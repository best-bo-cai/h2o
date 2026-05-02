import { useCallback, useState } from "react"
import { Moon, Sun } from "lucide-react"
import { Button } from "@/components/ui/button"

function getInitialTheme(): boolean {
  if (typeof window === "undefined") return false
  const saved = localStorage.getItem("h2o_theme")
  if (saved === "dark") return true
  if (saved === "light") return false
  return false
}

export function ThemeToggle() {
  const [dark, setDark] = useState(getInitialTheme)

  const toggle = useCallback(() => {
    setDark((prev) => {
      const next = !prev
      const root = document.documentElement
      if (next) {
        root.classList.add("dark")
      } else {
        root.classList.remove("dark")
      }
      localStorage.setItem("h2o_theme", next ? "dark" : "light")
      return next
    })
  }, [])

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggle}
      title={dark ? "切换到亮色模式" : "切换到暗色模式"}
    >
      {dark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
    </Button>
  )
}
