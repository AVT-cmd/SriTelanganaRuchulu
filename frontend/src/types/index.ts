export interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string;
}

export interface Product {
  id: number;
  name: string;
  slug: string;
  shortDescription?: string;
  description?: string;
  price: number;
  regularPrice: number;
  imageUrl: string;
  isInStock: boolean;
  isVisible?: boolean;
  categories: Category[];
  basePrice?: number;
}

export interface CartItem extends Product {
  cartItemId?: string;
  quantity: number;
  weight?: string;
  weightKg?: number;
  basePrice?: number;
}

export interface OrderItem {
  id?: number;
  productId: number;
  productName: string;
  quantity: number;
  price: number;
  weight?: string;
}

export type OrderStatus = 'PENDING' | 'CONFIRMED' | 'PREPARING' | 'SHIPPED' | 'OUT_FOR_DELIVERY' | 'DELIVERED' | 'CANCELLED';

export interface TrackingTimelineEvent {
  status: OrderStatus;
  title: string;
  description: string;
  timestamp: string;
  location?: string;
}

export interface Order {
  id: number;
  orderNumber: string;
  customerName: string;
  email: string;
  phone: string;
  shippingAddress: string;
  items: OrderItem[];
  shippingFee?: number;
  discount?: number;
  totalAmount: number;
  status: OrderStatus;
  trackingId?: string;
  courierPartner?: string;
  trackingNotes?: string;
  estimatedDelivery?: string;
  timeline?: TrackingTimelineEvent[];
  paymentMethod: 'COD' | 'ONLINE' | 'UPI' | 'RAZORPAY';
  razorpayPaymentId?: string;
  razorpayOrderId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CustomerRecord {
  id: number;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  city?: string;
  totalOrders: number;
  totalSpend: number;
  lastOrderDate?: string;
  createdAt: string;
}

export interface NotificationLog {
  id: string;
  type: 'EMAIL' | 'SMS';
  category: 'WELCOME' | 'OTP' | 'FORGOT_PASSWORD' | 'ORDER_CONFIRMATION';
  recipient: string;
  recipientName?: string;
  subject?: string;
  content: string;
  previewText?: string;
  metadata?: Record<string, any>;
  status: 'SENT' | 'DELIVERED';
  timestamp: string;
}
