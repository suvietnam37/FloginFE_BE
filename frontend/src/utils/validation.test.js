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

    // (Bạn sẽ thêm các test case khác ở đây sau)

});