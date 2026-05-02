import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { NavigationData, NavSection, NavItem, SearchEngine } from "@/lib/types"
import { Plus, Trash2, GripVertical, Sparkles, ChevronDown, ChevronRight, Loader2 } from "lucide-react"

function getFaviconUrls(url: string): string[] {
  try {
    const urlObj = new URL(url)
    const domain = urlObj.hostname

    return [
      `https://icons.duckduckgo.com/ip3/${domain}.ico`,
      `https://www.google.com/s2/favicons?domain=${encodeURIComponent(domain)}&sz=64`,
      `${urlObj.origin}/favicon.ico`,
    ]
  } catch {
    return []
  }
}

function checkImageExists(url: string, timeoutMs = 5000): Promise<boolean> {
  return new Promise((resolve) => {
    const img = new Image()
    const timer = setTimeout(() => {
      img.src = ""
      resolve(false)
    }, timeoutMs)

    img.onload = () => {
      clearTimeout(timer)
      const { naturalWidth: w, naturalHeight: h } = img
      if (w >= 16 && h >= 16 && w <= 256 && h <= 256) {
        const ratio = w / h
        if (ratio > 0.7 && ratio < 1.3) {
          resolve(true)
          return
        }
      }
      resolve(false)
    }
    img.onerror = () => {
      clearTimeout(timer)
      resolve(false)
    }
    img.src = url
  })
}

async function fetchValidFavicon(url: string): Promise<string> {
  const faviconUrls = getFaviconUrls(url)

  for (const faviconUrl of faviconUrls) {
    const exists = await checkImageExists(faviconUrl)
    if (exists) {
      return faviconUrl
    }
  }

  return ""
}

interface DataEditorProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  data: NavigationData
  onSave: (data: NavigationData) => void
}

