import React from "react";
import { CheckCircle, AlertCircle, Info } from "lucide-react";

interface ToastProps {
  message: string;
  type?: "success" | "error" | "info";
}

const Toast: React.FC<ToastProps> = ({ message, type = "info" }) => {
  if (!message) return null;

  // chọn icon và màu theo type
  const icons = {
    success: <CheckCircle className="w-5 h-5 text-green-400" />,
    error: <AlertCircle className="w-5 h-5 text-red-400" />,
    info: <Info className="w-5 h-5 text-blue-400" />,
  };

  const bgColors = {
    success: "bg-green-600",
    error: "bg-red-600",
    info: "bg-blue-600",
  };

  return (
    <div
      className={`fixed bottom-6 right-6 flex items-center gap-3 text-white px-4 py-3 rounded-xl shadow-lg z-50 ${bgColors[type]}`}
    >
      {icons[type]}
      <span className="text-sm font-medium">{message}</span>
    </div>
  );
};

export default Toast;
