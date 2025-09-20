import React from "react";

const BACKEND_URL = `${import.meta.env.VITE_BASE_URL}/api/discordauth`;

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
      const baseUrl = import.meta.env.VITE_BASE_URL;
      if (event.origin !== baseUrl) return;
      const data = event.data as { token?: string; user?: any; error?: string };

      if (data.error) {
        console.error("Discord login failed:", data.error);
      }

      if (data.token) {
        // Lưu token + user info
        localStorage.setItem("authToken", data.token);
        localStorage.setItem("userInfo", JSON.stringify(data.user));

        console.log("Discord login success:", data);
        window.location.href = "/dashboard";
        popup?.close();
        window.removeEventListener("message", messageHandler);
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
