/**
 * 将内容下载为Markdown文件
 * @param content 文件内容
 * @param filename 文件名
 */
export const downloadAsMarkdown = (content: string, filename: string): void => {
  // 确保文件名以.md结尾
  const sanitizedFilename = filename.endsWith(".md") ? filename : `${filename}.md`

  // 创建blob对象
  const blob = new Blob([content], { type: "text/markdown" })

  // 创建下载链接
  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = sanitizedFilename

  // 触发下载
  document.body.appendChild(a)
  a.click()

  // 清理
  setTimeout(() => {
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }, 100)
}

/**
 * 从视频标题生成文件名
 * @param title 视频标题
 * @returns 清理后的文件名
 */
export const generateFilenameFromTitle = (title: string): string => {
  // 移除不适合作为文件名的字符
  let filename = title
    .replace(/[^\w\s-]/g, "") // 移除特殊字符
    .replace(/\s+/g, "_") // 将空格替换为下划线
    .trim()

  // 如果文件名为空，使用默认名称
  if (!filename) {
    filename = "youtube_video_notes"
  }

  return `${filename}.md`
}