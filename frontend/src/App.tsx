import { useEffect, useState } from "react"
import { MedicalTasksTable } from "./components/medical-tasks-table"
import { Pagination } from "./components/pagination"
import { SearchBar } from "./components/search-bar"
import { Button } from "./components/ui/button"
import type { MedicalTask } from "./types/medical-task"
import { api, type PaginationInfo } from "./services/api"
import voccaLogo from "./assets/vocca-logo.avif"
import { BarChart3 } from "lucide-react"
import { Routes, Route, useNavigate } from "react-router-dom"
import { StatisticsPage } from "./pages/statistics-page"

function App() {
  const [tasks, setTasks] = useState<MedicalTask[]>([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [pagination, setPagination] = useState<PaginationInfo | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const navigate = useNavigate()

  const loadTasks = async (page: number = currentPage) => {
    try {
      setLoading(true)
      const data = await api.getTasks(page, 150)
      setTasks(data.tasks)
      setPagination(data.pagination)
      setCurrentPage(page)
    } catch (error) {
      console.error("Erreur lors du chargement des tâches:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadTasks()
  }, [])

  const handleUpdateTask = async (id: string, updates: Partial<MedicalTask>) => {
    try {
      await api.updateTask(id, updates)
      await loadTasks()
    } catch (error) {
      console.error("Erreur lors de la mise à jour:", error)
      alert("Erreur lors de la mise à jour de la tâche")
    }
  }

  const handleDeleteTask = async (id: string) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer cette tâche ?")) {
      return
    }

    try {
      await api.deleteTask(id)
      await loadTasks()
    } catch (error) {
      console.error("Erreur lors de la suppression:", error)
      alert("Erreur lors de la suppression de la tâche")
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Chargement des tâches médicales...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="container mx-auto py-8 px-4 max-w-[1600px]">
          <div className="mb-8 bg-white rounded-2xl shadow-lg border border-slate-200 p-6">
          <div className="flex items-center gap-4">
            <img
              src={voccaLogo}
              alt="Vocca Logo"
              className="h-16 w-16 object-contain rounded-xl"
            />
            <div className="flex-1">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                Gestionnaire de Tâches Médicales
              </h1>
              <p className="text-slate-600 text-sm mt-1">
                Gérez et suivez toutes les tâches médicales de votre établissement
              </p>
            </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  onClick={() => navigate("/statistics")}
                  title="Mes statistiques"
                >
                  <BarChart3 className="mr-2 h-4 w-4" />
                  Mes statistiques
                </Button>
              </div>
          </div>
        </div>
        <div className="space-y-4">
          <Routes>
            <Route
              path="/"
              element={
                <>
                  {/* (Les statistiques sont maintenant sur une page dédiée) */}

                  <div className="bg-white rounded-lg shadow-sm p-4 border border-slate-200">
                    <SearchBar
                      value={searchQuery}
                      onChange={setSearchQuery}
                      placeholder="Rechercher par titre, patient, assigné à, catégorie..."
                    />
                  </div>
                  <div className="space-y-0">
                    <MedicalTasksTable
                      tasks={tasks}
                      onUpdateTask={handleUpdateTask}
                      onDeleteTask={handleDeleteTask}
                      globalFilter={searchQuery}
                    />
                    {pagination && (
                      <Pagination
                        pagination={pagination}
                        onPageChange={loadTasks}
                      />
                    )}
                  </div>
                </>
              }
            />

            <Route path="/statistics" element={<StatisticsPage tasks={tasks} />} />
          </Routes>
        </div>
      </div>
    </div>
  )
}

export default App
