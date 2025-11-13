import React, { useState, useEffect } from 'react';
import ProductForm from '../../components/Product/ProductForm';
import ProductList from '../../components/Product/ProductList';
import productService from '../../services/productService';

function ProductPage() {
    const [products, setProducts] = useState([]);
    const [productToEdit, setProductToEdit] = useState(null);

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

    const handleFormSubmit = async (productData, id) => {
        try {
            if (id) { // Nếu có ID -> Cập nhật
                const response = await productService.updateProduct(id, productData);
                // Cập nhật lại danh sách products
                setProducts(products.map(p => p.id === id ? response.data : p));
            } else { // Nếu không có ID -> Tạo mới
                const response = await productService.createProduct(productData);
                setProducts([...products, response.data]);
            }
            setProductToEdit(null); // Xóa trạng thái đang edit
        } catch (error) {
            console.error("Failed to submit form", error);
        }
    };

    const handleEdit = (product) => {
        setProductToEdit(product);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Bạn có chắc chắn muốn xóa sản phẩm này?')) {
            try {
                await productService.deleteProduct(id);
                // Lọc sản phẩm đã xóa ra khỏi danh sách
                setProducts(products.filter(p => p.id !== id));
            } catch (error) {
                console.error("Failed to delete product", error);
            }
        }
    };

    return (
        <div>
            <h2>Trang Quản lý Sản phẩm</h2>
            <ProductForm
                onFormSubmit={handleFormSubmit}
                productToEdit={productToEdit}
                clearEdit={() => setProductToEdit(null)}
            />
            <hr />
            <ProductList
                products={products}
                onEdit={handleEdit}
                onDelete={handleDelete}
            />
        </div>
    );
}
export default ProductPage;