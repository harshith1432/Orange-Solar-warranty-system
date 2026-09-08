package com.ewarranty.dto;

import java.math.BigDecimal;

public class ProductDto {
    private String name;
    private String model;
    private String category;
    private BigDecimal price;
    private Integer defaultWarrantyMonths = 12;
    private String description;
    private String serialPrefix;
    private String storeName;
    private String imageUrl;

    public ProductDto() {}

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

    public String getStoreName() { return storeName; }
    public void setStoreName(String storeName) { this.storeName = storeName; }

    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }
}
