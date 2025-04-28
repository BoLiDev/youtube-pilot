import { ChatGoogleGenerativeAI } from "@langchain/google-genai"
import { PromptTemplate } from "@langchain/core/prompts"
import { StringOutputParser } from "@langchain/core/output_parsers"
import { RunnableSequence } from "@langchain/core/runnables"

// 确保你有GOOGLE_API_KEY
const GOOGLE_API_KEY = process.env.PLASMO_PUBLIC_GOOGLE_API_KEY

if (!GOOGLE_API_KEY) {
  console.error("没有找到GOOGLE_API_KEY环境变量")
}

// 创建Gemini AI模型实例
const model = new ChatGoogleGenerativeAI({
  apiKey: GOOGLE_API_KEY,
  model: "gemini-2.0-flash",
  maxOutputTokens: 2048,
})

// 创建用于视频概要的提示模板
const summaryPromptTemplate = PromptTemplate.fromTemplate(`
你是一个专业的YouTube视频内容总结助手。请基于以下视频URL提供一个简洁的总结，捕捉视频的主要内容和关键点:

视频URL: {videoUrl}

请以第三人称的方式撰写简明扼要的总结，包含视频的主要内容、关键信息和要点。总结应该是客观的，不应超过200个字。
`)

// 创建用于详细笔记的提示模板
const detailedNotesPromptTemplate = PromptTemplate.fromTemplate(`
你是一个专业的YouTube视频内容分析助手。请基于以下视频URL提供详细的笔记:

视频URL: {videoUrl}

请提供结构化的笔记，包括:
1. 视频概述 (简短介绍视频的主题和目的)
2. 关键要点 (列出视频中讨论的主要观点，使用编号列表)
3. 重要细节 (提供重要的细节、例子或引用)
4. 总结和见解 (总结视频的主要价值和任何重要的见解)

请以Markdown格式输出内容，使用适当的标题、列表和格式来提高可读性。
`)

// 生成视频概要的链
const summarizeVideoChain = RunnableSequence.from([
  summaryPromptTemplate,
  model,
  new StringOutputParser()
])

// 生成详细笔记的链
const createDetailedNotesChain = RunnableSequence.from([
  detailedNotesPromptTemplate,
  model,
  new StringOutputParser()
])

/**
 * 获取视频URL的简短概要
 */
export const getVideoSummary = async (videoUrl: string): Promise<string> => {
  try {
    const summary = await summarizeVideoChain.invoke({
      videoUrl
    })
    return summary
  } catch (error) {
    console.error("获取视频摘要时出错:", error)
    throw new Error("无法生成视频摘要。请稍后再试。")
  }
}

/**
 * 获取视频URL的详细笔记
 */
export const getVideoDetailedNotes = async (videoUrl: string): Promise<string> => {
  try {
    const notes = await createDetailedNotesChain.invoke({
      videoUrl
    })
    return notes
  } catch (error) {
    console.error("生成详细笔记时出错:", error)
    throw new Error("无法生成详细笔记。请稍后再试。")
  }
}