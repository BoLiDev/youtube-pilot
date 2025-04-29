import { observer } from "mobx-react-lite"

import { popupStore, TabType } from "~/store"

import ApiKeyInput from "./ApiKeyInput"

import "~/styles/shared.css"

const ConfigTab = observer(() => {
  return (
    <div
      className={`tab-content ${popupStore.activeTab === TabType.SETTINGS ? "active" : ""}`}>
      <ApiKeyInput onApiKeyChange={(key) => popupStore.saveApiKey(key || "")} />
    </div>
  )
})

export default ConfigTab
