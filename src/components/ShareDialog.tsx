import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Copy, Share2, Link } from "lucide-react"

interface ShareDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  shareCode: string | null
  onGenerateCode: () => Promise<string>
  onImportCode: (code: string) => Promise<boolean>
}

export function ShareDialog({
  open,
  onOpenChange,
  shareCode,
  onGenerateCode,
  onImportCode,
}: ShareDialogProps) {
  const [importCode, setImportCode] = useState("")
  const [message, setMessage] = useState("")
  const [generating, setGenerating] = useState(false)

  const handleGenerate = async () => {
    setGenerating(true)
    try {
      await onGenerateCode()
    } catch {
      setMessage("生成分享码失败，请重试。")
    }
    setGenerating(false)
  }

  const handleCopy = () => {
    if (shareCode) {
      navigator.clipboard.writeText(shareCode)
      setMessage("分享码已复制到剪贴板！")
      setTimeout(() => setMessage(""), 2000)
    }
  }

  const handleImport = async () => {
    if (!importCode.trim()) return
    const success = await onImportCode(importCode.trim())
    if (success) {
      setMessage("导入成功！导航配置已更新。")
      setTimeout(() => {
        setMessage("")
        onOpenChange(false)
      }, 1500)
    } else {
      setMessage("导入失败，请检查分享码是否正确。")
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md max-sm:max-w-full max-sm:max-h-[95dvh] max-sm:mx-2 max-sm:rounded-xl max-sm:overflow-y-auto">
        <DialogHeader>
          <DialogTitle>分享与导入</DialogTitle>
          <DialogDescription>
            生成分享码让好友复制你的导航配置，或输入好友的分享码来导入。
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label>我的分享码</Label>
            <div className="flex gap-2">
              <Input
                value={shareCode || ""}
                readOnly
                placeholder="点击生成分享码"
                className="font-mono"
              />
              {shareCode ? (
                <Button variant="outline" size="icon" onClick={handleCopy}>
                  <Copy className="h-4 w-4" />
                </Button>
              ) : (
                <Button
                  variant="outline"
                  onClick={handleGenerate}
                  disabled={generating}
                >
                  <Share2 className="h-4 w-4 mr-1" />
                  {generating ? "生成中..." : "生成"}
                </Button>
              )}
            </div>
          </div>

          <div className="border-t border-border pt-4 space-y-2">
            <Label>输入好友的分享码</Label>
            <div className="flex gap-2">
              <Input
                value={importCode}
                onChange={(e) => setImportCode(e.target.value)}
                placeholder="输入分享码"
                className="font-mono"
              />
              <Button
                variant="outline"
                onClick={handleImport}
                disabled={!importCode.trim()}
              >
                <Link className="h-4 w-4 mr-1" />
                导入
              </Button>
            </div>
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

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            关闭
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
