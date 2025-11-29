package com.sgu.flogin.dto;

import lombok.Data;

@Data
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

    public ProductDto() {
        this.name = "";
        this.price = 0;
        this.quantity = 0;
    }

    public String getName() {
        return name;
    }

    public double getPrice() {
        return price;
    }

    public int getQuantity() {
        return quantity;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setPrice(double price) {
        this.price = price;
    }

    public void setQuantity(int quantity) {
        this.quantity = quantity;
    }
}