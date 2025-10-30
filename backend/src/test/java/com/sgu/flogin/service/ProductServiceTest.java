// Trong file: service/ProductServiceTest.java
package com.sgu.flogin.service;
import com.sgu.flogin.dto.ProductDto;
import com.sgu.flogin.entity.Product;
import com.sgu.flogin.repository.ProductRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;
import java.util.Arrays;
import java.util.List;

@ExtendWith(MockitoExtension.class)
class ProductServiceTest {
    @Mock
    private ProductRepository productRepository;

    @InjectMocks
    private ProductService productService;

    @Test
    void whenCreateProduct_thenShouldSaveAndReturnProduct() {
        // ARRANGE
        ProductDto newProductDto = new ProductDto("Laptop Dell", 15000000.0, 10);
        Product savedProduct = new Product(1L, "Laptop Dell", 15000000.0, 10);
        
        // Dạy cho mock biết khi save sẽ trả về đối tượng đã lưu
        when(productRepository.save(any(Product.class))).thenReturn(savedProduct);

        // ACT
        ProductDto createdProduct = productService.createProduct(newProductDto);

        // ASSERT
        assertNotNull(createdProduct);
        assertEquals("Laptop Dell", createdProduct.getName());
        // Verify rằng phương thức save đã được gọi đúng 1 lần
        verify(productRepository, times(1)).save(any(Product.class));
    }

    @Test
    void whenGetAllProducts_thenShouldReturnProductList() {
        // ARRANGE
        Product product1 = new Product(1L, "Laptop", 1500.0, 10);
        Product product2 = new Product(2L, "Mouse", 25.0, 100);
        when(productRepository.findAll()).thenReturn(Arrays.asList(product1, product2));

        // ACT
        List<ProductDto> productDtos = productService.getAllProducts();

        // ASSERT
        assertNotNull(productDtos);
        assertEquals(2, productDtos.size());
        assertEquals("Laptop", productDtos.get(0).getName());
    }
}