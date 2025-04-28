import React from "react";

interface ButtonProps {
  onClick: () => void;
  disabled?: boolean;
  children: React.ReactNode;
  variant?: "primary" | "secondary";
  fullWidth?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  onClick,
  disabled = false,
  children,
  variant = "primary",
  fullWidth = false
}) => {
  // 按钮样式
  const getButtonStyles = () => {
    const baseStyles = {
      padding: "0.5rem 1rem",
      borderRadius: "4px",
      fontWeight: 500,
      fontSize: "0.875rem",
      cursor: disabled ? "not-allowed" : "pointer",
      transition: "background-color 0.2s",
      border: "none",
      width: fullWidth ? "100%" : "auto",
      opacity: disabled ? 0.7 : 1
    };

    if (variant === "primary") {
      return {
        ...baseStyles,
        backgroundColor: "#1976d2",
        color: "white",
        ":hover": {
          backgroundColor: "#1565c0"
        }
      };
    } else {
      return {
        ...baseStyles,
        backgroundColor: "#e0e0e0",
        color: "#424242",
        ":hover": {
          backgroundColor: "#d5d5d5"
        }
      };
    }
  };

  const buttonStyles = getButtonStyles();

  return (
    <button
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      style={buttonStyles}>
      {children}
    </button>
  );
};

export default Button;