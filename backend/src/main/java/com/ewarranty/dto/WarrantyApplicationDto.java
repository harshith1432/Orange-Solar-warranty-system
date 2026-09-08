package com.ewarranty.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

public class WarrantyApplicationDto {
    private Long userId;
    private Long productId;
    private String productName;
    private String productModel;
    private String serialNumber;
    private LocalDate purchaseDate;
    private String storeName;
    private BigDecimal purchasePrice;
    private String invoiceUrl;

    public WarrantyApplicationDto() {}

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public Long getProductId() { return productId; }
    public void setProductId(Long productId) { this.productId = productId; }

    public String getProductName() { return productName; }
    public void setProductName(String productName) { this.productName = productName; }

    public String getProductModel() { return productModel; }
    public void setProductModel(String productModel) { this.productModel = productModel; }

    public String getSerialNumber() { return serialNumber; }
    public void setSerialNumber(String serialNumber) { this.serialNumber = serialNumber; }

    public LocalDate getPurchaseDate() { return purchaseDate; }
    public void setPurchaseDate(LocalDate purchaseDate) { this.purchaseDate = purchaseDate; }

    public String getStoreName() { return storeName; }
    public void setStoreName(String storeName) { this.storeName = storeName; }

    public BigDecimal getPurchasePrice() { return purchasePrice; }
    public void setPurchasePrice(BigDecimal purchasePrice) { this.purchasePrice = purchasePrice; }

    public String getInvoiceUrl() { return invoiceUrl; }
    public void setInvoiceUrl(String invoiceUrl) { this.invoiceUrl = invoiceUrl; }
}
