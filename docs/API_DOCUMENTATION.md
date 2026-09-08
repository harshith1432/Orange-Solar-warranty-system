# REST API Specification & Endpoint Documentation

The Orange Solar E-Warranty Backend exposes a standardized RESTful API under the `/api` prefix on port `8085`.

---

## 1. Authentication Endpoints (`/api/auth`)

### 1.1. Login User / Admin
- **Method**: `POST`
- **Path**: `/api/auth/login`
- **Request Body**:
  ```json
  {
    "email": "admin@gmail.com",
    "password": "Admin@123"
  }
  ```
- **Response (`200 OK`)**:
  ```json
  {
    "success": true,
    "token": "eyJhbGciOiJIUzI1NiJ9...",
    "user": {
      "id": 1,
      "name": "Orange Solar Admin",
      "email": "admin@gmail.com",
      "phone": "9900112233",
      "role": "ADMIN",
      "createdAt": "2026-09-08T22:53:13.265522"
    }
  }
  ```

### 1.2. Register New Customer
- **Method**: `POST`
- **Path**: `/api/auth/register`
- **Request Body**:
  ```json
  {
    "name": "Harshith D",
    "email": "harshith@example.com",
    "phone": "9845012345",
    "password": "Password@123",
    "address": "45, MG Road, Bangalore - 560001",
    "age": 28
  }
  ```
- **Response (`200 OK`)**:
  ```json
  {
    "success": true,
    "token": "eyJhbGciOiJIUzI1NiJ9...",
    "user": {
      "id": 5,
      "name": "Harshith D",
      "email": "harshith@example.com",
      "phone": "9845012345",
      "role": "CUSTOMER"
    }
  }
  ```

### 1.3. Verify JWT Token
- **Method**: `GET`
- **Path**: `/api/auth/verify-token`
- **Headers**: `Authorization: Bearer <token>`
- **Response (`200 OK`)**:
  ```json
  {
    "valid": true,
    "claims": {
      "id": 1,
      "sub": "admin@gmail.com",
      "role": "ADMIN",
      "name": "Orange Solar Admin"
    }
  }
  ```

---

## 2. Customer 360 & CRM Endpoints (`/api/customers`)

### 2.1. Get All Customers (with Filters)
- **Method**: `GET`
- **Path**: `/api/customers`
- **Query Parameters**:
  - `search` *(optional)*: Search by name, phone, email, address, or serial number
  - `area` *(optional)*: Filter by city/region (e.g. `Bangalore`, `Mysore`)
  - `product` *(optional)*: Filter by registered product name
  - `status` *(optional)*: Filter by warranty status (`APPROVED`, `PENDING`, `REJECTED`, `NONE`)
- **Response (`200 OK`)**: Array of customer objects enriched with purchase count, lifetime spend, equipment, and stores.

### 2.2. Get Single Customer 360 History
- **Method**: `GET`
- **Path**: `/api/customers/{id}`
- **Response (`200 OK`)**:
  ```json
  {
    "customer": { "id": 2, "name": "Ramesh Kumar", "phone": "9876543210", ... },
    "requests": [ ... ],
    "cards": [ ... ],
    "timeline": [ ... ],
    "notifications": [ ... ],
    "area": "Bangalore"
  }
  ```

### 2.3. Update Customer Profile
- **Method**: `PUT`
- **Path**: `/api/customers/{id}/profile`
- **Request Body**:
  ```json
  {
    "name": "Ramesh Kumar Updated",
    "age": 45,
    "address": "No. 42, 3rd Cross, Indiranagar, Bangalore - 560038"
  }
  ```

---

## 3. Warranty Processing Endpoints (`/api/warranties`)

### 3.1. Submit Warranty Application
- **Method**: `POST`
- **Path**: `/api/warranties`
- **Headers**: `Authorization: Bearer <token>`
- **Request Body**:
  ```json
  {
    "userId": 2,
    "productId": 1,
    "productName": "Diamond Glass Line Ultimate Solar Water Heater",
    "productModel": "OS-ETC-ULT200",
    "serialNumber": "OS-ULT-984210",
    "purchaseDate": "2024-04-15",
    "storeName": "Orange Solar Authorized Dealer - Bangalore",
    "purchasePrice": 48500.00,
    "invoiceUrl": "/uploads/bills/bill_sample.png"
  }
  ```

### 3.2. Approve Claim & Generate Card
- **Method**: `POST`
- **Path**: `/api/warranties/{id}/approve`
- **Request Body**:
  ```json
  {
    "warrantyPeriod": "5 Years",
    "certificateNo": "EW-2024-8841",
    "notes": "Verified against dealer serial database"
  }
  ```

### 3.3. Reject Claim
- **Method**: `POST`
- **Path**: `/api/warranties/{id}/reject`
- **Request Body**:
  ```json
  {
    "reason": "Serial number plate illegible and bill date mismatch"
  }
  ```

### 3.4. Public Certificate Verification
- **Method**: `GET`
- **Path**: `/api/warranties/verify/{certificateNo}`
- **Authentication**: *Public (No Token Required)*
- **Response (`200 OK`)**: Complete official warranty record and cryptographic verification payload.

---

## 4. Product Catalog Endpoints (`/api/products`)

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `GET` | `/api/products` | Retrieve active products for customer catalog | No |
| `GET` | `/api/products/admin/all` | Retrieve all products including unlisted | Yes (Admin) |
| `GET` | `/api/products/{id}` | Get product details by ID | No |
| `POST` | `/api/products` | Add new solar product with photo & specs | Yes (Admin) |
| `PUT` | `/api/products/{id}` | Update existing product specs | Yes (Admin) |
| `DELETE`| `/api/products/{id}` | Deactivate product from catalog | Yes (Admin) |

---

## 5. File Upload Endpoints (`/api/upload`)

### 5.1. Upload Purchase Bill / Invoice
- **Method**: `POST`
- **Path**: `/api/upload/bill`
- **Content-Type**: `multipart/form-data`
- **Payload**: `file` (Binary image: JPG, PNG, WEBP, or PDF; max 10MB)
- **Response (`200 OK`)**:
  ```json
  {
    "success": true,
    "url": "/uploads/bills/bill_1788890109114_ea14eb76.png",
    "fileName": "bill_1788890109114_ea14eb76.png"
  }
  ```
