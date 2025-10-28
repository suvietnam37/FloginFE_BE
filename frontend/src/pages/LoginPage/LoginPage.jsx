// Trong file: pages/LoginPage/LoginPage.jsx
import React, { useState } from 'react';
import { validateUsername } from '../../utils/validation';
import authService from '../../services/authService'; // BƯỚC 1: Import service

function LoginPage() {
    const [formData, setFormData] = useState({
        username: '',
        password: '',
    });

    const [errors, setErrors] = useState({});
    const [apiMessage, setApiMessage] = useState(''); // State mới để lưu thông báo từ API

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({ ...prevState, [name]: value }));
    };

    // BƯỚC 2: Chuyển hàm thành async
    const handleSubmit = async (e) => {
        e.preventDefault();
        setApiMessage(''); // Xóa thông báo cũ mỗi khi submit

        const usernameError = validateUsername(formData.username);
        // (Thêm passwordError ở đây sau)

        if (usernameError) {
            setErrors({ username: usernameError });
            return; // Dừng lại nếu có lỗi validation
        }

        setErrors({});

        // BƯỚC 3: Gọi API bằng try...catch
        try {
            // Gửi username và password đến backend
            const response = await authService.login(formData.username, formData.password);
            
            // Nếu thành công, backend sẽ trả về response
            console.log('Login successful:', response.data);
            setApiMessage({ type: 'success', text: response.data.message });

            // Ở đây sau này chúng ta sẽ lưu token và chuyển trang
            // localStorage.setItem('token', response.data.token);

        } catch (error) {
            // Nếu có lỗi, server sẽ trả về lỗi (ví dụ 401)
            console.error('Login failed:', error.response.data);
            const errorMessage = error.response?.data?.message || 'Đã có lỗi xảy ra';
            setApiMessage({ type: 'error', text: errorMessage });
        }
    };

    return (
        <div>
            <h2>Đăng nhập</h2>
            <form onSubmit={handleSubmit}>
                {/* ... (phần input username và password không đổi) ... */}
                <div>
                    <label>Tên đăng nhập:</label>
                    <input type="text" name="username" value={formData.username} onChange={handleChange} />
                    {errors.username && <p style={{ color: 'red' }}>{errors.username}</p>}
                </div>
                <div>
                    <label>Mật khẩu:</label>
                    <input type="password" name="password" value={formData.password} onChange={handleChange}/>
                    {/* {errors.password && <p style={{ color: 'red' }}>{errors.password}</p>} */}
                </div>
                <button type="submit">Đăng nhập</button>
            </form>
            
            {/* BƯỚC 4: Hiển thị thông báo từ API */}
            {apiMessage && (
                <p style={{ color: apiMessage.type === 'success' ? 'green' : 'red' }}>
                    {apiMessage.text}
                </p>
            )}
        </div>
    );
}

export default LoginPage;