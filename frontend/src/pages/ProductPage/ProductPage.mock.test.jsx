// src/pages/ProductPage/ProductPage.mock.test.jsx
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
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

// Helper: Đợi microtasks
const flushPromises = () => new Promise(resolve => setTimeout(resolve, 0));

describe('ProductPage - CLEAN MOCK TESTS', () => {
  const initialProducts = [
    { id: 1, name: 'Laptop', price: 1000, quantity: 5 },
    { id: 2, name: 'Mouse', price: 20, quantity: 100 },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    productService.getAllProducts.mockResolvedValue({ data: initialProducts });
  });

  test('hiển thị danh sách sản phẩm khi load', async () => {
    render(<ProductPage />);
    await flushPromises();

    expect(screen.getByTestId('product-item-1')).toBeInTheDocument();
    expect(screen.getByTestId('product-item-2')).toBeInTheDocument();
  });

  test('thêm sản phẩm mới vào danh sách', async () => {
    const newProd = { id: 3, name: 'Keyboard', price: 50,  quantity: 30 };
    productService.createProduct.mockResolvedValue({ data: newProd });

    render(<ProductPage />);
    await flushPromises();

    fireEvent.change(screen.getByTestId('product-name-input'), { target: { value: 'Keyboard' } });
    fireEvent.change(screen.getByTestId('product-price-input'), { target: { value: '50' } });
    fireEvent.change(screen.getByTestId('product-quantity-input'), { target: { value: '30' } });
    fireEvent.click(screen.getByTestId('product-submit-button'));

    await flushPromises();

    expect(screen.getByTestId('product-item-3')).toBeInTheDocument();
    expect(screen.getByText('Keyboard')).toBeInTheDocument();
    expect(productService.createProduct).toHaveBeenCalledTimes(1);
  });

   test('cập nhật sản phẩm thành công', async () => {
    const updatedProductData = { id: 1, name: 'Laptop Pro', price: 1200, quantity: 5 };
    productService.updateProduct.mockResolvedValue({ data: updatedProductData });

    render(<ProductPage />);
    await flushPromises();

    expect(screen.getByText('Laptop')).toBeInTheDocument();

    fireEvent.click(screen.getByTestId('btn-edit-1'));

    const nameInput = screen.getByTestId('product-name-input');
    fireEvent.change(nameInput, { target: { value: 'Laptop Pro' } });

    fireEvent.click(screen.getByRole('button', { name: /Lưu/i }));

    await flushPromises();

    expect(productService.updateProduct).toHaveBeenCalledWith(1, {
      name: 'Laptop Pro',
      price: 1000,
      quantity: 5,
    });
    expect(productService.updateProduct).toHaveBeenCalledTimes(1);
    
    expect(screen.queryByText('Laptop')).not.toBeInTheDocument();
    expect(screen.getByText('Laptop Pro')).toBeInTheDocument();
  });

  test('xóa sản phẩm khỏi danh sách', async () => {
    productService.deleteProduct.mockResolvedValue({});
    window.confirm = vi.fn(() => true);

    render(<ProductPage />);
    await flushPromises();

    fireEvent.click(screen.getByTestId('btn-delete-1'));
    await flushPromises();

    expect(screen.queryByTestId('product-item-1')).not.toBeInTheDocument();
    expect(productService.deleteProduct).toHaveBeenCalledWith(1);
  });
});