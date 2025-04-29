import { computed, makeAutoObservable, runInAction } from "mobx"

import {
  getApiKey,
  saveApiKey as saveApiKeyToStorage
} from "../storage/keyStorage"
import {
  downloadAsMarkdown,
  generateFilenameFromTitle
} from "../utils/fileUtils"
import {
  getVideoTitleFromTab,
  getVideoUrlFromCurrentTab,
  isYouTubeVideoPage
} from "../utils/tabUtils"
import { aiServiceStore } from "./AIServiceStore"

export enum TabType {
  QUICK_SUMMARY = "quick_summary",
  DETAILED_NOTES = "detailed_notes",
  SETTINGS = "settings"
}

class PopupStore {
  activeTab: TabType = TabType.QUICK_SUMMARY
  videoUrl: string = ""
  videoTitle: string = ""
  summary: string = ""
  detailedNotes: string = ""
  isLoadingSummary: boolean = false
  isLoadingNotes: boolean = false
  error: string = ""
  isYouTubeVideo: boolean = false
  apiKey: string | null = null

  constructor() {
    makeAutoObservable(this)
    this.loadApiKey()
  }

  get isAvailable(): boolean {
    return !!this.videoUrl && !!this.apiKey
  }

  get isOverallLoading(): boolean {
    return (
      this.isLoadingSummary ||
      this.isLoadingNotes ||
      aiServiceStore.isProcessing
    )
  }

  setActiveTab(tab: TabType) {
    this.activeTab = tab
  }

  setVideoUrl(url: string) {
    this.videoUrl = url
  }

  setVideoTitle(title: string) {
    this.videoTitle = title
  }

  setError(errorMsg: string) {
    this.error = errorMsg
  }

  clearError() {
    this.error = ""
  }

  async loadApiKey() {
    const key = await getApiKey()
    runInAction(() => {
      this.apiKey = key
      if (key && this.error.includes("API密钥")) {
        this.clearError()
      }
    })
  }

  async saveApiKey(newApiKey: string) {
    if (!newApiKey) {
      this.setError("API密钥不能为空")
      return
    }
    try {
      await saveApiKeyToStorage(newApiKey)
      runInAction(() => {
        this.apiKey = newApiKey
        this.clearError()
      })
    } catch (e) {
      runInAction(() => {
        this.setError(`无法保存API密钥: ${e.message}`)
      })
    }
  }

  async initialize() {
    try {
      const url = await getVideoUrlFromCurrentTab()
      const isYTVideo = await isYouTubeVideoPage()
      const title = await getVideoTitleFromTab()

      runInAction(() => {
        this.isYouTubeVideo = isYTVideo
        this.videoUrl = url || ""
        this.videoTitle = title
        if (!this.apiKey && isYTVideo) {
          this.setError("请先在设置中添加Google Gemini API密钥")
          this.setActiveTab(TabType.SETTINGS)
        }
      })
    } catch (error) {
      console.error("获取当前标签页信息时出错:", error)
      runInAction(() => {
        this.setError("无法获取当前标签页信息。请刷新后重试。")
      })
    }
  }

  async fetchSummary() {
    if (!this.isAvailable || !this.videoUrl) return

    this.clearError()
    this.isLoadingSummary = true
    this.summary = ""

    try {
      const result = await aiServiceStore.generateContent(
        this.videoUrl,
        "summary"
      )
      runInAction(() => {
        this.summary = result
      })
    } catch (error) {
      console.error("PopupStore: 获取视频摘要时出错:", error)
      this.setError(`生成摘要失败: ${error.message || "未知错误"}`)
    } finally {
      runInAction(() => {
        this.isLoadingSummary = false
      })
    }
  }

  async fetchDetailedNotes() {
    if (!this.isAvailable || !this.videoUrl) return

    this.clearError()
    this.isLoadingNotes = true
    this.detailedNotes = ""

    try {
      const result = await aiServiceStore.generateContent(
        this.videoUrl,
        "notes"
      )
      runInAction(() => {
        this.detailedNotes = result
      })
    } catch (error) {
      console.error("PopupStore: 获取详细笔记时出错:", error)
      this.setError(`生成笔记失败: ${error.message || "未知错误"}`)
    } finally {
      runInAction(() => {
        this.isLoadingNotes = false
      })
    }
  }

  downloadNotes() {
    if (!this.detailedNotes) return
    const filename = generateFilenameFromTitle(this.videoTitle)
    downloadAsMarkdown(this.detailedNotes, filename)
  }
}

export const popupStore = new PopupStore()
