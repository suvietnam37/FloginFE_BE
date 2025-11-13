/**
 * File: Login.mock.test.js
 * Mục tiêu: Kiểm thử component Login bằng cách mock authService.loginUser()
 */

import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Login from "../components/Login"; // Đường dẫn component
import * as authService from "../services/authService";

//  Mock toàn bộ module authService
jest.mock("../services/authService");

describe(" Login Mock Tests", () => {
  beforeEach(() => {
    jest.clearAllMocks(); // reset mock trước mỗi test
  });

  test(" TC1: Mock login thành công", async () => {
    // Giả lập phản hồi thành công từ API
    authService.loginUser.mockResolvedValue({
      success: true,
      token: "mock-token-123",
      user: { username: "testuser" },
    });

    render(<Login />);

    // Nhập username và password
    fireEvent.change(screen.getByTestId("username-input"), {
      target: { value: "testuser" },
    });
    fireEvent.change(screen.getByTestId("password-input"), {
      target: { value: "Test123" },
    });

    // Click nút Login
    fireEvent.click(screen.getByTestId("login-button"));

    // Kiểm tra gọi mock và hiển thị kết quả thành công
    await waitFor(() => {
      expect(authService.loginUser).toHaveBeenCalledWith("testuser", "Test123");
      expect(authService.loginUser).toHaveBeenCalledTimes(1);
      expect(
        screen.getByText(/đăng nhập thành công/i)
      ).toBeInTheDocument();
    });
  });

  test(" TC2: Mock login thất bại (sai mật khẩu)", async () => {
    // Giả lập phản hồi thất bại từ API
    authService.loginUser.mockRejectedValue({
      message: "Invalid credentials",
    });

    render(<Login />);

    fireEvent.change(screen.getByTestId("username-input"), {
      target: { value: "testuser" },
    });
    fireEvent.change(screen.getByTestId("password-input"), {
      target: { value: "wrongpass" },
    });
    fireEvent.click(screen.getByTestId("login-button"));

    // Kiểm tra xử lý lỗi
    await waitFor(() => {
      expect(authService.loginUser).toHaveBeenCalledWith("testuser", "wrongpass");
      expect(screen.getByText(/đăng nhập thất bại/i)).toBeInTheDocument();
    });
  });
});
