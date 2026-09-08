import QRCode from 'qrcode';

export interface ProductQRPayload {
  productName: string;
  productModel: string;
  serialNumber: string;
  purchaseDate: string;
  storeName: string;
  price: number;
}

export async function generateQRDataUrl(data: string): Promise<string> {
  try {
    return await QRCode.toDataURL(data, {
      width: 320,
      margin: 2,
      color: {
        dark: '#1e293b',
        light: '#ffffff',
      },
      errorCorrectionLevel: 'H',
    });
  } catch (err) {
    console.error('Failed to generate QR code', err);
    return '';
  }
}

export function encodeProductQR(payload: ProductQRPayload): string {
  return JSON.stringify({
    type: 'EWARRANTY_PRODUCT',
    ...payload,
  });
}

export function parseProductQR(text: string): Partial<ProductQRPayload> | null {
  try {
    const data = JSON.parse(text);
    if (data.type === 'EWARRANTY_PRODUCT' || data.productName || data.serialNumber) {
      return {
        productName: data.productName || '',
        productModel: data.productModel || '',
        serialNumber: data.serialNumber || '',
        purchaseDate: data.purchaseDate || new Date().toISOString().split('T')[0],
        storeName: data.storeName || '',
        price: data.price ? Number(data.price) : 0,
      };
    }
  } catch {
    // If text format: "Product: Smartphone XYZ\nModel: XYZ-2024..."
    const lines = text.split('\n');
    const result: Partial<ProductQRPayload> = {};
    for (const line of lines) {
      const [key, ...vals] = line.split(':');
      const val = vals.join(':').trim();
      if (!val) continue;
      const lowerKey = key.toLowerCase();
      if (lowerKey.includes('name') || lowerKey.includes('product')) result.productName = val;
      if (lowerKey.includes('model')) result.productModel = val;
      if (lowerKey.includes('serial')) result.serialNumber = val;
      if (lowerKey.includes('date')) result.purchaseDate = val;
      if (lowerKey.includes('store')) result.storeName = val;
      if (lowerKey.includes('price')) result.price = Number(val.replace(/[^0-9.]/g, ''));
    }
    if (Object.keys(result).length > 0) return result;
  }
  return null;
}
