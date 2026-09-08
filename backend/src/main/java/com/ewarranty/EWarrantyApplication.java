package com.ewarranty;

import com.ewarranty.config.DatabaseAutoProvisioner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import java.net.URI;
import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;

@SpringBootApplication
public class EWarrantyApplication {
    public static void main(String[] args) {
        loadDotenv();
        DatabaseAutoProvisioner.provisionDatabaseIfMissing();
        SpringApplication.run(EWarrantyApplication.class, args);
    }

    private static void loadDotenv() {
        String[] candidates = {".env", "../.env", "backend/.env"};
        for (String c : candidates) {
            Path p = Paths.get(c);
            if (Files.exists(p)) {
                try {
                    List<String> lines = Files.readAllLines(p, StandardCharsets.UTF_8);
                    for (String line : lines) {
                        line = line.trim();
                        if (line.isEmpty() || line.startsWith("#") || !line.contains("=")) {
                            continue;
                        }
                        int eq = line.indexOf('=');
                        String key = line.substring(0, eq).trim();
                        String val = line.substring(eq + 1).trim();
                        if (val.startsWith("\"") && val.endsWith("\"") && val.length() >= 2) {
                            val = val.substring(1, val.length() - 1);
                        } else if (val.startsWith("'") && val.endsWith("'") && val.length() >= 2) {
                            val = val.substring(1, val.length() - 1);
                        }
                        if (System.getProperty(key) == null && System.getenv(key) == null) {
                            System.setProperty(key, val);
                        }
                    }
                    System.out.println("[ENV] Loaded environment configuration from: " + p.toAbsolutePath());
                    break;
                } catch (Exception e) {
                    System.err.println("[ENV] Warning reading " + p + ": " + e.getMessage());
                }
            }
        }

        // Support standard DATABASE_URL format: postgresql://user:pass@host:port/dbname
        String dbUrl = System.getProperty("DATABASE_URL", System.getenv("DATABASE_URL"));
        if (dbUrl != null && (dbUrl.startsWith("postgresql://") || dbUrl.startsWith("postgres://"))) {
            try {
                URI uri = URI.create(dbUrl);
                String host = uri.getHost() != null ? uri.getHost() : "127.0.0.1";
                int port = uri.getPort() != -1 ? uri.getPort() : 5432;
                String dbPath = uri.getPath() != null && uri.getPath().length() > 1 ? uri.getPath().substring(1) : "orange";
                String jdbcUrl = "jdbc:postgresql://" + host + ":" + port + "/" + dbPath;
                System.setProperty("SPRING_DATASOURCE_URL", jdbcUrl);

                if (uri.getUserInfo() != null) {
                    String[] parts = uri.getUserInfo().split(":", 2);
                    String user = URLDecoder.decode(parts[0], StandardCharsets.UTF_8);
                    System.setProperty("SPRING_DATASOURCE_USERNAME", user);
                    if (parts.length > 1) {
                        String pass = URLDecoder.decode(parts[1], StandardCharsets.UTF_8);
                        System.setProperty("SPRING_DATASOURCE_PASSWORD", pass);
                    }
                }
                System.out.println("[ENV] Configured datasource from DATABASE_URL for database: " + dbPath);
            } catch (Exception ex) {
                System.err.println("[ENV] Notice: Could not parse DATABASE_URL: " + ex.getMessage());
            }
        }
    }
}
