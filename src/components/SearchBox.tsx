import { useState } from "react"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import type { SearchEngine } from "@/lib/types"

interface SearchBoxProps {
  engines: SearchEngine[]
}

export function SearchBox({ engines }: SearchBoxProps) {
  const [query, setQuery] = useState("")
  const [selectedEngine, setSelectedEngine] = useState<string>(
    engines.length > 0 ? engines[0].name : ""
  )

  const sortedEngines = [...engines].sort((a, b) => a.sortOrder - b.sortOrder)

  const handleSearch = () => {
    const trimmed = query.trim()
    if (!trimmed) return

    const engine = engines.find((e) => e.name === selectedEngine)
    if (!engine) return

    const url = engine.urlTemplate.replace("{query}", encodeURIComponent(trimmed))
    window.open(url, "_blank")
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch()
    }
  }

  if (sortedEngines.length === 0) return null

  return (
    <div className="flex items-center gap-2 w-full max-w-xl mx-auto">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="搜索..."
          className="pl-9 h-11 rounded-full border-border/60 bg-white/80 backdrop-blur-sm shadow-sm hover:shadow-md focus-within:shadow-md transition-all duration-300"
        />
      </div>
      <Select value={selectedEngine} onValueChange={setSelectedEngine}>
        <SelectTrigger className="w-[110px] h-11 rounded-full bg-white/80 backdrop-blur-sm border-border/60 shadow-sm hover:shadow-md transition-all duration-300">
          <SelectValue />
        </SelectTrigger>
        <SelectContent className="bg-white dark:bg-gray-900 border-border">
          {sortedEngines.map((engine) => (
            <SelectItem key={engine.name} value={engine.name}>
              {engine.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
