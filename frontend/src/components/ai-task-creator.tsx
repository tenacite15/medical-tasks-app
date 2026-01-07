import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "./ui/dialog"
import { Button } from "./ui/button"
import { Plus } from "lucide-react"
import { api } from "../services/api"
import type { MedicalTask, Priority } from "../types/medical-task"

interface Props {
  onCreated: () => void
}

function inferPriority(text: string): Priority {
  const t = text.toLowerCase()
  if (t.includes("urgent") || t.includes("immédiat") || t.includes("immédiatement") || t.includes("asap")) return "high"
  if (t.includes("important") || t.includes("priorité")) return "medium"
  return "low"
}

function inferDueDate(text: string): string | null {
  const t = text.toLowerCase()
  const now = new Date()

  if (t.includes("aujourd'hui") || t.includes("aujourd’hui") || t.includes("aujourd hui")) {
    return new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString()
  }
  if (t.includes("demain")) {
    const d = new Date(now)
    d.setDate(d.getDate() + 1)
    return new Date(d.getFullYear(), d.getMonth(), d.getDate()).toISOString()
  }

  const dateMatch = text.match(/(\b\d{1,2}[\/\-]\d{1,2}(?:[\/\-]\d{2,4})?\b)/)
  if (dateMatch) {
    const raw = dateMatch[1]
    const parts = raw.split(/[-\/]/).map((p) => parseInt(p, 10))
    let day = parts[0]
    let month = (parts[1] || (now.getMonth() + 1)) - 1
    let year = parts[2] || now.getFullYear()
    if (year < 100) year += 2000
    const d = new Date(year, month, day)
    if (!isNaN(d.getTime())) return d.toISOString()
  }

  return null
}

function inferPatientName(text: string): { firstName: string; lastName: string } | null {
  const t = text
  const patterns = [/(?:pour|patient|patiente|chez)\s+([^,\.\n]+)/i, /(?:pour|patient|patiente|chez):?\s*([^,\.\n]+)/i]

  for (const p of patterns) {
    const m = t.match(p)
    if (m && m[1]) {
      let namePart = m[1].trim()
      namePart = namePart.replace(/\b(demain|aujourd'hui|aujourd’hui|urgent|important|immédiat|immédiatement|pour|à|a)\b.*/i, "").trim()
      namePart = namePart.replace(/\b(M\.?|Mr\.?|Monsieur|Mme\.?|Madame|Mlle\.?|Dr\.?|Docteur)\b\.?\s*/gi, "").trim()
      const tokens = namePart.split(/\s+/).filter(Boolean)
      if (tokens.length === 0) continue
      if (tokens.length === 1) {
        const name = capitalize(tokens[0])
        return { firstName: name, lastName: name }
      }
      const firstName = capitalize(tokens[0])
      const lastName = capitalize(tokens[tokens.length - 1])
      return { firstName, lastName }
    }
  }

  const short = t.match(/\b([A-ZÀ-Ÿ][a-zà-ÿ'-]+)\s+([A-ZÀ-Ÿ][a-zà-ÿ'-]+)\b/)
  if (short) {
    return { firstName: capitalize(short[1]), lastName: capitalize(short[2]) }
  }

  return null
}

function capitalize(s: string) {
  if (!s) return s
  return s.charAt(0).toUpperCase() + s.slice(1)
}

export function AITaskCreator({ onCreated }: Props) {
  const [open, setOpen] = useState(false)
  const [text, setText] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault()
    if (!text.trim()) return
    setLoading(true)

    try {
      const inferredPriority = inferPriority(text)
      const inferredDueDate = inferDueDate(text)

      const patientInfo = inferPatientName(text)

      const payload: Omit<MedicalTask, "id" | "createdAt" | "updatedAt"> = {
        title: text.split(/[\.\n]/)[0].slice(0, 120),
        description: text,
        patient: {
          id: patientInfo ? `${patientInfo.lastName.toLowerCase()}-${patientInfo.firstName.toLowerCase()}` : "unknown",
          firstName: patientInfo ? patientInfo.firstName : "N/A",
          lastName: patientInfo ? patientInfo.lastName : "N/A",
          dateOfBirth: new Date().toISOString(),
          roomNumber: "N/A",
        },
        assignedTo: {
          id: "system",
          name: "Système",
          role: "nurse",
        },
        priority: inferredPriority,
        status: "pending",
        category: "consultation",
        dueDate: inferredDueDate ?? new Date().toISOString(),
        notes: "Créée via assistant IA",
      }

      await api.createTask(payload)
      setText("")
      setOpen(false)
      onCreated()
    } catch (err) {
      console.error(err)
      alert("Erreur lors de la création de la tâche")
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Button variant="outline" onClick={() => setOpen(true)} title="Créer une tâche via IA">
        <Plus className="mr-2 h-4 w-4" />
        IA: Créer tâche
      </Button>

      <Dialog open={open} onOpenChange={(o) => setOpen(o)}>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Créer une tâche depuis du texte</DialogTitle>
            </DialogHeader>

            <div className="space-y-3">
              <p className="text-sm text-slate-600">Colle une description en langage naturel (ex: "Faire ECG pour patient Dupont demain, urgent"). Le système tentera d'extraire la priorité et la date d'échéance.</p>
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-md min-h-[120px]"
                placeholder="Ex: ECG pour M. Dupont demain matin, urgent"
                required
              />
            </div>
          </DialogContent>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>Annuler</Button>
            <Button type="submit" disabled={loading}>{loading ? "Création..." : "Créer"}</Button>
          </DialogFooter>
        </form>
      </Dialog>
    </>
  )
}
