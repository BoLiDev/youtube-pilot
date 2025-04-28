/**
 * 将Markdown内容下载为文件
 * @param content 要下载的Markdown内容
 * @param filename 文件名
 */
export const downloadMarkdown = (content: string, filename: string): void => {
  const blob = new Blob([content], { type: "text/markdown" });
  const url = URL.createObjectURL(blob);

  // 确保文件名有.md扩展名
  const finalFilename = filename.endsWith(".md") ? filename : `${filename}.md`;

  const a = document.createElement("a");
  a.href = url;
  a.download = finalFilename;
  a.style.display = "none";

  document.body.appendChild(a);
  a.click();

  // 清理
  setTimeout(() => {
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, 100);
};

/**
 * 清理文件名，移除非法字符
 * @param title 原始标题
 * @returns 处理后的安全文件名
 */
export const sanitizeFilename = (title: string): string => {
  // 移除文件名中不允许的字符
  let sanitized = title.replace(/[<>:"/\\|?*\x00-\x1F]/g, "");

  // 将多个空格替换为单个空格
  sanitized = sanitized.replace(/\s+/g, " ");

  // 修剪长度
  if (sanitized.length > 100) {
    sanitized = sanitized.substring(0, 100);
  }

  // 确保我们有一个非空文件名
  return sanitized.trim() || "youtube_notes";
};