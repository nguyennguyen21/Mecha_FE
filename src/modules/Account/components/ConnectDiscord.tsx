import React, { useState } from 'react';
import "bootstrap-icons/font/bootstrap-icons.css";

interface ConnectDiscordProps {
  userId: number;
  discordId?: string | null;
  onSuccess?: () => void;
}

const ConnectDiscord: React.FC<ConnectDiscordProps> = ({ userId, discordId, onSuccess }) => {
  const API_BASE_URL = import.meta.env.VITE_BASE_URL || 'http://localhost:30052';
  const [linking, setLinking] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleConnectDiscord = () => {
    setLinking(true);
    setError(null);

    const width = 500;
    const height = 600;
    const left = window.screenX + (window.outerWidth - width) / 2;
    const top = window.screenY + (window.outerHeight - height) / 2;

    const popup = window.open(
      `${API_BASE_URL}/api/discordauth/link?userId=${userId}`,
      'Connect Discord',
      `width=${width},height=${height},left=${left},top=${top},toolbar=no,menubar=no,scrollbars=yes,resizable=yes,location=no,directories=no,status=no`
    );

    if (!popup) {
      setError('Popup blocked. Please allow popups for this site.');
      setLinking(false);
      return;
    }

    const messageHandler = (event: MessageEvent) => {
      if (event.data && (event.data.success || event.data.error)) {
        if (event.data.error) {
          setError(event.data.error);
        } else if (event.data.success) {
          onSuccess?.();
        }
        setLinking(false);
        window.removeEventListener('message', messageHandler);
        popup?.close();
      }
    };

    window.addEventListener('message', messageHandler);

    // Cleanup if popup is closed manually
    const checkClosed = setInterval(() => {
      if (popup.closed) {
        clearInterval(checkClosed);
        window.removeEventListener('message', messageHandler);
        setLinking(false);
      }
    }, 500);
  };

  const isConnected = !!discordId;

  return (
    <div className="bg-gray-700/50 rounded-xl p-5 sm:p-6 border border-gray-600/50">
      <h3 className="text-lg sm:text-xl font-bold text-white mb-4 flex items-center gap-2">
        <i className="bi bi-discord text-purple-400"></i> Discord Connection
      </h3>
      
      {error && (
        <div className="mb-4 p-3 bg-red-600/20 border border-red-500/30 rounded-lg text-red-400 text-sm">
          {error}
        </div>
      )}

      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-300 text-sm mb-1">
            {isConnected ? 'Connected to Discord' : 'Not connected to Discord'}
          </p>
          {isConnected && (
            <p className="text-gray-400 text-xs">Discord ID: {discordId}</p>
          )}
        </div>
        {!isConnected ? (
          <button
            onClick={handleConnectDiscord}
            disabled={linking}
            className={`px-4 py-2 bg-[#5865F2] hover:bg-[#4752C4] text-white rounded-lg font-semibold transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {linking ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Connecting...</span>
              </>
            ) : (
              <>
                <i className="bi bi-discord"></i>
                <span>Connect Discord</span>
              </>
            )}
          </button>
        ) : (
          <div className="flex items-center gap-2 text-green-400">
            <i className="bi bi-check-circle-fill"></i>
            <span className="text-sm font-semibold">Connected</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ConnectDiscord;

