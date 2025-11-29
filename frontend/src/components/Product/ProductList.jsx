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
        {products.map(product => (
          <tr key={product.id} data-testid={`product-item-${product.id}`}>
            <td>{product.name}</td>
            <td>{product.price}</td>
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
        ))}
      </tbody>
    </table>
  );
}

export default ProductList;