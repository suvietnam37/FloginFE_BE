package com.sgu.flogin.service;

import com.sgu.flogin.dto.ProductDto;
import com.sgu.flogin.entity.Product;
import com.sgu.flogin.repository.ProductRepository;

import jakarta.persistence.EntityNotFoundException;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("Product Service Unit Tests")
class ProductServiceTest {

    @Mock 
    private ProductRepository productRepository;

    @InjectMocks
    private ProductService productService;

    @Test
    @DisplayName("TC1: Tạo sản phẩm mới thành công")
    void testCreateProduct() {

        ProductDto productDto = new ProductDto("Laptop Dell", 15000000.0, 10);
        Product product = new Product(1L, "Laptop Dell", 15000000.0, 10);

        // Dạy cho mock biết khi save sẽ trả về đối tượng đã lưu
        when(productRepository.save(any(Product.class))).thenReturn(product);

        // Hành động
        ProductDto result = productService.createProduct(productDto);

        // Xác nhận
        assertNotNull(result);
        assertEquals(1L, result.getId());
        assertEquals("Laptop Dell", result.getName());
        // Xác minh rằng phương thức save đã được gọi chính xác 1 lần.
        verify(productRepository, times(1)).save(any(Product.class));
    }

    @Test
    @DisplayName("TC2: Lấy thông tin sản phẩm theo ID thành công")
    void testGetProductById() {

        Long productId = 1L;
        Product productInDb = new Product(productId, "Laptop", 1500.0, 10);
        when(productRepository.findById(productId)).thenReturn(Optional.of(productInDb));

        ProductDto result = productService.getProductById(productId);

        assertNotNull(result);
        assertEquals(productId, result.getId());
    }

    @Test
    @DisplayName("TC3: Cập nhật sản phẩm thành công")
    void testUpdateProduct() {

        Long productId = 1L;
        ProductDto updateData = new ProductDto("Laptop Mới", 1600.0, 5);
        Product existingProduct = new Product(productId, "Laptop Cũ", 1500.0, 10);
        
        when(productRepository.findById(productId)).thenReturn(Optional.of(existingProduct));
        // Dạy mock: khi save, trả về chính đối tượng đã được cập nhật.
        when(productRepository.save(any(Product.class))).thenAnswer(invocation -> invocation.getArgument(0));

        ProductDto result = productService.updateProduct(productId, updateData);

        assertNotNull(result);
        assertEquals("Laptop Mới", result.getName());
        assertEquals(5, result.getQuantity());
        verify(productRepository, times(1)).save(any(Product.class));
    }

    @Test
    @DisplayName("TC4: Xóa sản phẩm thành công")
    void testDeleteProduct() {

        Long productId = 1L;
        when(productRepository.existsById(productId)).thenReturn(true);
        doNothing().when(productRepository).deleteById(productId);

        productService.deleteProduct(productId);

        verify(productRepository, times(1)).deleteById(productId);
    }

    @Test
    @DisplayName("TC5: Lấy tất cả sản phẩm với pagination")
    void testGetAllProductsWithPagination() {

        Pageable pageable = PageRequest.of(0, 10);
        
        Product p1 = new Product(1L, "Laptop", 1500.0, 10);
        Product p2 = new Product(2L, "Mouse", 25.0, 100);
        List<Product> productList = Arrays.asList(p1, p2);

        Page<Product> productPage = new PageImpl<>(productList, pageable, productList.size());

        when(productRepository.findAll(pageable)).thenReturn(productPage);
        
        Page<ProductDto> resultPage = productService.getAllProducts(pageable);

        assertNotNull(resultPage);
        assertEquals(2, resultPage.getTotalElements()); // Tổng số sản phẩm
        assertEquals(1, resultPage.getTotalPages());   // Tổng số trang
        assertEquals("Laptop", resultPage.getContent().get(0).getName());
    }

    @Test
    @DisplayName("TC6: Lấy sản phẩm theo ID không tìm thấy, ném EntityNotFoundException")
    void testGetProductById_NotFound() {

        Long productId = 999L;
        when(productRepository.findById(productId)).thenReturn(Optional.empty());
        
        assertThrows(EntityNotFoundException.class, () -> {
            productService.getProductById(productId);
        });

        verify(productRepository, times(1)).findById(productId);
    }
}