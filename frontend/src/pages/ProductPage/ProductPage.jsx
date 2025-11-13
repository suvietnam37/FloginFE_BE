// src/pages/ProductPage/ProductPage.jsx
import React, { useState, useEffect } from 'react';
import productService from '../../services/productService';

function ProductPage() {
  const [products, setProducts] = useState([]);
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [quantity, setQuantity] = useState('');

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    const res = await productService.getAllProducts();
    setProducts(res.data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newProd = { name, price: +price, quantity: +quantity };
    const res = await productService.createProduct(newProd);
    setProducts(prev => [...prev, res.data]);
    setName('');
    setPrice('');
    setQuantity('');
  };

  const handleDelete = async (id) => {
    if (window.confirm('Xóa?')) {
      await productService.deleteProduct(id);
      setProducts(prev => prev.filter(p => p.id !== id));
    }
  };

  return (
    <div data-testid="product-page">
      <h2 data-testid="title">Quản lý sản phẩm</h2>

      <form onSubmit={handleSubmit} data-testid="form">
        <input
          placeholder="Tên sản phẩm"
          value={name}
          onChange={e => setName(e.target.value)}
          data-testid="input-name"
        />
        <input
          placeholder="Giá"
          value={price}
          onChange={e => setPrice(e.target.value)}
          data-testid="input-price"
        />
        <input
          placeholder="Số lượng"
          value={quantity}
          onChange={e => setQuantity(e.target.value)}
          data-testid="input-quantity"
        />
        <button type="submit" data-testid="btn-add">Thêm</button>
      </form>

      <table data-testid="table">
        <thead>
          <tr>
            <th>Tên</th>
            <th>Giá</th>
            <th>Số lượng</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {products.map(p => (
            <tr key={p.id} data-testid={`row-${p.id}`}>
              <td>{p.name}</td>
              <td>{p.price}</td>
              <td>{p.quantity}</td>
              <td>
                <button onClick={() => handleDelete(p.id)} data-testid={`btn-delete-${p.id}`}>
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