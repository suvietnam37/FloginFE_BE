/// <reference types="vitest" />
import { defineConfig } from 'vite';

export default defineConfig({
  test: {
    globals: true,          // 👈 Cho phép dùng describe/test/expect không cần import
    environment: 'jsdom',   // 👈 Mô phỏng môi trường DOM (React)
  },
});
