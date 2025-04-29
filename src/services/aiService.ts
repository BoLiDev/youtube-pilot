import { GoogleGenerativeAI } from "@google/generative-ai";
import { getApiKey } from "../storage/keyStorage"

/**
 * 创建Gemini AI模型实例
 */
const createModel = async () => {
  const apiKey = await getApiKey()

  if (!apiKey) {
    throw new Error("没有设置API密钥, 请在设置页面添加您的Google Gemini API密钥")
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  return genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
}

/**
 * 从YouTube URL中提取视频ID
 */
const extractVideoId = (url: string): string | null => {
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

/**
 * 获取视频URL的简短概要
 */
export const getVideoSummary = async (videoUrl: string): Promise<string> => {
  try {

    const model = await createModel()

    const videoId = extractVideoId(videoUrl)
    if (!videoId) {
      throw new Error("无法从URL中提取视频ID")
    }

    const fullVideoUrl = `https://www.youtube.com/watch?v=${videoId}`

    const prompt = `
请基于以下视频提供一个简洁的总结, 捕捉视频的主要内容和关键点:

请以第三人称的方式撰写简明扼要的总结, 包含视频的主要内容、关键信息和要点。总结应该是客观的, 不应超过200个字。
  `

    const result = await model.generateContent([
      prompt,
      {
        // @ts-expect-error 忽略类型错误
        fileData: {
          fileUri: fullVideoUrl,
        }
      },
    ]);

    return result.response.text();
  } catch (error) {
    if (error.message) {
      throw new Error(`AI摘要生成失败: ${error.message}`)
    } else if (error.response) {
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
    const model = await createModel()

    const videoId = extractVideoId(videoUrl)
    if (!videoId) {
      throw new Error("无法从URL中提取视频ID")
    }

    const fullVideoUrl = `https://www.youtube.com/watch?v=${videoId}`

    const prompt = `
请基于以下视频提供详细的笔记:

请提供结构化的笔记, 包括:
1. 视频概述 (简短介绍视频的主题和目的)
2. 关键要点 (列出视频中讨论的主要观点, 使用编号列表)
3. 重要细节 (提供重要的细节、例子或引用)
4. 总结和见解 (总结视频的主要价值和任何重要的见解)

请以Markdown格式输出内容, 使用适当的标题、列表和格式来提高可读性。
    `

    const result = await model.generateContent([
      prompt,
      {
        // @ts-expect-error 忽略类型错误
        fileData: {
          fileUri: fullVideoUrl,
        }
      },
    ]);

    const notes = result.response.text();

    return notes;
  } catch (error) {
    if (error.message) {
      throw new Error(`AI笔记生成失败: ${error.message}`)
    } else if (error.response) {
      throw new Error(`API错误 - 状态码: ${error.response.status}, 消息: ${JSON.stringify(error.response.data || {})}`)
    } else {
      throw new Error(`无法生成详细笔记: ${String(error)}`)
    }
  }
}