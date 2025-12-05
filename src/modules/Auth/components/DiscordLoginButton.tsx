import React from 'react';

interface DiscordLoginButtonProps {
  onSuccess?: (data: { token: string; user: any }) => void;
  onError?: (error: string) => void;
}

const DiscordLoginButton: React.FC<DiscordLoginButtonProps> = ({ onSuccess, onError }) => {
  const API_BASE_URL = import.meta.env.VITE_BASE_URL || 'http://localhost:30052';

  const handleDiscordLogin = () => {
    const width = 500;
    const height = 600;
    const left = window.screenX + (window.outerWidth - width) / 2;
    const top = window.screenY + (window.outerHeight - height) / 2;

    const popup = window.open(
      `${API_BASE_URL}/api/discordauth/login`,
      'Discord Login',
      `width=${width},height=${height},left=${left},top=${top},toolbar=no,menubar=no,scrollbars=yes,resizable=yes,location=no,directories=no,status=no`
    );

    if (!popup) {
      onError?.('Popup blocked. Please allow popups for this site.');
      return;
    }

    const messageHandler = (event: MessageEvent) => {
      // Only process messages from Discord OAuth
      if (event.data && (event.data.token || event.data.error || event.data.success)) {
        if (event.data.error) {
          onError?.(event.data.error);
        } else if (event.data.token) {
          onSuccess?.(event.data);
        } else if (event.data.success) {
          onSuccess?.(event.data);
        }
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
      }
    }, 500);
  };

  return (
    <button
      onClick={handleDiscordLogin}
      className="w-full py-2 rounded-lg bg-[#5865F2] hover:bg-[#4752C4] transition-colors text-white font-semibold flex items-center justify-center gap-2"
    >
      <i className="bi bi-discord text-xl"></i>
      Login with Discord
    </button>
  );
};

export default DiscordLoginButton;

