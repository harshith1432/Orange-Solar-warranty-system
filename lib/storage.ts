'use client';

import { 
  User, 
  PurchaseItem, 
  WarrantyRequest, 
  WarrantyCertificate 
} from './types';
import { 
  INITIAL_CUSTOMER, 
  INITIAL_PURCHASES, 
  INITIAL_REQUESTS, 
  INITIAL_CERTIFICATES 
} from './initialData';

const STORAGE_KEY_REQUESTS = 'ewarranty_requests';
const STORAGE_KEY_CERTIFICATES = 'ewarranty_certificates';
const STORAGE_KEY_PURCHASES = 'ewarranty_purchases';
const STORAGE_KEY_CUSTOMER = 'ewarranty_customer';

const isBrowser = typeof window !== 'undefined';

export function getRequests(): WarrantyRequest[] {
  if (!isBrowser) return INITIAL_REQUESTS;
  const stored = localStorage.getItem(STORAGE_KEY_REQUESTS);
  if (!stored) {
    localStorage.setItem(STORAGE_KEY_REQUESTS, JSON.stringify(INITIAL_REQUESTS));
    return INITIAL_REQUESTS;
  }
  try {
    return JSON.parse(stored);
  } catch {
    return INITIAL_REQUESTS;
  }
}

export function getCertificates(): WarrantyCertificate[] {
  if (!isBrowser) return INITIAL_CERTIFICATES;
  const stored = localStorage.getItem(STORAGE_KEY_CERTIFICATES);
  if (!stored) {
    localStorage.setItem(STORAGE_KEY_CERTIFICATES, JSON.stringify(INITIAL_CERTIFICATES));
    return INITIAL_CERTIFICATES;
  }
  try {
    return JSON.parse(stored);
  } catch {
    return INITIAL_CERTIFICATES;
  }
}

export function getCustomer(): User {
  if (!isBrowser) return INITIAL_CUSTOMER;
  const stored = localStorage.getItem(STORAGE_KEY_CUSTOMER);
  if (!stored) {
    localStorage.setItem(STORAGE_KEY_CUSTOMER, JSON.stringify(INITIAL_CUSTOMER));
    return INITIAL_CUSTOMER;
  }
  try {
    return JSON.parse(stored);
  } catch {
    return INITIAL_CUSTOMER;
  }
}

export function getCustomerPurchases(): PurchaseItem[] {
  if (!isBrowser) return INITIAL_PURCHASES;
  const stored = localStorage.getItem(STORAGE_KEY_PURCHASES);
  if (!stored) {
    localStorage.setItem(STORAGE_KEY_PURCHASES, JSON.stringify(INITIAL_PURCHASES));
    return INITIAL_PURCHASES;
  }
  try {
    return JSON.parse(stored);
  } catch {
    return INITIAL_PURCHASES;
  }
}

export function addWarrantyRequest(data: {
  productName: string;
  productModel: string;
  serialNumber: string;
  purchaseDate: string;
  storeName: string;
  price: number;
}): WarrantyRequest {
  const currentRequests = getRequests();
  const customer = getCustomer();

  // Generate next sequential request ID e.g. REQ12349
  const nextNum = 12348 + currentRequests.length + 1;
  const requestId = `REQ${nextNum}`;

  const newRequest: WarrantyRequest = {
    id: `req_${Date.now()}`,
    requestId,
    customerName: customer.name,
    customerPhone: customer.phone,
    customerEmail: customer.email,
    productName: data.productName,
    productModel: data.productModel,
    serialNumber: data.serialNumber,
    purchaseDate: data.purchaseDate,
    storeName: data.storeName,
    price: Number(data.price),
    status: 'Pending',
    submissionDate: new Date().toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    }),
  };

  const updated = [newRequest, ...currentRequests];
  if (isBrowser) {
    localStorage.setItem(STORAGE_KEY_REQUESTS, JSON.stringify(updated));
    window.dispatchEvent(new Event('storage-update'));
  }
  return newRequest;
}

export function updateRequestStatus(
  requestId: string,
  status: 'Approved' | 'Rejected',
  options?: { reason?: string; sendEmail?: boolean; sendWhatsapp?: boolean }
): { request?: WarrantyRequest; certificate?: WarrantyCertificate } {
  const requests = getRequests();
  const index = requests.findIndex((r) => r.requestId === requestId);
  if (index === -1) return {};

  const req = requests[index];
  const now = new Date();
  const reviewedDate = now.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });

  let newCert: WarrantyCertificate | undefined;

  if (status === 'Approved') {
    const certs = getCertificates();
    const certNum = Math.floor(1000 + Math.random() * 9000);
    const certificateNo = `EW-${now.getFullYear()}-${certNum}`;

    // Valid till 1 year later
    const validTillDate = new Date(now);
    validTillDate.setFullYear(validTillDate.getFullYear() + 1);
    validTillDate.setDate(validTillDate.getDate() - 1);

    newCert = {
      certificateNo,
      requestId: req.requestId,
      customerName: req.customerName,
      customerPhone: req.customerPhone,
      customerEmail: req.customerEmail,
      productName: `${req.productName} (${req.productModel})`,
      productModel: req.productModel,
      serialNumber: req.serialNumber,
      purchaseDate: req.purchaseDate,
      warrantyPeriod: '1 Year',
      validFrom: req.purchaseDate || reviewedDate,
      validTill: validTillDate.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      }),
      storeName: req.storeName,
      price: req.price,
      issuedAt: reviewedDate,
      verificationUrl: `/verify/${certificateNo}`,
      emailSent: options?.sendEmail !== false,
      whatsappSent: options?.sendWhatsapp !== false,
    };

    req.certificateNo = certificateNo;
    req.notificationSent = {
      email: options?.sendEmail !== false,
      whatsapp: options?.sendWhatsapp !== false,
    };

    if (isBrowser) {
      localStorage.setItem(STORAGE_KEY_CERTIFICATES, JSON.stringify([newCert, ...certs]));
    }
  } else {
    req.rejectionReason = options?.reason || 'Warranty documentation rejected.';
  }

  req.status = status;
  req.reviewedDate = reviewedDate;
  requests[index] = req;

  if (isBrowser) {
    localStorage.setItem(STORAGE_KEY_REQUESTS, JSON.stringify(requests));
    window.dispatchEvent(new Event('storage-update'));
  }

  return { request: req, certificate: newCert };
}

export function resetAllData() {
  if (!isBrowser) return;
  localStorage.setItem(STORAGE_KEY_REQUESTS, JSON.stringify(INITIAL_REQUESTS));
  localStorage.setItem(STORAGE_KEY_CERTIFICATES, JSON.stringify(INITIAL_CERTIFICATES));
  localStorage.setItem(STORAGE_KEY_PURCHASES, JSON.stringify(INITIAL_PURCHASES));
  localStorage.setItem(STORAGE_KEY_CUSTOMER, JSON.stringify(INITIAL_CUSTOMER));
  window.dispatchEvent(new Event('storage-update'));
}
