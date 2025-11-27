import http from 'k6/http';
import { check, sleep } from 'k6';
import { htmlReport } from 'https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js';
import { textSummary } from 'https://jslib.k6.io/k6-summary/0.0.1/index.js';

// Cấu hình test
export const options = {
  stages: [
    // Load Test: Tăng dần người dùng
    { duration: '2m', target: 100 },   // lên 100 VU trong 2 phút
    { duration: '5m', target: 100 },   // giữ 100 VU trong 5 phút
    { duration: '2m', target: 0 },     // giảm về 0

    // Stress Test: Đẩy quá tải
    { duration: '1m', target: 200 },
    { duration: '2m', target: 500 },
    { duration: '1m', target: 1000 },
    { duration: '2m', target: 1000 },
    { duration: '2m', target: 0 },
  ],
  thresholds: {
    http_req_duration: ['p(95)<500'], // 95% request < 500ms
    http_req_failed: ['rate<0.1'],    // lỗi < 10%
  },
};

const BASE_URL = 'http://localhost:5000'; // Thay bằng URL backend của bạn
const LOGIN_PAYLOAD = JSON.stringify({
  email: 'user@example.com',
  password: '123456',
});

const params = {
  headers: {
    'Content-Type': 'application/json',
  },
};

export default function () {
  // Gửi request login
  const res = http.post(`${BASE_URL}/api/login`, LOGIN_PAYLOAD, params);

  // Kiểm tra kết quả
  const checkRes = check(res, {
    'login successful (status 200)': (r) => r.status === 200,
    'response has token': (r) => {
      try {
        const body = JSON.parse(r.body);
        return body.token !== undefined;
      } catch (e) {
        return false;
      }
    },
  });

  // Log lỗi nếu thất bại
  if (!checkRes) {
    console.log(`Login failed: status=${res.status}, body=${res.body}`);
  }

  // Nghỉ ngẫu nhiên giữa các request (giống người thật)
  sleep(Math.random() * 2 + 1); // 1-3 giây
}

// Tạo báo cáo HTML + console summary
export function handleSummary(data) {
  return {
    'performance-tests/report-login.html': htmlReport(data),
    stdout: textSummary(data, { indent: ' → ', enableColors: true }),
  };
}