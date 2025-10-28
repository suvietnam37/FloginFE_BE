// Trong file: utils/validation.js

// 1. Định nghĩa hàm
export const validateUsername = (username) => {
    // 2. Viết logic tối thiểu để pass test case đầu tiên
    if (username.trim() === '') {
        return 'Tên đăng nhập không được để trống';
    }

    // Trả về chuỗi rỗng nếu không có lỗi
    return '';
};