# ==============================================================================
# Multi-stage Dockerfile for Spring Boot Backend
# ==============================================================================

# Stage 1: Build JAR using Maven and Temurin JDK 17
FROM maven:3.9.6-eclipse-temurin-17-alpine AS builder
WORKDIR /app

# Cache dependencies layer
COPY pom.xml .
RUN mvn dependency:go-offline -B

# Copy source code and build production artifact
COPY src ./src
RUN mvn clean package -DskipTests

# Stage 2: Minimal Production JRE Runtime
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app

# Ensure uploads directory structure exists
RUN mkdir -p /app/uploads/bills

# Copy compiled jar from builder stage
COPY --from=builder /app/target/*.jar app.jar

# Expose Spring Boot port
EXPOSE 8085

# Mount uploads directory for persistent storage
VOLUME ["/app/uploads"]

# Run the application
ENTRYPOINT ["java", "-jar", "app.jar"]
