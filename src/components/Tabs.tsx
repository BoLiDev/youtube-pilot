import { observer } from "mobx-react-lite"

import { popupStore, TabType } from "../store/PopupStore"

import "../styles/popup.css"

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

export default Tabs
