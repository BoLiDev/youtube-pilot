import React from "react";

interface ErrorMessageProps {
  message: string;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ message }) => {
  return (
    <div
      style={{
        padding: "0.75rem",
        marginBottom: "1rem",
        backgroundColor: "#ffebee",
        color: "#d32f2f",
        borderRadius: "4px",
        fontSize: "0.875rem",
        textAlign: "center"
      }}>
      {message}
    </div>
  );
};

export default ErrorMessage;