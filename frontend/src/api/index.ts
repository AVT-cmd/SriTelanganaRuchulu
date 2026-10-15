import type { Product, Category, Order, OrderStatus, CustomerRecord, NotificationLog } from '../types';
import type { UserProfile } from '../store/authStore';
import { mockProducts, mockCategories } from './mockData';

const rawApiUrl = (import.meta.env.VITE_API_URL || '').trim();
const API_BASE_URL = rawApiUrl.replace(/\/api\/?$/i, '').replace(/\/+$/, '');

export interface CreateOrderPayload {
  customerName: string;
  email: string;
  phone: string;
  shippingAddress: string;
  items: {
    productId: number;
    productName: string;
    quantity: number;
    price: number;
    weight?: string;
  }[];
  shippingFee?: number;
  discount?: number;
  totalAmount: number;
  paymentMethod?: string;
  razorpayPaymentId?: string;
  razorpayOrderId?: string;
}

const PRODUCT_DATA_VERSION = 'v3_accurate_matched_images';
const getStoredProducts = (): Product[] => {
  try {
    const version = localStorage.getItem('str_products_data_version');
    if (version !== PRODUCT_DATA_VERSION) {
      localStorage.removeItem('str_products');
      localStorage.setItem('str_products_data_version', PRODUCT_DATA_VERSION);
      return mockProducts;
    }
    const raw = localStorage.getItem('str_products');
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.warn(e);
  }
  return mockProducts;
};

const saveStoredProducts = (products: Product[]) => {
  try {
    localStorage.setItem('str_products', JSON.stringify(products));
  } catch (e) {
    console.warn(e);
  }
};

export const getProducts = async (): Promise<Product[]> => {
  try {
    const res = await fetch(`${API_BASE_URL}/api/products`);
    if (res.ok) {
      const data = await res.json();
      const list = Array.isArray(data) ? data : (data.data || []);
      if (list.length > 0) {
        return list.filter((p: Product) => p.isVisible !== false);
      }
    }
  } catch (error) {
    console.warn('API unavailable, falling back to local dataset:', error);
  }
  return getStoredProducts().filter(p => p.isVisible !== false);
};

export const getProductBySlug = async (slug: string): Promise<Product> => {
  try {
    const res = await fetch(`${API_BASE_URL}/api/products/${slug}`);
    if (res.ok) {
      const data = await res.json();
      return data.data || data;
    }
  } catch (error) {
    console.warn(`API unavailable for product ${slug}, falling back to local dataset:`, error);
  }

  const product = mockProducts.find(p => p.slug === slug || p.id.toString() === slug);
  if (!product) throw new Error('Product not found');
  return product;
};

export const getCategories = async (): Promise<Category[]> => {
  try {
    const res = await fetch(`${API_BASE_URL}/api/categories`);
    if (res.ok) {
      const data = await res.json();
      return Array.isArray(data) ? data : (data.data || mockCategories);
    }
  } catch (error) {
    console.warn('API unavailable, falling back to local categories:', error);
  }
  return mockCategories;
};

export const createOrder = async (order: CreateOrderPayload) => {
  try {
    const res = await fetch(`${API_BASE_URL}/api/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(order)
    });
    if (res.ok) {
      return await res.json();
    }
  } catch (error) {
    console.warn('API unavailable for createOrder:', error);
  }
  const fallbackTracking = `STR-TRK-${Math.floor(100000 + Math.random() * 900000)}`;
  return {
    success: true,
    message: 'Order placed successfully',
    data: {
      orderNumber: `STR-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
      trackingId: fallbackTracking,
      totalAmount: order.totalAmount,
      paymentMethod: order.paymentMethod,
      razorpayPaymentId: order.razorpayPaymentId
    }
  };
};

