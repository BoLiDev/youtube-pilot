import { observer } from "mobx-react-lite"

import { aiServiceStore, popupStore } from "~/store"

import styles from "./ProgressIndicator.module.css"

const ProgressIndicator = observer(() => {
  const shouldShow = popupStore.isLoadingSummary || popupStore.isLoadingNotes

  if (!shouldShow) return null

  return (
    <div className={styles.progressIndicator}>
      <div className={styles.spinner}></div>
      <p>{aiServiceStore.status}</p>
    </div>
  )
})

export default ProgressIndicator
