import React, { useState, useEffect } from 'react';

function ProductForm({ onFormSubmit, productToEdit, clearEdit }) {
  // State nội bộ để quản lý dữ liệu form
  const [formData, setFormData] = useState({ name: '', price: '', quantity: '' });
  const isEditing = !!productToEdit;

  // Lắng nghe sự thay đổi của prop 'productToEdit'
  // Nếu có, điền dữ liệu vào form để sửa
  useEffect(() => {
    if (isEditing) {
      setFormData({
        name: productToEdit.name,
        price: productToEdit.price.toString(),
        quantity: productToEdit.quantity.toString(),
      });
    } else {
      // Nếu không, reset form
      setFormData({ name: '', price: '', quantity: '' });
    }
  }, [productToEdit]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.price || !formData.quantity) {
      alert("Vui lòng điền đầy đủ thông tin.");
      return;
    }
    const productData = {
      name: formData.name,
      price: parseFloat(formData.price),
      quantity: parseInt(formData.quantity, 10),
    };
    // Gọi hàm của component cha, truyền dữ liệu và ID (nếu có)
    onFormSubmit(productData, productToEdit ? productToEdit.id : null);
  };

  return (
    <form onSubmit={handleSubmit} className="product-form" data-testid="product-form" noValidate>
      <input
        placeholder="Tên sản phẩm"
        name="name"
        value={formData.name}
        onChange={handleChange}
        data-testid="product-name-input"
      />
      <input
        placeholder="Giá"
        name="price"
        type="number"
        value={formData.price}
        onChange={handleChange}
        data-testid="product-price-input"
      />
      <input
        placeholder="Số lượng"
        name="quantity"
        type="number"
        value={formData.quantity}
        onChange={handleChange}
        data-testid="product-quantity-input"
      />
      <div className="form-buttons">
        <button type="submit" data-testid="product-submit-button">
          {isEditing ? 'Lưu' : 'Thêm'}
        </button>
        {isEditing && (
          <button type="button" onClick={clearEdit} data-testid="cancel-edit-button">
            Hủy
          </button>
        )}
      </div>
    </form>
  );
}

export default ProductForm;