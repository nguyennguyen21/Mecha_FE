// src/pages/Auth/Login.tsx
import React, { useState } from "react";
import LoginForm from "../../modules/Auth/component/LoginForm";
import { login } from "../../modules/Auth/services/Authservices";

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

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<LoginResponse | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setResult(null);
    setLoading(true);

    try {
      const data = await login({ username, password });
      setResult(data);
      localStorage.setItem("authToken", data.token);
      console.log("Đăng nhập thành công:", data);
    } catch (err: any) {
      setError(err.message || "Đăng nhập thất bại");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <LoginForm
        username={username}
        password={password}
        loading={loading}
        error={error}
        onUsernameChange={setUsername}
        onPasswordChange={setPassword}
        onSubmit={handleSubmit}
      />

      {result && (
        <div
          style={{
            marginTop: 20,
            padding: 10,
            backgroundColor: "#d4edda",
            color: "#155724",
            borderRadius: 4,
          }}
        >
          <h4>✅ Đăng nhập thành công!</h4>
          <p>
            <strong>Token:</strong> {result.token}
          </p>
          <p>
            <strong>Xin chào:</strong> {result.user.username} ({result.user.roles})
          </p>
        </div>
      )}
    </div>
  );
}
