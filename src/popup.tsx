import { observer } from "mobx-react-lite"
import { useEffect } from "react"

import ConfigTab from "./components/ConfigTab"
import DetailedNotesTab from "./components/DetailedNotesTab"
import ErrorMessage from "./components/ErrorMessage"
import QuickSummaryTab from "./components/QuickSummaryTab"
import Tabs from "./components/Tabs"
import { popupStore } from "./store/PopupStore"

import "./styles/popup.css"

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
