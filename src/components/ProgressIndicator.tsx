import { observer } from "mobx-react-lite"

import { aiServiceStore } from "../store/AIServiceStore"
import { popupStore } from "../store/PopupStore"

import "../styles/popup.css"

const ProgressIndicator = observer(() => {
  const shouldShow = popupStore.isLoadingSummary || popupStore.isLoadingNotes

  // Check if AI Service status is available and not idle
  const status = aiServiceStore.status
  if (!shouldShow || !status || status === "闲置") return null

  return (
    <div className="progress-indicator">
      <p>{status}</p>
    </div>
  )
})

export default ProgressIndicator
