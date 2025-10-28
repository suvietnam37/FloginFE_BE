// Trong file: services/authService.js
import axios from 'axios';

// Cấu hình URL cơ sở cho backend
// Khi chạy, backend Spring Boot mặc định ở cổng 8080
const API_URL = 'http://localhost:8080/api/auth';

const login = (username, password) => {
    return axios.post(API_URL + '/login', {
        username,
        password,
    });
};

const authService = {
    login,
};

export default authService;