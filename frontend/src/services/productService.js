// TRONG FILE: frontend/src/services/productService.js
import axios from 'axios';

const API_URL = 'http://localhost:8080/api/products';

const getAllProducts = (page = 0, size = 20) => {
    return axios.get(`${API_URL}?page=${page}&size=${size}`);
};

const createProduct = (productData) => {
    return axios.post(API_URL, productData);
};

const updateProduct = (id, productData) => {
    return axios.put(`${API_URL}/${id}`, productData);
};

const deleteProduct = (id) => {
    return axios.delete(`${API_URL}/${id}`);
};

const productService = {
    getAllProducts,
    createProduct,
    updateProduct,
    deleteProduct,
};

export default productService;