import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, AlertCircle } from "lucide-react";

interface MessageHandlerProps {
  message: string;
  stylesError?: string | null;
}

const MessageHandler: React.FC<MessageHandlerProps> = ({ message, stylesError }) => {
  const isSuccess = message?.toLowerCase().includes("success");

  return (
    <div className="space-y-4 mx-4 mb-6">
      <AnimatePresence>
        {message && (
          <motion.div
            key="message"
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className={`flex items-center justify-center gap-3 text-center font-medium text-lg rounded-xl p-4 shadow-lg border
              ${isSuccess 
                ? "bg-green-900/50 text-green-300 border-green-700/50 shadow-green-900/30" 
                : "bg-red-900/50 text-red-300 border-red-700/50 shadow-red-900/30"
              }`}
          >
            {isSuccess ? (
              <CheckCircle2 className="w-6 h-6 text-green-400" />
            ) : (
              <AlertCircle className="w-6 h-6 text-red-400" />
            )}
            <span>{message}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {stylesError && (
          <motion.div
            key="stylesError"
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className="flex items-center justify-center gap-3 text-yellow-300 bg-yellow-900/50 border border-yellow-700/50 rounded-xl p-4 shadow-lg shadow-yellow-900/30"
          >
            <AlertCircle className="w-6 h-6 text-yellow-400" />
            <span>Styles Error: {stylesError}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MessageHandler;
