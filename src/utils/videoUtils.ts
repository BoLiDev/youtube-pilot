
/**
 * 从YouTube URL中提取视频ID
 */
export const extractVideoId = (url: string): string | null => {
  let match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&]+)/)
  if (match && match[1]) {
    return match[1]
  }

  match = url.match(/youtube\.com\/embed\/([^?]+)/)
  if (match && match[1]) {
    return match[1]
  }

  match = url.match(/youtube\.com\/shorts\/([^?]+)/)
  if (match && match[1]) {
    return match[1]
  }

  return null
}




