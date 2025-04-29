import { observer } from "mobx-react-lite"

import { popupStore, TabType } from "~/store"

import ProgressIndicator from "./ProgressIndicator"
import UrlInputArea from "./UrlInputArea"

import "~/styles/shared.css"

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

export default QuickSummaryTab
