import { useState } from "react"
import type { NavSection as NavSectionType, NavItem } from "@/lib/types"
import { NavCard } from "./NavCard"

interface NavSectionProps {
  section: NavSectionType
  onEditItem?: (item: NavItem, sectionIndex: number) => void
  onDeleteItem?: (item: NavItem, sectionIndex: number) => void
  onReorder?: (sectionIndex: number, fromIndex: number, toIndex: number) => void
  sectionIndex: number
}

export function NavSection({
  section,
  onEditItem,
  onDeleteItem,
  onReorder,
  sectionIndex,
}: NavSectionProps) {
  const sortedItems = [...section.items].sort((a, b) => a.sortOrder - b.sortOrder)
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null)

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = "move"
    setDragOverIndex(index)
  }

  const handleDragLeave = () => {
    setDragOverIndex(null)
  }

  const handleDrop = (e: React.DragEvent, toIndex: number) => {
    e.preventDefault()
    setDragOverIndex(null)
    const fromIndexStr = e.dataTransfer.getData("text/plain")
    const fromIndex = parseInt(fromIndexStr, 10)
    if (isNaN(fromIndex) || fromIndex === toIndex) return
    onReorder?.(sectionIndex, fromIndex, toIndex)
  }

  return (
    <div className="mb-10">
      <div className="flex flex-wrap justify-center gap-x-1.5 gap-y-3 max-w-[680px] mx-auto">
        {sortedItems.map((item, index) => (
          <NavCard
            key={`${item.title}-${item.sortOrder}`}
            item={item}
            index={index}
            onEdit={(i) => onEditItem?.(i, sectionIndex)}
            onDelete={(i) => onDeleteItem?.(i, sectionIndex)}
            onDragStart={(e) => {
              e.dataTransfer.setData("text/plain", String(index))
              e.dataTransfer.effectAllowed = "move"
            }}
            onDragOver={(e) => handleDragOver(e, index)}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, index)}
            isDragOver={dragOverIndex === index}
          />
        ))}
      </div>
    </div>
  )
}
