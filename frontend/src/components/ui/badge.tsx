import * as React from "react"
import { type VariantProps, cva } from "class-variance-authority"
import { cn } from "../../lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold transition-all duration-200 shadow-sm",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
        outline: "text-foreground",
        // Priority variants
        low: "border-green-200 bg-gradient-to-br from-green-50 to-green-100 text-green-700 hover:shadow-md",
        medium: "border-orange-200 bg-gradient-to-br from-orange-50 to-orange-100 text-orange-700 hover:shadow-md",
        high: "border-red-200 bg-gradient-to-br from-red-50 to-red-100 text-red-700 hover:shadow-md",
        // Status variants
        pending: "border-slate-200 bg-gradient-to-br from-slate-50 to-slate-100 text-slate-700 hover:shadow-md",
        in_progress: "border-blue-200 bg-gradient-to-br from-blue-50 to-blue-100 text-blue-700 hover:shadow-md",
        completed: "border-emerald-200 bg-gradient-to-br from-emerald-50 to-emerald-100 text-emerald-700 hover:shadow-md",
        cancelled: "border-rose-200 bg-gradient-to-br from-rose-50 to-rose-100 text-rose-700 hover:shadow-md",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
