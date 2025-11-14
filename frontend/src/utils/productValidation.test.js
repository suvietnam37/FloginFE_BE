import { validateProduct } from './productValidation';

describe('Product Validation Tests', () => {

    // Test product name validation
    test('TC1: Trả về lỗi khi tên sản phẩm rỗng', () => {
        const product = { name: '', price: 1000, quantity: 10, category: 'Electronics' };
        const errors = validateProduct(product);
        expect(errors.name).toBe('Tên sản phẩm không được để trống');
    });

    test('TC2: Trả về lỗi khi tên sản phẩm quá ngắn', () => {
        const product = { name: 'ab', price: 1000, quantity: 10, category: 'Electronics' };
        const errors = validateProduct(product);
        expect(errors.name).toBe('Tên sản phẩm phải có ít nhất 3 ký tự');
    });

    test('TC3: Trả về lỗi khi tên sản phẩm quá dài', () => {
        const longName = 'a'.repeat(101);
        const product = { name: longName, price: 1000, quantity: 10, category: 'Electronics' };
        const errors = validateProduct(product);
        expect(errors.name).toBe('Tên sản phẩm không được vượt quá 100 ký tự');
    });

    // Test price validation (boundary tests)
    test('TC4: Trả về lỗi khi giá sản phẩm để trống', () => {
        const product = { name: 'Laptop', price: '', quantity: 10, category: 'Electronics' };
        const errors = validateProduct(product);
        expect(errors.price).toBe('Giá sản phẩm không được để trống');
    });

    test('TC5: Trả về lỗi khi giá sản phẩm là số âm', () => {
        const product = { name: 'Laptop', price: -1000, quantity: 10, category: 'Electronics' };
        const errors = validateProduct(product);
        expect(errors.price).toBe('Giá sản phẩm phải lớn hơn 0');
    });

    // Test quantity validation
    test('TC6: Trả về lỗi khi số lượng để trống', () => {
        const product = { name: 'Laptop', price: 1000, quantity: '', category: 'Electronics' };
        const errors = validateProduct(product);
        expect(errors.quantity).toBe('Số lượng không được để trống');
    });

    test('TC7: Trả về lỗi khi số lượng là số âm', () => {
        const product = { name: 'Laptop', price: 1000, quantity: -5, category: 'Electronics' };
        const errors = validateProduct(product);
        expect(errors.quantity).toBe('Số lượng không được là số âm');
    });

    // Test description length
    test('TC8: Trả về lỗi khi mô tả quá dài', () => {
        const longDescription = 'a'.repeat(501);
        const product = { name: 'Laptop', price: 1000, quantity: 10, description: longDescription, category: 'Electronics' };
        const errors = validateProduct(product);
        expect(errors.description).toBe('Mô tả không được vượt quá 500 ký tự');
    });

    // Test category validation
    test('TC9: Trả về lỗi khi danh mục để trống', () => {
        const product = { name: 'Laptop', price: 1000, quantity: 10, category: '' };
        const errors = validateProduct(product);
        expect(errors.category).toBe('Danh mục không được để trống');
    });
});