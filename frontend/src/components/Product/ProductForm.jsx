import React, { useState, useEffect } from 'react';

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

    const handleSubmit = (e) => {
        // Ngăn trình duyệt reload
        e.preventDefault();

        // Chuyển đổi dữ liệu
        const productData = {
            name: formData.name,
            price: formData.price ? parseFloat(formData.price) : 0,
            quantity: formData.quantity ? parseInt(formData.quantity) : 0
        };

        // Gọi hàm callback của component cha
        onFormSubmit(productData, productToEdit ? productToEdit.id : null);

        // Nếu không phải đang edit thì reset form
        if (!isEditing) {
            setFormData({ name: '', price: '', quantity: '' });
        }
    };

    return (
        <form onSubmit={handleSubmit} data-testid="product-form"> {/* Thêm data-testid cho form */}
            <h3>{isEditing ? 'Cập nhật sản phẩm' : 'Thêm sản phẩm mới'}</h3>
            <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Tên sản phẩm" />
            <input type="number" name="price" value={formData.price} onChange={handleChange} placeholder="Giá" />
            <input type="number" name="quantity" value={formData.quantity} onChange={handleChange} placeholder="Số lượng" />
            <button type="submit">{isEditing ? 'Lưu thay đổi' : 'Thêm'}</button>
            {isEditing && <button type="button" onClick={clearEdit}>Hủy</button>}
        </form>
    );
}
export default ProductForm;