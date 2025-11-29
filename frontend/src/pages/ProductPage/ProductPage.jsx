import React, { useState, useEffect } from 'react';
import productService from '../../services/productService';
import ProductForm from '../../components/Product/ProductForm';
import ProductList from '../../components/Product/ProductList';
import './ProductPage.css';

function ProductPage() {
  const [products, setProducts] = useState([]);
  const [productToEdit, setProductToEdit] = useState(null); // Dùng để truyền xuống form khi sửa

  // Chạy một lần khi component được render để tải danh sách sản phẩm
  useEffect(() => {
    loadProducts();
  }, []);

  // Hàm tải danh sách sản phẩm từ API
  const loadProducts = async () => {
    try {
      const response = await productService.getAllProducts();
      // API trả về đối tượng Page, lấy mảng sản phẩm từ trường 'content'
      setProducts(response.data.content || []);
    } catch (error) {
      console.error("Lỗi khi tải danh sách sản phẩm:", error);
      alert("Không thể tải danh sách sản phẩm.");
    }
  };

  // Hàm được gọi khi form (ProductForm) được submit
  const handleFormSubmit = async (productData, id) => {
    try {
      if (id) {
        // --- Logic Cập nhật ---
        const response = await productService.updateProduct(id, productData);
        setProducts(prevProducts =>
          prevProducts.map(p => (p.id === id ? response.data : p))
        );
      } else {
        // --- Logic Tạo mới ---
        const response = await productService.createProduct(productData);
        setProducts(prevProducts => [...prevProducts, response.data]);
      }
      setProductToEdit(null); // Reset form về trạng thái tạo mới
    } catch (error) {
      console.error("Lỗi khi lưu sản phẩm:", error);
      alert("Lưu sản phẩm thất bại!");
    }
  };
  
  // Hàm được gọi khi nhấn nút "Sửa" trong danh sách (ProductList)
  const handleEdit = (product) => {
    setProductToEdit(product);
  };

  // Hàm được gọi khi nhấn nút "Xóa" trong danh sách (ProductList)
  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa sản phẩm này?')) {
      try {
        await productService.deleteProduct(id);
        // Lọc sản phẩm đã xóa ra khỏi state để cập nhật UI
        setProducts(prevProducts => prevProducts.filter(p => p.id !== id));
      } catch (error) {
        console.error("Lỗi khi xóa sản phẩm:", error);
        alert("Xóa sản phẩm thất bại!");
      }
    }
  };

  return (
    <div className="product-page" data-testid="product-page">
      <h2 data-testid="title">Quản lý sản phẩm</h2>
      
      {/* Component Form: nhận dữ liệu để sửa và hàm xử lý submit */}
      <ProductForm
        onFormSubmit={handleFormSubmit}
        productToEdit={productToEdit}
        clearEdit={() => setProductToEdit(null)}
      />
      
      <hr style={{ margin: '32px 0' }} />
      
      {/* Component List: nhận danh sách sản phẩm và các hàm xử lý hành động */}
      <ProductList
        products={products}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  );
}

export default ProductPage;