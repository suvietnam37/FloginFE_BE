/// <reference types="vitest" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,          // 👈 Cho phép dùng describe/test/expect không cần import
    environment: 'jsdom',   // 👈 Mô phỏng môi trường DOM (React)
    setupFiles: './src/setupTests.js',           // THÊM: để dùng toBeInTheDocument()
    include: ['src/**/*.{test,spec}.{js,ts,jsx,tsx}'],
  },
});
