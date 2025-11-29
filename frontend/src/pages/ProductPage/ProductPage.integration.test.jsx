import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { describe, test, expect, beforeEach, vi } from 'vitest';
import ProductPage from './ProductPage';
import productService from '../../services/productService';

vi.mock('../../services/productService');

describe('ProductPage Integration Tests', () => {

  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('Hiển thị danh sách sản phẩm từ API (ProductList)', async () => {
    // ARRANGE: Giả lập API trả về một đối tượng Page
    const mockPage = {
      content: [
        { id: 1, name: 'MacBook', price: 30000000, quantity: 5 },
        { id: 2, name: 'iPhone', price: 20000000, quantity: 10 }
      ]
    };
    productService.getAllProducts.mockResolvedValue({ data: mockPage });

    // ACT
    render(<ProductPage />);

    // ASSERT: Dùng findBy... để đợi element xuất hiện
    expect(await screen.findByTestId('product-item-1')).toBeInTheDocument();
    expect(await screen.findByTestId('product-item-2')).toBeInTheDocument();
    expect(screen.getByText('MacBook')).toBeInTheDocument();
  });

  test('Thêm sản phẩm mới thành công (ProductForm)', async () => {
    // ARRANGE
    productService.getAllProducts.mockResolvedValue({ data: { content: [] } });
    const newProduct = { id: 3, name: 'AirPods', price: 5000000, quantity: 15 };
    productService.createProduct.mockResolvedValue({ data: newProduct });

    render(<ProductPage />);

    // ACT
    fireEvent.change(screen.getByTestId('product-name-input'), { target: { value: 'AirPods' } });
    fireEvent.change(screen.getByTestId('product-price-input'), { target: { value: '5000000' } });
    fireEvent.change(screen.getByTestId('product-quantity-input'), { target: { value: '15' } });
    fireEvent.click(screen.getByTestId('product-submit-button'));

    // ASSERT
    await waitFor(() => {
      // 1. Kiểm tra API call
      expect(productService.createProduct).toHaveBeenCalledWith({
        name: 'AirPods',
        price: 5000000,
        quantity: 15
      });
      // 2. Kiểm tra UI update
      expect(screen.getByTestId('product-item-3')).toBeInTheDocument();
    });
  });

  test('Xóa sản phẩm khỏi danh sách', async () => {
    // ARRANGE
    const mockPage = {
      content: [{ id: 4, name: 'Galaxy S24', price: 18000000, quantity: 8 }]
    };
    productService.getAllProducts.mockResolvedValue({ data: mockPage });
    productService.deleteProduct.mockResolvedValue({});
    vi.spyOn(window, 'confirm').mockReturnValue(true);

    render(<ProductPage />);

    // Chờ cho sản phẩm ban đầu xuất hiện
    expect(await screen.findByTestId('product-item-4')).toBeInTheDocument();

    // ACT
    fireEvent.click(screen.getByTestId('btn-delete-4'));

    // ASSERT
    await waitFor(() => {
      // 1. Kiểm tra API call
      expect(productService.deleteProduct).toHaveBeenCalledWith(4);
      // 2. Kiểm tra UI update
      expect(screen.queryByTestId('product-item-4')).not.toBeInTheDocument();
    });
  });
});