import React, { useState, useEffect } from "react"
import LoadingIndicator from "./src/components/LoadingIndicator"
import ErrorMessage from "./src/components/ErrorMessage"
import SummaryDisplay from "./src/components/SummaryDisplay"
import NotesDisplay from "./src/components/NotesDisplay"
import UrlInput from "./src/components/UrlInput"
import Button from "./src/components/Button"
import { getQuickSummary, getDetailedNotes } from "./src/services/videoSummary"
import { getCurrentTabUrl, getCurrentTabTitle, isYouTubeVideoPage, extractVideoId } from "./src/utils/tabs"
import { downloadMarkdown, sanitizeFilename } from "./src/utils/download"
import { getSummaryFromCache, saveSummaryToCache, getNotesFromCache, saveNotesToCache } from "./src/services/storage"

function IndexPopup() {
  const [currentUrl, setCurrentUrl] = useState<string | null>(null)
  const [videoTitle, setVideoTitle] = useState<string | null>(null)
  const [isYouTubeVideo, setIsYouTubeVideo] = useState(false)
  const [customUrl, setCustomUrl] = useState("")

  const [summary, setSummary] = useState<string | null>(null)
  const [notes, setNotes] = useState<string | null>(null)

  const [loadingSummary, setLoadingSummary] = useState(false)
  const [loadingNotes, setLoadingNotes] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // 加载当前标签信息
  useEffect(() => {
    const loadTabInfo = async () => {
      try {
        const url = await getCurrentTabUrl()
        setCurrentUrl(url)

        const isYT = await isYouTubeVideoPage()
        setIsYouTubeVideo(isYT)

        if (isYT) {
          const title = await getCurrentTabTitle()
          setVideoTitle(title)

          // 尝试从缓存加载摘要
          if (url) {
            const videoId = extractVideoId(url)
            if (videoId) {
              const cachedSummary = await getSummaryFromCache(videoId)
              if (cachedSummary) {
                setSummary(cachedSummary)
              }
            }
          }
        }
      } catch (error) {
        console.error("加载标签信息时出错:", error)
        setError("加载页面信息时出错")
      }
    }

    loadTabInfo()
  }, [])

  // 生成当前视频的快速摘要
  const handleGenerateSummary = async () => {
    if (!currentUrl) return

    setLoadingSummary(true)
    setError(null)

    try {
      const videoId = extractVideoId(currentUrl)

      // 尝试从缓存获取摘要
      if (videoId) {
        const cachedSummary = await getSummaryFromCache(videoId)
        if (cachedSummary) {
          setSummary(cachedSummary)
          setLoadingSummary(false)
          return
        }
      }

      // 生成新摘要
      const summaryText = await getQuickSummary(currentUrl)
      setSummary(summaryText)

      // 保存到缓存
      if (videoId) {
        await saveSummaryToCache(videoId, summaryText)
      }
    } catch (error) {
      console.error("生成摘要时出错:", error)
      setError("生成摘要时出错: " + (error instanceof Error ? error.message : String(error)))
    } finally {
      setLoadingSummary(false)
    }
  }

  // 生成自定义URL的详细笔记
  const handleGenerateNotes = async (url: string) => {
    setLoadingNotes(true)
    setError(null)
    setCustomUrl(url)

    try {
      const videoId = extractVideoId(url)

      // 尝试从缓存获取笔记
      if (videoId) {
        const cachedNotes = await getNotesFromCache(videoId)
        if (cachedNotes) {
          setNotes(cachedNotes)
          setLoadingNotes(false)
          return
        }
      }

      // 生成新笔记
      const notesText = await getDetailedNotes(url)
      setNotes(notesText)

      // 保存到缓存
      if (videoId) {
        await saveNotesToCache(videoId, notesText)
      }
    } catch (error) {
      console.error("生成笔记时出错:", error)
      setError("生成笔记时出错: " + (error instanceof Error ? error.message : String(error)))
    } finally {
      setLoadingNotes(false)
    }
  }

  // 下载笔记为Markdown文件
  const handleDownloadNotes = () => {
    if (!notes) return

    const filename = sanitizeFilename(videoTitle || "YouTube Video Notes")
    downloadMarkdown(notes, filename)
  }

  return (
    <div
      style={{
        width: "400px",
        padding: "1rem",
        fontFamily: "Arial, sans-serif"
      }}>
      <h2 style={{ fontSize: "1.25rem", marginTop: 0, marginBottom: "1rem", textAlign: "center" }}>
        YouTube 视频摘要工具
      </h2>

      {error && <ErrorMessage message={error} />}

      {isYouTubeVideo && (
        <div style={{ marginBottom: "1.5rem" }}>
          <div style={{ fontSize: "0.875rem", marginBottom: "0.5rem" }}>
            当前视频: {videoTitle}
          </div>

          <Button
            onClick={handleGenerateSummary}
            disabled={loadingSummary}
            fullWidth
          >
            {loadingSummary ? "生成中..." : "获取快速摘要"}
          </Button>

          {loadingSummary && <LoadingIndicator size="small" />}

          {summary && <SummaryDisplay summary={summary} />}
        </div>
      )}

      <div style={{ marginBottom: "1rem" }}>
        <h3 style={{ fontSize: "1rem", marginBottom: "0.75rem" }}>
          获取详细笔记
        </h3>

        <UrlInput onSubmit={handleGenerateNotes} isLoading={loadingNotes} />

        {loadingNotes && <LoadingIndicator />}

        {notes && <NotesDisplay notes={notes} onDownload={handleDownloadNotes} />}
      </div>
    </div>
  )
}

export default IndexPopup
