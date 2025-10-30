package com.sgu.flogin.repository;

import com.sgu.flogin.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProductRepository extends JpaRepository<Product, Long> {
}
