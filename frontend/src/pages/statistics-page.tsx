import { Button } from "../components/ui/button"
import { Statistics } from "../components/statistics"
import type { MedicalTask } from "../types/medical-task"
import { useNavigate } from "react-router-dom"

interface StatisticsPageProps {
  tasks: MedicalTask[]
}

export function StatisticsPage({ tasks }: StatisticsPageProps) {
  const navigate = useNavigate()

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-lg shadow-sm p-4 border border-slate-200">
        <Statistics tasks={tasks} />
      </div>
    </div>
  )
}
