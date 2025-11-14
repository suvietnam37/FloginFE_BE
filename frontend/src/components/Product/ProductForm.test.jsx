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
        render(<ProductForm onFormSubmit={mockSubmitHandler} />);

        fireEvent.change(screen.getByPlaceholderText(/Tên sản phẩm/i), { target: { value: 'Sản phẩm hợp lệ' } });
        fireEvent.change(screen.getByPlaceholderText(/Giá/i), { target: { value: '100' } });
        fireEvent.change(screen.getByPlaceholderText(/Số lượng/i), { target: { value: '10' } });

        // Sử dụng fireEvent.submit trên chính cái form
        fireEvent.submit(screen.getByTestId('product-form'));

        expect(mockSubmitHandler).toHaveBeenCalledTimes(1);
        expect(mockSubmitHandler).toHaveBeenCalledWith({
            name: 'Sản phẩm hợp lệ',
            price: 100,
            quantity: 10,
        }, null);
    });

    // Test case 4: Kiểm tra việc gọi hàm callback khi submit dữ liệu KHÔNG HỢP LỆ.
    test('should still call onFormSubmit even when form data is incomplete', () => {
        const mockSubmitHandler = vi.fn();
        render(<ProductForm onFormSubmit={mockSubmitHandler} />);

        fireEvent.change(screen.getByPlaceholderText(/Tên sản phẩm/i), { target: { value: 'Sản phẩm lỗi' } });
        
        // Submit form
        fireEvent.submit(screen.getByTestId('product-form'));

        // Hàm onFormSubmit VẪN được gọi. Việc quyết định dữ liệu có hợp lệ hay không
        // là của component cha, không phải của form này.
        expect(mockSubmitHandler).toHaveBeenCalledTimes(1);
        expect(mockSubmitHandler).toHaveBeenCalledWith({
            name: 'Sản phẩm lỗi',
            price: 0, // giá trị mặc định khi parse chuỗi rỗng
            quantity: 0,
        }, null);
    });
});