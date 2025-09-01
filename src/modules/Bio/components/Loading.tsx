import React from "react";

interface LoadingProps {
  message?: string; // có thể tùy chỉnh text
}

const Loading: React.FC<LoadingProps> = ({ message = "Loading..." }) => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 to-black">
      <div className="flex flex-col items-center gap-4">
        {/* Spinner */}
        <div className="w-12 h-12 border-4 border-t-blue-500 border-gray-700 rounded-full animate-spin"></div>
        {/* Message */}
        <p className="text-white text-lg font-medium animate-pulse">{message}</p>
      </div>
    </div>
  );
};

export default Loading;
