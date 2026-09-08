package com.ewarranty.repository;

import com.ewarranty.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
    List<Product> findByActiveTrueOrderByCreatedAtDesc();
    List<Product> findAllByOrderByCreatedAtDesc();
}
