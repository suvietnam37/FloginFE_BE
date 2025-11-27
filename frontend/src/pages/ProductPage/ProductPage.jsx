import React, { useState, useEffect } from 'react';
import productService from '../../services/productService';
import './ProductPage.css';

function ProductPage() {
  const [products, setProducts] = useState([]);
  const [formData, setFormData] = useState({ id: null, name: '', price: '', quantity: '' });
  const isEditing = formData.id !== null;

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const res = await productService.getAllProducts();
      // Giả sử API trả về một đối tượng Page, chúng ta lấy content
      setProducts(res.data.content || res.data);
    } catch (error) {
      console.error("Failed to load products:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setFormData({ id: null, name: '', price: '', quantity: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const productData = { name: formData.name, price: +formData.price, quantity: +formData.quantity };
    
    try {
      if (isEditing) { // Nếu đang edit -> gọi API update
        const res = await productService.updateProduct(formData.id, productData);
        setProducts(prev => prev.map(p => p.id === formData.id ? res.data : p));
      } else { // Nếu không -> gọi API create
        const res = await productService.createProduct(productData);
        setProducts(prev => [...prev, res.data]);
      }
      resetForm();
    } catch (error) {
      console.error("Failed to save product:", error);
      alert("Lưu sản phẩm thất bại!");
    }
  };

  const handleEdit = (product) => {
    setFormData({ id: product.id, name: product.name, price: product.price, quantity: product.quantity });
  };

  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa sản phẩm này?')) {
      try {
        await productService.deleteProduct(id);
        setProducts(prev => prev.filter(p => p.id !== id));
      } catch (error) {
        console.error("Failed to delete product:", error);
        alert("Xóa sản phẩm thất bại!");
      }
    }
  };

  return (
    <div className="product-page" data-testid="product-page">
      <h2 data-testid="title">Quản lý sản phẩm</h2>

      <form onSubmit={handleSubmit} className="product-form" data-testid="form">
        <input
          placeholder="Tên sản phẩm"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          data-testid="input-name"
          required
        />
        <input
          placeholder="Giá"
          name="price"
          type="number"
          value={formData.price}
          onChange={handleInputChange}
          data-testid="input-price"
          required
        />
        <input
          placeholder="Số lượng"
          name="quantity"
          type="number"
          value={formData.quantity}
          onChange={handleInputChange}
          data-testid="input-quantity"
          required
        />
        <button type="submit" data-testid="btn-add">
          {isEditing ? 'Lưu' : 'Thêm'}
        </button>
        {isEditing && <button type="button" onClick={resetForm}>Hủy</button>}
      </form>

      <table className="product-table" data-testid="table">
        <thead>
          <tr>
            <th>Tên sản phẩm</th>
            <th>Giá</th>
            <th>Số lượng</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {products.map(p => (
            <tr key={p.id} data-testid={`row-${p.id}`}>
              <td>{p.name}</td>
              <td>{p.price}</td>
              <td>{p.quantity}</td>
              <td className="actions">
                <button onClick={() => handleEdit(p)} className="btn-edit" data-testid={`btn-edit-${p.id}`}>
                  Sửa
                </button>
                <button onClick={() => handleDelete(p.id)} className="btn-delete" data-testid={`btn-delete-${p.id}`}>
                  Xóa
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ProductPage;