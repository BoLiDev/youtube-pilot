import { GenerativeModel, GoogleGenerativeAI } from "@google/generative-ai"
import { computed, makeAutoObservable, runInAction } from "mobx"

import { getTranscript } from "../services/transcript"
import { getApiKey } from "../storage/keyStorage"
import { extractVideoId } from "../utils/videoUtils"
import { notesPrompt, summaryPrompt } from "./constants"

const modelName = "gemini-2.0-flash"

export enum ProcessingState {
  IDLE = "闲置",
  CHECKING_API_KEY = "正在检查 API 密钥...",
  CONNECTING_MODEL = "正在连接 AI 模型...",
  EXTRACTING_VIDEO_ID = "正在解析视频链接...",
  FETCHING_TRANSCRIPT = "正在尝试获取字幕...",
  GENERATING_WITH_TRANSCRIPT = "正在使用字幕生成内容...",
  GENERATING_WITH_VIDEO = "字幕不可用，直接使用 LLM 分析视频内容...",
  ERROR = "错误",
  SUCCESS = "成功"
}

class AIServiceStore {
  private _model: GenerativeModel | null = null
  private _state: ProcessingState = ProcessingState.IDLE
  private _error: string | null = null

  constructor() {
    makeAutoObservable(this)
  }

  public get status(): string {
    if (this._state === ProcessingState.CONNECTING_MODEL) {
      return `${ProcessingState.CONNECTING_MODEL} (${modelName})`
    }
    if (this._state === ProcessingState.ERROR && this._error) {
      return `错误: ${this._error.split(":")[0]}`
    }
    return this._state
  }

  public get isProcessing() {
    return (
      this._state === ProcessingState.CONNECTING_MODEL ||
      this._state === ProcessingState.FETCHING_TRANSCRIPT ||
      this._state === ProcessingState.GENERATING_WITH_TRANSCRIPT ||
      this._state === ProcessingState.GENERATING_WITH_VIDEO ||
      this._state === ProcessingState.EXTRACTING_VIDEO_ID
    )
  }

  public async generateContent(
    videoUrl: string,
    type: "summary" | "notes"
  ): Promise<string> {
    const modelInitialized = await this.initializeModel()
    if (!modelInitialized || !this._model) {
      throw new Error(this._error || "AI 模型未能初始化")
    }

    let resultText = ""

    try {
      runInAction(() => this.moveState(ProcessingState.EXTRACTING_VIDEO_ID))
      const { videoId, fullVideoUrl } = this.processVideo(videoUrl)

      runInAction(() => this.moveState(ProcessingState.FETCHING_TRANSCRIPT))
      const transcriptText = await getTranscript(videoId)

      const prompt = type === "summary" ? summaryPrompt : notesPrompt
      let generationInput: any[]

      if (transcriptText) {
        runInAction(() =>
          this.moveState(ProcessingState.GENERATING_WITH_TRANSCRIPT)
        )
        generationInput = [prompt, transcriptText]
      } else {
        runInAction(() => this.moveState(ProcessingState.GENERATING_WITH_VIDEO))
        generationInput = [{ fileData: { fileUri: fullVideoUrl } }, prompt]
      }

      const result = await this._model.generateContent(generationInput)
      resultText = result.response.text()

      runInAction(() => this.moveState(ProcessingState.SUCCESS))

      return resultText
    } catch (error) {
      const errorMsg = error.message || this.defaultErrorMsg(type)
      runInAction(() => {
        this._state = ProcessingState.ERROR
        this._error = errorMsg
      })
      if (error.response) {
        throw new Error(
          `API错误 - ${error.response.status}: ${JSON.stringify(error.response.data || {})}`
        )
      } else {
        throw new Error(errorMsg)
      }
    }
  }

  private async initializeModel(): Promise<boolean> {
    if (this._model) return true

    runInAction(() => {
      this._state = ProcessingState.CHECKING_API_KEY
      this._error = null
    })

    try {
      const apiKey = await getApiKey()
      if (!apiKey) {
        throw new Error("没有设置API密钥")
      }

      runInAction(() => {
        this._state = ProcessingState.CONNECTING_MODEL
      })
      const genAI = new GoogleGenerativeAI(apiKey)
      this._model = genAI.getGenerativeModel({ model: modelName })
      return true
    } catch (error) {
      runInAction(() => {
        this._state = ProcessingState.ERROR
        this._error = error.message || "模型初始化失败"
      })
      return false
    }
  }

  private defaultErrorMsg(type: "summary" | "notes") {
    return type === "summary" ? "无法生成视频摘要" : "无法生成详细笔记"
  }

  private processVideo(videoUrl: string) {
    const videoId = extractVideoId(videoUrl)
    if (!videoId) {
      throw new Error("无法从URL中提取视频ID")
    }
    const fullVideoUrl = `https://www.youtube.com/watch?v=${videoId}`
    return { videoId, fullVideoUrl }
  }

  private moveState(state: ProcessingState) {
    this._state = state
  }
}

export const aiServiceStore = new AIServiceStore()
