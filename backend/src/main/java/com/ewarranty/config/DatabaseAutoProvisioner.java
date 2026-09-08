package com.ewarranty.config;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.Statement;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * Automatically detects if the target PostgreSQL database exists before
 * Spring Boot's main DataSource connects. If missing, it creates the database.
 */
public class DatabaseAutoProvisioner {

    private static final Pattern JDBC_PATTERN = Pattern.compile("^jdbc:postgresql://([^/?]+)(?:/([^?]*))?(?:\\?(.*))?$");

    public static void main(String[] args) {
        provisionDatabaseIfMissing();
    }

    public static void provisionDatabaseIfMissing() {
        String jdbcUrl = System.getProperty("SPRING_DATASOURCE_URL");
        if (jdbcUrl == null || jdbcUrl.isBlank()) {
            jdbcUrl = System.getenv("SPRING_DATASOURCE_URL");
        }
        if (jdbcUrl == null || jdbcUrl.isBlank()) {
            jdbcUrl = "jdbc:postgresql://127.0.0.1:5432/orange";
        }

        String username = System.getProperty("SPRING_DATASOURCE_USERNAME");
        if (username == null || username.isBlank()) {
            username = System.getenv("SPRING_DATASOURCE_USERNAME");
        }
        if (username == null || username.isBlank()) {
            username = "postgres";
        }

        String password = System.getProperty("SPRING_DATASOURCE_PASSWORD");
        if (password == null || password.isBlank()) {
            password = System.getenv("SPRING_DATASOURCE_PASSWORD");
        }
        if (password == null || password.isBlank()) {
            password = "Harshith@1432";
        }

        Matcher matcher = JDBC_PATTERN.matcher(jdbcUrl);
        if (!matcher.matches()) {
            System.out.println("[DATABASE PROVISIONER] Notice: Non-standard JDBC URL format, skipping auto-creation: " + jdbcUrl);
            return;
        }

        String hostAndPort = matcher.group(1);
        String targetDb = matcher.group(2);
        String queryParams = matcher.group(3);

        if (targetDb == null || targetDb.isBlank() || targetDb.equalsIgnoreCase("postgres")) {
            return;
        }

        // Validate database name against alphanumeric and underscores to prevent SQL injection
        if (!targetDb.matches("^[a-zA-Z0-9_]+$")) {
            System.err.println("[DATABASE PROVISIONER] Warning: Database name contains invalid characters: " + targetDb);
            return;
        }

        String maintenanceUrl = "jdbc:postgresql://" + hostAndPort + "/postgres" + (queryParams != null ? "?" + queryParams : "");

        System.out.println("[DATABASE PROVISIONER] Checking database status for '" + targetDb + "' on " + hostAndPort + "...");

        int maxRetries = 5;
        int attempt = 0;
        boolean connected = false;

        while (attempt < maxRetries && !connected) {
            attempt++;
            try (Connection conn = DriverManager.getConnection(maintenanceUrl, username, password)) {
                connected = true;

                // 1. Check if database exists
                boolean exists = false;
                String checkSql = "SELECT 1 FROM pg_database WHERE datname = ?";
                try (PreparedStatement checkStmt = conn.prepareStatement(checkSql)) {
                    checkStmt.setString(1, targetDb);
                    try (ResultSet rs = checkStmt.executeQuery()) {
                        if (rs.next()) {
                            exists = true;
                        }
                    }
                }

                // 2. If database does not exist, create it
                if (!exists) {
                    System.out.println("[DATABASE PROVISIONER] Database '" + targetDb + "' was not found. Creating database '" + targetDb + "'...");
                    try (Statement stmt = conn.createStatement()) {
                        stmt.executeUpdate("CREATE DATABASE \"" + targetDb + "\"");
                    }
                    System.out.println("[DATABASE PROVISIONER] ✅ Database '" + targetDb + "' created successfully!");
                } else {
                    System.out.println("[DATABASE PROVISIONER] ✅ Database '" + targetDb + "' already exists. Reusing existing database.");
                }

            } catch (Exception e) {
                if (attempt < maxRetries) {
                    System.out.println("[DATABASE PROVISIONER] Waiting for PostgreSQL server to be ready (attempt " + attempt + "/" + maxRetries + "): " + e.getMessage());
                    try {
                        Thread.sleep(2000);
                    } catch (InterruptedException ignored) {
                        Thread.currentThread().interrupt();
                    }
                } else {
                    System.err.println("[DATABASE PROVISIONER] Warning: Could not connect to maintenance database to verify '" + targetDb + "': " + e.getMessage());
                }
            }
        }
    }
}
