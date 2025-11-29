import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import ProductForm from './ProductForm';

describe('ProductForm Component Tests', () => {

    // Test case 1: Kiểm tra xem component có render đúng các element cơ bản không.
    test('should render all input fields and the submit button', () => {
        // Render component. Hàm jest.fn() tạo ra một hàm giả để theo dõi.
        render(<ProductForm onFormSubmit={vi.fn()} />);

        // Tìm các element trên màn hình và khẳng định chúng tồn tại.
        expect(screen.getByPlaceholderText(/Tên sản phẩm/i)).toBeInTheDocument();
        expect(screen.getByPlaceholderText(/Giá/i)).toBeInTheDocument();
        expect(screen.getByPlaceholderText(/Số lượng/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /Thêm/i })).toBeInTheDocument();
    });

    // Test case 2: Kiểm tra việc nhập liệu có hoạt động đúng không.
    test('should update form state when user types in input fields', () => {
        render(<ProductForm onFormSubmit={vi.fn()} />);

        // Giả lập người dùng gõ vào các ô input.
        const nameInput = screen.getByPlaceholderText(/Tên sản phẩm/i);
        const priceInput = screen.getByPlaceholderText(/Giá/i);

        fireEvent.change(nameInput, { target: { value: 'Laptop Mới' } });
        fireEvent.change(priceInput, { target: { value: '12345' } });

        // Kiểm tra xem value của các ô input có đúng là những gì người dùng đã gõ.
        expect(nameInput.value).toBe('Laptop Mới');
        expect(priceInput.value).toBe('12345');
    });

    // Test case 3: Kiểm tra việc gọi hàm callback khi submit dữ liệu HỢP LỆ.
    test('should call onFormSubmit with correct data when form is submitted', () => {
        const mockSubmitHandler = vi.fn();
        // Tạo một hàm giả cho window.alert để nó không gây lỗi trong môi trường test
        // và để chúng ta có thể kiểm tra xem nó có được gọi không
        window.alert = vi.fn(); 
    
        render(<ProductForm onFormSubmit={mockSubmitHandler} />);

        // --- ACT ---
        // Chỉ điền tên sản phẩm, bỏ trống các trường bắt buộc khác
        fireEvent.change(screen.getByTestId('product-name-input'), { target: { value: 'Sản phẩm lỗi' } });
    
        // Kích hoạt sự kiện submit
        fireEvent.submit(screen.getByTestId('product-form'));

        // --- ASSERT ---
        // 1. Khẳng định rằng onFormSubmit KHÔNG được gọi
        expect(mockSubmitHandler).not.toHaveBeenCalled();
    
        // 2. Khẳng định rằng alert ĐÃ được gọi với đúng thông báo
        expect(window.alert).toHaveBeenCalledWith("Vui lòng điền đầy đủ thông tin.");
    });

    // Test case 4: Kiểm tra việc gọi hàm callback khi submit dữ liệu KHÔNG HỢP LỆ.
    test('should still call onFormSubmit even when form data is incomplete', () => {
        // --- ARRANGE ---
    // Tạo một hàm giả cho onFormSubmit
    const mockSubmitHandler = vi.fn();
    // Tạo một hàm giả cho window.alert để nó không gây lỗi và để chúng ta kiểm tra
    window.alert = vi.fn(); 
    
    render(<ProductForm onFormSubmit={mockSubmitHandler} />);

    // --- ACT ---
    // Chỉ điền tên, bỏ trống giá và số lượng
    fireEvent.change(screen.getByTestId('product-name-input'), { target: { value: 'Sản phẩm lỗi' } });
    
    // Kích hoạt sự kiện submit
    fireEvent.submit(screen.getByTestId('product-form'));

    // --- ASSERT ---
    // 1. Khẳng định rằng onFormSubmit KHÔNG được gọi
    expect(mockSubmitHandler).not.toHaveBeenCalled();
    
    // 2. Khẳng định rằng alert ĐÃ được gọi với đúng thông báo
    expect(window.alert).toHaveBeenCalledWith("Vui lòng điền đầy đủ thông tin.");
    });
});