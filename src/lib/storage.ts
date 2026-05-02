import { supabase } from "./supabase"
import type { NavigationData } from "./types"
import { DEFAULT_NAVIGATION_DATA } from "./types"

export async function loadNavigationData(deviceId: string): Promise<NavigationData> {
  const { data, error } = await supabase
    .from("navigation")
    .select("data")
    .eq("device_id", deviceId)
    .maybeSingle()

  if (error) {
    console.error("Failed to load navigation data:", error)
    return { ...DEFAULT_NAVIGATION_DATA }
  }

  if (!data) {
    return { ...DEFAULT_NAVIGATION_DATA }
  }

  return data.data as NavigationData
}

export async function saveNavigationData(deviceId: string, navData: NavigationData): Promise<void> {
  const { error } = await supabase
    .from("navigation")
    .upsert(
      {
        device_id: deviceId,
        data: navData as unknown as Record<string, unknown>,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "device_id" }
    )

  if (error) {
    console.error("Failed to save navigation data:", error)
    throw error
  }
}

export async function generateShareCode(deviceId: string): Promise<string> {
  const code = generateRandomCode(8)

  const { error } = await supabase
    .from("navigation")
    .update({ share_code: code, updated_at: new Date().toISOString() })
    .eq("device_id", deviceId)

  if (error) {
    console.error("Failed to generate share code:", error)
    throw error
  }

  return code
}

export async function getShareCode(deviceId: string): Promise<string | null> {
  const { data, error } = await supabase
    .from("navigation")
    .select("share_code")
    .eq("device_id", deviceId)
    .maybeSingle()

  if (error || !data) {
    return null
  }

  return data.share_code
}

export async function loadByShareCode(shareCode: string): Promise<NavigationData | null> {
  const { data, error } = await supabase
    .from("navigation")
    .select("data")
    .eq("share_code", shareCode)
    .maybeSingle()

  if (error || !data) {
    console.error("Failed to load by share code:", error)
    return null
  }

  return data.data as NavigationData
}

function generateRandomCode(length: number): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
  let result = ""
  const array = new Uint8Array(length)
  crypto.getRandomValues(array)
  for (let i = 0; i < length; i++) {
    result += chars[array[i] % chars.length]
  }
  return result
}
