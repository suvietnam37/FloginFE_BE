// Trong file: utils/validation.test.js

// 1. Import hàm cần test (hàm này chưa tồn tại)
import { validateUsername } from './validation';

// 2. Bọc các test case trong một khối describe
describe('Username Validation', () => {

    // 3. Viết test case đầu tiên
    test('TC1: should return an error if username is empty', () => {
        // ARRANGE: Dữ liệu đầu vào là một chuỗi rỗng
        const emptyUsername = '';

        // ACT & ASSERT: Gọi hàm và mong đợi nó trả về một thông báo lỗi cụ thể
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