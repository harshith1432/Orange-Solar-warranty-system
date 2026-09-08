package com.ewarranty.controller;

import com.ewarranty.dto.LoginRequest;
import com.ewarranty.dto.LoginResponse;
import com.ewarranty.dto.RegisterRequest;
import com.ewarranty.entity.User;
import com.ewarranty.repository.UserRepository;
import com.ewarranty.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtUtil jwtUtil;

    @Value("${app.admin.email:admin@gmail.com}")
    private String adminEmail;

    @Value("${app.admin.password:Admin@123}")
    private String adminPassword;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest req) {
        if (req.getEmail() == null || req.getPassword() == null) {
            return ResponseEntity.badRequest().body(new LoginResponse(false, "Email and password are required", null, null));
        }

        String inputEmail = req.getEmail().trim();
        String inputPassword = req.getPassword();

        Optional<User> userOpt = userRepository.findByEmail(inputEmail);

        if (userOpt.isEmpty()) {
            userOpt = userRepository.findByPhone(inputEmail);
        }

        if (userOpt.isPresent()) {
            User user = userOpt.get();
            boolean isPasswordCorrect;
            if ("ADMIN".equalsIgnoreCase(user.getRole())) {
                isPasswordCorrect = inputPassword.equals(user.getPassword()) || inputPassword.equals(adminPassword);
            } else {
                isPasswordCorrect = inputPassword.equals(user.getPassword());
            }

            if (isPasswordCorrect) {
                String token = jwtUtil.generateToken(user);
                return ResponseEntity.ok(new LoginResponse(true, "Login successful", token, user));
            }
        } else if (inputEmail.equalsIgnoreCase(adminEmail) && inputPassword.equals(adminPassword)) {
            // Self-healing: create admin user in database if not yet present
            User admin = new User("Orange Solar Administrator", adminEmail, "9900112233", adminPassword, "ADMIN");
            userRepository.save(admin);
            String token = jwtUtil.generateToken(admin);
            return ResponseEntity.ok(new LoginResponse(true, "Login successful", token, admin));
        }

        return ResponseEntity.status(401).body(new LoginResponse(false, "Invalid email or password", null, null));
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest req) {
        if (req.getEmail() == null || req.getPassword() == null || req.getName() == null || req.getPhone() == null) {
            return ResponseEntity.badRequest().body(Map.of("success", false, "message", "Name, email, phone, and password are required"));
        }

        if (userRepository.findByEmail(req.getEmail().trim()).isPresent()) {
            return ResponseEntity.badRequest().body(Map.of("success", false, "message", "An account with this email already exists"));
        }

        if (userRepository.findByPhone(req.getPhone().trim()).isPresent()) {
            return ResponseEntity.badRequest().body(Map.of("success", false, "message", "An account with this phone number already exists"));
        }

        User newUser = new User();
        newUser.setName(req.getName().trim());
        newUser.setEmail(req.getEmail().trim().toLowerCase());
        newUser.setPhone(req.getPhone().trim());
        newUser.setPassword(req.getPassword());
        newUser.setRole("CUSTOMER"); // All registrations create Customer accounts
        newUser.setAge(req.getAge() != null ? req.getAge() : 25);
        newUser.setAddress(req.getAddress() != null ? req.getAddress() : "Bangalore, Karnataka");
        newUser.setTotalPurchases(0);
        newUser.setTotalSpent(BigDecimal.ZERO);
        newUser.setMemberSince(LocalDateTime.now().getDayOfMonth() + " " + LocalDateTime.now().getMonth().name().substring(0, 3) + " " + LocalDateTime.now().getYear());
        newUser.setCreatedAt(LocalDateTime.now());

        User savedUser = userRepository.save(newUser);

        // Generate JWT token for immediate authenticated session
        String token = jwtUtil.generateToken(savedUser);

        Map<String, Object> resp = new HashMap<>();
        resp.put("success", true);
        resp.put("message", "Registration completed successfully");
        resp.put("token", token);
        resp.put("user", savedUser);

        return ResponseEntity.ok(resp);
    }

    @GetMapping("/verify-token")
    public ResponseEntity<?> verifyToken(@RequestHeader(value = "Authorization", required = false) String authHeader) {
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return ResponseEntity.status(401).body(Map.of("valid", false, "message", "Missing or malformed Authorization header"));
        }

        String token = authHeader.substring(7);
        if (!jwtUtil.isTokenValid(token)) {
            return ResponseEntity.status(401).body(Map.of("valid", false, "message", "Token expired or invalid"));
        }

        String email = jwtUtil.extractEmail(token);
        Optional<User> userOpt = userRepository.findByEmail(email);

        if (userOpt.isPresent()) {
            User user = userOpt.get();
            Map<String, Object> resp = new HashMap<>();
            resp.put("valid", true);
            resp.put("user", user);
            resp.put("role", user.getRole());
            return ResponseEntity.ok(resp);
        }

        return ResponseEntity.status(404).body(Map.of("valid", false, "message", "User not found"));
    }

    @GetMapping("/user/{id}")
    public ResponseEntity<?> getUser(@PathVariable Long id) {
        return userRepository.findById(id)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }
}