export const getAdminStats = async () => {
  try {
    const res = await fetch(`${API_BASE_URL}/api/admin/stats`);
    if (res.ok) {
      const data = await res.json();
      return data.data;
    }
  } catch (error) {
    console.warn('API unavailable for admin stats:', error);
  }
  return {
    totalProducts: mockProducts.length,
    totalInStock: mockProducts.filter(p => p.isInStock).length,
    totalCategories: mockCategories.length,
    totalOrders: 0,
    totalRevenue: 0,
    totalCustomers: 0,
    recentOrders: []
  };
};

export const loginUser = async (email: string, password: string): Promise<{ success: boolean; user?: UserProfile; token?: string; message?: string }> => {
  try {
    const res = await fetch(`${API_BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    return data;
  } catch (error: any) {
    console.error('Login error:', error);
    return {
      success: false,
      message: error?.message || 'Unable to connect to authentication server. Please check your network.'
    };
  }
};

export interface RegisterData {
  name: string;
  email: string;
  password?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  otp?: string;
}

export const registerUser = async (data: RegisterData): Promise<{ success: boolean; user?: UserProfile; token?: string; message?: string }> => {
  try {
    const res = await fetch(`${API_BASE_URL}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return await res.json();
  } catch (error: any) {
    console.error('Registration error:', error);
    return {
      success: false,
      message: error?.message || 'Unable to register account. Please check your network connection.'
    };
  }
};

export const loginWithOtp = async (
  params: { identifier: string; otp: string; name?: string; phone?: string; address?: string; city?: string; state?: string; postalCode?: string } | string, 
  otpCode?: string
): Promise<{ success: boolean; user?: UserProfile; token?: string; message?: string; isNewCustomer?: boolean }> => {
  try {
    const body = typeof params === 'string' ? { identifier: params, otp: otpCode } : params;
    const res = await fetch(`${API_BASE_URL}/api/auth/login-with-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
    const data = await res.json();
    return data;
  } catch (error: any) {
    console.error('OTP Login error:', error);
    return {
      success: false,
      message: error?.message || 'Unable to connect to authentication server.'
    };
  }
};

export const sendOtp = async (payload: { 
  email?: string; 
  phone?: string; 
  purpose?: 'REGISTRATION' | 'LOGIN' | 'FORGOT_PASSWORD'; 
  name?: string;
  address?: string;
  city?: string;
  state?: string;
  postalCode?: string;
}) => {
  try {
    const res = await fetch(`${API_BASE_URL}/api/auth/send-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    return data;
  } catch (err: any) {
    console.error('API send-otp error:', err);
    return {
      success: false,
      message: err?.message || 'Failed to dispatch verification code.'
    };
  }
};

export const verifyOtp = async (identifier: string, otp: string) => {
  try {
    const res = await fetch(`${API_BASE_URL}/api/auth/verify-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ identifier, otp })
    });
    const data = await res.json();
    return data;
  } catch (err: any) {
    console.error('API verify-otp error:', err);
    return {
      success: false,
      message: err?.message || 'Verification failed. Please check your network connection.'
    };
  }
};

export const requestForgotPassword = async (email: string) => {
  try {
    const res = await fetch(`${API_BASE_URL}/api/auth/forgot-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    });
    const data = await res.json();
    return data;
  } catch (err: any) {
    console.error('API forgot-password error:', err);
    return {
      success: false,
      message: err?.message || 'Failed to process forgot password request.'
    };
  }
};

export const resetPassword = async (payload: { email: string; otp: string; newPassword: string }) => {
  try {
    const res = await fetch(`${API_BASE_URL}/api/auth/reset-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    return data;
  } catch (err: any) {
    console.error('API reset-password error:', err);
    return {
      success: false,
      message: err?.message || 'Failed to reset password.'
    };
  }
};

export const getNotifications = async (): Promise<NotificationLog[]> => {
  try {
    const res = await fetch(`${API_BASE_URL}/api/notifications`);
    if (res.ok) {
      const data = await res.json();
      return data.data || [];
    }
  } catch (err) {
    console.warn('API notifications error:', err);
  }
  return [];
};

const getStoredOrders = (): Order[] => {
  try {
    const raw = localStorage.getItem('str_orders');
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.warn(e);
  }
  return [];
};

const saveStoredOrders = (orders: Order[]) => {
  try {
    localStorage.setItem('str_orders', JSON.stringify(orders));
  } catch (e) {
    console.warn(e);
  }
};

export const getOrders = async (): Promise<Order[]> => {
  try {
    const res = await fetch(`${API_BASE_URL}/api/orders`);
    if (res.ok) {
      const data = await res.json();
      const list = Array.isArray(data) ? data : (data.data || []);
      saveStoredOrders(list);
      return list;
    }
  } catch (error) {
    console.warn('API unavailable for getOrders, using local store:', error);
  }
  return getStoredOrders();
};

export const updateOrderStatus = async (id: number, status: OrderStatus): Promise<Order | null> => {
  try {
    const res = await fetch(`${API_BASE_URL}/api/orders/${id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    });
    if (res.ok) {
      const data = await res.json();
      return data.data;
    }
  } catch (error) {
    console.warn(`API unavailable for updateOrderStatus #${id}:`, error);
  }

  // Fallback update local store
  const orders = getStoredOrders();
  const idx = orders.findIndex(o => o.id === id);
  if (idx !== -1) {
    orders[idx].status = status;
    if (!orders[idx].trackingId) {
      orders[idx].trackingId = `STR-TRK-${Math.floor(100000 + Math.random() * 900000)}`;
    }
    orders[idx].updatedAt = new Date().toISOString();
    if (!orders[idx].timeline) orders[idx].timeline = [];
    orders[idx].timeline!.push({
      status,
      title: `Status: ${status}`,
      description: `Order status set to ${status}`,
      timestamp: new Date().toISOString(),
      location: orders[idx].courierPartner || 'Warangal Hub'
    });
    saveStoredOrders(orders);
    return orders[idx];
  }
  return null;
};

export const updateOrderTracking = async (
  id: number,
  updates: {
    status?: OrderStatus;
    trackingId?: string;
    courierPartner?: string;
    trackingNotes?: string;
    estimatedDelivery?: string;
  }
): Promise<Order | null> => {
  try {
    const res = await fetch(`${API_BASE_URL}/api/orders/${id}/tracking`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates)
    });
    if (res.ok) {
      const data = await res.json();
      return data.data;
    }
  } catch (error) {
    console.warn(`API unavailable for updateOrderTracking for order #${id}:`, error);
  }

  // Fallback update local store
  const orders = getStoredOrders();
  const idx = orders.findIndex(o => o.id === id);
  if (idx !== -1) {
    const order = orders[idx];
    if (updates.status) order.status = updates.status;
    if (updates.trackingId) order.trackingId = updates.trackingId;
    if (updates.courierPartner) order.courierPartner = updates.courierPartner;
    if (updates.trackingNotes !== undefined) order.trackingNotes = updates.trackingNotes;
    if (updates.estimatedDelivery !== undefined) order.estimatedDelivery = updates.estimatedDelivery;
    order.updatedAt = new Date().toISOString();

    if (!order.timeline) order.timeline = [];
    order.timeline.push({
      status: order.status,
      title: updates.status ? `Status Updated to ${updates.status}` : 'Tracking Note Updated',
      description: updates.trackingNotes || `Courier: ${order.courierPartner || 'Assigned'} | ID: ${order.trackingId}`,
      timestamp: new Date().toISOString(),
      location: order.courierPartner || 'Transit Hub'
    });

    saveStoredOrders(orders);
    return order;
  }
  return null;
};

