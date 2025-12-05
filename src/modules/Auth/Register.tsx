// src/pages/Auth/Register.tsx
import React, { useState } from "react";
import RegisterForm from "../../modules/Auth/component/RegisterForm";
import { Register as registerUser } from "../../modules/Auth/services/Authservices";
import Background from "../../modules/Core/Components/Background/Background";
import { useNavigate } from "react-router-dom";
import Header  from "../../modules/Core/layout/Header";

const Register: React.FC = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const res = await registerUser({ username, email, password });
      setMessage(res.message || "Registration successful!");

      // Optionally redirect to login after success
      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (err: any) {
      setMessage(err.message || "Registration failed!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Background>
      <Header/>
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="w-full max-w-sm">
          <RegisterForm
            username={username}
            email={email}
            password={password}
            loading={loading}
            message={message}
            onUsernameChange={setUsername}
            onEmailChange={setEmail}
            onPasswordChange={setPassword}
            onSubmit={handleSubmit}
          />
        </div>
      </div>
    </Background>
  );
};

export default Register;
