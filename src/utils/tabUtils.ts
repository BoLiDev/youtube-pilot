/**
 * 获取当前活动标签页的信息
 * @returns Promise解析为当前活动标签页，如果没有找到则为null
 */
export const getCurrentTab = async (): Promise<chrome.tabs.Tab | null> => {
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true })
    return tab || null
  } catch (error) {
    console.error("获取当前标签页时出错:", error)
    return null
  }
}

/**
 * 检查当前标签页是否是YouTube视频页面
 * @returns Promise解析为布尔值，表示当前页面是否是YouTube视频页面
 */
export const isYouTubeVideoPage = async (): Promise<boolean> => {
  const tab = await getCurrentTab()
  return tab?.url?.includes("youtube.com/watch") || false
}

/**
 * 从标签页获取当前视频URL
 * @returns Promise解析为当前视频的URL，如果不在视频页面则为null
 */
export const getVideoUrlFromCurrentTab = async (): Promise<string | null> => {
  const tab = await getCurrentTab()
  if (tab?.url?.includes("youtube.com/watch")) {
    return tab.url
  }
  return null
}

/**
 * 从标签页获取视频标题
 * @returns Promise解析为当前视频的标题
 */
export const getVideoTitleFromTab = async (): Promise<string> => {
  const tab = await getCurrentTab()
  return tab?.title?.replace(" - YouTube", "") || "YouTube Video"
}