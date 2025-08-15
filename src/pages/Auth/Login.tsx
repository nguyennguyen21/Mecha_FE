// src/pages/Auth/Login.tsx
import React, { useState } from "react";
import LoginForm from "../../modules/Auth/component/LoginForm";
import { login } from "../../modules/Auth/services/Authservices"; 
import Background from "../../modules/Core/components/Background/Background";
import { useNavigate } from "react-router-dom";
import Header  from "../../modules/Core/layout/Header";

interface LoginResponse {
  token: string;
  user: {
    idUser: number;
    username: string;
    email: string;
    phone: string;
    roles: string;
  };
}

const Login: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const data: LoginResponse = await login({ username, password });
      localStorage.setItem("authToken", data.token);
      console.log("Login success:", data);

      // redirect to dashboard
      navigate("/dashboard");
    } catch (err: any) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const handleDiscordLogin = () => {
    // Redirect to Discord OAuth URL
    window.location.href = "/auth/discord";
  };

  return (
    <Background>
      <Header/>
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="w-full max-w-sm">
          <LoginForm
            username={username}
            password={password}
            loading={loading}
            error={error}
            onUsernameChange={setUsername}
            onPasswordChange={setPassword}
            onSubmit={handleSubmit}
            onDiscordLogin={handleDiscordLogin}
          />
        </div>
      </div>
    </Background>
  );
};

export default Login;
