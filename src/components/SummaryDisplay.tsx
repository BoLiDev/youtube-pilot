import React from "react";

interface SummaryDisplayProps {
  summary: string;
}

const SummaryDisplay: React.FC<SummaryDisplayProps> = ({ summary }) => {
  return (
    <div
      style={{
        marginBottom: "1rem",
        padding: "1rem",
        backgroundColor: "#f5f5f5",
        borderRadius: "4px",
        fontSize: "0.875rem",
        lineHeight: "1.5"
      }}>
      <h3 style={{ fontSize: "1rem", marginTop: 0, marginBottom: "0.5rem" }}>
        视频摘要
      </h3>
      <div>{summary}</div>
    </div>
  );
};

export default SummaryDisplay;