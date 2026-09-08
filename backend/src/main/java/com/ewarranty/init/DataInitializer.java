package com.ewarranty.init;

import com.ewarranty.entity.*;
import com.ewarranty.repository.*;
import com.ewarranty.service.NotificationService;
import com.ewarranty.service.TimelineService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private WarrantyRequestRepository warrantyRequestRepository;

    @Autowired
    private WarrantyCardRepository warrantyCardRepository;

    @Autowired
    private TimelineService timelineService;

    @Autowired
    private NotificationService notificationService;

    @Value("${app.admin.email:admin@gmail.com}")
    private String adminEmail;

    @Value("${app.admin.password:Admin@123}")
    private String adminPassword;

    @Override
    public void run(String... args) throws Exception {
        // 1. Seed or Update Admin User with credentials configured from .env
        String targetAdminEmail = (adminEmail != null && !adminEmail.isBlank()) ? adminEmail.trim() : "admin@gmail.com";
        String targetAdminPass = (adminPassword != null && !adminPassword.isBlank()) ? adminPassword.trim() : "Admin@123";

        Optional<User> existingAdmin = userRepository.findByEmail(targetAdminEmail);
        User admin;
        if (existingAdmin.isPresent()) {
            admin = existingAdmin.get();
            admin.setPassword(targetAdminPass);
            admin.setRole("ADMIN");
            userRepository.save(admin);
            System.out.println("[ADMIN SYNC] Updated admin user " + targetAdminEmail + " with password from env configuration.");
        } else {
            Optional<User> oldAdmin = userRepository.findByEmail("admin@ewarranty.com");
            if (oldAdmin.isPresent()) {
                admin = oldAdmin.get();
                admin.setEmail(targetAdminEmail);
                admin.setPassword(targetAdminPass);
                admin.setRole("ADMIN");
                userRepository.save(admin);
                System.out.println("[ADMIN SYNC] Migrated existing admin user to " + targetAdminEmail + " with password from env configuration.");
            } else {
                admin = new User("Orange Solar Administrator", targetAdminEmail, "9900112233", targetAdminPass, "ADMIN");
                userRepository.save(admin);
                System.out.println("[ADMIN SYNC] Created new admin user " + targetAdminEmail + " with password from env configuration.");
            }
        }

        User rahul;
        if (userRepository.findByEmail("rahul@gmail.com").isEmpty()) {
            rahul = new User("Rahul Sharma", "rahul@gmail.com", "9876543210", "password123", "CUSTOMER");
            rahul.setAge(32);
            rahul.setAddress("56/1 Byadarahalli, Magadi Main Road, Bangalore - 560091");
            rahul.setTotalPurchases(3);
            rahul.setTotalSpent(new BigDecimal("145000"));
            rahul.setMemberSince("10 Jan 2024");
            userRepository.save(rahul);
        } else {
            rahul = userRepository.findByEmail("rahul@gmail.com").get();
        }

        User priya;
        if (userRepository.findByEmail("priya@gmail.com").isEmpty()) {
            priya = new User("Priya Patel", "priya@gmail.com", "9811223344", "password123", "CUSTOMER");
            priya.setAge(29);
            priya.setAddress("45, Rajajinagar 2nd Block, Bangalore - 560010");
            priya.setTotalPurchases(1);
            priya.setTotalSpent(new BigDecimal("42000"));
            priya.setMemberSince("15 Feb 2024");
            userRepository.save(priya);
        } else {
            priya = userRepository.findByEmail("priya@gmail.com").get();
        }

        // Seed diverse customer dataset for pagination, search, and area filtering
        seedCustomerIfMissing("Suresh Kumar", "suresh.kumar@gmail.com", "9845012345", 42, "12, Gokulam 3rd Stage, Mysore - 570002", 2, new BigDecimal("88400"), "12 Jan 2024");
        seedCustomerIfMissing("Ananya Hegde", "ananya.hegde@gmail.com", "9845123456", 34, "78, Kadri Hills, Mangalore - 575004", 1, new BigDecimal("34500"), "20 Jan 2024");
        seedCustomerIfMissing("Ramesh Patil", "ramesh.patil@gmail.com", "9845234567", 51, "90/A, Vidyanagar, Hubli - 580021", 2, new BigDecimal("58500"), "02 Feb 2024");
        seedCustomerIfMissing("Vikram Desai", "vikram.desai@gmail.com", "9822012345", 38, "Plot 44, Baner Road, Pune - 411045", 1, new BigDecimal("27500"), "14 Feb 2024");
        seedCustomerIfMissing("Sneha Kulkarni", "sneha.k@gmail.com", "9822123456", 31, "23, Kothrud, Pune - 411038", 3, new BigDecimal("112000"), "01 Mar 2024");
        seedCustomerIfMissing("Karthik Reddy", "karthik.reddy@gmail.com", "9849012345", 36, "8-2-293, Banjara Hills Road 12, Hyderabad - 500034", 2, new BigDecimal("97000"), "18 Mar 2024");
        seedCustomerIfMissing("Meenakshi S", "meenakshi.s@gmail.com", "9840012345", 45, "15, Anna Nagar West, Chennai - 600040", 1, new BigDecimal("48500"), "25 Mar 2024");
        seedCustomerIfMissing("Rajesh Mehta", "rajesh.mehta@gmail.com", "9820012345", 48, "B-204, Powai Vihar, Mumbai - 400076", 2, new BigDecimal("82900"), "05 Apr 2024");
        seedCustomerIfMissing("Neha Verma", "neha.verma@gmail.com", "9810012345", 28, "C-12, Vasant Kunj, Delhi - 110070", 1, new BigDecimal("21000"), "15 Apr 2024");
        seedCustomerIfMissing("Amit Joshi", "amit.joshi@gmail.com", "9845345678", 39, "102, Indiranagar 100ft Road, Bangalore - 560038", 2, new BigDecimal("74000"), "02 May 2024");
        seedCustomerIfMissing("Kavita Nair", "kavita.nair@gmail.com", "9845456789", 35, "67, Koramangala 4th Block, Bangalore - 560034", 1, new BigDecimal("39900"), "20 May 2024");
        seedCustomerIfMissing("Harish Gowda", "harish.gowda@gmail.com", "9845567890", 44, "34, Saraswathipuram, Mysore - 570009", 1, new BigDecimal("21000"), "10 Jun 2024");

        // 2. Clean up old mock electronics (Smartphone, Laptop, etc.)
        List<Product> existingProducts = productRepository.findAll();
        for (Product p : existingProducts) {
            if (p.getName().contains("Smartphone") || p.getName().contains("Laptop") || 
                p.getName().contains("Headphones") || p.getName().contains("Smartwatch")) {
                p.setActive(false);
                productRepository.save(p);
            }
        }

        // 3. Seed / Update Authentic Orange Solar Catalog
        seedOrUpdateProduct("Diamond Glass Line Ultimate Solar Water Heater", "OS-ETC-ULT200", 
            "Solar Water Heater (ETC)", new BigDecimal("48500"), 120, "OS-ULT",
            "Highest grade corrosion-resistant inner tank with patented Diamond Glass Lining technology, high-absorption 3-target evacuated tubes, and 10-year comprehensive warranty.",
            "Orange Solar Authorized Dealer - Bangalore",
            "https://images.unsplash.com/photo-1508873696983-2df5293cb32f?w=600&auto=format&fit=crop&q=80");

        seedOrUpdateProduct("Diamond Glass Line Solar Water Heater", "OS-ETC-DGL200", 
            "Solar Water Heater (ETC)", new BigDecimal("39900"), 84, "OS-DGL",
            "Premium ETC solar water heater engineered for hard water conditions with enamel glass lined tank and high thermal efficiency.",
            "Orange Solar Authorized Dealer - Bangalore",
            "https://images.unsplash.com/photo-1613665813446-82a78c468a1d?w=600&auto=format&fit=crop&q=80");

        seedOrUpdateProduct("Prime Ceramic Solar Water Heater", "OS-ETC-PRM200", 
            "Solar Water Heater (ETC)", new BigDecimal("34500"), 60, "OS-PRM",
            "Heavy-duty ceramic coated inner tank protecting against scale and rust, suitable for residential domestic hot water needs.",
            "Orange Solar Direct Store",
            "https://images.unsplash.com/photo-1509391365360-2e959784a276?w=600&auto=format&fit=crop&q=80");

        seedOrUpdateProduct("Eco Deluxe Solar Water Heater", "OS-ETC-ECO150", 
            "Solar Water Heater (ETC)", new BigDecimal("27500"), 60, "OS-ECO",
            "Cost-effective and energy-saving vacuum tube solar heating solution with polyurethane foam insulation for maximum heat retention.",
            "Orange Solar Official Retail",
            "https://images.unsplash.com/photo-1497440001374-f26997328c1b?w=600&auto=format&fit=crop&q=80");

        seedOrUpdateProduct("Mitra Solar Water Heater", "OS-ETC-MTR100", 
            "Solar Water Heater (ETC)", new BigDecimal("21000"), 36, "OS-MTR",
            "Compact and efficient compact solar water heater ideal for small families and independent homes.",
            "Orange Solar Dealership Hub",
            "https://images.unsplash.com/photo-1545208942-e1c9c916524b?w=600&auto=format&fit=crop&q=80");

        seedOrUpdateProduct("Non Pressurised Solar Water Heater", "OS-FPC-NP200", 
            "Solar Water Heater (FPC)", new BigDecimal("44000"), 60, "OS-FPC",
            "Flat Plate Collector (FPC) with copper-riser ultrasound welded fins, toughened solar glass, and weather-proof aluminum casing.",
            "Sun Zone Solar System India Pvt Ltd",
            "https://images.unsplash.com/photo-1508873696983-2df5293cb32f?w=600&auto=format&fit=crop&q=80");

        seedOrUpdateProduct("Pressurised Solar Water Heater", "OS-FPC-PR300", 
            "Solar Water Heater (FPC)", new BigDecimal("68000"), 84, "OS-PRS",
            "High pressure FPC solar water heater designed for modern pressure pump and luxury bathroom shower installations.",
            "Sun Zone Solar System India Pvt Ltd",
            "https://images.unsplash.com/photo-1613665813446-82a78c468a1d?w=600&auto=format&fit=crop&q=80");

        seedOrUpdateProduct("Domestic Heat Pump Water Heater", "OS-HP-DOM200", 
            "Heat Pump", new BigDecimal("78000"), 36, "OS-HP",
            "Eco-friendly hybrid heat pump using ambient air to heat water with up to 75% energy savings compared to conventional heaters.",
            "Sun Zone Solar System India Pvt Ltd",
            "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=600&auto=format&fit=crop&q=80");

        seedOrUpdateProduct("On-Grid Solar Rooftop Power Plant 5kW", "OS-RT-ON5KW", 
            "Solar Rooftop Systems", new BigDecimal("265000"), 300, "OS-RTG",
            "Complete grid-tied rooftop solar system with Tier-1 bifacial panels, smart micro-inverters, net metering support, and 25-year linear performance warranty.",
            "Orange Solar Renewable Solutions",
            "https://images.unsplash.com/photo-1509391365360-2e959784a276?w=600&auto=format&fit=crop&q=80");

        // 4. Update or Seed Sample Warranty Request & Certificate with real Orange Solar product
        Product diamondProduct = productRepository.findAll().stream()
            .filter(p -> p.getModel().equals("OS-ETC-ULT200"))
            .findFirst()
            .orElse(null);

        if (diamondProduct != null && warrantyCardRepository.count() == 0) {
            WarrantyRequest req1 = new WarrantyRequest();
            req1.setRequestId("REQ12345");
            req1.setUser(rahul);
            req1.setProduct(diamondProduct);
            req1.setProductName(diamondProduct.getName());
            req1.setProductModel(diamondProduct.getModel());
            req1.setSerialNumber("OS-ULT-984210");
            req1.setPurchaseDate(LocalDate.of(2024, 4, 15));
            req1.setStoreName("Orange Solar Authorized Dealer - Bangalore");
            req1.setPurchasePrice(diamondProduct.getPrice());
            req1.setStatus("APPROVED");
            req1.setSubmissionDate(LocalDateTime.now().minusDays(10));
            req1.setReviewedAt(LocalDateTime.now().minusDays(9));
            warrantyRequestRepository.save(req1);

            WarrantyCard card1 = new WarrantyCard();
            card1.setCertificateNo("OS-WAR-2024-8841");
            card1.setWarrantyRequest(req1);
            card1.setUser(rahul);
            card1.setProduct(diamondProduct);
            card1.setProductName(diamondProduct.getName() + " (OS-ETC-ULT200)");
            card1.setSerialNumber("OS-ULT-984210");
            card1.setWarrantyPeriod("10 Years (120 Months)");
            card1.setValidFrom(LocalDate.of(2024, 4, 15));
            card1.setValidTill(LocalDate.of(2034, 4, 14));
            card1.setStoreName("Orange Solar Authorized Dealer - Bangalore");
            card1.setVerificationCode("OS-VER-8841");
            card1.setQrPayload("http://localhost:5173/verify/OS-WAR-2024-8841");
            card1.setIssuedAt(LocalDateTime.now().minusDays(9));
            warrantyCardRepository.save(card1);
            req1.setWarrantyCard(card1);
            warrantyRequestRepository.save(req1);

            timelineService.initializeTimeline(req1);
            timelineService.markTimelineApproved(req1, card1);
            notificationService.dispatchWarrantyGeneratedNotifications(req1, card1, true, true, true);

            // Seed a pending request for demonstration
            Product ecoProduct = productRepository.findAll().stream()
                .filter(p -> p.getModel().equals("OS-ETC-ECO150"))
                .findFirst()
                .orElse(diamondProduct);

            WarrantyRequest req2 = new WarrantyRequest();
            req2.setRequestId("REQ12348");
            req2.setUser(rahul);
            req2.setProduct(ecoProduct);
            req2.setProductName(ecoProduct.getName());
            req2.setProductModel(ecoProduct.getModel());
            req2.setSerialNumber("OS-ECO-552109");
            req2.setPurchaseDate(LocalDate.of(2024, 5, 20));
            req2.setStoreName("Orange Solar Official Retail");
            req2.setPurchasePrice(ecoProduct.getPrice());
            req2.setStatus("PENDING");
            req2.setSubmissionDate(LocalDateTime.now().minusHours(4));
            warrantyRequestRepository.save(req2);
            timelineService.initializeTimeline(req2);
        }
    }

    private void seedOrUpdateProduct(String name, String model, String category, BigDecimal price, 
                                     int warrantyMonths, String serialPrefix, String desc, String store, String imageUrl) {
        Product p = productRepository.findAll().stream()
            .filter(item -> item.getModel().equals(model))
            .findFirst()
            .orElse(new Product());

        p.setName(name);
        p.setModel(model);
        p.setCategory(category);
        p.setPrice(price);
        p.setDefaultWarrantyMonths(warrantyMonths);
        p.setSerialPrefix(serialPrefix);
        p.setDescription(desc);
        p.setStoreName(store);
        p.setImageUrl(imageUrl);
        p.setActive(true);
        productRepository.save(p);
    }

    private void seedCustomerIfMissing(String name, String email, String phone, int age, String address, 
                                       int purchases, BigDecimal spent, String memberSince) {
        if (userRepository.findByEmail(email).isEmpty()) {
            User u = new User(name, email, phone, "password123", "CUSTOMER");
            u.setAge(age);
            u.setAddress(address);
            u.setTotalPurchases(purchases);
            u.setTotalSpent(spent);
            u.setMemberSince(memberSince);
            userRepository.save(u);

            // Also attach a realistic solar system request to demonstrate products & warranty ledger
            List<Product> products = productRepository.findAll();
            if (!products.isEmpty()) {
                Product chosenProduct = products.get((int) (Math.abs(u.getId() != null ? u.getId() : name.hashCode()) % products.size()));
                WarrantyRequest wr = new WarrantyRequest();
                wr.setRequestId("REQ" + (20000 + Math.abs(name.hashCode() % 80000)));
                wr.setUser(u);
                wr.setProduct(chosenProduct);
                wr.setProductName(chosenProduct.getName());
                wr.setProductModel(chosenProduct.getModel());
                wr.setSerialNumber(chosenProduct.getSerialPrefix() + "-" + (100000 + Math.abs(name.hashCode() % 900000)));
                wr.setPurchaseDate(LocalDate.now().minusMonths((purchases * 2) % 12 + 1));
                wr.setStoreName(chosenProduct.getStoreName() != null ? chosenProduct.getStoreName() : "Orange Solar Dealership Hub");
                wr.setPurchasePrice(chosenProduct.getPrice());
                wr.setStatus(purchases > 1 ? "APPROVED" : "PENDING");
                wr.setSubmissionDate(LocalDateTime.now().minusDays(purchases * 4));
                warrantyRequestRepository.save(wr);

                if ("APPROVED".equals(wr.getStatus())) {
                    WarrantyCard card = new WarrantyCard();
                    card.setCertificateNo("OS-WAR-2024-" + (1000 + Math.abs(name.hashCode() % 9000)));
                    card.setWarrantyRequest(wr);
                    card.setUser(u);
                    card.setProduct(chosenProduct);
                    card.setProductName(chosenProduct.getName());
                    card.setSerialNumber(wr.getSerialNumber());
                    card.setWarrantyPeriod(chosenProduct.getDefaultWarrantyMonths() + " Months");
                    card.setStoreName(wr.getStoreName());
                    card.setValidFrom(wr.getPurchaseDate());
                    card.setValidTill(wr.getPurchaseDate().plusMonths(chosenProduct.getDefaultWarrantyMonths()));
                    card.setQrPayload("http://localhost:5173/verify/" + card.getCertificateNo());
                    card.setIssuedAt(LocalDateTime.now().minusDays(purchases * 3));
                    warrantyCardRepository.save(card);
                    wr.setWarrantyCard(card);
                    warrantyRequestRepository.save(wr);
                }
            }
        }
    }
}
