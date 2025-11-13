import { validatePassword, validateUsername } from './validation';

describe('Username Validation Tests', () => {

    test('TC1: Test username rỗng', () => {
        const emptyUsername = '';
        expect(validateUsername(emptyUsername)).toBe('Tên đăng nhập không được để trống');
    });

    test('TC2: Test username quá ngắn', () => {
        expect(validateUsername('ab')).toBe('Tên đăng nhập phải có ít nhất 3 ký tự');
    });

    test('TC3: Test username quá dài', () => {
        const longUsername = 'a'.repeat(51);
        expect(validateUsername(longUsername)).toBe('Tên đăng nhập không được vượt quá 50 ký tự');
    });

    test('TC4: Test ký tự đặc biệt không hợp lệ', () => {
        expect(validateUsername('test user!')).toBe('Tên đăng nhập chỉ được chứa chữ, số, và các ký tự _, ., -');
    });

    test('TC5: Test username hợp lệ', () => {
        expect(validateUsername('valid-user_123')).toBe('');
    });
});

describe('Password Validation Tests', () => {

    test('TC1: Test password rỗng', () => {
        const emptyPassword = '';
        expect(validatePassword(emptyPassword)).toBe('Mật khẩu không được để trống');
    });

    test('TC2: Test password quá ngắn', () => {
        expect(validatePassword('123ab')).toBe('Mật khẩu phải có ít nhất 6 ký tự');
    });

    test('TC3: Test password quá dài', () => {
        const longPassword = 'a'.repeat(101);
        expect(validatePassword(longPassword)).toBe('Mật khẩu không được vượt quá 100 ký tự');
    });

    test('TC4: Test password không chứa số', () => {
        expect(validatePassword('abcdef')).toBe('Mật khẩu phải chứa ít nhất một chữ số');
    });

    test('TC5: Test password không chứa chữ cái', () => {
        expect(validatePassword('123456')).toBe('Mật khẩu phải chứa ít nhất một chữ cái');
    });

    test('TC6: Test password hợp lệ', () => {
        expect(validatePassword('validPass123')).toBe('');
    });
});