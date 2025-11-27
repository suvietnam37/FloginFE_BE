import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import LoginPage from './LoginPage';
import authService from '../../services/authService';
import { MemoryRouter } from 'react-router-dom';

vi.mock('../../services/authService');

describe('LoginPage Integration Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('Hiển thị input và xử lý tương tác người dùng', () => {
    render(<LoginPage />, { wrapper: MemoryRouter });

    const usernameInput = screen.getByTestId('username-input');
    const passwordInput = screen.getByTestId('password-input');
    const submitButton = screen.getByTestId('submit-btn');

    expect(usernameInput).toBeInTheDocument();
    expect(passwordInput).toBeInTheDocument();
    expect(submitButton).toBeInTheDocument();

    fireEvent.change(usernameInput, { target: { value: 'user1' } });
    fireEvent.change(passwordInput, { target: { value: 'pass1' } });

    expect(usernameInput.value).toBe('user1');
    expect(passwordInput.value).toBe('pass1');
  });

  test('Gọi API khi submit form hợp lệ', async () => {
    authService.login.mockResolvedValue({
      data: { message: 'Đăng nhập thành công' }
    });

    render(<LoginPage />, { wrapper: MemoryRouter });

    fireEvent.change(screen.getByTestId('username-input'), {
      target: { value: 'validuser' }
    });
    fireEvent.change(screen.getByTestId('password-input'), {
      target: { value: 'validpass' }
    });

    fireEvent.click(screen.getByTestId('submit-btn'));

    await waitFor(() => {
      expect(authService.login).toHaveBeenCalledWith('validuser', 'validpass');
      expect(screen.getByTestId('api-message')).toHaveTextContent('Đăng nhập thành công');
    });
  });

  test('Hiển thị lỗi khi API trả về lỗi', async () => {
    authService.login.mockRejectedValue({
      response: { data: { message: 'Sai thông tin đăng nhập' } }
    });

    render(<LoginPage />, { wrapper: MemoryRouter });

    fireEvent.change(screen.getByTestId('username-input'), {
      target: { value: 'wronguser' }
    });
    fireEvent.change(screen.getByTestId('password-input'), {
      target: { value: 'wrongpass' }
    });

    fireEvent.click(screen.getByTestId('submit-btn'));

    await waitFor(() => {
      expect(authService.login).toHaveBeenCalled();
      expect(screen.getByTestId('api-message')).toHaveTextContent('Sai thông tin đăng nhập');
    });
  });

  test('Hiển thị lỗi mặc định khi API không trả về message', async () => {
    authService.login.mockRejectedValue({});

    render(<LoginPage />, { wrapper: MemoryRouter });

    fireEvent.change(screen.getByTestId('username-input'), {
      target: { value: 'anyuser' }
    });
    fireEvent.change(screen.getByTestId('password-input'), {
      target: { value: 'anypass' }
    });

    fireEvent.click(screen.getByTestId('submit-btn'));

    await waitFor(() => {
      expect(screen.getByTestId('api-message')).toHaveTextContent('Đăng nhập thất bại');
    });
  });
});
