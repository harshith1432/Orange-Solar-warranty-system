package com.ewarranty.service;

import com.ewarranty.dto.ApprovalDto;
import com.ewarranty.dto.RejectionDto;
import com.ewarranty.dto.WarrantyApplicationDto;
import com.ewarranty.dto.WarrantyDetailsResponse;
import com.ewarranty.entity.*;
import com.ewarranty.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;

@Service
public class WarrantyService {

    @Autowired
    private WarrantyRequestRepository warrantyRequestRepository;

    @Autowired
    private WarrantyCardRepository warrantyCardRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private TimelineService timelineService;

    @Autowired
    private NotificationService notificationService;

    public List<WarrantyRequest> getAllRequests(String status) {
        if (status != null && !status.equalsIgnoreCase("ALL")) {
            return warrantyRequestRepository.findByStatusOrderBySubmissionDateDesc(status.toUpperCase());
        }
        return warrantyRequestRepository.findAllByOrderBySubmissionDateDesc();
    }

    public List<WarrantyRequest> getRequestsByUser(Long userId) {
        return warrantyRequestRepository.findByUserIdOrderBySubmissionDateDesc(userId);
    }

    public List<WarrantyCard> getCardsByUser(Long userId) {
        return warrantyCardRepository.findByUserIdOrderByIssuedAtDesc(userId);
    }

    public List<WarrantyCard> getAllCards() {
        return warrantyCardRepository.findAllByOrderByIssuedAtDesc();
    }

    public Optional<WarrantyRequest> getRequestById(Long id) {
        return warrantyRequestRepository.findById(id);
    }

    public Optional<WarrantyRequest> getRequestByRequestId(String requestId) {
        return warrantyRequestRepository.findByRequestId(requestId);
    }

    public Optional<WarrantyCard> getCardByCertificateNo(String certNo) {
        return warrantyCardRepository.findByCertificateNo(certNo);
    }

    public WarrantyDetailsResponse getWarrantyDetails(Long requestId) {
        WarrantyRequest req = warrantyRequestRepository.findById(requestId)
            .orElseThrow(() -> new RuntimeException("Warranty request not found: " + requestId));

        WarrantyCard card = req.getWarrantyCard();
        List<TimelineEvent> timeline = timelineService.getTimelineByRequestId(requestId);
        List<NotificationLog> notifs = notificationService.getLogsByRequestId(requestId);

        return new WarrantyDetailsResponse(req, card, timeline, notifs);
    }

    @Transactional
    public WarrantyRequest applyForWarranty(WarrantyApplicationDto dto) {
        User user = userRepository.findById(dto.getUserId())
            .orElseThrow(() -> new RuntimeException("User not found: " + dto.getUserId()));

        Product product = null;
        if (dto.getProductId() != null) {
            product = productRepository.findById(dto.getProductId()).orElse(null);
        }

        // Generate sequential Request ID e.g. REQ12349
        long totalCount = warrantyRequestRepository.count();
        String reqId = "REQ" + (12348 + totalCount + 1);

        WarrantyRequest req = new WarrantyRequest();
        req.setRequestId(reqId);
        req.setUser(user);
        req.setProduct(product);
        req.setProductName(dto.getProductName() != null ? dto.getProductName() : (product != null ? product.getName() : "General Product"));
        req.setProductModel(dto.getProductModel() != null ? dto.getProductModel() : (product != null ? product.getModel() : "Standard"));
        req.setSerialNumber(dto.getSerialNumber());
        req.setPurchaseDate(dto.getPurchaseDate() != null ? dto.getPurchaseDate() : LocalDate.now());
        req.setStoreName(dto.getStoreName() != null ? dto.getStoreName() : (product != null ? product.getStoreName() : "Authorized Retail Store"));
        req.setPurchasePrice(dto.getPurchasePrice() != null ? dto.getPurchasePrice() : (product != null ? product.getPrice() : null));
        if (dto.getInvoiceUrl() == null || dto.getInvoiceUrl().trim().isEmpty()) {
            throw new IllegalArgumentException("Purchase bill / invoice photo is mandatory. Please upload your bill photo.");
        }
        req.setInvoiceUrl(dto.getInvoiceUrl().trim());
        req.setStatus("PENDING");
        req.setSubmissionDate(LocalDateTime.now());

        WarrantyRequest saved = warrantyRequestRepository.save(req);

        // Initialize Milestone Timeline
        timelineService.initializeTimeline(saved);

        return saved;
    }

