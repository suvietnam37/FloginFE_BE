package com.sgu.flogin.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.sgu.flogin.dto.ProductDto;
import com.sgu.flogin.service.ProductService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;



import java.util.Arrays;
import java.util.List;

import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
import static org.hamcrest.Matchers.hasSize;


@WebMvcTest(ProductController.class)
@AutoConfigureMockMvc(addFilters = false)
@DisplayName("Product API Integration Tests")
class ProductControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private ProductService productService;

    @Test
    @DisplayName("GET /api/products - Lay danh sach san pham")
    void testGetAllProducts() throws Exception {
        List<ProductDto> products = Arrays.asList(
            new ProductDto("Laptop", 15000000, 10),
            new ProductDto("Mouse", 200000, 50)
        );

        PageImpl<ProductDto> page = new PageImpl<>(products, PageRequest.of(0, 10), products.size());

        when(productService.getAllProducts(any()))
            .thenReturn(page);

        mockMvc.perform(get("/api/products"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.content", hasSize(2)))
            .andExpect(jsonPath("$.content[0].name").value("Laptop"));
    }

    @Test
    @DisplayName("POST /api/products - Tao san pham moi")
    void testCreateProduct() throws Exception {
        ProductDto request = new ProductDto("Keyboard", 500000, 20);
        ProductDto response = new ProductDto("Keyboard", 500000, 20);
        response.setId(1L);

        when(productService.createProduct(any()))
            .thenReturn(response);

        mockMvc.perform(post("/api/products")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
            .andExpect(status().isCreated())
            .andExpect(jsonPath("$.name").value("Keyboard"))
            .andExpect(jsonPath("$.id").value(1));
    }

    @Test
    @DisplayName("GET /api/products/{id} - Lay san pham theo id")
    void testGetProductById() throws Exception {
        ProductDto product = new ProductDto("Monitor", 3000000, 15);
        product.setId(2L);

        when(productService.getProductById(2L))
            .thenReturn(product);

        mockMvc.perform(get("/api/products/2"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.name").value("Monitor"))
            .andExpect(jsonPath("$.id").value(2));
    }

    @Test
    @DisplayName("PUT /api/products/{id} - Cap nhat san pham")
    void testUpdateProduct() throws Exception {
        ProductDto request = new ProductDto("Monitor", 2800000, 20);
        ProductDto updated = new ProductDto("Monitor", 2800000, 20);
        updated.setId(2L);

        when(productService.updateProduct(eq(2L), any()))
            .thenReturn(updated);

        mockMvc.perform(put("/api/products/2")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.price").value(2800000))
            .andExpect(jsonPath("$.id").value(2));
    }

    @Test
    @DisplayName("DELETE /api/products/{id} - Xoa san pham")
    void testDeleteProduct() throws Exception {
        doNothing().when(productService).deleteProduct(2L);

        mockMvc.perform(delete("/api/products/2"))
            .andExpect(status().isNoContent());
    }
}
