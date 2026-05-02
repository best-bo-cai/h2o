export interface NavItem {
  title: string
  description: string
  url: string
  icon: string
  sortOrder: number
}

export interface NavSection {
  name: string
  sortOrder: number
  items: NavItem[]
}

export interface SearchEngine {
  name: string
  urlTemplate: string
  sortOrder: number
}

export interface PageInfo {
  title: string
}

export interface AppConfig {
  theme: string
  layout: string
  iconSize: string
}

export interface NavigationData {
  pageInfo: PageInfo
  sections: NavSection[]
  appConfig: AppConfig
  searchEngines: SearchEngine[]
}

export interface NavigationRecord {
  id: number
  device_id: string
  data: NavigationData
  share_code: string | null
  created_at: string
  updated_at: string
}

export const DEFAULT_SEARCH_ENGINES: SearchEngine[] = [
  {
    name: "Google",
    urlTemplate: "https://www.google.com/search?q={query}",
    sortOrder: 0,
  },
  {
    name: "Bing",
    urlTemplate: "https://www.bing.com/search?q={query}",
    sortOrder: 1,
  },
  {
    name: "百度",
    urlTemplate: "https://www.baidu.com/s?wd={query}",
    sortOrder: 2,
  },
  {
    name: "DuckDuckGo",
    urlTemplate: "https://duckduckgo.com/?q={query}",
    sortOrder: 3,
  },
]

export const DEFAULT_NAVIGATION_DATA: NavigationData = {
  pageInfo: {
    title: "H2O导航页",
  },
  sections: [],
  appConfig: {
    theme: "light",
    layout: "horizontal",
    iconSize: "medium",
  },
  searchEngines: DEFAULT_SEARCH_ENGINES,
}
