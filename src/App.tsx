import { useState } from "react"
import { Settings, Download, Share2, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/ThemeToggle"
import { NavSection } from "@/components/NavSection"
import { SearchBox } from "@/components/SearchBox"
import { DecoCircle, DecoWave, DecoTriangle, DecoDots } from "@/components/Decorations"
import { DataEditor } from "@/components/DataEditor"
import { ImportExport } from "@/components/ImportExport"
import { ShareDialog } from "@/components/ShareDialog"
import { useNavigation } from "@/hooks/useNavigation"

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
      <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
          <h1 className="text-lg font-semibold text-foreground tracking-wide">
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

      <main className="max-w-7xl mx-auto px-4 py-8 flex-1 w-full relative overflow-hidden">
        <DecoCircle className="w-72 h-72 -top-36 -right-36 text-primary animate-pulse-soft" />
        <DecoCircle className="w-48 h-48 -bottom-24 -left-24 text-accent animate-float" />
        <DecoTriangle className="top-20 right-10" />
        <DecoDots className="bottom-10 right-20" />
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
            <div className="flex flex-wrap justify-center gap-2 mb-6">
              {sortedSections.map((section, index) => (
                <button
                  key={section.name}
                  onClick={() => setActiveSection(index)}
                  className={
                    activeSection === index
                      ? "px-5 py-2 rounded-full text-sm font-medium bg-gradient-to-r from-primary to-primary/80 text-primary-foreground shadow-md transition-all duration-300"
                      : "px-5 py-2 rounded-full text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-white/60 hover:shadow-sm transition-all duration-300"
                  }
                >
                  {section.name}
                </button>
              ))}
            </div>
            {sortedSections[activeSection] && (
              <NavSection
                section={sortedSections[activeSection]}
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

      <footer className="border-t border-border/60 py-6 text-center relative">
        <DecoWave className="bottom-0 left-0 right-0 h-16" />
        <p className="text-xs text-muted-foreground relative z-10">
          H2O 导航页 · 简约插画风格
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
