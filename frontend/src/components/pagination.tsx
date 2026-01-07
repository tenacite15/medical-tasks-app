import { Button } from "./ui/button"
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react"
import type { PaginationInfo } from "../services/api"

interface PaginationProps {
  pagination: PaginationInfo
  onPageChange: (page: number) => void
}

export function Pagination({ pagination, onPageChange }: PaginationProps) {
  const { currentPage, totalPages, totalTasks, tasksPerPage, hasNextPage, hasPreviousPage } = pagination

  const startTask = (currentPage - 1) * tasksPerPage + 1
  const endTask = Math.min(currentPage * tasksPerPage, totalTasks)

  return (
    <div className="flex items-center justify-between px-4 py-3 bg-white border-t border-slate-200">
      <div className="flex items-center gap-6">
        <div className="text-sm text-slate-600">
          Affichage de <span className="font-semibold text-slate-900">{startTask}</span> à{" "}
          <span className="font-semibold text-slate-900">{endTask}</span> sur{" "}
          <span className="font-semibold text-slate-900">{totalTasks}</span> tâches
        </div>
        <div className="text-sm text-slate-500">
          Page {currentPage} sur {totalPages}
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onPageChange(1)}
          disabled={!hasPreviousPage}
          title="Première page"
        >
          <ChevronsLeft className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={!hasPreviousPage}
          title="Page précédente"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        <div className="flex items-center gap-1">
          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
            let pageNumber: number
            if (totalPages <= 5) {
              pageNumber = i + 1
            } else if (currentPage <= 3) {
              pageNumber = i + 1
            } else if (currentPage >= totalPages - 2) {
              pageNumber = totalPages - 4 + i
            } else {
              pageNumber = currentPage - 2 + i
            }

            return (
              <Button
                key={pageNumber}
                variant={currentPage === pageNumber ? "default" : "ghost"}
                size="sm"
                onClick={() => onPageChange(pageNumber)}
                className="min-w-[2.5rem]"
              >
                {pageNumber}
              </Button>
            )
          })}
        </div>

        <Button
          variant="ghost"
          size="icon"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={!hasNextPage}
          title="Page suivante"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onPageChange(totalPages)}
          disabled={!hasNextPage}
          title="Dernière page"
        >
          <ChevronsRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
