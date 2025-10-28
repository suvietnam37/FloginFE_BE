// Trong file: pages/LoginPage/LoginPage.jsx
import React, { useState } from 'react';
import { validateUsername } from '../../utils/validation';
// Chúng ta cũng sẽ cần validatePassword sau này
// import { validatePassword } from '../../utils/validation';

function LoginPage() {
    const [formData, setFormData] = useState({
        username: '',
        password: '',
    });
    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault(); // Ngăn trình duyệt reload lại trang
        
        // --- Validation Logic ---
        const usernameError = validateUsername(formData.username);
        // const passwordError = validatePassword(formData.password); // Sẽ làm sau

        if (usernameError /* || passwordError */) {
            setErrors({
                username: usernameError,
                // password: passwordError,
            });
        } else {
            // Nếu không có lỗi validation, ta sẽ gọi API ở đây
            setErrors({});
            console.log('Form is valid, ready to submit:', formData);
            // alert('Đăng nhập thành công!'); // Tạm thời
        }
    };

    return (
        <div>
            <h2>Đăng nhập</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Tên đăng nhập:</label>
                    <input
                        type="text"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                    />
                    {errors.username && <p style={{ color: 'red' }}>{errors.username}</p>}
                </div>
                <div>
                    <label>Mật khẩu:</label>
                    <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                    />
                    {/* {errors.password && <p style={{ color: 'red' }}>{errors.password}</p>} */}
                </div>
                <button type="submit">Đăng nhập</button>
            </form>
        </div>
    );
}

export default LoginPage;