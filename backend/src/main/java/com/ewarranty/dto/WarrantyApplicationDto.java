package com.ewarranty.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

public class WarrantyApplicationDto {
    private Long userId;
    private Long productId;
    private String customerName;
    private String customerPhone;
    private String customerEmail;
    private String address;
    private String pincode;
    private String city;
    private String district;
    private String state;
    private String productName;
    private String productModel;
    private String serialNumber;
    private String tankCapacity;
    private String modelType;
    private LocalDate purchaseDate;
    private LocalDate installationDate;
    private String invoiceNumber;
    private String storeName;
    private String dealerName;
    private String dealerPhone;
    private BigDecimal purchasePrice;
    private String invoiceUrl;

    public WarrantyApplicationDto() {}

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public Long getProductId() { return productId; }
    public void setProductId(Long productId) { this.productId = productId; }

    public String getCustomerName() { return customerName; }
    public void setCustomerName(String customerName) { this.customerName = customerName; }

    public String getCustomerPhone() { return customerPhone; }
    public void setCustomerPhone(String customerPhone) { this.customerPhone = customerPhone; }

    public String getCustomerEmail() { return customerEmail; }
    public void setCustomerEmail(String customerEmail) { this.customerEmail = customerEmail; }

    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }

    public String getPincode() { return pincode; }
    public void setPincode(String pincode) { this.pincode = pincode; }

    public String getCity() { return city; }
    public void setCity(String city) { this.city = city; }

    public String getDistrict() { return district; }
    public void setDistrict(String district) { this.district = district; }

    public String getState() { return state; }
    public void setState(String state) { this.state = state; }

    public String getProductName() { return productName; }
    public void setProductName(String productName) { this.productName = productName; }

    public String getProductModel() { return productModel; }
    public void setProductModel(String productModel) { this.productModel = productModel; }

    public String getSerialNumber() { return serialNumber; }
    public void setSerialNumber(String serialNumber) { this.serialNumber = serialNumber; }

    public String getTankCapacity() { return tankCapacity; }
    public void setTankCapacity(String tankCapacity) { this.tankCapacity = tankCapacity; }

    public String getModelType() { return modelType; }
    public void setModelType(String modelType) { this.modelType = modelType; }

    public LocalDate getPurchaseDate() { return purchaseDate; }
    public void setPurchaseDate(LocalDate purchaseDate) { this.purchaseDate = purchaseDate; }

    public LocalDate getInstallationDate() { return installationDate; }
    public void setInstallationDate(LocalDate installationDate) { this.installationDate = installationDate; }

    public String getInvoiceNumber() { return invoiceNumber; }
    public void setInvoiceNumber(String invoiceNumber) { this.invoiceNumber = invoiceNumber; }

    public String getStoreName() { return storeName != null ? storeName : dealerName; }
    public void setStoreName(String storeName) { this.storeName = storeName; }

    public String getDealerName() { return dealerName != null ? dealerName : storeName; }
    public void setDealerName(String dealerName) { this.dealerName = dealerName; }

    public String getDealerPhone() { return dealerPhone; }
    public void setDealerPhone(String dealerPhone) { this.dealerPhone = dealerPhone; }

    public BigDecimal getPurchasePrice() { return purchasePrice; }
    public void setPurchasePrice(BigDecimal purchasePrice) { this.purchasePrice = purchasePrice; }

    public String getInvoiceUrl() { return invoiceUrl; }
    public void setInvoiceUrl(String invoiceUrl) { this.invoiceUrl = invoiceUrl; }
}
