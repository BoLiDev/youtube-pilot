import React from "react";
import ReactMarkdown from "react-markdown";

interface MarkdownRendererProps {
  content: string;
}

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content }) => {
  return (
    <div style={{ maxHeight: "400px", overflowY: "auto" }}>
      <ReactMarkdown
        components={{
          // 自定义标题样式
          h1: ({ node, ...props }) => (
            <h1 style={{ fontSize: "1.5rem", marginBottom: "0.5rem" }} {...props} />
          ),
          h2: ({ node, ...props }) => (
            <h2 style={{ fontSize: "1.25rem", marginBottom: "0.5rem" }} {...props} />
          ),
          h3: ({ node, ...props }) => (
            <h3 style={{ fontSize: "1.1rem", marginBottom: "0.5rem" }} {...props} />
          ),

          // 自定义段落样式
          p: ({ node, ...props }) => (
            <p style={{ marginBottom: "0.75rem" }} {...props} />
          ),

          // 自定义列表样式
          ul: ({ node, ...props }) => (
            <ul style={{ marginBottom: "0.75rem", paddingLeft: "1.5rem" }} {...props} />
          ),
          ol: ({ node, ...props }) => (
            <ol style={{ marginBottom: "0.75rem", paddingLeft: "1.5rem" }} {...props} />
          ),

          // 自定义引用样式
          blockquote: ({ node, ...props }) => (
            <blockquote
              style={{
                borderLeft: "4px solid #ccc",
                paddingLeft: "1rem",
                marginLeft: "0",
                marginRight: "0",
                fontStyle: "italic"
              }}
              {...props}
            />
          ),

          // 自定义代码块样式
          code: ({ node, className, children, ...props }) => (
            <code
              style={{
                backgroundColor: "#f5f5f5",
                padding: "0.2rem 0.4rem",
                borderRadius: "3px",
                fontSize: "0.9em"
              }}
              {...props}
            >
              {children}
            </code>
          )
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};

export default MarkdownRenderer;