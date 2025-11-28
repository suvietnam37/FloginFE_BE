import React from 'react';

function ProductList({ products, onEdit, onDelete }) {
  return (
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
        {/* Kiểm tra nếu không có sản phẩm nào thì hiển thị thông báo */}
        {products.length === 0 ? (
          <tr>
            <td colSpan="4" style={{ textAlign: 'center' }}>Không có sản phẩm nào.</td>
          </tr>
        ) : (
          // Nếu có sản phẩm, lặp qua và hiển thị
          products.map(product => (
            <tr key={product.id} data-testid={`product-item-${product.id}`}>
              <td>{product.name}</td>
              <td>{product.price.toLocaleString('vi-VN')} VNĐ</td> {/* Định dạng tiền tệ cho đẹp */}
              <td>{product.quantity}</td>
              <td className="actions">
                <button 
                  onClick={() => onEdit(product)} 
                  className="btn-edit" 
                  data-testid={`btn-edit-${product.id}`}
                >
                  Sửa
                </button>
                <button 
                  onClick={() => onDelete(product.id)} 
                  className="btn-delete" 
                  data-testid={`btn-delete-${product.id}`}
                >
                  Xóa
                </button>
              </td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  );
}

export default ProductList;