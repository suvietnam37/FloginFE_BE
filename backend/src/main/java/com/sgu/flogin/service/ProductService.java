package com.sgu.flogin.service;

import com.sgu.flogin.dto.ProductDto;
import com.sgu.flogin.entity.Product;
import com.sgu.flogin.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;
import jakarta.persistence.EntityNotFoundException;

@Service
public class ProductService {

    @Autowired
    private ProductRepository productRepository;

    public ProductDto createProduct(ProductDto productDto) {
        // Chuyển đổi DTO thành Entity để lưu vào DB
        Product product = new Product();
        product.setName(productDto.getName());
        product.setPrice(productDto.getPrice());
        product.setQuantity(productDto.getQuantity());

        Product savedProduct = productRepository.save(product);

        // Chuyển đổi Entity đã lưu thành DTO để trả về cho client
        ProductDto savedProductDto = new ProductDto();
        savedProductDto.setId(savedProduct.getId());
        savedProductDto.setName(savedProduct.getName());
        savedProductDto.setPrice(savedProduct.getPrice());
        savedProductDto.setQuantity(savedProduct.getQuantity());

        return savedProductDto;
    }

    public List<ProductDto> getAllProducts() {
        return productRepository.findAll().stream()
                .map(product -> {
                    ProductDto dto = new ProductDto();
                    dto.setId(product.getId());
                    dto.setName(product.getName());
                    dto.setPrice(product.getPrice());
                    dto.setQuantity(product.getQuantity());
                    return dto;
                })
                .collect(Collectors.toList());
    }

    public ProductDto updateProduct(Long id, ProductDto productDto) {
        // 1. Tìm sản phẩm trong DB, nếu không có sẽ ném ra lỗi
        Product productToUpdate = productRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Product not found with id: " + id));

        // 2. Cập nhật các trường
        productToUpdate.setName(productDto.getName());
        productToUpdate.setPrice(productDto.getPrice());
        productToUpdate.setQuantity(productDto.getQuantity());

        // 3. Lưu lại vào DB
        Product updatedProduct = productRepository.save(productToUpdate);

        // 4. Chuyển đổi về DTO để trả về
        return mapToDto(updatedProduct); // Sử dụng hàm helper để tránh lặp code
    }

    // Hàm helper để chuyển Entity sang DTO
    private ProductDto mapToDto(Product product) {
        ProductDto dto = new ProductDto();
        dto.setId(product.getId());
        dto.setName(product.getName());
        dto.setPrice(product.getPrice());
        dto.setQuantity(product.getQuantity());
        return dto;
    }

    public void deleteProduct(Long id) {
        // Để an toàn, có thể kiểm tra sản phẩm tồn tại trước khi xóa
        if (!productRepository.existsById(id)) {
            throw new EntityNotFoundException("Product not found with id: " + id);
        }
        productRepository.deleteById(id);
    }
}