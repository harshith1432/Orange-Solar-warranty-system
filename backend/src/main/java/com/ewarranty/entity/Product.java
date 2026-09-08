package com.ewarranty.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "products")
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String model;

    private String category;

    @Column(precision = 10, scale = 2)
    private BigDecimal price;

    @Column(name = "default_warranty_months", nullable = false)
    private Integer defaultWarrantyMonths = 12;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "serial_prefix")
    private String serialPrefix;

    @Column(nullable = false)
    private Boolean active = true;

    @Column(name = "store_name")
    private String storeName = "Authorized Dealer";

    @Column(name = "image_url", columnDefinition = "TEXT")
    private String imageUrl;

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();

    public Product() {}

    public Product(String name, String model, String category, BigDecimal price, Integer defaultWarrantyMonths, String serialPrefix) {
        this.name = name;
        this.model = model;
        this.category = category;
        this.price = price;
        this.defaultWarrantyMonths = defaultWarrantyMonths;
        this.serialPrefix = serialPrefix;
        this.createdAt = LocalDateTime.now();
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getModel() { return model; }
    public void setModel(String model) { this.model = model; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public BigDecimal getPrice() { return price; }
    public void setPrice(BigDecimal price) { this.price = price; }

    public Integer getDefaultWarrantyMonths() { return defaultWarrantyMonths; }
    public void setDefaultWarrantyMonths(Integer defaultWarrantyMonths) { this.defaultWarrantyMonths = defaultWarrantyMonths; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getSerialPrefix() { return serialPrefix; }
    public void setSerialPrefix(String serialPrefix) { this.serialPrefix = serialPrefix; }

    public Boolean getActive() { return active; }
    public void setActive(Boolean active) { this.active = active; }

    public String getStoreName() { return storeName; }
    public void setStoreName(String storeName) { this.storeName = storeName; }

    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
