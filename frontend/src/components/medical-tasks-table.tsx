import { useMemo, useRef, useState, useEffect } from "react"
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  flexRender,
  type ColumnDef,
  type SortingState,
} from "@tanstack/react-table"
import { useVirtualizer } from "@tanstack/react-virtual"
import { Badge } from "./ui/badge"
import { Button } from "./ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table"
import { Dialog } from "./ui/dialog"
import { TaskEditForm } from "./task-edit-form"
import { Pencil, Trash2, ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react"
import type { MedicalTask, Priority, Status } from "../types/medical-task"

interface MedicalTasksTableProps {
  tasks: MedicalTask[]
  onUpdateTask: (id: string, updates: Partial<MedicalTask>) => void
  onDeleteTask: (id: string) => void
  globalFilter?: string
}

const priorityLabels: Record<Priority, string> = {
  low: "Basse",
  medium: "Moyenne",
  high: "Haute",
}

const statusLabels: Record<Status, string> = {
  pending: "En attente",
  in_progress: "En cours",
  completed: "Terminée",
  cancelled: "Annulée",
}

const categoryLabels: Record<string, string> = {
  examination: "Examen",
  surgery: "Chirurgie",
  medication: "Médication",
  consultation: "Consultation",
  follow_up: "Suivi",
}

export function MedicalTasksTable({ tasks, onUpdateTask, onDeleteTask, globalFilter = "" }: MedicalTasksTableProps) {
  const tableContainerRef = useRef<HTMLDivElement>(null)
  const [editingTask, setEditingTask] = useState<MedicalTask | null>(null)
  const [sorting, setSorting] = useState<SortingState>([])
  const [internalGlobalFilter, setInternalGlobalFilter] = useState(globalFilter)

  useEffect(() => {
    setInternalGlobalFilter(globalFilter ?? "")
  }, [globalFilter])

  const columns = useMemo<ColumnDef<MedicalTask>[]>(
    () => [
      {
        accessorKey: "priority",
        header: ({ column }) => {
          return (
            <Button
              variant="ghost"
              onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
              className="-ml-3 h-8 data-[state=open]:bg-accent"
            >
              Priorité
              {column.getIsSorted() === "asc" ? (
                <ArrowUp className="ml-2 h-4 w-4" />
              ) : column.getIsSorted() === "desc" ? (
                <ArrowDown className="ml-2 h-4 w-4" />
              ) : (
                <ArrowUpDown className="ml-2 h-4 w-4" />
              )}
            </Button>
          )
        },
        cell: ({ row }) => (
          <Badge variant={row.original.priority}>
            {priorityLabels[row.original.priority]}
          </Badge>
        ),
        size: 120,
        sortingFn: (rowA, rowB) => {
          const priorityOrder = { high: 0, medium: 1, low: 2 }
          return priorityOrder[rowA.original.priority] - priorityOrder[rowB.original.priority]
        },
      },
      {
        accessorKey: "status",
        header: ({ column }) => {
          return (
            <Button
              variant="ghost"
              onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
              className="-ml-3 h-8 data-[state=open]:bg-accent"
            >
              Status
              {column.getIsSorted() === "asc" ? (
                <ArrowUp className="ml-2 h-4 w-4" />
              ) : column.getIsSorted() === "desc" ? (
                <ArrowDown className="ml-2 h-4 w-4" />
              ) : (
                <ArrowUpDown className="ml-2 h-4 w-4" />
              )}
            </Button>
          )
        },
        cell: ({ row }) => (
          <Badge variant={row.original.status}>
            {statusLabels[row.original.status]}
          </Badge>
        ),
        size: 140,
      },
      {
        accessorKey: "title",
        header: ({ column }) => {
          return (
            <Button
              variant="ghost"
              onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
              className="-ml-3 h-8 data-[state=open]:bg-accent"
            >
              Titre
              {column.getIsSorted() === "asc" ? (
                <ArrowUp className="ml-2 h-4 w-4" />
              ) : column.getIsSorted() === "desc" ? (
                <ArrowDown className="ml-2 h-4 w-4" />
              ) : (
                <ArrowUpDown className="ml-2 h-4 w-4" />
              )}
            </Button>
          )
        },
        cell: ({ row }) => (
          <div className="font-medium">{row.original.title}</div>
        ),
        size: 250,
      },
      {
        accessorKey: "patient",
        header: ({ column }) => {
          return (
            <Button
              variant="ghost"
              onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
              className="-ml-3 h-8 data-[state=open]:bg-accent"
            >
              Patient
              {column.getIsSorted() === "asc" ? (
                <ArrowUp className="ml-2 h-4 w-4" />
              ) : column.getIsSorted() === "desc" ? (
                <ArrowDown className="ml-2 h-4 w-4" />
              ) : (
                <ArrowUpDown className="ml-2 h-4 w-4" />
              )}
            </Button>
          )
        },
        cell: ({ row }) => (
          <div>
            <div className="font-medium">
              {row.original.patient.firstName} {row.original.patient.lastName}
            </div>
            <div className="text-xs text-muted-foreground">
              Chambre {row.original.patient.roomNumber}
            </div>
          </div>
        ),
        size: 200,
        sortingFn: (rowA, rowB) => {
          const nameA = `${rowA.original.patient.lastName} ${rowA.original.patient.firstName}`.toLowerCase()
          const nameB = `${rowB.original.patient.lastName} ${rowB.original.patient.firstName}`.toLowerCase()
          return nameA.localeCompare(nameB)
        },
      },
      {
        accessorKey: "assignedTo",
        header: ({ column }) => {
          return (
            <Button
              variant="ghost"
              onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
              className="-ml-3 h-8 data-[state=open]:bg-accent"
            >
              Assigné à
              {column.getIsSorted() === "asc" ? (
                <ArrowUp className="ml-2 h-4 w-4" />
              ) : column.getIsSorted() === "desc" ? (
                <ArrowDown className="ml-2 h-4 w-4" />
              ) : (
                <ArrowUpDown className="ml-2 h-4 w-4" />
              )}
            </Button>
          )
        },
        cell: ({ row }) => (
          <div>
            <div className="font-medium">{row.original.assignedTo.name}</div>
            <div className="text-xs text-muted-foreground capitalize">
              {row.original.assignedTo.role}
            </div>
          </div>
        ),
        size: 180,
        sortingFn: (rowA, rowB) => {
          return rowA.original.assignedTo.name.localeCompare(rowB.original.assignedTo.name)
        },
      },
      {
        accessorKey: "category",
        header: ({ column }) => {
          return (
            <Button
              variant="ghost"
              onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
              className="-ml-3 h-8 data-[state=open]:bg-accent"
            >
              Catégorie
              {column.getIsSorted() === "asc" ? (
                <ArrowUp className="ml-2 h-4 w-4" />
              ) : column.getIsSorted() === "desc" ? (
                <ArrowDown className="ml-2 h-4 w-4" />
              ) : (
                <ArrowUpDown className="ml-2 h-4 w-4" />
              )}
            </Button>
          )
        },
        cell: ({ row }) => (
          <div className="text-sm">
            {categoryLabels[row.original.category] || row.original.category}
          </div>
        ),
        size: 140,
      },
      {
        accessorKey: "dueDate",
        header: ({ column }) => {
          return (
            <Button
              variant="ghost"
              onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
              className="-ml-3 h-8 data-[state=open]:bg-accent"
            >
              Échéance
              {column.getIsSorted() === "asc" ? (
                <ArrowUp className="ml-2 h-4 w-4" />
              ) : column.getIsSorted() === "desc" ? (
                <ArrowDown className="ml-2 h-4 w-4" />
              ) : (
                <ArrowUpDown className="ml-2 h-4 w-4" />
              )}
            </Button>
          )
        },
        cell: ({ row }) => {
          const dueDate = new Date(row.original.dueDate)
          const now = new Date()
          const isOverdue = dueDate < now && row.original.status !== "completed"
          const isToday =
            dueDate.toDateString() === now.toDateString()

          return (
            <div>
              <div
                className={`text-sm ${
                  isOverdue
                    ? "text-red-600 font-semibold"
                    : isToday
                    ? "text-orange-600 font-semibold"
                    : ""
                }`}
              >
                {dueDate.toLocaleDateString("fr-FR", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                })}
              </div>
              {isOverdue && (
                <Badge variant="high" className="mt-1 text-xs">
                  ⚠️ En retard
                </Badge>
              )}
            </div>
          )
        },
        size: 140,
      },
      {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => (
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setEditingTask(row.original)}
              title="Modifier la tâche"
            >
              <Pencil className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                if (confirm("Êtes-vous sûr de vouloir supprimer cette tâche ?")) {
                  onDeleteTask(row.original.id)
                }
              }}
              title="Supprimer la tâche"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ),
        size: 120,
      },
    ],
    [onDeleteTask]
  )

  const table = useReactTable({
    data: tasks,
    columns,
    state: {
      sorting,
      globalFilter: internalGlobalFilter,
    },
    onSortingChange: setSorting,
    onGlobalFilterChange: setInternalGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    globalFilterFn: (row, _columnId, filterValue) => {
      const fv = filterValue ?? ""
      const searchValue = String(fv).toLowerCase()

      if (!searchValue) return true

      const safe = (s?: string) => (s ?? "").toLowerCase()

      if (safe(row.original.title).includes(searchValue)) return true

      const patientName = `${row.original.patient?.firstName ?? ""} ${row.original.patient?.lastName ?? ""}`.toLowerCase()
      if (patientName.includes(searchValue)) return true

      if (safe(row.original.patient?.roomNumber).includes(searchValue)) return true

      if (safe(row.original.assignedTo?.name).includes(searchValue)) return true

      if (safe(row.original.description).includes(searchValue)) return true

      if (safe(categoryLabels[row.original.category]).includes(searchValue)) return true

      if (safe(statusLabels[row.original.status]).includes(searchValue)) return true

      if (safe(priorityLabels[row.original.priority]).includes(searchValue)) return true

      return false
    },
  })

  const rows = table.getRowModel().rows

  const rowVirtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => tableContainerRef.current,
    estimateSize: () => 73,
    overscan: 10,
  })

  const virtualRows = rowVirtualizer.getVirtualItems()
  const totalSize = rowVirtualizer.getTotalSize()

  const paddingTop = virtualRows.length > 0 ? virtualRows[0]?.start || 0 : 0
  const paddingBottom =
    virtualRows.length > 0
      ? totalSize - (virtualRows[virtualRows.length - 1]?.end || 0)
      : 0

  return (
    <>
      <div
        ref={tableContainerRef}
        className="rounded-t-xl border border-slate-200 bg-white shadow-xl overflow-hidden"
        style={{ height: "calc(100vh - 250px)", overflow: "auto" }}
      >
        <Table>
          <TableHeader className="sticky top-0 bg-gradient-to-r from-slate-50 to-slate-100 z-10 border-b border-slate-200">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="hover:bg-transparent">
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    style={{ width: header.getSize() }}
                    className="font-semibold text-slate-700 text-xs uppercase tracking-wide"
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {paddingTop > 0 && (
              <tr>
                <td style={{ height: `${paddingTop}px` }} />
              </tr>
            )}
            {virtualRows.map((virtualRow) => {
              const row = rows[virtualRow.index]
              return (
                <TableRow
                  key={row.id}
                  data-index={virtualRow.index}
                  className="hover:bg-blue-50/50 transition-colors duration-150"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      style={{ width: cell.column.getSize() }}
                      className="py-4"
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              )
            })}
            {paddingBottom > 0 && (
              <tr>
                <td style={{ height: `${paddingBottom}px` }} />
              </tr>
            )}
          </TableBody>
        </Table>
      </div>

      {editingTask && (
        <Dialog open={!!editingTask} onOpenChange={() => setEditingTask(null)}>
          <TaskEditForm
            task={editingTask}
            onSave={(updates) => {
              onUpdateTask(editingTask.id, updates)
              setEditingTask(null)
            }}
            onCancel={() => setEditingTask(null)}
          />
        </Dialog>
      )}
    </>
  )
}
