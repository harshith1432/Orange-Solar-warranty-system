package com.ewarranty.service;

import com.ewarranty.dto.ProductDto;
import com.ewarranty.entity.Product;
import com.ewarranty.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ProductService {

    @Autowired
    private ProductRepository productRepository;

    public List<Product> getAllActiveProducts() {
        return productRepository.findByActiveTrueOrderByCreatedAtDesc();
    }

    public List<Product> getAllProducts() {
        return productRepository.findAllByOrderByCreatedAtDesc();
    }

    public Optional<Product> getProductById(Long id) {
        return productRepository.findById(id);
    }

    public Product createProduct(ProductDto dto) {
        Product p = new Product();
        p.setName(dto.getName());
        p.setModel(dto.getModel());
        p.setCategory(dto.getCategory() != null ? dto.getCategory() : "Electronics");
        p.setPrice(dto.getPrice());
        p.setDefaultWarrantyMonths(dto.getDefaultWarrantyMonths() != null ? dto.getDefaultWarrantyMonths() : 12);
        p.setDescription(dto.getDescription());
        p.setSerialPrefix(dto.getSerialPrefix() != null ? dto.getSerialPrefix() : "OS");
        p.setStoreName(dto.getStoreName() != null ? dto.getStoreName() : "Orange Solar Authorized Dealer");
        p.setImageUrl(dto.getImageUrl());
        p.setActive(true);
        return productRepository.save(p);
    }

    public Product updateProduct(Long id, ProductDto dto) {
        Product p = productRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Product not found with id: " + id));

        if (dto.getName() != null) p.setName(dto.getName());
        if (dto.getModel() != null) p.setModel(dto.getModel());
        if (dto.getCategory() != null) p.setCategory(dto.getCategory());
        if (dto.getPrice() != null) p.setPrice(dto.getPrice());
        if (dto.getDefaultWarrantyMonths() != null) p.setDefaultWarrantyMonths(dto.getDefaultWarrantyMonths());
        if (dto.getDescription() != null) p.setDescription(dto.getDescription());
        if (dto.getSerialPrefix() != null) p.setSerialPrefix(dto.getSerialPrefix());
        if (dto.getStoreName() != null) p.setStoreName(dto.getStoreName());
        if (dto.getImageUrl() != null) p.setImageUrl(dto.getImageUrl());

        return productRepository.save(p);
    }

    public void deactivateProduct(Long id) {
        Product p = productRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Product not found with id: " + id));
        p.setActive(false);
        productRepository.save(p);
    }
}
