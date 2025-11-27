import http from 'k6/http';
import { check, sleep } from 'k6';
import { htmlReport } from 'https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js';
import { textSummary } from 'https://jslib.k6.io/k6-summary/0.0.1/index.js';

export const options = {
  stages: [
    // Load Test
    { duration: '2m', target: 100 },  // tăng dần lên 100 user
    { duration: '5m', target: 100 },  // giữ 100 user trong 5 phút
    { duration: '2m', target: 0 },    // giảm về 0

    // Stress Test
    { duration: '1m', target: 200 },
    { duration: '2m', target: 500 },
    { duration: '1m', target: 1000 },
    { duration: '2m', target: 1000 },
    { duration: '2m', target: 0 },
  ],
  thresholds: {
    http_req_duration: ['p(95)<800'],   // 95% request dưới 800ms là đạt
    http_req_failed: ['rate<0.05'],     // lỗi dưới 5%
  },
};

// ĐÚNG PORT + ĐÚNG ENDPOINT CỦA 99% PROJECT SPRING BOOT LOGIN
const BASE_URL = 'http://localhost:8080';
const LOGIN_ENDPOINT = '/api/auth/login';   // cái này chuẩn nhất với project bạn

const LOGIN_PAYLOAD = JSON.stringify({
  username: 'admin',     // sửa thành email thật có trong DB nếu cần
  password: '123456'             // sửa thành pass thật nếu cần
});

const params = {
  headers: {
    'Content-Type': 'application/json',
  },
};

export default function () {
  const res = http.post(`${BASE_URL}${LOGIN_ENDPOINT}`, LOGIN_PAYLOAD, params);//thay /api/auth/fake-login${LOGIN_ENDPOINT}

  // In ra kết quả để dễ debug (chỉ hiện khi có lỗi)
  if (res.status !== 200) {
    console.log(`Login thất bại → Status: ${res.status} | Body: ${res.body}`);
  }

  const success = check(res, {
    'Đăng nhập thành công (status 200)': (r) => r.status === 200,
    'Nhận được token': (r) => {
      try {
        const body = JSON.parse(r.body);
        return body.token || body.accessToken || body.jwt;  // hỗ trợ nhiều tên token
      } catch (e) {
        return false;
      }
    },
  });

  // Nếu bạn muốn test trường hợp sai email/pass để kiểm tra lỗi 401
  // → thêm 1 request khác ở đây (không bắt buộc)

  sleep(Math.random() * 2 + 1); // 1-3 giây nghỉ ngẫu nhiên
}

export function handleSummary(data) {
  return {
    'report-login.html': htmlReport(data),           // báo cáo đẹp
    stdout: textSummary(data, { indent: ' → ', enableColors: true }), // tóm tắt console
  };
}