import { observer } from "mobx-react-lite"

import { popupStore, TabType } from "~/store"

import styles from "./Tabs.module.css"

const Tabs = observer(() => {
  return (
    <div className={styles.tabsContainer}>
      <div
        className={`${styles.tab} ${popupStore.activeTab === TabType.QUICK_SUMMARY ? styles.active : ""}`}
        onClick={() => popupStore.setActiveTab(TabType.QUICK_SUMMARY)}>
        快速总结
      </div>
      <div
        className={`${styles.tab} ${popupStore.activeTab === TabType.DETAILED_NOTES ? styles.active : ""}`}
        onClick={() => popupStore.setActiveTab(TabType.DETAILED_NOTES)}>
        详细笔记
      </div>
      <div
        className={`${styles.tab} ${popupStore.activeTab === TabType.SETTINGS ? styles.active : ""}`}
        onClick={() => popupStore.setActiveTab(TabType.SETTINGS)}>
        设置
      </div>
    </div>
  )
})

export default Tabs
