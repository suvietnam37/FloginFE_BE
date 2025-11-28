import http from 'k6/http';
import { check, sleep } from 'k6';
// (Bạn có thể dùng lại 'options' tương tự như file login)

export const options = { /* ... */ };
const BASE_URL = 'http://localhost:8080/api/products';

export default function () {
  // 80% thời gian người dùng chỉ xem sản phẩm (Read)
  const getRes = http.get(`${BASE_URL}?page=0&size=20`);
  check(getRes, { 'Get products success': (r) => r.status === 200 });
  sleep(2);

  // 20% thời gian người dùng tạo sản phẩm mới (Write)
  const payload = JSON.stringify({
    name: `Sản phẩm k6 - ${Math.random()}`,
    price: 100,
    quantity: 10,
  });
  const params = { headers: { 'Content-Type': 'application/json' } };
  const postRes = http.post(BASE_URL, payload, params);
  check(postRes, { 'Create product success': (r) => r.status === 201 });
  sleep(1);
}