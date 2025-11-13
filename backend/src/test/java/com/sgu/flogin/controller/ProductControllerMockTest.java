package com.sgu.flogin.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.sgu.flogin.dto.ProductDto;
import com.sgu.flogin.service.ProductService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
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

@WebMvcTest(
    value = ProductController.class,
    excludeAutoConfiguration = SecurityAutoConfiguration.class // TẮT SECURITY
)
class ProductControllerMockTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private ProductService productService;

    // GET /api/products
    @Test
    void whenGetAllProducts_thenReturnsProductList() throws Exception {
        ProductDto p1 = new ProductDto("Laptop", 1500.0, 10);
        p1.setId(1L);
        ProductDto p2 = new ProductDto("Mouse", 25.0, 100);
        p2.setId(2L);
        List<ProductDto> mockProducts = Arrays.asList(p1, p2);

        when(productService.getAllProducts()).thenReturn(mockProducts);

        mockMvc.perform(get("/api/products"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(2)))
                .andExpect(jsonPath("$[0].name", is("Laptop")))
                .andExpect(jsonPath("$[1].name", is("Mouse")));
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
                .andExpect(jsonPath("$.id").value(1L))
                .andExpect(jsonPath("$.name", is("Bàn phím")));
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

        verify(productService).deleteProduct(id);
    }

    // PUT non-existing → 404
    @Test
    void whenUpdateNonExistingProduct_thenReturnsNotFound() throws Exception {
        Long id = 999L;
        ProductDto input = new ProductDto("Test", 100.0, 10);

        when(productService.updateProduct(eq(id), any())).thenReturn(null);

        mockMvc.perform(put("/api/products/{id}", id)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(input)))
                .andExpect(status().isNotFound());
    }
}