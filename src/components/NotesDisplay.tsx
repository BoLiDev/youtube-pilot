import React from "react";
import MarkdownRenderer from "./MarkdownRenderer";
import Button from "./Button";

interface NotesDisplayProps {
  notes: string;
  onDownload: () => void;
}

const NotesDisplay: React.FC<NotesDisplayProps> = ({ notes, onDownload }) => {
  return (
    <div
      style={{
        marginBottom: "1rem",
        padding: "1rem",
        backgroundColor: "#f5f5f5",
        borderRadius: "4px"
      }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.75rem" }}>
        <h3 style={{ fontSize: "1rem", margin: 0 }}>
          详细笔记
        </h3>
        <Button onClick={onDownload} variant="secondary">
          下载笔记
        </Button>
      </div>

      <MarkdownRenderer content={notes} />
    </div>
  );
};

export default NotesDisplay;