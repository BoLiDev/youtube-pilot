import { useEffect, useState } from "react"

import { clearApiKey, getApiKey, saveApiKey } from "~/storage/keyStorage"

import styles from "./ApiKeyInput.module.css"

import "~/styles/shared.css"

interface ApiKeyInputProps {
  onApiKeyChange: (apiKey: string | null) => void
}

export default function ApiKeyInput({ onApiKeyChange }: ApiKeyInputProps) {
  const [apiKey, setApiKey] = useState<string>("")
  const [savedApiKey, setSavedApiKey] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [message, setMessage] = useState<{
    text: string
    type: "success" | "error" | "info"
  } | null>(null)
  const [showApiKey, setShowApiKey] = useState<boolean>(false)

  // 加载保存的API密钥
  useEffect(() => {
    const loadApiKey = async () => {
      try {
        const key = await getApiKey()
        setSavedApiKey(key)
        onApiKeyChange(key)
      } catch (error) {
        console.error("加载API密钥时出错:", error)
      }
    }

    loadApiKey()
  }, [onApiKeyChange])

  // 保存API密钥
  const handleSaveApiKey = async () => {
    if (!apiKey) {
      setMessage({
        text: "请输入有效的API密钥",
        type: "error"
      })
      return
    }

    setIsLoading(true)
    setMessage(null)

    try {
      await saveApiKey(apiKey)
      setSavedApiKey(apiKey)
      onApiKeyChange(apiKey)
      setMessage({
        text: "API密钥已保存",
        type: "success"
      })
      setApiKey("") // 清空输入框
    } catch (error) {
      setMessage({
        text: `保存API密钥失败: ${error.message}`,
        type: "error"
      })
    } finally {
      setIsLoading(false)
    }
  }

  // 清除API密钥
  const handleClearApiKey = async () => {
    setIsLoading(true)
    setMessage(null)

    try {
      await clearApiKey()
      setSavedApiKey(null)
      onApiKeyChange(null)
      setMessage({
        text: "API密钥已删除",
        type: "info"
      })
    } catch (error) {
      setMessage({
        text: `删除API密钥失败: ${error.message}`,
        type: "error"
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className={styles.apiKeyContainer}>
      <h3>设置 Google Gemini API 密钥</h3>

      {savedApiKey ? (
        <div className={styles.savedKeyContainer}>
          <p className={styles.apiKeyInfo}>
            API密钥已设置:
            <code>
              {showApiKey
                ? savedApiKey
                : `${savedApiKey.substring(0, 4)}...${savedApiKey.substring(savedApiKey.length - 4)}`}
            </code>
            <button
              className={styles.toggleKeyBtn}
              onClick={() => setShowApiKey(!showApiKey)}
              title={showApiKey ? "隐藏密钥" : "显示完整密钥"}>
              {showApiKey ? "隐藏" : "显示"}
            </button>
          </p>
          <button
            className="button button-secondary"
            onClick={handleClearApiKey}
            disabled={isLoading}>
            {isLoading ? "处理中..." : "删除密钥"}
          </button>
        </div>
      ) : (
        <div className={styles.apiKeyForm}>
          <p className={styles.apiKeyInfo}>
            请输入您的 Google Gemini API 密钥。您可以在
            <a
              href="https://ai.google.dev/"
              target="_blank"
              rel="noopener noreferrer">
              Google AI Studio
            </a>
            创建密钥。
          </p>
          <div className={styles.inputWrapper}>
            <input
              type={showApiKey ? "text" : "password"}
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="输入Google Gemini API密钥"
              disabled={isLoading}
            />
            <button
              className={styles.toggleKeyBtn}
              onClick={() => setShowApiKey(!showApiKey)}
              title={showApiKey ? "隐藏" : "显示"}
              type="button">
              {showApiKey ? "隐藏" : "显示"}
            </button>
          </div>
          <button
            className="button"
            onClick={handleSaveApiKey}
            disabled={isLoading || !apiKey}>
            {isLoading ? "保存中..." : "保存密钥"}
          </button>
        </div>
      )}

      {message && (
        <div className={`${styles.message} ${styles[message.type]}`}>
          {message.text}
        </div>
      )}
    </div>
  )
}
