import { useState } from "react"
import { cn } from "@/lib/utils"
import type { NavItem } from "@/lib/types"

interface NavCardProps {
  item: NavItem
  index?: number
  onEdit?: (item: NavItem) => void
  onDelete?: (item: NavItem) => void
  onDragStart?: (e: React.DragEvent) => void
  onDragOver?: (e: React.DragEvent) => void
  onDragLeave?: () => void
  onDrop?: (e: React.DragEvent) => void
  isDragOver?: boolean
}

export function NavCard({
  item,
  onEdit,
  onDelete,
  onDragStart,
  onDragOver,
  onDragLeave,
  onDrop,
  isDragOver,
}: NavCardProps) {
  const [imgError, setImgError] = useState(false)
  const showFallback = !item.icon || imgError

  return (
    <a
      href={item.url}
      target="_blank"
      rel="noopener noreferrer"
      draggable={!!onDragStart}
      onDragStart={onDragStart}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
      className={cn(
        "group flex flex-col items-center gap-1.5 p-1",
        "w-[60px]",
        "cursor-pointer",
        "transition-all duration-300 ease-out",
        isDragOver && "ring-2 ring-primary ring-offset-2 rounded-xl"
      )}
      onContextMenu={(e) => {
        if (onEdit || onDelete) {
          e.preventDefault()
          const edit = window.confirm(
            `编辑 "${item.title}"？\n确定=编辑 | 取消=删除`
          )
          if (edit) {
            onEdit?.(item)
          } else {
            onDelete?.(item)
          }
        }
      }}
    >
      <div
        className={cn(
          "w-[42px] h-[42px] rounded-full",
          "bg-gradient-to-br from-primary/10 via-accent/5 to-secondary",
          "flex items-center justify-center",
          "transition-all duration-300 ease-out",
          "group-hover:scale-110 group-hover:shadow-lg",
          "group-hover:from-primary/20 group-hover:to-accent/15",
          "overflow-hidden shrink-0",
          "border border-border/50"
        )}
      >
        {!showFallback && (
          <img
            src={item.icon}
            alt={item.title}
            className="w-[70%] h-[70%] object-contain"
            onError={() => setImgError(true)}
          />
        )}
        {showFallback && (
          <span className="text-muted-foreground text-lg font-bold">
            {item.title.charAt(0)}
          </span>
        )}
      </div>
      <span
        className={cn(
          "text-[11px] text-foreground truncate w-full text-center",
          "group-hover:text-primary transition-colors duration-300"
        )}
      >
        {item.title}
      </span>
    </a>
  )
}
