package com.ewarranty.service;

import com.ewarranty.entity.TimelineEvent;
import com.ewarranty.entity.WarrantyCard;
import com.ewarranty.entity.WarrantyRequest;
import com.ewarranty.repository.TimelineEventRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;

@Service
public class TimelineService {

    @Autowired
    private TimelineEventRepository timelineEventRepository;

    public List<TimelineEvent> initializeTimeline(WarrantyRequest request) {
        List<TimelineEvent> events = new ArrayList<>();
        LocalDateTime now = LocalDateTime.now();

        // 1. Application Submitted
        events.add(new TimelineEvent(
            request,
            "Warranty Application Submitted",
            String.format("Customer %s submitted claim with Serial Number: %s", request.getUser().getName(), request.getSerialNumber()),
            "COMPLETED",
            now,
            1
        ));

        // 2. Document & Invoice Review
        events.add(new TimelineEvent(
            request,
            "Verification & Document Audit",
            "Admin is verifying store retailer authenticity and purchase invoice validity.",
            "CURRENT",
            now.plusMinutes(5),
            2
        ));

        // 3. Warranty Card Generation
        events.add(new TimelineEvent(
            request,
            "Official Warranty Card Generation",
            "System generates cryptographic certificate number and digital verification QR code.",
            "UPCOMING",
            null,
            3
        ));

        // 4. Active Coverage Period
        events.add(new TimelineEvent(
            request,
            "Active Manufacturer Coverage",
            "Warranty protection is active under authorized service terms.",
            "UPCOMING",
            null,
            4
        ));

        // 5. Expiry Milestone
        events.add(new TimelineEvent(
            request,
            "Coverage Expiry & Renewal",
            "Warranty valid until official expiration milestone date.",
            "UPCOMING",
            null,
            5
        ));

        return timelineEventRepository.saveAll(events);
    }

    public List<TimelineEvent> markTimelineApproved(WarrantyRequest request, WarrantyCard card) {
        List<TimelineEvent> events = timelineEventRepository.findByWarrantyRequestIdOrderByStepOrderAsc(request.getId());
        LocalDateTime now = LocalDateTime.now();
        String validTillStr = card.getValidTill().format(DateTimeFormatter.ofPattern("dd MMM yyyy"));

        for (TimelineEvent ev : events) {
            if (ev.getStepOrder() == 2) {
                ev.setStatus("COMPLETED");
                ev.setEventDescription("Purchase documentation and serial number verified successfully by Admin.");
                ev.setEventDate(now);
            } else if (ev.getStepOrder() == 3) {
                ev.setStatus("COMPLETED");
                ev.setEventDescription(String.format("Generated official Certificate #%s with instant QR verification.", card.getCertificateNo()));
                ev.setEventDate(now);
            } else if (ev.getStepOrder() == 4) {
                ev.setStatus("CURRENT");
                ev.setEventDescription(String.format("Warranty coverage is officially ACTIVE. Coverage valid till %s.", validTillStr));
                ev.setEventDate(now);
            } else if (ev.getStepOrder() == 5) {
                ev.setStatus("UPCOMING");
                ev.setEventDescription(String.format("Policy scheduled to expire on %s.", validTillStr));
                ev.setEventDate(card.getValidTill().atTime(23, 59, 59));
            }
        }

        return timelineEventRepository.saveAll(events);
    }

    public List<TimelineEvent> markTimelineRejected(WarrantyRequest request, String reason) {
        List<TimelineEvent> events = timelineEventRepository.findByWarrantyRequestIdOrderByStepOrderAsc(request.getId());
        LocalDateTime now = LocalDateTime.now();

        for (TimelineEvent ev : events) {
            if (ev.getStepOrder() == 2) {
                ev.setStatus("REJECTED");
                ev.setEventDescription(String.format("Claim rejected by Admin. Reason: %s", reason));
                ev.setEventDate(now);
            } else if (ev.getStepOrder() >= 3) {
                ev.setStatus("CANCELLED");
                ev.setEventDescription("Not applicable due to application rejection.");
            }
        }

        return timelineEventRepository.saveAll(events);
    }

    public List<TimelineEvent> getTimelineByRequestId(Long requestId) {
        return timelineEventRepository.findByWarrantyRequestIdOrderByStepOrderAsc(requestId);
    }
}
