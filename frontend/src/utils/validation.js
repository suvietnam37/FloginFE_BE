export const validateUsername = (username) => {

    if (username.trim() === '') {
        return 'Tên đăng nhập không được để trống';
    }

    if (username.length < 3) {
        return 'Tên đăng nhập phải có ít nhất 3 ký tự';
    }

    if (username.length > 50) {
        return 'Tên đăng nhập không được vượt quá 50 ký tự';
    }

    if (!/^[a-zA-Z0-9_.-]+$/.test(username)) {
        return 'Tên đăng nhập chỉ được chứa chữ, số, và các ký tự _, ., -';
    }

    return '';
};

export const validatePassword = (password) => {

    if (password.trim() === '') {
        return 'Mật khẩu không được để trống';
    }

    if (password.length < 6) {
        return 'Mật khẩu phải có ít nhất 6 ký tự';
    }

    if (password.length > 100) {
        return 'Mật khẩu không được vượt quá 100 ký tự';
    }

    if (!/[a-zA-Z]/.test(password)) {
        return 'Mật khẩu phải chứa ít nhất một chữ cái';
    }

    if (!/\d/.test(password)) {
        return 'Mật khẩu phải chứa ít nhất một chữ số';
    }

    return '';
};
