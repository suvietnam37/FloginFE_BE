package com.sgu.flogin.service;

import com.sgu.flogin.dto.ProductDto;
import com.sgu.flogin.entity.Product;
import com.sgu.flogin.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

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
}