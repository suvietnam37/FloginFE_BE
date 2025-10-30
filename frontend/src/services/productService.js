// Trong file: services/productService.js
import axios from 'axios';

const API_URL = 'http://localhost:8080/api/products';

const createProduct = (productData) => {
    // productData là một object, ví dụ: { name: '...', price: ..., quantity: ... }
    return axios.post(API_URL, productData);
};

const getAllProducts = () => {
    return axios.get(API_URL);
};

const productService = {
    createProduct,
    getAllProducts,
};

export default productService;