    @Transactional
    public WarrantyDetailsResponse approveWarranty(Long requestId, ApprovalDto dto) {
        WarrantyRequest req = warrantyRequestRepository.findById(requestId)
            .orElseThrow(() -> new RuntimeException("Request not found: " + requestId));

        if ("APPROVED".equalsIgnoreCase(req.getStatus())) {
            throw new RuntimeException("This request has already been approved.");
        }

        req.setStatus("APPROVED");
        req.setReviewedAt(LocalDateTime.now());
        req.setRejectionReason(null);

        // Determine validity dates
        int months = (dto.getCustomMonths() != null && dto.getCustomMonths() > 0)
            ? dto.getCustomMonths()
            : (req.getProduct() != null ? req.getProduct().getDefaultWarrantyMonths() : 12);

        LocalDate validFrom = req.getPurchaseDate() != null ? req.getPurchaseDate() : LocalDate.now();
        LocalDate validTill = validFrom.plusMonths(months).minusDays(1);

        String periodLabel = (months % 12 == 0) ? (months / 12) + " Year" + (months > 12 ? "s" : "") : months + " Months";

        // Generate Certificate Number: EW-2024-XXXX
        int randomDigits = 1000 + new Random().nextInt(9000);
        String certNo = String.format("EW-%d-%d", LocalDate.now().getYear(), randomDigits);

        WarrantyCard card = new WarrantyCard();
        card.setCertificateNo(certNo);
        card.setWarrantyRequest(req);
        card.setUser(req.getUser());
        card.setProduct(req.getProduct());
        card.setProductName(String.format("%s (%s)", req.getProductName(), req.getProductModel() != null ? req.getProductModel() : "Standard"));
        card.setSerialNumber(req.getSerialNumber());
        card.setWarrantyPeriod(periodLabel);
        card.setValidFrom(validFrom);
        card.setValidTill(validTill);
        card.setStoreName(req.getStoreName());
        card.setVerificationCode(UUID.randomUUID().toString().substring(0, 8).toUpperCase());
        card.setQrPayload(String.format("http://localhost:5173/verify/%s", certNo));
        card.setIssuedAt(LocalDateTime.now());

        WarrantyCard savedCard = warrantyCardRepository.save(card);
        req.setWarrantyCard(savedCard);
        warrantyRequestRepository.save(req);

        // Update Timeline
        List<TimelineEvent> timeline = timelineService.markTimelineApproved(req, savedCard);

        // Dispatch 3-Way Notifications (WhatsApp, Email, SMS)
        List<NotificationLog> notifs = notificationService.dispatchWarrantyGeneratedNotifications(
            req,
            savedCard,
            dto.isSendWhatsapp(),
            dto.isSendEmail(),
            dto.isSendSms()
        );

        return new WarrantyDetailsResponse(req, savedCard, timeline, notifs);
    }

    @Transactional
    public WarrantyDetailsResponse rejectWarranty(Long requestId, RejectionDto dto) {
        WarrantyRequest req = warrantyRequestRepository.findById(requestId)
            .orElseThrow(() -> new RuntimeException("Request not found: " + requestId));

        req.setStatus("REJECTED");
        req.setRejectionReason(dto.getReason() != null ? dto.getReason() : "Documentation does not meet authorized criteria.");
        req.setReviewedAt(LocalDateTime.now());

        warrantyRequestRepository.save(req);

        // Advance timeline
        List<TimelineEvent> timeline = timelineService.markTimelineRejected(req, req.getRejectionReason());

        // Dispatch 3-Way notification alerts
        List<NotificationLog> notifs = notificationService.dispatchWarrantyRejectionNotifications(
            req,
            req.getRejectionReason(),
            dto.isSendWhatsapp(),
            dto.isSendEmail(),
            dto.isSendSms()
        );

        return new WarrantyDetailsResponse(req, null, timeline, notifs);
    }

    public Map<String, Object> getDashboardStats(Long userId) {
        Map<String, Object> stats = new HashMap<>();
        if (userId != null) {
            List<WarrantyRequest> userReqs = warrantyRequestRepository.findByUserIdOrderBySubmissionDateDesc(userId);
            long total = userReqs.size();
            long approved = userReqs.stream().filter(r -> "APPROVED".equalsIgnoreCase(r.getStatus())).count();
            long pending = userReqs.stream().filter(r -> "PENDING".equalsIgnoreCase(r.getStatus())).count();
            long rejected = userReqs.stream().filter(r -> "REJECTED".equalsIgnoreCase(r.getStatus())).count();

            stats.put("total", total);
            stats.put("approved", approved);
            stats.put("pending", pending);
            stats.put("rejected", rejected);
        } else {
            stats.put("total", warrantyRequestRepository.count());
            stats.put("approved", warrantyRequestRepository.countByStatus("APPROVED"));
            stats.put("pending", warrantyRequestRepository.countByStatus("PENDING"));
            stats.put("rejected", warrantyRequestRepository.countByStatus("REJECTED"));
        }
        return stats;
    }
}
