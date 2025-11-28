import http from 'k6/http';
import { check, sleep } from 'k6';
import { Trend } from 'k6/metrics';

// Tạo một metric tùy chỉnh để theo dõi thời gian phản hồi
const loginResponseTime = new Trend('login_response_time');

export const options = {
  stages: [
    // === LOAD TEST: Mô phỏng lưu lượng truy cập bình thường và cao điểm ===
    { duration: '1m', target: 100 },  // Tăng dần lên 100 người dùng trong 1 phút
    { duration: '2m', target: 100 },  // Giữ 100 người dùng trong 2 phút
    { duration: '1m', target: 500 },  // Tăng lên 500 người dùng trong 1 phút (giờ cao điểm)
    { duration: '2m', target: 500 },  // Giữ 500 người dùng trong 2 phút
    { duration: '1m', target: 0 },    // Giảm dần về 0
    
    // === STRESS TEST: Tìm điểm giới hạn của hệ thống ===
    { duration: '1m', target: 1000 }, // Cố gắng đạt 1000 người dùng
    { duration: '2m', target: 1000 }, // Giữ tải 1000 người dùng để xem hệ thống có "sập" không
    { duration: '1m', target: 0 },
  ],
  thresholds: {
    // Yêu cầu 95% request phải hoàn thành dưới 800ms
    'http_req_duration': ['p(95)<800'],
    // Tỷ lệ request thất bại phải dưới 1%
    'http_req_failed': ['rate<0.01'],
  },
};

const BASE_URL = 'http://localhost:8080/api/auth';

export default function () {
  const payload = JSON.stringify({
    username: 'testuser', // Đảm bảo user này tồn tại trong DB
    password: 'Test123',
  });
  const params = { headers: { 'Content-Type': 'application/json' } };
  
  const res = http.post(`${BASE_URL}/login`, payload, params);

  // Response time analysis
  loginResponseTime.add(res.timings.duration);

  check(res, {
    'Login success (status 200)': (r) => r.status === 200,
  });

  sleep(1);
}