// src/pages/LoginPage/LoginPage.mock.test.jsx
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import LoginPage from './LoginPage';
import authService from '../../services/authService';

// Mock authService
vi.mock('../../services/authService', () => ({
  default: {
    login: vi.fn(),
  },
}));

describe('LoginPage - Mock Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('displays success message on successful login', async () => {
    authService.login.mockResolvedValue({
      data: { message: 'Đăng nhập thành công!' },
    });

    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByTestId('username-input'), {
      target: { value: 'admin' },
    });
    fireEvent.change(screen.getByTestId('password-input'), {
      target: { value: '123456' },
    });
    fireEvent.click(screen.getByTestId('login-button'));

    const msg = await screen.findByTestId('api-message');
    expect(msg).toBeInTheDocument();
    expect(msg).toHaveTextContent('Đăng nhập thành công!');
    expect(authService.login).toHaveBeenCalledWith('admin', '123456');
  });

  test('displays error message on failed login', async () => {
    const error = new Error('Invalid credentials');
    error.response = { data: { message: 'Sai tên đăng nhập hoặc mật khẩu' } };
    authService.login.mockRejectedValue(error);

    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByTestId('username-input'), {
      target: { value: 'wrong' },
    });
    fireEvent.change(screen.getByTestId('password-input'), {
      target: { value: 'wrong' },
    });
    fireEvent.click(screen.getByTestId('login-button'));

    const msg = await screen.findByTestId('api-message');
    expect(msg).toBeInTheDocument();
    expect(msg).toHaveTextContent('Sai tên đăng nhập hoặc mật khẩu');
  });
});