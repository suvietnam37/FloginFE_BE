package com.sgu.flogin.dto;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class ProductDto {
    private Long id;
    private String name;
    private double price;
    private int quantity;

    // Constructor tiện lợi để tạo DTO mới
    public ProductDto(String name, double price, int quantity) {
        this.name = name;
        this.price = price;
        this.quantity = quantity;
    }
}