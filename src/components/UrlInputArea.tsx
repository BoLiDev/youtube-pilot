import { observer } from "mobx-react-lite"

import { popupStore } from "~/store"

import "~/styles/shared.css"

const UrlInputArea = observer(() => {
  const isOverallLoading = popupStore.isOverallLoading
  return (
    <div className="input-group">
      <label htmlFor="video-url">YouTube视频URL</label>
      <input
        id="video-url"
        type="text"
        value={popupStore.videoUrl}
        onChange={(e) => popupStore.setVideoUrl(e.target.value)}
        placeholder="https://www.youtube.com/watch?v=..."
        disabled={isOverallLoading}
      />
    </div>
  )
})

export default UrlInputArea
