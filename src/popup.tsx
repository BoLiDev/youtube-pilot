import { observer } from "mobx-react-lite"
import { useEffect } from "react"

import ApiKeyInput from "./components/ApiKeyInput"
import MarkdownRenderer from "./components/MarkdownRenderer"
import { aiServiceStore } from "./store/AIServiceStore"
import { popupStore, TabType } from "./store/PopupStore"

import "./styles/popup.css"

const ProgressIndicator = observer(() => {
  const shouldShow = popupStore.isLoadingSummary || popupStore.isLoadingNotes

  if (!shouldShow || aiServiceStore.status === "闲置") return null

  return (
    <div className="progress-indicator">
      <p>{aiServiceStore.status}</p>
    </div>
  )
})

const Tabs = observer(() => {
  return (
    <div className="tabs">
      <div
        className={`tab ${popupStore.activeTab === TabType.QUICK_SUMMARY ? "active" : ""}`}
        onClick={() => popupStore.setActiveTab(TabType.QUICK_SUMMARY)}>
        快速总结
      </div>
      <div
        className={`tab ${popupStore.activeTab === TabType.DETAILED_NOTES ? "active" : ""}`}
        onClick={() => popupStore.setActiveTab(TabType.DETAILED_NOTES)}>
        详细笔记
      </div>
      <div
        className={`tab ${popupStore.activeTab === TabType.SETTINGS ? "active" : ""}`}
        onClick={() => popupStore.setActiveTab(TabType.SETTINGS)}>
        设置
      </div>
    </div>
  )
})

const ErrorMessage = observer(() => {
  if (!popupStore.error) return null
  return (
    <div className="error">
      <h4>错误信息</h4>
      <details open={!!popupStore.error}>
        <summary>{popupStore.error.split(":")[0]}</summary>
        <p>{popupStore.error}</p>
      </details>
    </div>
  )
})

const ConfigTab = observer(() => {
  return (
    <div
      className={`tab-content ${popupStore.activeTab === TabType.SETTINGS ? "active" : ""}`}>
      <ApiKeyInput onApiKeyChange={(key) => popupStore.saveApiKey(key || "")} />
    </div>
  )
})

const UrlInputArea = observer(() => {
  const isOverallLoading = popupStore.isOverallLoading
  return (
    <div className="input-group">
      <label htmlFor="video-url">YouTube视频URL</label>
      <input
        id="video-url"
        type="text"
        value={popupStore.videoUrl}
        onChange={(e) => popupStore.setVideoUrl(e.target.value)}
        placeholder="https://www.youtube.com/watch?v=..."
        disabled={isOverallLoading}
      />
    </div>
  )
})

const QuickSummaryTab = observer(() => {
  return (
    <div
      className={`tab-content ${popupStore.activeTab === TabType.QUICK_SUMMARY ? "active" : ""}`}>
      <UrlInputArea />
      <button
        className="button"
        onClick={() => popupStore.fetchSummary()}
        disabled={popupStore.isLoadingSummary || !popupStore.isAvailable}>
        {popupStore.isLoadingSummary ? "处理中..." : "获取总结"}
      </button>

      {popupStore.isLoadingSummary ? (
        <ProgressIndicator />
      ) : popupStore.summary ? (
        <div className="result-area">
          <h3>视频摘要</h3>
          <p>{popupStore.summary}</p>
        </div>
      ) : (
        !popupStore.apiKey &&
        !popupStore.isLoadingSummary && (
          <div className="instruction-message">
            请先在"设置"标签页中添加您的Google Gemini API密钥
          </div>
        )
      )}
    </div>
  )
})

const DetailedNotesTab = observer(() => {
  return (
    <div
      className={`tab-content ${popupStore.activeTab === TabType.DETAILED_NOTES ? "active" : ""}`}>
      <UrlInputArea />
      <button
        className="button"
        onClick={() => popupStore.fetchDetailedNotes()}
        disabled={popupStore.isLoadingNotes || !popupStore.isAvailable}>
        {popupStore.isLoadingNotes ? "处理中..." : "生成详细笔记"}
      </button>

      {popupStore.isLoadingNotes ? (
        <ProgressIndicator />
      ) : popupStore.detailedNotes ? (
        <>
          <div className="result-area">
            <MarkdownRenderer content={popupStore.detailedNotes} />
          </div>
          <div className="button-group">
            <button
              className="button"
              onClick={() => popupStore.downloadNotes()}
              disabled={!popupStore.detailedNotes}>
              下载笔记
            </button>
          </div>
        </>
      ) : (
        !popupStore.apiKey &&
        !popupStore.isLoadingNotes && (
          <div className="instruction-message">
            请先在"设置"标签页中添加您的Google Gemini API密钥
          </div>
        )
      )}
    </div>
  )
})

const IndexPopup = observer(() => {
  useEffect(() => {
    popupStore.initialize()
  }, [])

  return (
    <div className="container">
      <h1>YouTube视频总结</h1>

      <ErrorMessage />
      <Tabs />
      <ConfigTab />
      <QuickSummaryTab />
      <DetailedNotesTab />
    </div>
  )
})

export default IndexPopup
