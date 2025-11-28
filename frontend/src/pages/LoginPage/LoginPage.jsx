import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../../services/authService';
import { validateUsername, validatePassword } from '../../utils/loginValidation';
import './LoginPage.css';

const LoginPage = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [apiMessage, setApiMessage] = useState(null);
  const [errors, setErrors] = useState({});

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiMessage(null);
    setErrors({});

    const usernameError = validateUsername(username);
    const passwordError = validatePassword(password);

    if (usernameError || passwordError) {
      setErrors({
        username: usernameError,
        password: passwordError,
      });
      return; // Dừng lại nếu có lỗi validation
    }

    // Nếu không có lỗi validation, mới tiếp tục gọi API
    try {
      const res = await authService.login(username, password);
      setApiMessage({ type: 'success', text: res.data.message || 'Đăng nhập thành công!' });
      setTimeout(() => navigate('/products'), 1000);
    } catch (err) {
      const text = err.response?.data?.message || 'Đăng nhập thất bại';
      setApiMessage({ type: 'error', text });
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <h2>Đăng nhập</h2>
        <form onSubmit={handleSubmit} noValidate> {/* Thêm noValidate để tắt validation mặc định của trình duyệt */}
          <div className="input-group">
            <label htmlFor="username">Tên đăng nhập</label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              data-testid="username-input"
            />
            {/* Thẻ hiển thị lỗi validation */}
            {errors.username && (
              <p className="validation-error" data-testid="username-error">
                {errors.username}
              </p>
            )}
          </div>

          <div className="input-group">
            <label htmlFor="password">Mật khẩu</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              data-testid="password-input"
            />
            {/* Thêm thẻ cho lỗi password */}
            {errors.password && (
              <p className="validation-error" data-testid="password-error">
                {errors.password}
              </p>
            )}
          </div>

          <button type="submit" className="login-btn" data-testid="login-button">
            Đăng nhập
          </button>
        </form>

        {/* Thẻ này bây giờ chỉ dùng để hiển thị lỗi từ API */}
        {apiMessage && (
          <p
            data-testid="login-message"
            className={`api-message ${apiMessage.type}`}
          >
            {apiMessage.text}
          </p>
        )}
      </div>
    </div>
  );
};

export default LoginPage;