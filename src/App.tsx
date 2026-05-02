import { useState } from "react"
import { Settings, Download, Share2, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/ThemeToggle"
import { NavSection } from "@/components/NavSection"
import { SearchBox } from "@/components/SearchBox"
import { DataEditor } from "@/components/DataEditor"
import { ImportExport } from "@/components/ImportExport"
import { ShareDialog } from "@/components/ShareDialog"
import { useNavigation } from "@/hooks/useNavigation"
import type { NavItem } from "@/lib/types"

function App() {
  const {
    data,
    loading,
    saving,
    shareCode,
    save,
    generateCode,
    importFromShareCode,
    importData,
    exportData,
  } = useNavigation()

  const [editorOpen, setEditorOpen] = useState(false)
  const [importExportOpen, setImportExportOpen] = useState(false)
  const [shareOpen, setShareOpen] = useState(false)
  const [activeSection, setActiveSection] = useState(0)

  const sortedSections = [...data.sections].sort(
    (a, b) => a.sortOrder - b.sortOrder
  )

  const handleEditItem = () => {
    setEditorOpen(true)
  }

  const handleDeleteItem = (item: NavItem, sectionIndex: number) => {
    const sections = [...data.sections]
    const section = sections[sectionIndex]
    const items = section.items.filter(
      (i) => !(i.title === item.title && i.url === item.url)
    )
    sections[sectionIndex] = { ...section, items }
    save({ ...data, sections })
  }

  const handleReorder = (
    sectionIndex: number,
    fromIndex: number,
    toIndex: number
  ) => {
    const sections = [...data.sections]
    const section = sections[sectionIndex]
    const items = [...section.items].sort((a, b) => a.sortOrder - b.sortOrder)
    const [moved] = items.splice(fromIndex, 1)
    items.splice(toIndex, 0, moved)
    items.forEach((item, i) => {
      item.sortOrder = i
    })
    sections[sectionIndex] = { ...section, items }
    save({ ...data, sections })
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          <p className="text-sm text-muted-foreground">加载中...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
          <h1 className="text-lg font-bold text-foreground">
            {data.pageInfo.title}
          </h1>
          <div className="flex items-center gap-1">
            {saving && (
              <span className="text-xs text-muted-foreground mr-2">
                保存中...
              </span>
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setEditorOpen(true)}
              title="编辑数据"
            >
              <Settings className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setImportExportOpen(true)}
              title="导入/导出"
            >
              <Download className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShareOpen(true)}
              title="分享"
            >
              <Share2 className="h-5 w-5" />
            </Button>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 flex-1 w-full">
        {sortedSections.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <p className="text-muted-foreground mb-4">
              还没有任何导航链接
            </p>
            <Button onClick={() => setEditorOpen(true)} variant="outline">
              <Settings className="h-4 w-4 mr-2" />
              开始添加
            </Button>
          </div>
        ) : (
          <>
            <div className="mb-6">
              <SearchBox engines={data.searchEngines} />
            </div>
            <div className="flex flex-wrap justify-center gap-1 mb-6">
              {sortedSections.map((section, index) => (
                <button
                  key={section.name}
                  onClick={() => setActiveSection(index)}
                  className={
                    activeSection === index
                      ? "px-4 py-1.5 rounded-full text-sm font-medium bg-primary text-primary-foreground transition-colors"
                      : "px-4 py-1.5 rounded-full text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                  }
                >
                  {section.name}
                </button>
              ))}
            </div>
            {sortedSections[activeSection] && (
              <NavSection
                section={sortedSections[activeSection]}
                onEditItem={handleEditItem}
                onDeleteItem={handleDeleteItem}
                onReorder={handleReorder}
                sectionIndex={
                  data.sections.findIndex(
                    (s) => s.name === sortedSections[activeSection].name
                  )
                }
              />
            )}
          </>
        )}
      </main>

      <footer className="border-t border-border py-6 text-center">
        <p className="text-xs text-muted-foreground">
          H2O 导航页 · 极简风格 · 右键卡片可编辑/删除
        </p>
      </footer>

      <DataEditor
        open={editorOpen}
        onOpenChange={setEditorOpen}
        data={data}
        onSave={save}
      />

      <ImportExport
        open={importExportOpen}
        onOpenChange={setImportExportOpen}
        onImport={importData}
        onExport={exportData}
      />

      <ShareDialog
        open={shareOpen}
        onOpenChange={setShareOpen}
        shareCode={shareCode}
        onGenerateCode={generateCode}
        onImportCode={importFromShareCode}
      />
    </div>
  )
}

export default App
