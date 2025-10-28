// Trong file: utils/validation.js
export const validateUsername = (username) => {
    if (username.trim() === '') {
        return 'Tên đăng nhập không được để trống';
    }
    if (username.length < 3) {
        return 'Tên đăng nhập phải có ít nhất 3 ký tự';
    }
    // Regex: Chỉ cho phép các ký tự a-z, A-Z, 0-9 và _, ., -
    if (!/^[a-zA-Z0-9_.-]+$/.test(username)) {
        return 'Tên đăng nhập chỉ được chứa chữ, số, và các ký tự _, ., -';
    }
    // Thêm kiểm tra độ dài tối đa nếu cần
    if (username.length > 50) {
        return 'Tên đăng nhập không được vượt quá 50 ký tự';
    }

    return ''; // Không có lỗi
};