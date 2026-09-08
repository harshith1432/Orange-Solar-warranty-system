package com.ewarranty.service;

import com.ewarranty.entity.NotificationLog;
import com.ewarranty.entity.WarrantyCard;
import com.ewarranty.entity.WarrantyRequest;
import com.ewarranty.repository.NotificationLogRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;

@Service
public class NotificationService {

    private static final Logger log = LoggerFactory.getLogger(NotificationService.class);

    @Autowired
    private NotificationLogRepository notificationLogRepository;

    public List<NotificationLog> dispatchWarrantyGeneratedNotifications(WarrantyRequest request, WarrantyCard card, boolean sendWhatsapp, boolean sendEmail, boolean sendSms) {
        List<NotificationLog> logs = new ArrayList<>();
        String customerName = request.getUser().getName();
        String phone = request.getUser().getPhone();
        String email = request.getUser().getEmail();
        String certNo = card.getCertificateNo();
        String validTill = card.getValidTill().format(DateTimeFormatter.ofPattern("dd MMM yyyy"));

        // 1. WhatsApp Dispatch
        if (sendWhatsapp) {
            String waTitle = "Official E-Warranty Certificate Ready";
            String waContent = String.format(
                "Hello %s! 👋 Your official e-warranty for %s has been APPROVED and issued.\n" +
                "📜 Certificate No: %s\n" +
                "📅 Valid Till: %s\n" +
                "🔍 Instant Verification & Digital Card: http://localhost:5173/verify/%s\n" +
                "Thank you for your trust in our paperless warranty system.",
                customerName, request.getProductName(), certNo, validTill, certNo
            );
            NotificationLog waLog = new NotificationLog(request, customerName, phone, email, "WHATSAPP", waTitle, waContent);
            logs.add(notificationLogRepository.save(waLog));
            log.info("[WHATSAPP DISPATCH] To: {} | Cert: {} | Message sent successfully", phone, certNo);
        }

        // 2. Email Address Dispatch
        if (sendEmail) {
            String emailTitle = String.format("Your E-Warranty Certificate (%s) is Ready!", certNo);
            String emailContent = String.format(
                "Dear %s,\n\n" +
                "We are pleased to inform you that your warranty registration for %s (Serial: %s) has been approved by the admin.\n\n" +
                "Warranty Summary:\n" +
                "• Certificate ID: %s\n" +
                "• Coverage Period: %s\n" +
                "• Valid From: %s\n" +
                "• Valid Till: %s\n" +
                "• Retail Store: %s\n\n" +
                "You can view, download the PDF, or verify your official certificate at:\n" +
                "http://localhost:5173/verify/%s\n\n" +
                "Regards,\nE-Warranty Verification Department",
                customerName, request.getProductName(), request.getSerialNumber(),
                certNo, card.getWarrantyPeriod(), card.getValidFrom(), validTill,
                card.getStoreName() != null ? card.getStoreName() : "Authorized Retailer",
                certNo
            );
            NotificationLog emailLog = new NotificationLog(request, customerName, phone, email, "EMAIL", emailTitle, emailContent);
            logs.add(notificationLogRepository.save(emailLog));
            log.info("[EMAIL DISPATCH] To: {} | Subject: {} | Message sent successfully", email, emailTitle);
        }

        // 3. SMS Dispatch
        if (sendSms) {
            String smsTitle = "E-Warranty Approval Alert";
            String smsContent = String.format(
                "E-WARRANTY ALERT: Hi %s, your warranty card #%s for %s is ACTIVE till %s. Download & verify at: http://localhost:5173/verify/%s",
                customerName, certNo, request.getProductName(), validTill, certNo
            );
            NotificationLog smsLog = new NotificationLog(request, customerName, phone, email, "SMS", smsTitle, smsContent);
            logs.add(notificationLogRepository.save(smsLog));
            log.info("[SMS DISPATCH] To: {} | Content: {} | Delivered", phone, smsContent);
        }

        return logs;
    }

    public List<NotificationLog> dispatchWarrantyRejectionNotifications(WarrantyRequest request, String reason, boolean sendWhatsapp, boolean sendEmail, boolean sendSms) {
        List<NotificationLog> logs = new ArrayList<>();
        String customerName = request.getUser().getName();
        String phone = request.getUser().getPhone();
        String email = request.getUser().getEmail();

        if (sendWhatsapp) {
            String content = String.format("Hi %s, your warranty request (%s) for %s could not be approved. Reason: %s. Please re-submit with clear documentation.",
                customerName, request.getRequestId(), request.getProductName(), reason);
            logs.add(notificationLogRepository.save(new NotificationLog(request, customerName, phone, email, "WHATSAPP", "Warranty Status Update", content)));
        }

        if (sendEmail) {
            String content = String.format("Dear %s,\n\nYour warranty application (%s) for %s was reviewed. Unfortunately, it could not be approved for the following reason:\n\n\"%s\"\n\nPlease visit your customer portal to submit updated invoice proof.",
                customerName, request.getRequestId(), request.getProductName(), reason);
            logs.add(notificationLogRepository.save(new NotificationLog(request, customerName, phone, email, "EMAIL", "Warranty Claim Status: Action Required", content)));
        }

        if (sendSms) {
            String content = String.format("E-WARRANTY ALERT: Claim %s for %s requires review. Reason: %s. Visit customer portal.",
                request.getRequestId(), request.getProductName(), reason);
            logs.add(notificationLogRepository.save(new NotificationLog(request, customerName, phone, email, "SMS", "Warranty Status Update", content)));
        }

        return logs;
    }

    public List<NotificationLog> getAllLogs() {
        return notificationLogRepository.findAllByOrderBySentAtDesc();
    }

    public List<NotificationLog> getLogsByRequestId(Long requestId) {
        return notificationLogRepository.findByWarrantyRequestIdOrderBySentAtDesc(requestId);
    }
}
