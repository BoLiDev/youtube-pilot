interface MarkdownRendererProps {
  content: string
  className?: string
}

export default function MarkdownRenderer({
  content,
  className = ""
}: MarkdownRendererProps) {
  // 非常简单的markdown渲染，仅处理基本格式
  const renderMarkdown = (text: string) => {
    let html = text
      // 标题
      .replace(/^# (.*$)/gm, "<h1>$1</h1>")
      .replace(/^## (.*$)/gm, "<h2>$1</h2>")
      .replace(/^### (.*$)/gm, "<h3>$1</h3>")
      .replace(/^#### (.*$)/gm, "<h4>$1</h4>")
      // 加粗和斜体
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
      .replace(/\*(.*?)\*/g, "<em>$1</em>")
      // 列表
      .replace(/^\d+\. (.*$)/gm, "<ol><li>$1</li></ol>")
      .replace(/^- (.*$)/gm, "<ul><li>$1</li></ul>")
      // 链接
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, "<a href='$2'>$1</a>")
      // 段落和换行
      .replace(/\n\n/g, "</p><p>")

    // 确保所有内容都在段落内
    if (!html.startsWith("<")) {
      html = `<p>${html}</p>`
    }

    return html
  }

  return (
    <div
      className={`markdown-content ${className}`}
      dangerouslySetInnerHTML={{ __html: renderMarkdown(content) }}
    />
  )
}