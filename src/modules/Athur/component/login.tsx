// src/components/LoginForm.tsx

import React, { useState } from 'react';
import { login } from '../services/Authservices'; // Hàm login đã viết trước đó

// Giao diện dữ liệu phản hồi sau khi đăng nhập
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

const LoginForm: React.FC = () => {
  // State lưu thông tin người dùng nhập
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<LoginResponse | null>(null);

  // Hàm xử lý khi bấm nút Đăng nhập
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Ngăn form reload trang
    setError(null);
    setResult(null);
    setLoading(true);

    try {
      // Gọi API login
      const data = await login({ username, password });
      setResult(data); // Lưu kết quả (token + user)
      localStorage.setItem('authToken', data.token); // Lưu token
      console.log('Đăng nhập thành công:', data);
    } catch (err: any) {
      setError(err.message || 'Đăng nhập thất bại');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '400px', margin: '0 auto' }}>
      <h2>Đăng nhập</h2>

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '10px' }}>
          <label>Tên đăng nhập:</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Nhập username"
            required
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
          />
        </div>

        <div style={{ marginBottom: '10px' }}>
          <label>Mật khẩu:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Nhập mật khẩu"
            required
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{
            width: '100%',
            padding: '10px',
            backgroundColor: loading ? '#ccc' : '#007bff',
            color: 'white',
            border: 'none',
            cursor: loading ? 'not-allowed' : 'pointer',
          }}
        >
          {loading ? 'Đang xử lý...' : 'Đăng nhập'}
        </button>
      </form>

      {/* Hiển thị lỗi nếu có */}
      {error && <p style={{ color: 'red', marginTop: '10px' }}><strong>Lỗi:</strong> {error}</p>}

      {/* Hiển thị kết quả thành công */}
      {result && (
        <div style={{ marginTop: '20px', padding: '10px', backgroundColor: '#d4edda', color: '#155724', borderRadius: '4px' }}>
          <h4>✅ Đăng nhập thành công!</h4>
          <p><strong>Token:</strong> {result.token}</p>
          <p><strong>Xin chào:</strong> {result.user.username} ({result.user.roles})</p>
        </div>
      )}
    </div>
  );
};

export default LoginForm;