import { useState } from "react";
import RegisterForm from "../../modules/Auth/component/RegisterForm";
import { Register as registerUser } from "../../modules/Auth/services/Authservices";

export default function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const res = await registerUser({ username, email, password });
      setMessage(res.message || "Đăng ký thành công!");
    } catch (error: any) {
      setMessage(error.message || "Đăng ký thất bại!");
    } finally {
      setLoading(false);
    }
  };

  return (
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
  );
}
