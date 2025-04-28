import React from "react";

interface LoadingIndicatorProps {
  size?: "small" | "medium" | "large";
}

const LoadingIndicator: React.FC<LoadingIndicatorProps> = ({
  size = "medium"
}) => {
  // 根据大小设置样式
  const getSize = () => {
    switch (size) {
      case "small":
        return {
          width: "1rem",
          height: "1rem",
          borderWidth: "2px"
        };
      case "large":
        return {
          width: "2.5rem",
          height: "2.5rem",
          borderWidth: "4px"
        };
      default: // medium
        return {
          width: "1.5rem",
          height: "1.5rem",
          borderWidth: "3px"
        };
    }
  };

  const sizeStyles = getSize();

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "0.5rem"
      }}>
      <div
        style={{
          ...sizeStyles,
          borderRadius: "50%",
          border: `${sizeStyles.borderWidth} solid #f3f3f3`,
          borderTop: `${sizeStyles.borderWidth} solid #3498db`,
          animation: "spin 1s linear infinite"
        }}
      />
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  );
};

export default LoadingIndicator;