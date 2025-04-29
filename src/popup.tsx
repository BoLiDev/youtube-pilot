import { observer } from "mobx-react-lite"
import { useEffect } from "react"

import {
  ConfigTab,
  DetailedNotesTab,
  ErrorMessage,
  QuickSummaryTab,
  Tabs
} from "./components"
import { popupStore } from "./store"

import "./styles/global.css"
import "./popup.css"

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
