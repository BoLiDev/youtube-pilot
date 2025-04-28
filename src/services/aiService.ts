import { ChatGoogleGenerativeAI } from "@langchain/google-genai"
import { PromptTemplate } from "@langchain/core/prompts"
import { StringOutputParser } from "@langchain/core/output_parsers"
import { RunnableSequence } from "@langchain/core/runnables"
import { HumanMessage } from "@langchain/core/messages"
import { getApiKey } from "../storage/keyStorage"

// 创建用于视频概要的提示模板
const summaryPromptTemplate = PromptTemplate.fromTemplate(`
你是一个专业的YouTube视频内容总结助手。请基于以下视频字幕提供一个简洁的总结，捕捉视频的主要内容和关键点:

视频URL: {videoUrl}
视频字幕内容:
{transcript}

请以第三人称的方式撰写简明扼要的总结，包含视频的主要内容、关键信息和要点。总结应该是客观的，不应超过200个字。
`)

// 创建用于详细笔记的提示模板
const detailedNotesPromptTemplate = PromptTemplate.fromTemplate(`
你是一个专业的YouTube视频内容分析助手。请基于以下视频字幕提供详细的笔记:

视频URL: {videoUrl}
视频字幕内容:
{transcript}

请提供结构化的笔记，包括:
1. 视频概述 (简短介绍视频的主题和目的)
2. 关键要点 (列出视频中讨论的主要观点，使用编号列表)
3. 重要细节 (提供重要的细节、例子或引用)
4. 总结和见解 (总结视频的主要价值和任何重要的见解)

请以Markdown格式输出内容，使用适当的标题、列表和格式来提高可读性。
`)

/**
 * 创建Gemini AI模型实例
 */
const createModel = async () => {
  const apiKey = await getApiKey()

  if (!apiKey) {
    throw new Error("没有设置API密钥，请在设置页面添加您的Google Gemini API密钥")
  }

  return new ChatGoogleGenerativeAI({
    apiKey,
    model: "gemini-2.0-flash",
    maxOutputTokens: 2048,
  })
}

/**
 * 获取视频URL的简短概要
 */
export const getVideoSummary = async (videoUrl: string): Promise<string> => {
  try {
    console.log(`尝试获取视频摘要，URL: ${videoUrl}`)

    const model = await createModel()
    console.log("成功创建AI模型")

    // 获取视频字幕
    let transcript = "无法获取字幕"
    try {
      transcript = await transcriptProcessor.getTranscript(videoUrl)
      console.log("成功获取字幕")
    } catch (error) {
      console.error("获取字幕失败:", error)
      transcript = `无法获取字幕: ${error.message}`
    }

    // 创建提示并输出完整内容用于调试
    const promptContent = await summaryPromptTemplate.format({
      videoUrl,
      transcript
    })

    console.log("===========调试信息：完整提示内容===========")
    console.log(promptContent.substring(0, 500) + "...(内容过长已截断)")
    console.log("==========================================")

    const summarizeVideoChain = RunnableSequence.from([
      summaryPromptTemplate,
      model,
      new StringOutputParser()
    ])

    const summary = await summarizeVideoChain.invoke({
      videoUrl,
      transcript
    })

    console.log("原始摘要结果:", summary)

    return summary
  } catch (error) {
    console.error("获取视频摘要时出错:", error)
    // 保留并传递原始错误信息
    if (error.message) {
      throw new Error(`AI摘要生成失败: ${error.message}`)
    } else if (error.response) {
      // 处理API响应错误
      throw new Error(`API错误 - 状态码: ${error.response.status}, 消息: ${JSON.stringify(error.response.data || {})}`)
    } else {
      throw new Error(`无法生成视频摘要: ${String(error)}`)
    }
  }
}

/**
 * 获取视频URL的详细笔记
 */
export const getVideoDetailedNotes = async (videoUrl: string): Promise<string> => {
  try {
    console.log(`尝试生成详细笔记，URL: ${videoUrl}`)

    const model = await createModel()
    console.log("成功创建AI模型")

    // 获取视频字幕
    let transcript = "无法获取字幕"
    try {
      transcript = await transcriptProcessor.getTranscript(videoUrl)
      console.log("成功获取字幕")
    } catch (error) {
      console.error("获取字幕失败:", error)
      transcript = `无法获取字幕: ${error.message}`
    }

    // 创建提示并输出完整内容用于调试
    const promptContent = await detailedNotesPromptTemplate.format({
      videoUrl,
      transcript
    })

    console.log("===========调试信息：完整提示内容===========")
    console.log(promptContent.substring(0, 500) + "...(内容过长已截断)")
    console.log("==========================================")

    const createDetailedNotesChain = RunnableSequence.from([
      detailedNotesPromptTemplate,
      model,
      new StringOutputParser()
    ])

    const notes = await createDetailedNotesChain.invoke({
      videoUrl,
      transcript
    })

    console.log("原始笔记结果:", notes.substring(0, 200) + "...(结果过长已截断)")

    return notes
  } catch (error) {
    console.error("生成详细笔记时出错:", error)
    // 保留并传递原始错误信息
    if (error.message) {
      throw new Error(`AI笔记生成失败: ${error.message}`)
    } else if (error.response) {
      // 处理API响应错误
      throw new Error(`API错误 - 状态码: ${error.response.status}, 消息: ${JSON.stringify(error.response.data || {})}`)
    } else {
      throw new Error(`无法生成详细笔记: ${String(error)}`)
    }
  }
}

/**
 * YouTube字幕处理服务
 * 通过YouTube视频ID获取字幕
 */
class YoutubeTranscriptProcessor {
  private readonly API_BASE_URL = "https://yt-transcript-fetcher.fly.dev/api/transcript"

  /**
   * 从YouTube URL中提取视频ID
   */
  extractVideoId(url: string): string | null {
    // 处理标准YouTube URL
    let match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&]+)/)
    if (match && match[1]) {
      return match[1]
    }

    // 处理嵌入链接
    match = url.match(/youtube\.com\/embed\/([^?]+)/)
    if (match && match[1]) {
      return match[1]
    }

    // 处理shorts链接
    match = url.match(/youtube\.com\/shorts\/([^?]+)/)
    if (match && match[1]) {
      return match[1]
    }

    return null
  }

  /**
   * 获取视频字幕
   */
  async getTranscript(videoUrl: string): Promise<string> {
    try {
      const videoId = this.extractVideoId(videoUrl)
      if (!videoId) {
        throw new Error("无法从URL中提取视频ID")
      }

      console.log(`尝试获取视频字幕，视频ID: ${videoId}`)

      const response = await fetch(`${this.API_BASE_URL}/${videoId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json"
        }
      })

      if (!response.ok) {
        throw new Error(`获取字幕失败，状态码: ${response.status}`)
      }

      const data = await response.json()

      if (!data || !data.transcript || data.transcript.length === 0) {
        throw new Error("未找到视频字幕")
      }

      // 将字幕数组转换为单个文本字符串
      const transcriptText = data.transcript
        .map((item: { text: string }) => item.text)
        .join(" ")

      console.log("获取到字幕，总长度:", transcriptText.length)

      // 如果字幕太长，进行截断
      if (transcriptText.length > 10000) {
        console.log("字幕太长，进行截断")
        return transcriptText.substring(0, 10000) + "...(字幕已截断)"
      }

      return transcriptText
    } catch (error) {
      console.error("获取字幕时出错:", error)
      throw error
    }
  }
}

// 创建字幕处理器实例
const transcriptProcessor = new YoutubeTranscriptProcessor()