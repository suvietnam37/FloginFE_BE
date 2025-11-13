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

const updateProduct = (id, productData) => {
    return axios.put(`${API_URL}/${id}`, productData);
};

const deleteProduct = (id) => {
    return axios.delete(`${API_URL}/${id}`);
};

const productService = {
    createProduct: async (data) => ({ data: { ...data, id: Date.now() } }),
    getAllProducts: async () => ({ data: [] }),
    updateProduct,
    deleteProduct: async (id) => ({})
};

export default productService;