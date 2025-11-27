import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../../services/authService';
import './LoginPage.css';

const LoginPage = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);

    try {
      const res = await authService.login(username, password);
      setMessage({ type: 'success', text: res.data.message || 'Đăng nhập thành công!' });
      setTimeout(() => navigate('/products'), 1000);
    } catch (err) {
      const text = err.response?.data?.message || 'Đăng nhập thất bại';
      setMessage({ type: 'error', text });
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <h2>Đăng nhập</h2>
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label htmlFor="username">Tên đăng nhập</label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              data-testid="username-input"
              required
            />
          </div>

          <div className="input-group">
            <label htmlFor="password">Mật khẩu</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              data-testid="password-input"
              required
            />
          </div>

          <button type="submit" className="login-btn" data-testid="submit-btn">
            Đăng nhập
          </button>
        </form>

        {message && (
          <p
            data-testid="api-message"
            className={`api-message ${message.type}`}
          >
            {message.text}
          </p>
        )}
      </div>
    </div>
  );
};

export default LoginPage;