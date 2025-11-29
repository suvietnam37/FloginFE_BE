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
      setProducts(res.data.content || res.data);
    } catch (error) {
      console.error("Failed to load products:", error);
      alert("Không thể tải danh sách sản phẩm!");
    }
  };

  // Xử lý thay đổi trên các ô input của form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Reset form về trạng thái ban đầu (để tạo mới)
  const resetForm = () => {
    setFormData({ id: null, name: '', price: '', quantity: '' });
  };

  // Xử lý khi submit form (cả tạo mới và cập nhật)
  const handleSubmit = async (e) => {
    e.preventDefault();
    // Tạo đối tượng productData chỉ với các trường cần thiết
    const productData = {
        name: formData.name,
        price: parseFloat(formData.price) || 0, // Chuyển đổi sang số
        quantity: parseInt(formData.quantity, 10) || 0, // Chuyển đổi sang số
    };
    
    try {
        if (isEditing) {
            // Khi UPDATE, formData.id đã có ID đúng từ lúc nhấn nút "Sửa"
            const response = await productService.updateProduct(formData.id, productData);
            
            // Cập nhật lại sản phẩm trong danh sách với dữ liệu mới nhất từ server
            setProducts(prevProducts =>
                prevProducts.map(p => (p.id === formData.id ? response.data : p))
            );
        } else {
            // Khi CREATE
            const response = await productService.createProduct(productData);

            // RẤT QUAN TRỌNG: Thêm sản phẩm mới vào danh sách bằng cách sử dụng
            // chính đối tượng mà backend trả về (response.data), vì nó chứa ID thật.
            setProducts(prevProducts => [...prevProducts, response.data]);
        }
        resetForm(); // Reset form sau khi thành công
    } catch (error) {
        console.error("Lỗi khi lưu sản phẩm:", error);
        alert("Lưu sản phẩm thất bại!");
    }
};

  // Xử lý khi người dùng nhấn nút "Sửa"
  const handleEdit = (product) => {
    // Đảm bảo rằng đối tượng 'product' được truyền vào đây là đối tượng
    // đầy đủ từ state 'products', có chứa ID thật.
    setFormData({
        id: product.id,
        name: product.name,
        price: product.price.toString(), // Chuyển về string để hiển thị trong input
        quantity: product.quantity.toString(),
    });
};

  // Xử lý khi người dùng nhấn nút "Xóa"
  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa sản phẩm này?')) {
      try {
        await productService.deleteProduct(id);
        // Lọc sản phẩm đã bị xóa ra khỏi danh sách state
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

      {/* Form để tạo mới hoặc cập nhật sản phẩm */}
      <form onSubmit={handleSubmit} className="product-form" data-testid="product-form">
        <input
          placeholder="Tên sản phẩm"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          data-testid="product-name-input"
          required
        />
        <input
          placeholder="Giá"
          name="price"
          type="number"
          value={formData.price}
          onChange={handleInputChange}
          data-testid="product-price-input"
          required
        />
        <input
          placeholder="Số lượng"
          name="quantity"
          type="number"
          value={formData.quantity}
          onChange={handleInputChange}
          data-testid="product-quantity-input"
          required
        />
        <button type="submit" data-testid="product-submit-button">
          {isEditing ? 'Lưu' : 'Thêm'}
        </button>
        {isEditing && (
            <button type="button" onClick={resetForm} data-testid="cancel-edit-button">
                Hủy
            </button>
        )}
      </form>

      {/* Bảng hiển thị danh sách sản phẩm */}
      <table className="product-table" data-testid="product-table">
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
            <tr key={p.id} data-testid={`product-item-${p.id}`}>
              <td>{p.name}</td>
              <td>{p.price}</td>
              <td>{p.quantity}</td>
              <td className="actions">
                <button 
                    onClick={() => handleEdit(p)} 
                    className="btn-edit" 
                    data-testid={`btn-edit-${p.id}`}
                >
                  Sửa
                </button>
                <button 
                    onClick={() => handleDelete(p.id)} 
                    className="btn-delete" 
                    data-testid={`btn-delete-${p.id}`}
                >
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