// src/pages/Auth/Login.tsx
import React, { useState } from "react";
import LoginForm from "../../modules/Auth/component/LoginForm";
import { login } from "../../modules/Auth/services/Authservices"; 
import Background from "../../modules/Core/Components/Background/Background";
import { useNavigate } from "react-router-dom";
import Header from "../../modules/Core/layout/Header";

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

  // Login bằng username/password
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setLoading(true);
  setError(null);

  try {
    const data: LoginResponse = await login({ username, password });
    // Clear old cache before setting new user info
    localStorage.removeItem("userInfo");
    localStorage.removeItem("authToken");
    
    localStorage.setItem("authToken", data.token);
    localStorage.setItem("userInfo", JSON.stringify(data.user));

    navigate("/dashboard");
  } catch (err: any) {
    // Lấy message từ backend nếu có
    if (err.response && err.response.data?.message) {
      setError(err.response.data.message); 
    } else if (err.response?.status === 401) {
      setError("Invalid username or password");
    } else {
      setError("Login failed. Please try again later.");
    }
  } finally {
    setLoading(false);
  }
};



  return (
    <Background>
      <Header />
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
          />
        </div>
      </div>
    </Background>
  );
};

export default Login;
