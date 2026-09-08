package com.ewarranty.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.*;

@RestController
@RequestMapping("/api/upload")
public class FileUploadController {

    private final Path uploadDirectory = Paths.get("uploads", "bills");

    public FileUploadController() {
        try {
            Files.createDirectories(uploadDirectory);
        } catch (IOException e) {
            System.err.println("Could not create uploads directory: " + e.getMessage());
        }
    }

    @PostMapping("/bill")
    public ResponseEntity<?> uploadBillPhoto(@RequestParam("file") MultipartFile file) {
        if (file == null || file.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("message", "Please select a bill photo or invoice to upload."));
        }

        String originalFilename = file.getOriginalFilename();
        String ext = "";
        if (originalFilename != null && originalFilename.contains(".")) {
            ext = originalFilename.substring(originalFilename.lastIndexOf(".")).toLowerCase();
        }

        List<String> allowedExtensions = Arrays.asList(".jpg", ".jpeg", ".png", ".webp", ".pdf");
        if (!allowedExtensions.contains(ext)) {
            return ResponseEntity.badRequest().body(Map.of("message", "Only image files (.jpg, .jpeg, .png, .webp) and PDF documents are allowed."));
        }

        try {
            Files.createDirectories(uploadDirectory);
            String uniqueName = "bill_" + System.currentTimeMillis() + "_" + UUID.randomUUID().toString().substring(0, 8) + ext;
            Path targetPath = uploadDirectory.resolve(uniqueName);
            Files.copy(file.getInputStream(), targetPath);

            String publicUrl = "/uploads/bills/" + uniqueName;
            Map<String, Object> response = new HashMap<>();
            response.put("url", publicUrl);
            response.put("fileName", originalFilename);
            response.put("size", file.getSize());
            response.put("status", "SUCCESS");

            return ResponseEntity.ok(response);
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "Failed to store bill photo: " + e.getMessage()));
        }
    }
}