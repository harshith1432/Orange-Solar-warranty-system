package com.ewarranty.controller;

import com.ewarranty.entity.NotificationLog;
import com.ewarranty.service.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notifications")
public class NotificationController {

    @Autowired
    private NotificationService notificationService;

    @GetMapping
    public ResponseEntity<List<NotificationLog>> getAllLogs() {
        return ResponseEntity.ok(notificationService.getAllLogs());
    }

    @GetMapping("/request/{requestId}")
    public ResponseEntity<List<NotificationLog>> getLogsByRequest(@PathVariable Long requestId) {
        return ResponseEntity.ok(notificationService.getLogsByRequestId(requestId));
    }
}
