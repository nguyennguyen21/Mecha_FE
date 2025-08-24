import React from "react";

interface MessageHandlerProps {
  message: string;
  stylesError?: string | null;
}

const MessageHandler: React.FC<MessageHandlerProps> = ({ message, stylesError }) => {
  return (
    <>
      {message && (
        <div
          className={`text-center font-semibold text-lg mx-4 mb-6 rounded-xl p-4 transition-all duration-300 animate-bounce ${
            message.includes("success")
              ? "bg-green-900/50 text-green-300 border border-green-700/50 shadow-lg shadow-green-900/30"
              : "bg-red-900/50 text-red-300 border border-red-700/50 shadow-lg shadow-red-900/30"
          }`}
        >
          {message}
        </div>
      )}

      {stylesError && (
        <div className="text-center text-yellow-300 bg-yellow-900/50 border border-yellow-700/50 rounded-xl p-4 mx-4 mb-6">
          Styles Error: {stylesError}
        </div>
      )}
    </>
  );
};

export default MessageHandler;