export const trackOrderByQuery = async (query: string): Promise<Order | null> => {
  const cleanQuery = query.trim().toLowerCase();
  try {
    const res = await fetch(`${API_BASE_URL}/api/orders/track/${encodeURIComponent(cleanQuery)}`);
    if (res.ok) {
      const data = await res.json();
      return data.data;
    }
  } catch (error) {
    console.warn(`API unavailable for trackOrderByQuery '${query}':`, error);
  }

  // Fallback search local store
  const orders = getStoredOrders();
  const found = orders.find(o => 
    o.orderNumber.toLowerCase() === cleanQuery || 
    (o.trackingId && o.trackingId.toLowerCase() === cleanQuery) ||
    o.id.toString() === cleanQuery
  );
  return found || null;
};

export const getCustomers = async (): Promise<CustomerRecord[]> => {
  try {
    const res = await fetch(`${API_BASE_URL}/api/admin/customers`);
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data.data)) return data.data;
    }
  } catch (error) {
    console.warn('API unavailable for getCustomers:', error);
  }
  return [];
};

export const getAllProductsAdmin = async (): Promise<Product[]> => {
  try {
    const res = await fetch(`${API_BASE_URL}/api/products?includeHidden=true`);
    if (res.ok) {
      const data = await res.json();
      const list = Array.isArray(data) ? data : (data.data || []);
      if (list.length > 0) {
        saveStoredProducts(list);
        return list;
      }
    }
  } catch (error) {
    console.warn('API unavailable for getAllProductsAdmin:', error);
  }
  return getStoredProducts();
};

