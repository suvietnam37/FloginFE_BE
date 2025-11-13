import React, { useState, useEffect } from 'react';
import productService from '../../services/productService';

function ProductForm({ onFormSubmit, productToEdit, clearEdit }) {
    const [formData, setFormData] = useState({ name: '', price: '', quantity: '' });
    const isEditing = !!productToEdit;

    useEffect(() => {
        if (isEditing) {
            setFormData({
                name: productToEdit.name,
                price: productToEdit.price,
                quantity: productToEdit.quantity,
            });
        } else {
            setFormData({ name: '', price: '', quantity: '' });
        }
    }, [productToEdit]);

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
            onFormSubmit(productData, productToEdit ? productToEdit.id : null);
        } catch (error) {
            console.error("Failed to create product", error);
            alert("Tạo sản phẩm thất bại!");
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <h3>{isEditing ? 'Cập nhật sản phẩm' : 'Thêm sản phẩm mới'}</h3>
            <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Tên sản phẩm" required />
            <input type="number" name="price" value={formData.price} onChange={handleChange} placeholder="Giá" required />
            <input type="number" name="quantity" value={formData.quantity} onChange={handleChange} placeholder="Số lượng" required />
            <button type="submit">{isEditing ? 'Lưu thay đổi' : 'Thêm'}</button>
            {isEditing && <button type="button" onClick={clearEdit}>Hủy</button>}
        </form>
    );
}
export default ProductForm;