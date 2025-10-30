import React, { useState, useEffect } from 'react';
import ProductForm from '../../components/Product/ProductForm';
import ProductList from '../../components/Product/ProductList';
import productService from '../../services/productService';

function ProductPage() {
    const [products, setProducts] = useState([]);

    // useEffect sẽ chạy một lần khi component được render lần đầu
    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const response = await productService.getAllProducts();
            setProducts(response.data);
        } catch (error) {
            console.error("Failed to fetch products", error);
        }
    };

    // Hàm này được truyền xuống ProductForm
    const handleProductCreated = (newProduct) => {
        // Thêm sản phẩm mới vào danh sách hiện tại để UI cập nhật ngay lập tức
        setProducts(prevProducts => [...prevProducts, newProduct]);
    };

    return (
        <div>
            <h2>Trang Quản lý Sản phẩm</h2>
            <ProductForm onProductCreated={handleProductCreated} />
            <hr />
            <ProductList products={products} />
        </div>
    );
}
export default ProductPage;