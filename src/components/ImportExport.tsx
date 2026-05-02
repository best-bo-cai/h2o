import { useState, useRef } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Download, Upload, FileJson } from "lucide-react"

interface ImportExportProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onImport: (jsonStr: string) => Promise<boolean>
  onExport: () => string
}

export function ImportExport({
  open,
  onOpenChange,
  onImport,
  onExport,
}: ImportExportProps) {
  const [importText, setImportText] = useState("")
  const [message, setMessage] = useState("")
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleImport = async () => {
    const success = await onImport(importText)
    if (success) {
      setMessage("导入成功！")
      setTimeout(() => {
        setMessage("")
        onOpenChange(false)
      }, 1500)
    } else {
      setMessage("导入失败，请检查 JSON 格式是否正确。")
    }
  }

  const handleExport = () => {
    const jsonStr = onExport()
    const blob = new Blob([jsonStr], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    const dateStr = new Date().toISOString().slice(0, 10)
    a.download = `h2o-navigation-backup-${dateStr}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => {
      const text = ev.target?.result as string
      setImportText(text)
    }
    reader.readAsText(file)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>导入 / 导出数据</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <h3 className="text-sm font-medium">导出数据</h3>
            <p className="text-xs text-muted-foreground">
              将当前导航配置导出为 JSON 文件，用于备份或迁移。
            </p>
            <Button onClick={handleExport} variant="outline" className="w-full">
              <Download className="h-4 w-4 mr-2" />
              导出 JSON 文件
            </Button>
          </div>

          <div className="border-t border-border pt-4 space-y-2">
            <h3 className="text-sm font-medium">导入数据</h3>
            <p className="text-xs text-muted-foreground">
              粘贴 JSON 内容或上传 JSON 文件来导入导航配置。
            </p>
            <textarea
              value={importText}
              onChange={(e) => setImportText(e.target.value)}
              placeholder='粘贴 JSON 内容到此处...'
              className="flex min-h-[120px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            />
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="h-4 w-4 mr-2" />
                上传文件
              </Button>
              <input
                ref={fileInputRef}
                type="file"
                accept=".json"
                onChange={handleFileUpload}
                className="hidden"
              />
              <Button onClick={handleImport} disabled={!importText.trim()}>
                <FileJson className="h-4 w-4 mr-2" />
                导入
              </Button>
            </div>
            {message && (
              <p
                className={`text-sm ${
                  message.includes("成功")
                    ? "text-green-600 dark:text-green-400"
                    : "text-destructive"
                }`}
              >
                {message}
              </p>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            关闭
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
