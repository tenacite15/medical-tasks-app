import type { MedicalTask } from "../types/medical-task"
import { Badge } from "./ui/badge"
import { BarChart3, AlertCircle, CheckCircle, Clock, TrendingUp } from "lucide-react"

interface StatisticsProps {
  tasks: MedicalTask[]
}

export function Statistics({ tasks }: StatisticsProps) {
  // Calculer les statistiques
  const priorityStats = {
    high: tasks.filter(t => t.priority === "high").length,
    medium: tasks.filter(t => t.priority === "medium").length,
    low: tasks.filter(t => t.priority === "low").length,
  }

  const statusStats = {
    pending: tasks.filter(t => t.status === "pending").length,
    in_progress: tasks.filter(t => t.status === "in_progress").length,
    completed: tasks.filter(t => t.status === "completed").length,
    cancelled: tasks.filter(t => t.status === "cancelled").length,
  }

  const now = new Date()
  const overdueTasks = tasks.filter(t => {
    const dueDate = new Date(t.dueDate)
    return dueDate < now && t.status !== "completed"
  }).length

  const totalTasks = tasks.length

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
            <BarChart3 className="h-6 w-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Statistiques Globales</h2>
            <p className="text-slate-600 text-sm">Vue d'ensemble de toutes les tâches médicales</p>
          </div>
        </div>

        {/* Carte principale avec le total */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border-2 border-blue-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-blue-700 font-semibold text-sm">Total des tâches</span>
              <TrendingUp className="h-5 w-5 text-blue-600" />
            </div>
            <div className="text-4xl font-bold text-blue-900">{totalTasks}</div>
          </div>

          <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-xl p-6 border-2 border-red-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-red-700 font-semibold text-sm">En retard</span>
              <AlertCircle className="h-5 w-5 text-red-600" />
            </div>
            <div className="text-4xl font-bold text-red-900">{overdueTasks}</div>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 border-2 border-green-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-green-700 font-semibold text-sm">Terminées</span>
              <CheckCircle className="h-5 w-5 text-green-600" />
            </div>
            <div className="text-4xl font-bold text-green-900">{statusStats.completed}</div>
          </div>

          <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-6 border-2 border-orange-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-orange-700 font-semibold text-sm">En cours</span>
              <Clock className="h-5 w-5 text-orange-600" />
            </div>
            <div className="text-4xl font-bold text-orange-900">{statusStats.in_progress}</div>
          </div>
        </div>
      </div>

      {/* Statistiques par priorité */}
      <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6">
        <h3 className="text-xl font-bold text-slate-900 mb-4">Répartition par Priorité</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-xl p-6 border border-red-200">
            <div className="flex items-center justify-between mb-3">
              <Badge variant="high" className="text-sm">Haute</Badge>
              <span className="text-3xl font-bold text-red-800">{priorityStats.high}</span>
            </div>
            <div className="w-full bg-red-200 rounded-full h-2">
              <div
                className="bg-red-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${totalTasks > 0 ? (priorityStats.high / totalTasks) * 100 : 0}%` }}
              />
            </div>
            <p className="text-xs text-red-700 mt-2">
              {totalTasks > 0 ? Math.round((priorityStats.high / totalTasks) * 100) : 0}% du total
            </p>
          </div>

          <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-6 border border-orange-200">
            <div className="flex items-center justify-between mb-3">
              <Badge variant="medium" className="text-sm">Moyenne</Badge>
              <span className="text-3xl font-bold text-orange-800">{priorityStats.medium}</span>
            </div>
            <div className="w-full bg-orange-200 rounded-full h-2">
              <div
                className="bg-orange-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${totalTasks > 0 ? (priorityStats.medium / totalTasks) * 100 : 0}%` }}
              />
            </div>
            <p className="text-xs text-orange-700 mt-2">
              {totalTasks > 0 ? Math.round((priorityStats.medium / totalTasks) * 100) : 0}% du total
            </p>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 border border-green-200">
            <div className="flex items-center justify-between mb-3">
              <Badge variant="low" className="text-sm">Basse</Badge>
              <span className="text-3xl font-bold text-green-800">{priorityStats.low}</span>
            </div>
            <div className="w-full bg-green-200 rounded-full h-2">
              <div
                className="bg-green-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${totalTasks > 0 ? (priorityStats.low / totalTasks) * 100 : 0}%` }}
              />
            </div>
            <p className="text-xs text-green-700 mt-2">
              {totalTasks > 0 ? Math.round((priorityStats.low / totalTasks) * 100) : 0}% du total
            </p>
          </div>
        </div>
      </div>

      {/* Statistiques par status */}
      <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6">
        <h3 className="text-xl font-bold text-slate-900 mb-4">Répartition par Status</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl p-6 border border-yellow-200">
            <div className="flex items-center justify-between mb-3">
              <Badge variant="pending" className="text-sm">En attente</Badge>
              <span className="text-3xl font-bold text-yellow-800">{statusStats.pending}</span>
            </div>
            <div className="w-full bg-yellow-200 rounded-full h-2">
              <div
                className="bg-yellow-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${totalTasks > 0 ? (statusStats.pending / totalTasks) * 100 : 0}%` }}
              />
            </div>
            <p className="text-xs text-yellow-700 mt-2">
              {totalTasks > 0 ? Math.round((statusStats.pending / totalTasks) * 100) : 0}% du total
            </p>
          </div>

          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200">
            <div className="flex items-center justify-between mb-3">
              <Badge variant="in_progress" className="text-sm">En cours</Badge>
              <span className="text-3xl font-bold text-blue-800">{statusStats.in_progress}</span>
            </div>
            <div className="w-full bg-blue-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${totalTasks > 0 ? (statusStats.in_progress / totalTasks) * 100 : 0}%` }}
              />
            </div>
            <p className="text-xs text-blue-700 mt-2">
              {totalTasks > 0 ? Math.round((statusStats.in_progress / totalTasks) * 100) : 0}% du total
            </p>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 border border-green-200">
            <div className="flex items-center justify-between mb-3">
              <Badge variant="completed" className="text-sm">Terminée</Badge>
              <span className="text-3xl font-bold text-green-800">{statusStats.completed}</span>
            </div>
            <div className="w-full bg-green-200 rounded-full h-2">
              <div
                className="bg-green-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${totalTasks > 0 ? (statusStats.completed / totalTasks) * 100 : 0}%` }}
              />
            </div>
            <p className="text-xs text-green-700 mt-2">
              {totalTasks > 0 ? Math.round((statusStats.completed / totalTasks) * 100) : 0}% du total
            </p>
          </div>

          <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-3">
              <Badge variant="cancelled" className="text-sm">Annulée</Badge>
              <span className="text-3xl font-bold text-gray-800">{statusStats.cancelled}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-gray-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${totalTasks > 0 ? (statusStats.cancelled / totalTasks) * 100 : 0}%` }}
              />
            </div>
            <p className="text-xs text-gray-700 mt-2">
              {totalTasks > 0 ? Math.round((statusStats.cancelled / totalTasks) * 100) : 0}% du total
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
