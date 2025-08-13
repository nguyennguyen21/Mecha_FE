import React from "react";

interface RegisterFormProps {
  username: string;
  email: string;
  password: string;
  loading: boolean;
  message: string;
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
    <form onSubmit={onSubmit}>
      <h2>Đăng ký</h2>

      <div>
        <label>Tên đăng nhập:</label>
        <input
          type="text"
          placeholder="Tên đăng nhập"
          value={username}
          onChange={(e) => onUsernameChange(e.target.value)}
          required
        />
      </div>

      <div>
        <label>Email:</label>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => onEmailChange(e.target.value)}
          required
        />
      </div>

      <div>
        <label>Mật khẩu:</label>
        <input
          type="password"
          placeholder="Mật khẩu"
          value={password}
          onChange={(e) => onPasswordChange(e.target.value)}
          required
        />
      </div>

      <div>
        <button type="submit" disabled={loading}>
          {loading ? "Đang xử lý..." : "Đăng ký"}
        </button>
      </div>

      {message && (
        <p>
          <strong>{message}</strong>
        </p>
      )}
    </form>
  );
};

export default RegisterForm;
