import React, { useState } from "react";
import Button from "./Button";

interface UrlInputProps {
  onSubmit: (url: string) => void;
  isLoading: boolean;
}

const UrlInput: React.FC<UrlInputProps> = ({ onSubmit, isLoading }) => {
  const [url, setUrl] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = () => {
    // 验证URL格式
    try {
      const parsedUrl = new URL(url);
      if (
        !["youtube.com", "www.youtube.com", "youtu.be"].includes(parsedUrl.hostname) ||
        (parsedUrl.hostname !== "youtu.be" && !parsedUrl.pathname.includes("/watch"))
      ) {
        setError("请输入有效的YouTube视频URL");
        return;
      }

      setError(null);
      onSubmit(url);
    } catch (e) {
      setError("请输入有效的URL");
    }
  };

  return (
    <div style={{ marginBottom: "1rem" }}>
      <div style={{ marginBottom: "0.5rem", fontSize: "0.875rem" }}>
        输入YouTube视频URL:
      </div>

      <div style={{ display: "flex" }}>
        <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://www.youtube.com/watch?v=..."
          style={{
            flex: 1,
            padding: "0.5rem",
            border: "1px solid #ccc",
            borderRadius: "4px",
            marginRight: "0.5rem",
            fontSize: "0.875rem"
          }}
        />

        <Button
          onClick={handleSubmit}
          disabled={!url || isLoading}
          variant="primary"
        >
          生成笔记
        </Button>
      </div>

      {error && (
        <div
          style={{
            color: "red",
            fontSize: "0.75rem",
            marginTop: "0.25rem"
          }}
        >
          {error}
        </div>
      )}
    </div>
  );
};

export default UrlInput;