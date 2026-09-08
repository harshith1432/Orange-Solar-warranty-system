package com.ewarranty.controller;

import com.ewarranty.entity.*;
import com.ewarranty.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.*;

@RestController
@RequestMapping("/api/customers")
public class CustomerController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private WarrantyRequestRepository warrantyRequestRepository;

    @Autowired
    private WarrantyCardRepository warrantyCardRepository;

    @Autowired
    private TimelineEventRepository timelineEventRepository;

    @Autowired
    private NotificationLogRepository notificationLogRepository;

    /**
     * Get all customers with their purchase history metrics and registered products
     */
    @GetMapping
    public ResponseEntity<List<Map<String, Object>>> getAllCustomers(
            @RequestParam(value = "search", required = false) String search,
            @RequestParam(value = "area", required = false) String area,
            @RequestParam(value = "product", required = false) String product,
            @RequestParam(value = "status", required = false) String status) {

        List<User> customers = userRepository.findByRoleOrderByIdDesc("CUSTOMER");
        List<Map<String, Object>> result = new ArrayList<>();

        for (User u : customers) {
            List<WarrantyRequest> userRequests = warrantyRequestRepository.findByUserIdOrderBySubmissionDateDesc(u.getId());
            List<WarrantyCard> userCards = warrantyCardRepository.findByUserIdOrderByIssuedAtDesc(u.getId());

            int approved = 0;
            int pending = 0;
            int rejected = 0;
            BigDecimal calculatedSpent = BigDecimal.ZERO;
            Set<String> productNames = new LinkedHashSet<>();
            Set<String> storeNames = new LinkedHashSet<>();

            for (WarrantyRequest req : userRequests) {
                if ("APPROVED".equalsIgnoreCase(req.getStatus())) approved++;
                else if ("PENDING".equalsIgnoreCase(req.getStatus())) pending++;
                else if ("REJECTED".equalsIgnoreCase(req.getStatus())) rejected++;

                if (req.getPurchasePrice() != null) {
                    calculatedSpent = calculatedSpent.add(req.getPurchasePrice());
                }
                if (req.getProductName() != null && !req.getProductName().isBlank()) {
                    productNames.add(req.getProductName().trim());
                }
                if (req.getStoreName() != null && !req.getStoreName().isBlank()) {
                    storeNames.add(req.getStoreName().trim());
                }
            }

            BigDecimal effectiveSpent = calculatedSpent.compareTo(BigDecimal.ZERO) > 0
                    ? calculatedSpent
                    : (u.getTotalSpent() != null ? u.getTotalSpent() : BigDecimal.ZERO);

            int totalPurchases = userRequests.size() > 0 ? userRequests.size() : (u.getTotalPurchases() != null ? u.getTotalPurchases() : 0);

            // Extract primary area/city from address
            String customerArea = extractArea(u.getAddress());

            // Check filters
            boolean matchesSearch = true;
            if (search != null && !search.trim().isBlank()) {
                String q = search.trim().toLowerCase();
                boolean nameMatch = u.getName() != null && u.getName().toLowerCase().contains(q);
                boolean phoneMatch = u.getPhone() != null && u.getPhone().toLowerCase().contains(q);
                boolean emailMatch = u.getEmail() != null && u.getEmail().toLowerCase().contains(q);
                boolean addressMatch = u.getAddress() != null && u.getAddress().toLowerCase().contains(q);
                boolean prodMatch = productNames.stream().anyMatch(p -> p.toLowerCase().contains(q));
                boolean snMatch = userRequests.stream().anyMatch(r -> r.getSerialNumber() != null && r.getSerialNumber().toLowerCase().contains(q));

                matchesSearch = nameMatch || phoneMatch || emailMatch || addressMatch || prodMatch || snMatch;
            }

            boolean matchesArea = true;
            if (area != null && !area.trim().isBlank() && !"All".equalsIgnoreCase(area)) {
                String a = area.trim().toLowerCase();
                matchesArea = (u.getAddress() != null && u.getAddress().toLowerCase().contains(a)) ||
                              customerArea.toLowerCase().contains(a);
            }

            boolean matchesProduct = true;
            if (product != null && !product.trim().isBlank() && !"All".equalsIgnoreCase(product)) {
                String p = product.trim().toLowerCase();
                matchesProduct = productNames.stream().anyMatch(prod -> prod.toLowerCase().contains(p));
            }

            boolean matchesStatus = true;
            if (status != null && !status.trim().isBlank() && !"All".equalsIgnoreCase(status)) {
                if ("APPROVED".equalsIgnoreCase(status)) {
                    matchesStatus = approved > 0;
                } else if ("PENDING".equalsIgnoreCase(status)) {
                    matchesStatus = pending > 0;
                } else if ("REJECTED".equalsIgnoreCase(status)) {
                    matchesStatus = rejected > 0;
                } else if ("NONE".equalsIgnoreCase(status)) {
                    matchesStatus = userRequests.isEmpty();
                }
            }

            if (matchesSearch && matchesArea && matchesProduct && matchesStatus) {
                Map<String, Object> map = new HashMap<>();
                map.put("id", u.getId());
                map.put("name", u.getName());
                map.put("email", u.getEmail());
                map.put("phone", u.getPhone());
                map.put("age", u.getAge());
                map.put("address", u.getAddress());
                map.put("area", customerArea);
                map.put("role", u.getRole());
                map.put("memberSince", u.getMemberSince() != null ? u.getMemberSince() : "Active");
                map.put("createdAt", u.getCreatedAt());
                map.put("totalPurchases", totalPurchases);
                map.put("totalSpent", effectiveSpent);
                map.put("requestsCount", userRequests.size());
                map.put("approvedCount", approved);
                map.put("pendingCount", pending);
                map.put("rejectedCount", rejected);
                map.put("products", new ArrayList<>(productNames));
                map.put("stores", new ArrayList<>(storeNames));
                map.put("hasActiveWarranty", approved > 0);
                map.put("requests", userRequests);
                map.put("cardsCount", userCards.size());
                result.add(map);
            }
        }

        return ResponseEntity.ok(result);
    }

    /**
     * Get single customer with entire 360 history, warranty requests, cards, and audit logs
     */
    @GetMapping("/{id}")
    public ResponseEntity<?> getCustomerById(@PathVariable("id") Long id) {
        Optional<User> userOpt = userRepository.findById(id);
        if (userOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        User user = userOpt.get();
        List<WarrantyRequest> requests = warrantyRequestRepository.findByUserIdOrderBySubmissionDateDesc(user.getId());
        List<WarrantyCard> cards = warrantyCardRepository.findByUserIdOrderByIssuedAtDesc(user.getId());

        // Gather all timeline events and notifications for this customer's requests
        List<TimelineEvent> allTimeline = new ArrayList<>();
        List<NotificationLog> allNotifications = new ArrayList<>();

        for (WarrantyRequest r : requests) {
            allTimeline.addAll(timelineEventRepository.findByWarrantyRequestIdOrderByStepOrderAsc(r.getId()));
            allNotifications.addAll(notificationLogRepository.findByWarrantyRequestIdOrderBySentAtDesc(r.getId()));
        }

        Map<String, Object> response = new HashMap<>();
        response.put("customer", user);
        response.put("requests", requests);
        response.put("cards", cards);
        response.put("timeline", allTimeline);
        response.put("notifications", allNotifications);
        response.put("area", extractArea(user.getAddress()));

        return ResponseEntity.ok(response);
    }

    /**
     * Get aggregate statistics for Customer 360 header
     */
    @GetMapping("/stats")
    public ResponseEntity<?> getCustomerStats() {
        List<User> customers = userRepository.findByRole("CUSTOMER");
        List<WarrantyRequest> allRequests = warrantyRequestRepository.findAll();
        List<WarrantyCard> allCards = warrantyCardRepository.findAll();

        BigDecimal totalSpent = BigDecimal.ZERO;
        for (WarrantyRequest r : allRequests) {
            if (r.getPurchasePrice() != null) {
                totalSpent = totalSpent.add(r.getPurchasePrice());
            }
        }

        long activeWarranties = allCards.stream()
                .filter(c -> c.getValidTill() != null && !c.getValidTill().isBefore(java.time.LocalDate.now()))
                .count();
        long pendingClaims = allRequests.stream().filter(r -> "PENDING".equalsIgnoreCase(r.getStatus())).count();

        Map<String, Object> stats = new HashMap<>();
        stats.put("totalCustomers", customers.size());
        stats.put("totalSystems", allRequests.size());
        stats.put("activeWarranties", activeWarranties > 0 ? activeWarranties : allCards.size());
        stats.put("pendingClaims", pendingClaims);
        stats.put("totalSpent", totalSpent);

        return ResponseEntity.ok(stats);
    }

    /**
     * Search endpoint for quick lookup by phone or email
     */
    @GetMapping("/search")
    public ResponseEntity<?> searchCustomer(@RequestParam("phone") String phone) {
        String query = phone != null ? phone.trim() : "";
        Optional<User> userOpt = userRepository.findByPhone(query);

        if (userOpt.isEmpty()) {
            userOpt = userRepository.findByEmail(query);
        }

        if (userOpt.isPresent()) {
            User user = userOpt.get();
            return getCustomerById(user.getId());
        }

        return ResponseEntity.notFound().build();
    }

    private String extractArea(String address) {
        if (address == null || address.isBlank()) return "Bangalore";
        String lower = address.toLowerCase();
        if (lower.contains("bangalore") || lower.contains("bengaluru")) return "Bangalore";
        if (lower.contains("mysore") || lower.contains("mysuru")) return "Mysore";
        if (lower.contains("mangalore") || lower.contains("mangaluru")) return "Mangalore";
        if (lower.contains("hubli") || lower.contains("hubballi")) return "Hubli";
        if (lower.contains("pune")) return "Pune";
        if (lower.contains("mumbai")) return "Mumbai";
        if (lower.contains("hyderabad")) return "Hyderabad";
        if (lower.contains("chennai")) return "Chennai";
        if (lower.contains("delhi")) return "Delhi";

        String[] parts = address.split(",");
        if (parts.length > 1) {
            return parts[parts.length - 1].replaceAll("[0-9-]", "").trim();
        }
        return "Bangalore";
    }

    /**
     * Update customer profile fields (name, age, address)
     */
    @PutMapping("/{id}/profile")
    public ResponseEntity<Map<String, Object>> updateProfile(
            @PathVariable("id") Long id,
            @RequestBody Map<String, Object> body) {

        Optional<User> opt = userRepository.findById(id);
        if (opt.isEmpty()) {
            Map<String, Object> err = new HashMap<>();
            err.put("error", "Customer not found");
            return ResponseEntity.status(404).body(err);
        }

        User user = opt.get();

        if (body.containsKey("name") && body.get("name") != null) {
            String name = body.get("name").toString().trim();
            if (!name.isEmpty()) user.setName(name);
        }
        if (body.containsKey("age") && body.get("age") != null) {
            try {
                user.setAge(Integer.parseInt(body.get("age").toString()));
            } catch (NumberFormatException ignored) {}
        }
        if (body.containsKey("address") && body.get("address") != null) {
            user.setAddress(body.get("address").toString().trim());
        }

        User saved = userRepository.save(user);

        Map<String, Object> resp = new HashMap<>();
        resp.put("success", true);
        resp.put("id", saved.getId());
        resp.put("name", saved.getName());
        resp.put("age", saved.getAge());
        resp.put("address", saved.getAddress());
        resp.put("email", saved.getEmail());
        resp.put("phone", saved.getPhone());
        resp.put("role", saved.getRole());
        resp.put("createdAt", saved.getCreatedAt() != null ? saved.getCreatedAt().toString() : null);
        return ResponseEntity.ok(resp);
    }
}
