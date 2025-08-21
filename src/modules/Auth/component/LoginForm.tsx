import React from "react";
import { FaDiscord } from "react-icons/fa";

interface LoginFormProps {
  username: string;
  password: string;
  loading: boolean;
  error: string | null;
  onUsernameChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  onDiscordLogin: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({
  username,
  password,
  loading,
  error,
  onUsernameChange,
  onPasswordChange,
  onSubmit,
  onDiscordLogin,
}) => {
  return (
    <div className="bg-[#121212] border-2 border-[#191919] rounded-2xl w-full p-8 flex flex-col items-center">
      <h2 className="text-3xl font-bold text-white mb-6">Login</h2>

      {error && (
        <div className="mb-4 p-3 bg-red-600/80 text-white rounded w-full text-center">
          <strong>Error:</strong> {error}
        </div>
      )}

      <form className="w-full flex flex-col gap-4" onSubmit={onSubmit}>
        <input
          type="text"
          value={username}
          onChange={(e) => onUsernameChange(e.target.value)}
          placeholder="Username"
          className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500 text-white"
          required
        />
        <input
          type="password"
          value={password}
          onChange={(e) => onPasswordChange(e.target.value)}
          placeholder="Password"
          className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500 text-white"
          required
        />

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-2 rounded-lg bg-green-600 hover:bg-green-500 transition-colors ${
            loading ? "opacity-70 cursor-not-allowed" : ""
          }`}
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>

      {/* Discord Login Button */}
      <button
        onClick={onDiscordLogin}
        className="w-full mt-4 py-2 rounded-lg bg-[#5865F2] hover:bg-[#4752C4] transition-colors text-white flex items-center justify-center gap-2"
      >
        <FaDiscord className="text-lg" />
        Login with Discord
      </button>

      <p className="mt-4 text-gray-400 text-sm">
        Don't have an account?{" "}
        <a href="/register" className="text-green-500 hover:underline">
          Register
        </a>
      </p>
    </div>
  );
};

export default LoginForm;