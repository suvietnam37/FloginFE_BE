// Trong file: App.jsx
import { Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage/LoginPage';
import ProductPage from './pages/ProductPage/ProductPage';

function App() {
    return (
        <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/products" element={<ProductPage />} />
            {/* Route mặc định sẽ chuyển về trang login */}
            <Route path="/" element={<LoginPage />} />
        </Routes>
    );
}
export default App;