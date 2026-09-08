package com.ewarranty.controller;

import com.ewarranty.dto.ApprovalDto;
import com.ewarranty.dto.RejectionDto;
import com.ewarranty.dto.WarrantyApplicationDto;
import com.ewarranty.dto.WarrantyDetailsResponse;
import com.ewarranty.entity.WarrantyCard;
import com.ewarranty.entity.WarrantyRequest;
import com.ewarranty.service.WarrantyService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/warranties")
public class WarrantyController {

    @Autowired
    private WarrantyService warrantyService;

    @GetMapping
    public ResponseEntity<List<WarrantyRequest>> getAllRequests(@RequestParam(required = false) String status) {
        return ResponseEntity.ok(warrantyService.getAllRequests(status));
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<WarrantyRequest>> getRequestsByUser(@PathVariable Long userId) {
        return ResponseEntity.ok(warrantyService.getRequestsByUser(userId));
    }

    @GetMapping("/cards/user/{userId}")
    public ResponseEntity<List<WarrantyCard>> getCardsByUser(@PathVariable Long userId) {
        return ResponseEntity.ok(warrantyService.getCardsByUser(userId));
    }

    @GetMapping("/cards/all")
    public ResponseEntity<List<WarrantyCard>> getAllCards() {
        return ResponseEntity.ok(warrantyService.getAllCards());
    }

    @GetMapping("/{id}")
    public ResponseEntity<WarrantyDetailsResponse> getWarrantyDetails(@PathVariable Long id) {
        return ResponseEntity.ok(warrantyService.getWarrantyDetails(id));
    }

    @PostMapping
    public ResponseEntity<?> applyForWarranty(@RequestBody WarrantyApplicationDto dto) {
        try {
            WarrantyRequest created = warrantyService.applyForWarranty(dto);
            return ResponseEntity.ok(created);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @PostMapping("/{id}/approve")
    public ResponseEntity<WarrantyDetailsResponse> approveWarranty(
            @PathVariable Long id,
            @RequestBody(required = false) ApprovalDto dto) {
        if (dto == null) dto = new ApprovalDto();
        return ResponseEntity.ok(warrantyService.approveWarranty(id, dto));
    }

    @PostMapping("/{id}/reject")
    public ResponseEntity<WarrantyDetailsResponse> rejectWarranty(
            @PathVariable Long id,
            @RequestBody RejectionDto dto) {
        return ResponseEntity.ok(warrantyService.rejectWarranty(id, dto));
    }

    @GetMapping("/verify/{certificateNo}")
    public ResponseEntity<?> verifyCertificate(@PathVariable String certificateNo) {
        return warrantyService.getCardByCertificateNo(certificateNo)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getStats(@RequestParam(required = false) Long userId) {
        return ResponseEntity.ok(warrantyService.getDashboardStats(userId));
    }
}
