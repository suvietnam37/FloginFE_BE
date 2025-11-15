package com.sgu.flogin.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.sgu.flogin.dto.ProductDto;
import com.sgu.flogin.service.ProductService;
import jakarta.persistence.EntityNotFoundException;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.boot.autoconfigure.security.servlet.SecurityAutoConfiguration;

import java.util.Arrays;
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
import static org.hamcrest.Matchers.*;

@WebMvcTest(value = ProductController.class, excludeAutoConfiguration = SecurityAutoConfiguration.class)
class ProductControllerMockTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private ProductService productService;

     // GET /api/products
    @Test
    void whenGetAllProducts_thenReturnsProductPage() throws Exception {
        ProductDto p1 = new ProductDto("Laptop", 1500.0, 10);
        p1.setId(1L);
        List<ProductDto> mockProducts = Arrays.asList(p1);
        Page<ProductDto> mockPage = new PageImpl<>(mockProducts);

        when(productService.getAllProducts(any(Pageable.class))).thenReturn(mockPage);

        mockMvc.perform(get("/api/products")
                .param("page", "0")
                .param("size", "10"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content", hasSize(1)))
                .andExpect(jsonPath("$.content[0].name", is("Laptop")))
                .andExpect(jsonPath("$.totalPages", is(1)));
    }

    // POST /api/products
    @Test
    void whenCreateProduct_thenReturnsCreatedProduct() throws Exception {
        ProductDto newProduct = new ProductDto("Bàn phím", 100.0, 50);
        ProductDto savedProduct = new ProductDto("Bàn phím", 100.0, 50);
        savedProduct.setId(1L);
        when(productService.createProduct(any(ProductDto.class))).thenReturn(savedProduct);

        mockMvc.perform(post("/api/products")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(newProduct)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value(1L));
    }

    // PUT /api/products/{id}
    @Test
    void whenUpdateProduct_thenReturnsUpdatedProduct() throws Exception {
        Long id = 1L;
        ProductDto input = new ProductDto("Bàn phím cơ", 250.0, 30);
        ProductDto updated = new ProductDto("Bàn phím cơ", 250.0, 30);
        updated.setId(id);
        when(productService.updateProduct(eq(id), any(ProductDto.class))).thenReturn(updated);

        mockMvc.perform(put("/api/products/{id}", id)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(input)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name", is("Bàn phím cơ")));
    }

    // DELETE /api/products/{id}
    @Test
    void whenDeleteProduct_thenReturnsNoContent() throws Exception {
        Long id = 1L;
        doNothing().when(productService).deleteProduct(id);

        mockMvc.perform(delete("/api/products/{id}", id))
                .andExpect(status().isNoContent());

        verify(productService, times(1)).deleteProduct(id);
    }

    // PUT non-existing → 404
    @Test
    void whenUpdateNonExistingProduct_thenReturnsNotFound() throws Exception {
        Long id = 999L;
        ProductDto input = new ProductDto("Test", 100.0, 10);
        
        when(productService.updateProduct(eq(id), any(ProductDto.class)))
                .thenThrow(new EntityNotFoundException("Product not found"));

        mockMvc.perform(put("/api/products/{id}", id)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(input)))
                .andExpect(status().isNotFound());
    }
}