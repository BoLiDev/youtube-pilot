/**
 * API密钥存储服务
 * 使用Chrome存储API来保存和检索API密钥
 */

const API_KEY_STORAGE_KEY = "googleApiKey"

/**
 * 保存API密钥到Chrome存储
 */
export const saveApiKey = async (apiKey: string): Promise<void> => {
  try {
    await chrome.storage.sync.set({ [API_KEY_STORAGE_KEY]: apiKey })
    console.log("API密钥已保存")
  } catch (error) {
    console.error("保存API密钥时出错:", error)
    throw new Error(`无法保存API密钥: ${error.message}`)
  }
}

/**
 * 从Chrome存储获取API密钥
 */
export const getApiKey = async (): Promise<string | null> => {
  try {
    const result = await chrome.storage.sync.get([API_KEY_STORAGE_KEY])
    return result[API_KEY_STORAGE_KEY] || null
  } catch (error) {
    console.error("获取API密钥时出错:", error)
    return null
  }
}

/**
 * 从Chrome存储删除API密钥
 */
export const clearApiKey = async (): Promise<void> => {
  try {
    await chrome.storage.sync.remove([API_KEY_STORAGE_KEY])
    console.log("API密钥已清除")
  } catch (error) {
    console.error("清除API密钥时出错:", error)
    throw new Error(`无法清除API密钥: ${error.message}`)
  }
}