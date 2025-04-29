import { observer } from "mobx-react-lite"

import { popupStore, TabType } from "../store/PopupStore"
import MarkdownRenderer from "./MarkdownRenderer"
import ProgressIndicator from "./ProgressIndicator"
import UrlInputArea from "./UrlInputArea"

import "../styles/popup.css"

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

export default DetailedNotesTab