export const createProduct = async (productData: Partial<Product>): Promise<Product | null> => {
  try {
    const res = await fetch(`${API_BASE_URL}/api/products`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(productData)
    });
    if (res.ok) {
      const data = await res.json();
      if (data.data) {
        const stored = getStoredProducts();
        stored.unshift(data.data);
        saveStoredProducts(stored);
        return data.data;
      }
    }
  } catch (error) {
    console.warn('API unavailable for createProduct:', error);
  }

  // Local fallback
  const stored = getStoredProducts();
  const nextId = stored.length > 0 ? Math.max(...stored.map(p => p.id)) + 1 : 101;
  const newProduct: Product = {
    id: nextId,
    name: productData.name || 'New Traditional Product',
    slug: productData.slug || (productData.name || 'product').toLowerCase().replace(/[^a-z0-9]+/g, '-'),
    price: productData.price || 400,
    regularPrice: productData.regularPrice || productData.price || 450,
    imageUrl: productData.imageUrl || '/images/premium_snacks.jpg',
    isInStock: productData.isInStock !== undefined ? productData.isInStock : true,
    isVisible: productData.isVisible !== undefined ? productData.isVisible : true,
    categories: productData.categories || mockCategories.slice(0, 1),
    shortDescription: productData.shortDescription || 'Authentic traditional recipe handcrafted in Telangana.',
    description: productData.description || 'Made with traditional methods and fresh ingredients.'
  };
  stored.unshift(newProduct);
  saveStoredProducts(stored);
  return newProduct;
};

export const updateProduct = async (id: number, updates: Partial<Product>): Promise<Product | null> => {
  try {
    const res = await fetch(`${API_BASE_URL}/api/products/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates)
    });
    if (res.ok) {
      const data = await res.json();
      if (data.data) {
        const stored = getStoredProducts();
        const idx = stored.findIndex(p => p.id === id);
        if (idx !== -1) {
          stored[idx] = data.data;
          saveStoredProducts(stored);
        }
        return data.data;
      }
    }
  } catch (error) {
    console.warn(`API unavailable for updateProduct #${id}:`, error);
  }

  // Local fallback
  const stored = getStoredProducts();
  const idx = stored.findIndex(p => p.id === id);
  if (idx !== -1) {
    stored[idx] = { ...stored[idx], ...updates };
    saveStoredProducts(stored);
    return stored[idx];
  }
  return null;
};

export const deleteProduct = async (id: number): Promise<boolean> => {
  try {
    const res = await fetch(`${API_BASE_URL}/api/products/${id}`, {
      method: 'DELETE'
    });
    if (res.ok) {
      const stored = getStoredProducts();
      const filtered = stored.filter(p => p.id !== id);
      saveStoredProducts(filtered);
      return true;
    }
  } catch (error) {
    console.warn(`API unavailable for deleteProduct #${id}:`, error);
  }

  const stored = getStoredProducts();
  const filtered = stored.filter(p => p.id !== id);
  saveStoredProducts(filtered);
  return true;
};
