package com.ewarranty.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "notification_logs")
public class NotificationLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "request_id")
    @JsonIgnore
    private WarrantyRequest warrantyRequest;

    @Column(name = "recipient_name")
    private String recipientName;

    @Column(name = "recipient_phone")
    private String recipientPhone;

    @Column(name = "recipient_email")
    private String recipientEmail;

    @Column(nullable = false)
    private String channel; // "WHATSAPP", "EMAIL", "SMS"

    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String content;

    @Column(name = "delivery_status", nullable = false)
    private String deliveryStatus = "DELIVERED"; // SENT, DELIVERED, FAILED

    @Column(name = "sent_at", nullable = false)
    private LocalDateTime sentAt = LocalDateTime.now();

    public NotificationLog() {}

    public NotificationLog(WarrantyRequest warrantyRequest, String recipientName, String recipientPhone, String recipientEmail, String channel, String title, String content) {
        this.warrantyRequest = warrantyRequest;
        this.recipientName = recipientName;
        this.recipientPhone = recipientPhone;
        this.recipientEmail = recipientEmail;
        this.channel = channel;
        this.title = title;
        this.content = content;
        this.deliveryStatus = "DELIVERED";
        this.sentAt = LocalDateTime.now();
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public WarrantyRequest getWarrantyRequest() { return warrantyRequest; }
    public void setWarrantyRequest(WarrantyRequest warrantyRequest) { this.warrantyRequest = warrantyRequest; }

    public String getRecipientName() { return recipientName; }
    public void setRecipientName(String recipientName) { this.recipientName = recipientName; }

    public String getRecipientPhone() { return recipientPhone; }
    public void setRecipientPhone(String recipientPhone) { this.recipientPhone = recipientPhone; }

    public String getRecipientEmail() { return recipientEmail; }
    public void setRecipientEmail(String recipientEmail) { this.recipientEmail = recipientEmail; }

    public String getChannel() { return channel; }
    public void setChannel(String channel) { this.channel = channel; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }

    public String getDeliveryStatus() { return deliveryStatus; }
    public void setDeliveryStatus(String deliveryStatus) { this.deliveryStatus = deliveryStatus; }

    public LocalDateTime getSentAt() { return sentAt; }
    public void setSentAt(LocalDateTime sentAt) { this.sentAt = sentAt; }
}
