import type { PlasmoCSConfig } from "plasmo"

// 为window对象声明扩展接口
declare global {
  interface Window {
    isYouTubeVideoPage: () => boolean
    getCurrentVideoUrl: () => string | null
    getCurrentVideoTitle: () => string
  }
}

export const config: PlasmoCSConfig = {
  matches: ["https://*.youtube.com/*"]
}

// 检测页面是否是视频页面
const isYouTubeVideoPage = () => {
  return window.location.href.includes("youtube.com/watch")
}

// 获取当前YouTube视频的URL
export const getCurrentVideoUrl = () => {
  if (isYouTubeVideoPage()) {
    return window.location.href
  }
  return null
}

// 获取当前YouTube视频的标题
export const getCurrentVideoTitle = () => {
  if (isYouTubeVideoPage()) {
    const titleElement = document.querySelector("h1.ytd-video-primary-info-renderer")
    return titleElement?.textContent?.trim() || "YouTube Video"
  }
  return "YouTube Video"
}

window.addEventListener("load", () => {
  console.log("YouTube Summarizer loaded")

  // 为了向扩展的其他部分提供访问权限，我们将这些函数附加到window对象
  window.isYouTubeVideoPage = isYouTubeVideoPage
  window.getCurrentVideoUrl = getCurrentVideoUrl
  window.getCurrentVideoTitle = getCurrentVideoTitle
})
