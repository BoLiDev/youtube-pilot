import { useEffect, useState, useCallback } from "react"
import { getVideoSummary, getVideoDetailedNotes } from "./services/aiService"
import { downloadAsMarkdown, generateFilenameFromTitle } from "./utils/fileUtils"
import { getVideoUrlFromCurrentTab, getVideoTitleFromTab, isYouTubeVideoPage } from "./utils/tabUtils"
import LoadingSpinner from "./components/LoadingSpinner"
import MarkdownRenderer from "./components/MarkdownRenderer"
import ApiKeyInput from "./components/ApiKeyInput"
import "./styles/popup.css"

enum TabType {
  QUICK_SUMMARY = "quick_summary",
  DETAILED_NOTES = "detailed_notes",
  SETTINGS = "settings"
}

function IndexPopup() {
  const [activeTab, setActiveTab] = useState<TabType>(TabType.QUICK_SUMMARY)
  const [videoUrl, setVideoUrl] = useState<string>("")
  const [videoTitle, setVideoTitle] = useState<string>("")
  const [summary, setSummary] = useState<string>("")
  const [detailedNotes, setDetailedNotes] = useState<string>("")
  const [isLoadingSummary, setIsLoadingSummary] = useState<boolean>(false)
  const [isLoadingNotes, setIsLoadingNotes] = useState<boolean>(false)
  const [error, setError] = useState<string>("")
  const [isYouTubeVideo, setIsYouTubeVideo] = useState<boolean>(false)
  const [debug, setDebug] = useState<string>("")
  const [apiKey, setApiKey] = useState<string | null>(null)

  // 处理API密钥变化
  const handleApiKeyChange = useCallback((newApiKey: string | null) => {
    setApiKey(newApiKey)
    console.log("API密钥已更新:", newApiKey ? "已设置" : "未设置")

    // 清除错误消息（如果是由于没有API密钥导致的）
    if (newApiKey && error.includes("API密钥")) {
      setError("")
    }
  }, [error])

  // 初始化，获取当前标签页信息
  useEffect(() => {
    const fetchCurrentTab = async () => {
      try {
        const url = await getVideoUrlFromCurrentTab()
        const isYTVideo = await isYouTubeVideoPage()
        const title = await getVideoTitleFromTab()

        setIsYouTubeVideo(isYTVideo)
        if (url) {
          setVideoUrl(url)
        }
        if (title) {
          setVideoTitle(title)
        }

        // 如果是YouTube视频页面且已设置API密钥，自动获取摘要
        if (isYTVideo && url && apiKey) {
          handleGetSummary(url)
        }
      } catch (error) {
        console.error("获取当前标签页信息时出错:", error)
        setError("无法获取当前标签页信息。请刷新后重试。")
      }
    }

    fetchCurrentTab()
  }, [apiKey])

  // 获取视频摘要
  const handleGetSummary = async (url: string = videoUrl) => {
    if (!url) {
      setError("请输入有效的YouTube视频URL")
      return
    }

    if (!apiKey) {
      setError("请先在设置中添加Google Gemini API密钥")
      setActiveTab(TabType.SETTINGS)
      return
    }

    setError("")
    setIsLoadingSummary(true)

    try {
      const result = await getVideoSummary(url)
      setSummary(result)
    } catch (error) {
      console.error("获取视频摘要时出错:", error)
      setError(`生成摘要失败: ${error.message || "未知错误"}`)
    } finally {
      setIsLoadingSummary(false)
    }
  }

  // 获取详细笔记
  const handleGetDetailedNotes = async () => {
    if (!videoUrl) {
      setError("请输入有效的YouTube视频URL")
      return
    }

    if (!apiKey) {
      setError("请先在设置中添加Google Gemini API密钥")
      setActiveTab(TabType.SETTINGS)
      return
    }

    setError("")
    setIsLoadingNotes(true)

    try {
      const result = await getVideoDetailedNotes(videoUrl)
      setDetailedNotes(result)
    } catch (error) {
      console.error("获取详细笔记时出错:", error)
      setError(`生成笔记失败: ${error.message || "未知错误"}`)
    } finally {
      setIsLoadingNotes(false)
    }
  }

  // 下载笔记
  const handleDownloadNotes = () => {
    if (!detailedNotes) return

    const filename = generateFilenameFromTitle(videoTitle)
    downloadAsMarkdown(detailedNotes, filename)
  }

  // 切换标签页
  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab)

    // 如果切换到详细笔记标签且还没有内容，且有API密钥，自动获取笔记
    if (tab === TabType.DETAILED_NOTES && !detailedNotes && !isLoadingNotes && videoUrl && apiKey) {
      handleGetDetailedNotes()
    }
  }

  return (
    <div className="container">
      <h1>YouTube视频总结</h1>

      {error && (
        <div className="error">
          <h4>错误信息</h4>
          <details>
            <summary>{error.split(':')[0]}</summary>
            <p>{error}</p>
            {debug && <p className="debug-info">调试信息: {debug}</p>}
          </details>
        </div>
      )}

      <div className="tabs">
        <div
          className={`tab ${activeTab === TabType.QUICK_SUMMARY ? "active" : ""}`}
          onClick={() => handleTabChange(TabType.QUICK_SUMMARY)}
        >
          快速总结
        </div>
        <div
          className={`tab ${activeTab === TabType.DETAILED_NOTES ? "active" : ""}`}
          onClick={() => handleTabChange(TabType.DETAILED_NOTES)}
        >
          详细笔记
        </div>
        <div
          className={`tab ${activeTab === TabType.SETTINGS ? "active" : ""}`}
          onClick={() => handleTabChange(TabType.SETTINGS)}
        >
          设置
        </div>
      </div>

      <div className={`tab-content ${activeTab === TabType.SETTINGS ? "active" : ""}`}>
        <ApiKeyInput onApiKeyChange={handleApiKeyChange} />
      </div>

      <div className={`tab-content ${activeTab === TabType.QUICK_SUMMARY || activeTab === TabType.DETAILED_NOTES ? "active" : ""}`}>
        <div className="input-group">
          <label htmlFor="video-url">YouTube视频URL</label>
          <input
            id="video-url"
            type="text"
            value={videoUrl}
            onChange={(e) => setVideoUrl(e.target.value)}
            placeholder="https://www.youtube.com/watch?v=..."
          />
        </div>
      </div>

      <div className={`tab-content ${activeTab === TabType.QUICK_SUMMARY ? "active" : ""}`}>
        <button
          className="button"
          onClick={() => handleGetSummary()}
          disabled={isLoadingSummary || !videoUrl || !apiKey}
        >
          获取总结
        </button>

        {isLoadingSummary ? (
          <LoadingSpinner message="生成摘要中..." />
        ) : summary ? (
          <div className="result-area">
            <h3>视频摘要</h3>
            <p>{summary}</p>
          </div>
        ) : (
          !apiKey && (
            <div className="instruction-message">
              请先在"设置"标签页中添加您的Google Gemini API密钥
            </div>
          )
        )}
      </div>

      <div className={`tab-content ${activeTab === TabType.DETAILED_NOTES ? "active" : ""}`}>
        <button
          className="button"
          onClick={handleGetDetailedNotes}
          disabled={isLoadingNotes || !videoUrl || !apiKey}
        >
          生成详细笔记
        </button>

        {isLoadingNotes ? (
          <LoadingSpinner message="生成详细笔记中..." />
        ) : detailedNotes ? (
          <>
            <div className="result-area">
              <MarkdownRenderer content={detailedNotes} />
            </div>
            <div className="button-group">
              <button
                className="button"
                onClick={handleDownloadNotes}
              >
                下载笔记
              </button>
            </div>
          </>
        ) : (
          !apiKey && (
            <div className="instruction-message">
              请先在"设置"标签页中添加您的Google Gemini API密钥
            </div>
          )
        )}
      </div>
    </div>
  )
}

export default IndexPopup
