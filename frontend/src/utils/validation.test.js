// Trong file: utils/validation.test.js

// Import hàm cần test
import { validatePassword, validateUsername } from './validation';

// Tạo mô tả cho nhóm test case về hàm validateUsername
describe('Username Validation', () => {
    // Viết các test case cho hàm validateUsername
    test('TC1: should return an error if username is empty', () => {
        const emptyUsername = '';
        expect(validateUsername(emptyUsername)).toBe('Tên đăng nhập không được để trống');
    });
    test('TC2: should return an error if username is too short (less than 3 chars)', () => {
        expect(validateUsername('ab')).toBe('Tên đăng nhập phải có ít nhất 3 ký tự');
    });

    test('TC3: should return an error if username contains invalid characters', () => {
        expect(validateUsername('test user!')).toBe('Tên đăng nhập chỉ được chứa chữ, số, và các ký tự _, ., -');
    });

    test('TC4: should return an empty string for a valid username', () => {
        expect(validateUsername('valid-user_123')).toBe('');
    });

});

// Viết các test case cho hàm validatePassword
describe('Password Validation', () => {
    test('TC1: should return an error if password is too short (less than 6 chars)', () => {
        expect(validatePassword('123ab')).toBe('Mật khẩu phải có ít nhất 6 ký tự');
    });

    test('TC2: should return an error if password does not contain a number', () => {
        expect(validatePassword('abcdef')).toBe('Mật khẩu phải chứa ít nhất một chữ số');
    });

    test('TC3: should return an error if password does not contain a letter', () => {
        expect(validatePassword('123456')).toBe('Mật khẩu phải chứa ít nhất một chữ cái');
    });

    test('TC4: should return an empty string for a valid password', () => {
        expect(validatePassword('validPass123')).toBe('');
    });
});