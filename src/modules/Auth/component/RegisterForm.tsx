import React from "react";

interface RegisterFormProps {
  username: string;
  email: string;
  password: string;
  loading: boolean;
  message: string | null;
  onUsernameChange: (value: string) => void;
  onEmailChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}

const RegisterForm: React.FC<RegisterFormProps> = ({
  username,
  email,
  password,
  loading,
  message,
  onUsernameChange,
  onEmailChange,
  onPasswordChange,
  onSubmit,
}) => {
  return (
    <div className="bg-[#121212] border-2 border-[#191919] rounded-2xl w-full p-8 flex flex-col items-center">
      <h2 className="text-3xl font-bold text-white mb-6">Register</h2>

      {message && (
        <div className="mb-4 p-3 bg-green-600/80 text-white rounded w-full text-center">
          {message}
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
          type="email"
          value={email}
          onChange={(e) => onEmailChange(e.target.value)}
          placeholder="Email"
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
          {loading ? "Registering..." : "Register"}
        </button>
      </form>

      <p className="mt-4 text-gray-400 text-sm">
        Already have an account?{" "}
        <a href="/login" className="text-green-500 hover:underline">
          Login
        </a>
      </p>
    </div>
  );
};

export default RegisterForm;
