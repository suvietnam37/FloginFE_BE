// src/components/Product/ProductList.jsx
import React from 'react';

function ProductList({ products, onEdit, onDelete }) {
  return (
    <table>
      <thead>
        <tr>
          <th>Tên</th>
          <th>Giá</th>
          <th>Số lượng</th>
          <th>Hành động</th>
        </tr>
      </thead>
      <tbody>
        {products.map(product => (
          <tr key={product.id} data-testid={`product-row-${product.id}`}>
            <td>{product.name}</td>
            <td>{product.price}</td>
            <td>{product.quantity}</td>
            <td>
              <button onClick={() => onEdit(product)}>Sửa</button>
              <button onClick={() => onDelete(product.id)}>Xóa</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default ProductList;