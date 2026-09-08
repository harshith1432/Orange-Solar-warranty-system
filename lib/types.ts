export type Role = 'CUSTOMER' | 'ADMIN';

export type RequestStatus = 'Pending' | 'Approved' | 'Rejected';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: Role;
  age?: number;
  aadharNumber?: string;
  address?: string;
  totalPurchases?: number;
  totalSpent?: number;
  memberSince?: string;
}

export interface PurchaseItem {
  id: string;
  product: string;
  model: string;
  serialNumber: string;
  date: string;
  price: number;
  discount: number;
  amount: number;
  storeName: string;
  hasWarranty: boolean;
}

export interface WarrantyRequest {
  id: string;
  requestId: string; // e.g. REQ12348
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  productName: string;
  productModel: string;
  serialNumber: string;
  purchaseDate: string;
  storeName: string;
  price: number;
  status: RequestStatus;
  submissionDate: string;
  reviewedDate?: string;
  rejectionReason?: string;
  certificateNo?: string;
  notificationSent?: {
    email: boolean;
    whatsapp: boolean;
  };
  imageUrl?: string;
}

export interface WarrantyCertificate {
  certificateNo: string; // e.g. EW-2024-9842
  requestId: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  productName: string;
  productModel: string;
  serialNumber: string;
  purchaseDate: string;
  warrantyPeriod: string; // e.g. "1 Year"
  validFrom: string;
  validTill: string;
  storeName: string;
  price: number;
  issuedAt: string;
  verificationUrl: string;
  emailSent: boolean;
  whatsappSent: boolean;
  imageUrl?: string;
}

export interface ProductTemplate {
  name: string;
  model: string;
  defaultPrice: number;
  storeName: string;
  warrantyMonths: number;
  imageUrl?: string;
  description?: string;
  category?: string;
}
