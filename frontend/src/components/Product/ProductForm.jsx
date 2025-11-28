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
            // Reset form về trạng thái trống khi không còn ở chế độ edit
            setFormData({ name: '', price: '', quantity: '' });
        }
    }, [productToEdit]);

    // Xử lý sự kiện khi người dùng nhập liệu vào các ô input
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    // Xử lý sự kiện khi người dùng submit form
    const handleSubmit = (e) => {
        e.preventDefault(); // Ngăn trình duyệt reload lại trang

        // Chuyển đổi dữ liệu từ string (trong form) sang number
        const productData = {
            name: formData.name,
            price: formData.price ? parseFloat(formData.price) : 0,
            quantity: formData.quantity ? parseInt(formData.quantity, 10) : 0
        };

        // Gọi hàm callback từ component cha, truyền lên dữ liệu đã xử lý và ID (nếu có)
        onFormSubmit(productData, productToEdit ? productToEdit.id : null);

        // Nếu không phải đang edit, reset form sau khi submit thành công
        if (!isEditing) {
            setFormData({ name: '', price: '', quantity: '' });
        }
    };

    return (
        <form onSubmit={handleSubmit} className="product-form" data-testid="product-form">
            <h3>{isEditing ? 'Cập nhật sản phẩm' : 'Thêm sản phẩm mới'}</h3>
            <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Tên sản phẩm"
                data-testid="product-name-input"
                required
            />
            <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                placeholder="Giá"
                data-testid="product-price-input"
                required
            />
            <input
                type="number"
                name="quantity"
                value={formData.quantity}
                onChange={handleChange}
                placeholder="Số lượng"
                data-testid="product-quantity-input"
                required
            />
            <button type="submit" data-testid="product-submit-button">
                {isEditing ? 'Lưu thay đổi' : 'Thêm'}
            </button>
            {isEditing && (
                <button type="button" onClick={clearEdit} data-testid="cancel-edit-button">
                    Hủy
                </button>
            )}
        </form>
    );
}

export default ProductForm;