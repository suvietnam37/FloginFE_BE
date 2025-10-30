import React, { useState } from 'react';
import productService from '../../services/productService';

function ProductForm({ onProductCreated }) {
    const [formData, setFormData] = useState({ name: '', price: '', quantity: '' });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Chuyển đổi string sang number trước khi gửi
            const productData = {
                name: formData.name,
                price: parseFloat(formData.price),
                quantity: parseInt(formData.quantity)
            };
            const response = await productService.createProduct(productData);
            onProductCreated(response.data); // Gọi callback để báo cho component cha
            setFormData({ name: '', price: '', quantity: '' }); // Reset form
        } catch (error) {
            console.error("Failed to create product", error);
            alert("Tạo sản phẩm thất bại!");
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <h3>Thêm sản phẩm mới</h3>
            <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Tên sản phẩm" required />
            <input type="number" name="price" value={formData.price} onChange={handleChange} placeholder="Giá" required />
            <input type="number" name="quantity" value={formData.quantity} onChange={handleChange} placeholder="Số lượng" required />
            <button type="submit">Thêm</button>
        </form>
    );
}
export default ProductForm;