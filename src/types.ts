export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  compareAtPrice?: number;
  category: string;
  brand: string;
  images: string[];
  stock: number;
  sku: string;
  rating: number;
  reviewsCount: number;
  isFeatured?: boolean;
  tags?: string[];
  supplierName?: string;
  supplierPhone?: string;
  supplierEmail?: string;
  supplierWholesalePrice?: number;
  supplierAddress?: string;
  supplierNotes?: string;
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  image: string;
  description?: string;
}

export interface Brand {
  id: string;
  name: string;
  logo: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedColor?: string;
  selectedSize?: string;
}

export interface Address {
  id: string;
  fullName: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  isDefault?: boolean;
}

export interface Order {
  id: string;
  userId: string;
  customerEmail: string;
  customerName: string;
  shippingAddress: Address;
  items: {
    productId: string;
    productName: string;
    price: number;
    quantity: number;
    image: string;
  }[];
  subtotal: number;
  discount: number;
  shippingFee: number;
  total: number;
  paymentMethod: 'razorpay' | 'upi' | 'qr' | 'cod';
  paymentStatus: 'paid' | 'pending' | 'failed';
  orderStatus: 'placed' | 'processing' | 'shipped' | 'out_for_delivery' | 'delivered' | 'cancelled';
  trackingNumber: string;
  createdAt: string;
}

export interface Coupon {
  id: string;
  code: string;
  discountPercent: number;
  minOrderAmount: number;
  active: boolean;
  expiryDate: string;
}

export interface Banner {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  linkCategory: string;
  active: boolean;
}

export interface Review {
  id: string;
  productId: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  role: 'admin' | 'customer';
  phone?: string;
  addresses: Address[];
  createdAt: string;
}

export interface StoreSettings {
  storeName: string;
  currency: string;
  shippingFee: number;
  freeShippingThreshold: number;
  taxRate: number;
  adminEmail: string;
  razorpayEnabled: boolean;
  upiEnabled: boolean;
  qrEnabled: boolean;
  codEnabled: boolean;
  upiVpa?: string;
  customQrUrl?: string;
}

export type ViewMode = 'store' | 'product_detail' | 'cart' | 'checkout' | 'wishlist' | 'order_history' | 'profile' | 'admin';
