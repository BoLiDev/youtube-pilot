import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { ChatPromptTemplate } from "@langchain/core/prompts";

// 初始化 Gemini 模型（通过 Langchain）
const initGeminiModel = () => {
  const apiKey = process.env.PLASMO_PUBLIC_GOOGLE_API_KEY;

  if (!apiKey) {
    throw new Error("Google API key is missing");
  }

  return new ChatGoogleGenerativeAI({
    model: "gemini-2.0-flash",
    maxOutputTokens: 2048,
    apiKey
  });
};

// 简短摘要链
export const createQuickSummaryChain = () => {
  const model = initGeminiModel();

  const systemPrompt =
    "你是一位专业的YouTube视频内容分析师。你的任务是生成简洁而有信息量的视频摘要。" +
    "摘要应该突出视频的主要观点和关键信息，帮助用户快速理解视频内容，不超过150字。";

  const summaryPrompt = ChatPromptTemplate.fromMessages([
    ["system", systemPrompt],
    ["human", "请为这个YouTube视频提供简短摘要。视频URL: {videoUrl}"]
  ]);

  return summaryPrompt.pipe(model).pipe(new StringOutputParser());
};

// 详细笔记链
export const createDetailedNotesChain = () => {
  const model = initGeminiModel();

  const systemPrompt =
    "你是一位专业的YouTube视频内容分析师。你的任务是生成结构化的详细笔记。" +
    "笔记应该以Markdown格式呈现，包含标题、小标题、要点和重要引用。" +
    "组织内容以帮助用户深入理解视频中讨论的主题，并突出关键概念和见解。";

  const notesPrompt = ChatPromptTemplate.fromMessages([
    ["system", systemPrompt],
    ["human", "请为这个YouTube视频提供详细的结构化笔记。视频URL: {videoUrl}"]
  ]);

  return notesPrompt.pipe(model).pipe(new StringOutputParser());
};

// 获取当前视频的简短摘要
export const getQuickSummary = async (videoUrl: string): Promise<string> => {
  try {
    if (!isValidYouTubeUrl(videoUrl)) {
      throw new Error("无效的YouTube URL");
    }

    const summaryChain = createQuickSummaryChain();
    return await summaryChain.invoke({ videoUrl });
  } catch (error) {
    console.error("获取摘要时出错:", error);
    throw error;
  }
};

// 获取视频的详细笔记
export const getDetailedNotes = async (videoUrl: string): Promise<string> => {
  try {
    if (!isValidYouTubeUrl(videoUrl)) {
      throw new Error("无效的YouTube URL");
    }

    const notesChain = createDetailedNotesChain();
    return await notesChain.invoke({ videoUrl });
  } catch (error) {
    console.error("获取详细笔记时出错:", error);
    throw error;
  }
};

// 验证YouTube URL
const isValidYouTubeUrl = (url: string): boolean => {
  try {
    const urlObj = new URL(url);
    return (
      (urlObj.hostname === "www.youtube.com" ||
       urlObj.hostname === "youtube.com" ||
       urlObj.hostname === "youtu.be") &&
      (urlObj.pathname.includes("/watch") || urlObj.hostname === "youtu.be")
    );
  } catch {
    return false;
  }
};