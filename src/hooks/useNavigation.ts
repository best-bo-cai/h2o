import { useState, useEffect, useCallback } from "react"
import type { NavigationData } from "@/lib/types"
import { DEFAULT_NAVIGATION_DATA } from "@/lib/types"
import { getDeviceId } from "@/lib/deviceId"
import {
  loadNavigationData,
  saveNavigationData,
  generateShareCode,
  getShareCode,
  loadByShareCode,
} from "@/lib/storage"

export function useNavigation() {
  const [data, setData] = useState<NavigationData>(DEFAULT_NAVIGATION_DATA)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [shareCode, setShareCode] = useState<string | null>(null)
  const deviceId = getDeviceId()

  useEffect(() => {
    const init = async () => {
      setLoading(true)
      const navData = await loadNavigationData(deviceId)
      if (!navData.searchEngines) {
        navData.searchEngines = DEFAULT_NAVIGATION_DATA.searchEngines
      }
      setData(navData)
      const code = await getShareCode(deviceId)
      setShareCode(code)
      setLoading(false)
    }
    init()
  }, [deviceId])

  const save = useCallback(
    async (newData: NavigationData) => {
      setSaving(true)
      setData(newData)
      await saveNavigationData(deviceId, newData)
      setSaving(false)
    },
    [deviceId]
  )

  const generateCode = useCallback(async () => {
    const code = await generateShareCode(deviceId)
    setShareCode(code)
    return code
  }, [deviceId])

  const importFromShareCode = useCallback(
    async (code: string) => {
      const importedData = await loadByShareCode(code)
      if (importedData) {
        setData(importedData)
        await saveNavigationData(deviceId, importedData)
        return true
      }
      return false
    },
    [deviceId]
  )

  const importData = useCallback(
    async (jsonStr: string) => {
      try {
        const parsed = JSON.parse(jsonStr) as NavigationData
        if (!parsed.sections || !Array.isArray(parsed.sections)) {
          throw new Error("Invalid data format")
        }
        setData(parsed)
        await saveNavigationData(deviceId, parsed)
        return true
      } catch {
        return false
      }
    },
    [deviceId]
  )

  const exportData = useCallback(() => {
    return JSON.stringify(data, null, 2)
  }, [data])

  return {
    data,
    loading,
    saving,
    shareCode,
    deviceId,
    save,
    generateCode,
    importFromShareCode,
    importData,
    exportData,
  }
}
