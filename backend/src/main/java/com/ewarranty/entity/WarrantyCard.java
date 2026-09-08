package com.ewarranty.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "warranty_cards")
public class WarrantyCard {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "certificate_no", nullable = false, unique = true)
    private String certificateNo; // e.g. "EW-2024-8841"

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "request_id", nullable = false)
    @JsonIgnore
    private WarrantyRequest warrantyRequest;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "product_id")
    private Product product;

    @Column(name = "product_name", nullable = false)
    private String productName;

    @Column(name = "serial_number", nullable = false)
    private String serialNumber;

    @Column(name = "warranty_period", nullable = false)
    private String warrantyPeriod = "1 Year"; // e.g. "12 Months" or "1 Year"

    @Column(name = "valid_from", nullable = false)
    private LocalDate validFrom;

    @Column(name = "valid_till", nullable = false)
    private LocalDate validTill;

    @Column(name = "store_name")
    private String storeName;

    @Column(name = "verification_code")
    private String verificationCode;

    @Column(name = "qr_payload", columnDefinition = "TEXT")
    private String qrPayload;

    @Column(name = "issued_at", nullable = false)
    private LocalDateTime issuedAt = LocalDateTime.now();

    public WarrantyCard() {}

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getCertificateNo() { return certificateNo; }
    public void setCertificateNo(String certificateNo) { this.certificateNo = certificateNo; }

    public WarrantyRequest getWarrantyRequest() { return warrantyRequest; }
    public void setWarrantyRequest(WarrantyRequest warrantyRequest) { this.warrantyRequest = warrantyRequest; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public Product getProduct() { return product; }
    public void setProduct(Product product) { this.product = product; }

    public String getProductName() { return productName; }
    public void setProductName(String productName) { this.productName = productName; }

    public String getSerialNumber() { return serialNumber; }
    public void setSerialNumber(String serialNumber) { this.serialNumber = serialNumber; }

    public String getWarrantyPeriod() { return warrantyPeriod; }
    public void setWarrantyPeriod(String warrantyPeriod) { this.warrantyPeriod = warrantyPeriod; }

    public LocalDate getValidFrom() { return validFrom; }
    public void setValidFrom(LocalDate validFrom) { this.validFrom = validFrom; }

    public LocalDate getValidTill() { return validTill; }
    public void setValidTill(LocalDate validTill) { this.validTill = validTill; }

    public String getStoreName() { return storeName; }
    public void setStoreName(String storeName) { this.storeName = storeName; }

    public String getVerificationCode() { return verificationCode; }
    public void setVerificationCode(String verificationCode) { this.verificationCode = verificationCode; }

    public String getQrPayload() { return qrPayload; }
    public void setQrPayload(String qrPayload) { this.qrPayload = qrPayload; }

    public LocalDateTime getIssuedAt() { return issuedAt; }
    public void setIssuedAt(LocalDateTime issuedAt) { this.issuedAt = issuedAt; }
}
