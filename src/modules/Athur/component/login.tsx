// src/components/LoginForm.tsx
import { useState } from "react";
import { loginUser, LoginResponse } from "@/services/authService";

const LoginForm = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const result = await loginUser(formData);
      
      // ✅ Đăng nhập thành công
      console.log("Token:", result.token);
      console.log("User:", result.user);

      // 💡 Lưu token và user vào localStorage (hoặc context)
      localStorage.setItem("authToken", result.token);
      localStorage.setItem("user", JSON.stringify(result.user));

      alert(`Welcome back, ${result.user.username}!`);

      // 👉 Chuyển hướng hoặc cập nhật trạng thái đăng nhập ở đây
    } catch (error: any) {
      alert("Login failed: " + error.message);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Login</h2>
      <input
        name="username"
        placeholder="Username"
        value={formData.username}
        onChange={handleChange}
        required
      />
      <input
        name="password"
        type="password"
        placeholder="Password"
        value={formData.password}
        onChange={handleChange}
        required
      />
      <button type="submit">Login</button>
    </form>
  );
};

export default LoginForm;