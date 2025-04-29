import { observer } from "mobx-react-lite"

import { popupStore } from "../store/PopupStore"

import "../styles/popup.css"

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

export default ErrorMessage