export function DataEditor({ open, onOpenChange, data, onSave }: DataEditorProps) {
  const [editData, setEditData] = useState<NavigationData>(data)
  const [activeTab, setActiveTab] = useState("sections")
  const [collapsedSections, setCollapsedSections] = useState<Set<number>>(new Set())
  const [batchFetching, setBatchFetching] = useState(false)
  const [batchProgress, setBatchProgress] = useState("")

  useState(() => {
    setEditData(data)
  })

  const handleSave = () => {
    onSave(editData)
    onOpenChange(false)
  }

  const updatePageTitle = (title: string) => {
    setEditData({
      ...editData,
      pageInfo: { ...editData.pageInfo, title },
    })
  }

  const addSection = () => {
    const newSection: NavSection = {
      name: "新分类",
      sortOrder: editData.sections.length,
      items: [],
    }
    setEditData({
      ...editData,
      sections: [...editData.sections, newSection],
    })
  }

  const updateSection = (index: number, section: NavSection) => {
    const sections = [...editData.sections]
    sections[index] = section
    setEditData({ ...editData, sections })
  }

  const deleteSection = (index: number) => {
    const sections = editData.sections.filter((_, i) => i !== index)
    setEditData({ ...editData, sections })
  }

  const addItem = (sectionIndex: number) => {
    const sections = [...editData.sections]
    const section = sections[sectionIndex]
    const newItem: NavItem = {
      title: "新链接",
      description: "",
      url: "https://",
      icon: "",
      sortOrder: section.items.length,
    }
    sections[sectionIndex] = {
      ...section,
      items: [...section.items, newItem],
    }
    setEditData({ ...editData, sections })
  }

  const updateItem = (sectionIndex: number, itemIndex: number, item: NavItem) => {
    const sections = [...editData.sections]
    const items = [...sections[sectionIndex].items]
    items[itemIndex] = item
    sections[sectionIndex] = { ...sections[sectionIndex], items }
    setEditData({ ...editData, sections })
  }

  const deleteItem = (sectionIndex: number, itemIndex: number) => {
    const sections = [...editData.sections]
    const items = sections[sectionIndex].items.filter((_, i) => i !== itemIndex)
    sections[sectionIndex] = { ...sections[sectionIndex], items }
    setEditData({ ...editData, sections })
  }

  const moveItem = (
    sectionIndex: number,
    itemIndex: number,
    direction: "up" | "down"
  ) => {
    const sections = [...editData.sections]
    const items = [...sections[sectionIndex].items]
    const newIndex = direction === "up" ? itemIndex - 1 : itemIndex + 1
    if (newIndex < 0 || newIndex >= items.length) return
    ;[items[itemIndex], items[newIndex]] = [items[newIndex], items[itemIndex]]
    items.forEach((item, i) => {
      item.sortOrder = i
    })
    sections[sectionIndex] = { ...sections[sectionIndex], items }
    setEditData({ ...editData, sections })
  }

  const addSearchEngine = () => {
    const engines = [...editData.searchEngines]
    engines.push({
      name: "新引擎",
      urlTemplate: "https://example.com/search?q={query}",
      sortOrder: engines.length,
    })
    setEditData({ ...editData, searchEngines: engines })
  }

  const updateSearchEngine = (index: number, engine: SearchEngine) => {
    const engines = [...editData.searchEngines]
    engines[index] = engine
    setEditData({ ...editData, searchEngines: engines })
  }

  const deleteSearchEngine = (index: number) => {
    const engines = editData.searchEngines.filter((_, i) => i !== index)
    setEditData({ ...editData, searchEngines: engines })
  }

  const moveSearchEngine = (index: number, direction: "up" | "down") => {
    const engines = [...editData.searchEngines]
    const newIndex = direction === "up" ? index - 1 : index + 1
    if (newIndex < 0 || newIndex >= engines.length) return
    ;[engines[index], engines[newIndex]] = [engines[newIndex], engines[index]]
    engines.forEach((e, i) => {
      e.sortOrder = i
    })
    setEditData({ ...editData, searchEngines: engines })
  }

  const toggleSection = (index: number) => {
    const next = new Set(collapsedSections)
    if (next.has(index)) {
      next.delete(index)
    } else {
      next.add(index)
    }
    setCollapsedSections(next)
  }

  const batchFetchFavicons = async () => {
    setBatchFetching(true)
    setBatchProgress("")
    const sections = [...editData.sections]
    let total = 0
    let done = 0

    for (const section of sections) {
      total += section.items.length
    }

    for (let si = 0; si < sections.length; si++) {
      const items = [...sections[si].items]
      for (let ii = 0; ii < items.length; ii++) {
        const item = items[ii]
        if (!item.url || item.url === "https://") {
          done++
          continue
        }
        setBatchProgress(`正在获取图标... (${done + 1}/${total})`)
        const favicon = await fetchValidFavicon(item.url)
        if (favicon) {
          items[ii] = { ...item, icon: favicon }
        }
        done++
        sections[si] = { ...sections[si], items }
        setEditData({ ...editData, sections })
      }
    }

    setBatchProgress(`完成！共处理 ${total} 个链接`)
    setBatchFetching(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] flex flex-col p-0 max-sm:max-w-full max-sm:max-h-[95dvh] max-sm:mx-2 max-sm:rounded-xl">
        <DialogHeader className="px-6 pt-6 pb-2 shrink-0">
          <DialogTitle>编辑导航数据</DialogTitle>
        </DialogHeader>

        <div className="px-6 flex-1 overflow-y-auto min-h-0">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex flex-col h-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="sections">分类与链接</TabsTrigger>
            <TabsTrigger value="engines">搜索引擎</TabsTrigger>
            <TabsTrigger value="settings">页面设置</TabsTrigger>
          </TabsList>

          <TabsContent value="sections" className="space-y-4 mt-4">
            {editData.sections.map((section, si) => (
              <div
                key={si}
                className="border border-border rounded-lg overflow-hidden"
              >
                <button
                  onClick={() => toggleSection(si)}
                  className="w-full flex items-center gap-2 p-3 hover:bg-muted/50 transition-colors"
                >
                  {collapsedSections.has(si) ? (
                    <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
                  ) : (
                    <ChevronDown className="h-4 w-4 text-muted-foreground shrink-0" />
                  )}
                  <Input
                    value={section.name}
                    onChange={(e) =>
                      updateSection(si, { ...section, name: e.target.value })
                    }
                    placeholder="分类名称"
                    className="flex-1 h-8 text-sm border-0 bg-transparent p-0 focus-visible:ring-0"
                    onClick={(e) => e.stopPropagation()}
                  />
                  <span className="text-xs text-muted-foreground shrink-0">
                    {section.items.length} 个链接
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 shrink-0"
                    onClick={(e) => {
                      e.stopPropagation()
                      deleteSection(si)
                    }}
                  >
                    <Trash2 className="h-3.5 w-3.5 text-destructive" />
                  </Button>
                </button>

                {!collapsedSections.has(si) && (
                  <div className="px-3 pb-3 space-y-2 border-t border-border pt-3">
                  {section.items.map((item, ii) => (
                    <div
                      key={ii}
                      className="flex items-start gap-2 border border-border rounded-md p-2"
                    >
                      <div className="flex flex-col gap-1 mt-1">
                        <button
                          onClick={() => moveItem(si, ii, "up")}
                          disabled={ii === 0}
                          className="text-muted-foreground hover:text-foreground disabled:opacity-30"
                        >
                          <GripVertical className="h-3 w-3" />
                        </button>
                        <button
                          onClick={() => moveItem(si, ii, "down")}
                          disabled={ii === section.items.length - 1}
                          className="text-muted-foreground hover:text-foreground disabled:opacity-30"
                        >
                          <GripVertical className="h-3 w-3 rotate-180" />
                        </button>
                      </div>
                      <div className="flex-1 space-y-2">
                        <Input
                          value={item.title}
                          onChange={(e) =>
                            updateItem(si, ii, {
                              ...item,
                              title: e.target.value,
                            })
                          }
                          placeholder="标题"
                          className="h-8 text-sm"
                        />
                        <Input
                          value={item.url}
                          onChange={(e) =>
                            updateItem(si, ii, {
                              ...item,
                              url: e.target.value,
                            })
                          }
                          placeholder="URL"
                          className="h-8 text-sm"
                        />
                        <Input
                          value={item.description}
                          onChange={(e) =>
                            updateItem(si, ii, {
                              ...item,
                              description: e.target.value,
                            })
                          }
                          placeholder="描述（可选）"
                          className="h-8 text-sm"
                        />
                        <div className="flex gap-2">
                          <Input
                            value={item.icon}
                            onChange={(e) =>
                              updateItem(si, ii, {
                                ...item,
                                icon: e.target.value,
                              })
                            }
                            placeholder="图标 URL 或 base64（可选）"
                            className="h-8 text-sm flex-1"
                          />
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={async () => {
                              const favicon = await fetchValidFavicon(item.url)
                              if (favicon) {
                                updateItem(si, ii, {
                                  ...item,
                                  icon: favicon,
                                })
                              }
                            }}
                            disabled={!item.url}
                            title="自动获取图标"
                          >
                            <Sparkles className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => deleteItem(si, ii)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  ))}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => addItem(si)}
                    className="w-full"
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    添加链接
                  </Button>
                </div>
                )}
              </div>
            ))}

            <Button
              variant="outline"
              onClick={addSection}
              className="w-full"
            >
              <Plus className="h-4 w-4 mr-1" />
              添加分类
            </Button>
          </TabsContent>

          <TabsContent value="engines" className="space-y-3">
            {editData.searchEngines.map((engine, ei) => (
              <div
                key={ei}
                className="flex items-start gap-2 border border-border rounded-md p-3"
              >
                <div className="flex flex-col gap-1 mt-1">
                  <button
                    onClick={() => moveSearchEngine(ei, "up")}
                    disabled={ei === 0}
                    className="text-muted-foreground hover:text-foreground disabled:opacity-30"
                  >
                    <GripVertical className="h-3 w-3" />
                  </button>
                  <button
                    onClick={() => moveSearchEngine(ei, "down")}
                    disabled={ei === editData.searchEngines.length - 1}
                    className="text-muted-foreground hover:text-foreground disabled:opacity-30"
                  >
                    <GripVertical className="h-3 w-3 rotate-180" />
                  </button>
                </div>
                <div className="flex-1 space-y-2">
                  <Input
                    value={engine.name}
                    onChange={(e) =>
                      updateSearchEngine(ei, {
                        ...engine,
                        name: e.target.value,
                      })
                    }
                    placeholder="引擎名称"
                    className="h-8 text-sm"
                  />
                  <Input
                    value={engine.urlTemplate}
                    onChange={(e) =>
                      updateSearchEngine(ei, {
                        ...engine,
                        urlTemplate: e.target.value,
                      })
                    }
                    placeholder="搜索 URL 模板，使用 {query} 占位"
                    className="h-8 text-sm"
                  />
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => deleteSearchEngine(ei)}
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            ))}
            <Button
              variant="outline"
              onClick={addSearchEngine}
              className="w-full"
            >
              <Plus className="h-4 w-4 mr-1" />
              添加搜索引擎
            </Button>
          </TabsContent>

          <TabsContent value="settings" className="space-y-4">
            <div className="space-y-2">
              <Label>页面标题</Label>
              <Input
                value={editData.pageInfo.title}
                onChange={(e) => updatePageTitle(e.target.value)}
                placeholder="页面标题"
              />
            </div>
            <div className="space-y-2">
              <Label>图标大小</Label>
              <select
                value={editData.appConfig.iconSize}
                onChange={(e) =>
                  setEditData({
                    ...editData,
                    appConfig: {
                      ...editData.appConfig,
                      iconSize: e.target.value,
                    },
                  })
                }
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm"
              >
                <option value="small">小</option>
                <option value="medium">中</option>
                <option value="large">大</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label>批量获取图标</Label>
              <p className="text-xs text-muted-foreground">
                自动为所有链接获取网站 favicon 图标
              </p>
              <Button
                variant="outline"
                onClick={batchFetchFavicons}
                disabled={batchFetching}
                className="w-full"
              >
                {batchFetching ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                    {batchProgress || "正在获取..."}
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4 mr-1" />
                    一键获取所有图标
                  </>
                )}
              </Button>
              {batchProgress && !batchFetching && (
                <p className="text-xs text-green-600 dark:text-green-400">
                  {batchProgress}
                </p>
              )}
            </div>
          </TabsContent>
        </Tabs>
        </div>

        <DialogFooter className="px-6 py-4 border-t shrink-0">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            取消
          </Button>
          <Button onClick={handleSave}>保存</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
