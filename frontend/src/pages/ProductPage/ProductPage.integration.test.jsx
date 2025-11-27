import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ProductPage from './ProductPage';
import productService from '../../services/productService';

vi.mock('../../services/productService');

describe('ProductPage Integration Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('Hiển thị danh sách sản phẩm từ API (ProductList)', async () => {
    productService.getAllProducts.mockResolvedValue({
      data: [
        { id: 1, name: 'MacBook', price: 30000000, quantity: 5 },
        { id: 2, name: 'iPhone', price: 20000000, quantity: 10 }
      ]
    });

    render(<ProductPage />);

    await waitFor(() => {
      expect(screen.getByTestId('row-1')).toBeInTheDocument();
      expect(screen.getByTestId('row-2')).toBeInTheDocument();
    });
  });

  test('Thêm sản phẩm mới thành công (ProductForm)', async () => {
    productService.getAllProducts.mockResolvedValue({ data: [] });
    productService.createProduct.mockResolvedValue({
      data: { id: 3, name: 'AirPods', price: 5000000, quantity: 15 }
    });

    render(<ProductPage />);

    fireEvent.change(screen.getByTestId('input-name'), {
      target: { value: 'AirPods' }
    });
    fireEvent.change(screen.getByTestId('input-price'), {
      target: { value: '5000000' }
    });
    fireEvent.change(screen.getByTestId('input-quantity'), {
      target: { value: '15' }
    });

    fireEvent.click(screen.getByTestId('btn-add'));

    await waitFor(() => {
      expect(productService.createProduct).toHaveBeenCalledWith({
        name: 'AirPods',
        price: 5000000,
        quantity: 15
      });
      expect(screen.getByTestId('row-3')).toBeInTheDocument();
    });
  });

  test('Xóa sản phẩm khỏi danh sách (ProductDetail)', async () => {
    productService.getAllProducts.mockResolvedValue({
      data: [{ id: 4, name: 'Galaxy S24', price: 18000000, quantity: 8 }]
    });
    productService.deleteProduct.mockResolvedValue({});

    // Mock window.confirm luôn trả về true
    vi.spyOn(window, 'confirm').mockReturnValue(true);

    render(<ProductPage />);

    await waitFor(() => {
      expect(screen.getByTestId('row-4')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByTestId('btn-delete-4'));

    await waitFor(() => {
      expect(productService.deleteProduct).toHaveBeenCalledWith(4);
      expect(screen.queryByTestId('row-4')).not.toBeInTheDocument();
    });
  });
});
