import React from "react";

interface MessageBoxProps {
  message: string;
  type: "success" | "error";
}

const MessageBox: React.FC<MessageBoxProps> = ({ message, type }) => {
  if (!message) return null;
  return <div className={`message ${type}`}>{message}</div>;
};

export default MessageBox;
