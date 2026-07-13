import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/** 从搜索引擎 URL 模板提取域名，返回 Google s2 favicon 地址 */
export function getEngineIconUrl(urlTemplate: string): string {
  try {
    const u = new URL(urlTemplate)
    return `https://www.google.com/s2/favicons?domain=${encodeURIComponent(u.hostname)}&sz=32`
  } catch {
    return ""
  }
}
