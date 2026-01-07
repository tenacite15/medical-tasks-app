import { useState } from "react"
import type { MedicalTask, Priority, Status } from "../types/medical-task"
import { Button } from "./ui/button"
import { DialogContent, DialogHeader, DialogTitle, DialogFooter } from "./ui/dialog"
import { api } from "../services/api"
import { useEffect } from "react"

interface TaskEditFormProps {
  task: MedicalTask
  onSave: (updates: Partial<MedicalTask>) => void
  onCancel: () => void
}

const priorityOptions: { value: Priority; label: string }[] = [
  { value: "low", label: "Basse" },
  { value: "medium", label: "Moyenne" },
  { value: "high", label: "Haute" },
]

const statusOptions: { value: Status; label: string }[] = [
  { value: "pending", label: "En attente" },
  { value: "in_progress", label: "En cours" },
  { value: "completed", label: "Terminée" },
  { value: "cancelled", label: "Annulée" },
]

export function TaskEditForm({ task, onSave, onCancel }: TaskEditFormProps) {
  const [formData, setFormData] = useState({
    title: task.title,
    description: task.description,
    priority: task.priority,
    status: task.status,
    notes: task.notes || "",
  })
  const [aiSummary, setAiSummary] = useState<string | null>(null)
  const [aiLoading, setAiLoading] = useState(false)

  useEffect(() => {
    // clear AI summary when description changes
    setAiSummary(null)
  }, [formData.description])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formData)
  }

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Modifier la tâche</DialogTitle>
      </DialogHeader>
      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Titre
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[100px]"
              required
            />
            <div className="flex items-center gap-2 mt-2">
              <Button
                type="button"
                variant="outline"
                onClick={async () => {
                  try {
                    setAiLoading(true)
                    const res = await api.aiSummarize(formData.description)
                    setAiSummary(res.summary)
                  } catch (err) {
                    console.error(err)
                    alert("Erreur lors de la génération du résumé IA")
                  } finally {
                    setAiLoading(false)
                  }
                }}
              >
                Résumé IA
              </Button>
              {aiLoading && <div className="text-sm text-slate-500">Génération...</div>}
            </div>

            {aiSummary && (
              <div className="mt-3 p-3 bg-slate-50 border border-slate-200 rounded-md">
                <div className="text-sm text-slate-700 mb-2">Résumé proposé :</div>
                <div className="text-sm text-slate-900 mb-3">{aiSummary}</div>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setFormData({ ...formData, notes: (formData.notes || "") + (formData.notes ? "\n" : "") + aiSummary })}
                  >
                    Insérer dans les notes
                  </Button>
                  <Button type="button" variant="ghost" onClick={() => setAiSummary(null)}>Fermer</Button>
                </div>
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Priorité
              </label>
              <select
                value={formData.priority}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    priority: e.target.value as Priority,
                  })
                }
                className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {priorityOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Status
              </label>
              <select
                value={formData.status}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    status: e.target.value as Status,
                  })
                }
                className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {statusOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Notes (optionnel)
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) =>
                setFormData({ ...formData, notes: e.target.value })
              }
              className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[80px]"
              placeholder="Ajouter des notes..."
            />
          </div>
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={onCancel}>
            Annuler
          </Button>
          <Button type="submit">Enregistrer</Button>
        </DialogFooter>
      </form>
    </DialogContent>
  )
}
