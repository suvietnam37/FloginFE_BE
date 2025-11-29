import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { describe, test, expect, beforeEach, vi } from 'vitest';
import ProductPage from './ProductPage';
import productService from '../../services/productService';

// Mock service
vi.mock('../../services/productService', () => ({
  default: {
    getAllProducts: vi.fn(),
    createProduct: vi.fn(),
    updateProduct: vi.fn(),
    deleteProduct: vi.fn(),
  },
}));

describe('ProductPage - Mock Component Tests', () => {
  const initialProducts = [
    { id: 1, name: 'Laptop', price: 1000, quantity: 5 },
    { id: 2, name: 'Mouse', price: 20, quantity: 100 },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    // Giả lập API trả về một đối tượng Page
    productService.getAllProducts.mockResolvedValue({ data: { content: initialProducts } });
  });

  test('hiển thị danh sách sản phẩm khi load', async () => {
    render(<ProductPage />);
    
    // Dùng findBy... sẽ tự động đợi
    expect(await screen.findByTestId('product-item-1')).toBeInTheDocument();
    expect(await screen.findByTestId('product-item-2')).toBeInTheDocument();
  });

  test('thêm sản phẩm mới vào danh sách', async () => {
    const newProd = { id: 3, name: 'Keyboard', price: 50, quantity: 30 };
    productService.createProduct.mockResolvedValue({ data: newProd });

    render(<ProductPage />);
    // Đợi cho list ban đầu render xong
    await screen.findByText('Laptop');

    fireEvent.change(screen.getByTestId('product-name-input'), { target: { value: 'Keyboard' } });
    fireEvent.change(screen.getByTestId('product-price-input'), { target: { value: '50' } });
    fireEvent.change(screen.getByTestId('product-quantity-input'), { target: { value: '30' } });
    fireEvent.click(screen.getByTestId('product-submit-button'));

    // Đợi cho sản phẩm mới xuất hiện
    expect(await screen.findByTestId('product-item-3')).toBeInTheDocument();
    expect(productService.createProduct).toHaveBeenCalledTimes(1);
  });

  test('cập nhật sản phẩm thành công', async () => {
    const updatedProductData = { id: 1, name: 'Laptop Pro', price: 1200, quantity: 5 };
    productService.updateProduct.mockResolvedValue({ data: updatedProductData });

    render(<ProductPage />);
    await screen.findByText('Laptop'); // Đợi list ban đầu render

    fireEvent.click(screen.getByTestId('btn-edit-1'));

    const nameInput = screen.getByTestId('product-name-input');
    fireEvent.change(nameInput, { target: { value: 'Laptop Pro' } });

    fireEvent.click(screen.getByRole('button', { name: /Lưu/i }));

    await waitFor(() => {
      expect(productService.updateProduct).toHaveBeenCalledWith(1, {
        name: 'Laptop Pro',
        price: 1000, // Dữ liệu cũ chưa thay đổi
        quantity: 5,   // Dữ liệu cũ chưa thay đổi
      });
    });

    expect(await screen.findByText('Laptop Pro')).toBeInTheDocument();
    expect(screen.queryByText('Laptop')).not.toBeInTheDocument();
  });

  test('xóa sản phẩm khỏi danh sách', async () => {
    productService.deleteProduct.mockResolvedValue({});
    vi.spyOn(window, 'confirm').mockReturnValue(true);

    render(<ProductPage />);
    await screen.findByText('Laptop'); // Đợi list ban đầu render

    fireEvent.click(screen.getByTestId('btn-delete-1'));

    await waitFor(() => {
      expect(productService.deleteProduct).toHaveBeenCalledWith(1);
    });
    
    // Dùng waitFor để đảm bảo React đã re-render xong
    await waitFor(() => {
      expect(screen.queryByTestId('product-item-1')).not.toBeInTheDocument();
    });
  });
});