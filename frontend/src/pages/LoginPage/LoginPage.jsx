// src/pages/LoginPage/LoginPage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../../services/authService';

const LoginPage = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState(null); // { type: 'success' | 'error', text: string }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);

    try {
      const res = await authService.login(username, password);
      setMessage({ type: 'success', text: res.data.message });
      setTimeout(() => navigate('/products'), 100); // Giả lập redirect
    } catch (err) {
      const text = err.response?.data?.message || 'Đăng nhập thất bại';
      setMessage({ type: 'error', text });
    }
  };

  return (
    <div>
      <h2>Đăng nhập</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="username">Tên đăng nhập:</label>
          <input
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            data-testid="username-input"
          />
        </div>

        <div>
          <label htmlFor="password">Mật khẩu:</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            data-testid="password-input"
          />
        </div>

        <button type="submit" data-testid="submit-btn">
          Đăng nhập
        </button>
      </form>

      {message && (
        <p
          data-testid="api-message"
          style={{ color: message.type === 'success' ? 'green' : 'red' }}
        >
          {message.text}
        </p>
      )}
    </div>
  );
};

export default LoginPage;