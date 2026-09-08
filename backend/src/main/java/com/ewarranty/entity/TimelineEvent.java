package com.ewarranty.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "timeline_events")
public class TimelineEvent {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "request_id", nullable = false)
    @JsonIgnore
    private WarrantyRequest warrantyRequest;

    @Column(name = "event_title", nullable = false)
    private String eventTitle;

    @Column(name = "event_description", columnDefinition = "TEXT")
    private String eventDescription;

    @Column(nullable = false)
    private String status = "COMPLETED"; // COMPLETED, CURRENT, UPCOMING

    @Column(name = "event_date")
    private LocalDateTime eventDate = LocalDateTime.now();

    @Column(name = "step_order", nullable = false)
    private Integer stepOrder = 1;

    public TimelineEvent() {}

    public TimelineEvent(WarrantyRequest warrantyRequest, String eventTitle, String eventDescription, String status, LocalDateTime eventDate, Integer stepOrder) {
        this.warrantyRequest = warrantyRequest;
        this.eventTitle = eventTitle;
        this.eventDescription = eventDescription;
        this.status = status;
        this.eventDate = eventDate;
        this.stepOrder = stepOrder;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public WarrantyRequest getWarrantyRequest() { return warrantyRequest; }
    public void setWarrantyRequest(WarrantyRequest warrantyRequest) { this.warrantyRequest = warrantyRequest; }

    public String getEventTitle() { return eventTitle; }
    public void setEventTitle(String eventTitle) { this.eventTitle = eventTitle; }

    public String getEventDescription() { return eventDescription; }
    public void setEventDescription(String eventDescription) { this.eventDescription = eventDescription; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public LocalDateTime getEventDate() { return eventDate; }
    public void setEventDate(LocalDateTime eventDate) { this.eventDate = eventDate; }

    public Integer getStepOrder() { return stepOrder; }
    public void setStepOrder(Integer stepOrder) { this.stepOrder = stepOrder; }
}
