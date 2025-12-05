import React from "react";

const BACKEND_URL = `${import.meta.env.VITE_BASE_URL || 'http://localhost:30052'}/api/discordauth`;

const DiscordLogin: React.FC = () => {
  const handleLogin = () => {
    const width = 500;
    const height = 600;
    const left = window.screen.width / 2 - width / 2;
    const top = window.screen.height / 2 - height / 2;

    const popup = window.open(
      `${BACKEND_URL}/login`,
      "Discord Login",
      `width=${width},height=${height},top=${top},left=${left}`
    );

    const messageHandler = (event: MessageEvent) => {
      // Bỏ qua messages từ React DevTools và các sources khác
      if (event.data && typeof event.data === 'object' && 'source' in event.data) {
        return; // React DevTools messages
      }

      // Chỉ xử lý messages có token hoặc error (từ Discord callback)
      const data = event.data as { token?: string; user?: any; error?: string };
      
      if (!data || (typeof data !== 'object')) {
        return; // Không phải Discord message
      }

      if (data.error) {
        return;
      }

      if (data.token && data.user) {
        // Clear old cache before setting new user info
        localStorage.removeItem("userInfo");
        localStorage.removeItem("authToken");
        
        localStorage.setItem("authToken", data.token);
        localStorage.setItem("userInfo", JSON.stringify(data.user));
        popup?.close();
        window.removeEventListener("message", messageHandler);
        window.location.href = "/dashboard";
      }
    };

    window.addEventListener("message", messageHandler);
  };

  return (
    <button
      onClick={handleLogin}
      className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
    >
      Login with Discord
    </button>
  );
};

export default DiscordLogin;
