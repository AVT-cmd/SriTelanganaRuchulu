import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { Category, Product, Order, User, CustomerRecord, OrderStatus } from '../types/index.js';
import { mockCategories, mockProducts } from './seedData.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const resolveDbFile = () => {
  const candidates = [
    path.join(__dirname, 'db_store.json'),
    path.resolve(process.cwd(), 'src/data/db_store.json'),
    path.resolve(process.cwd(), 'backend/src/data/db_store.json'),
    path.resolve(__dirname, '../../src/data/db_store.json')
  ];
  for (const c of candidates) {
    if (fs.existsSync(c)) return c;
  }
  return path.join(__dirname, 'db_store.json');
};
const DB_FILE = resolveDbFile();

const STATUS_DESCRIPTIONS: Record<OrderStatus, { title: string; desc: string }> = {
  PENDING: { title: 'Order Placed & Received', desc: 'Order received and awaiting kitchen verification' },
  CONFIRMED: { title: 'Order Confirmed', desc: 'Ingredients assembled and allocated for traditional batch preparation' },
  PREPARING: { title: 'Fresh Preparation & Packing', desc: 'Handcrafted fresh batch sealed in Warangal central kitchen' },
  SHIPPED: { title: 'Dispatched in Transit', desc: 'Package handed over to courier partner with active Tracking ID' },
  OUT_FOR_DELIVERY: { title: 'Out for Delivery', desc: 'Delivery agent is out for final delivery to recipient destination' },
  DELIVERED: { title: 'Delivered Successfully', desc: 'Package safely delivered and signed by customer' },
  CANCELLED: { title: 'Order Cancelled', desc: 'Order has been cancelled' }
};

// Persistent JSON-backed DataStore for Sri Telangana Ruchulu
class DataStore {
  private categories: Category[] = [];
  private products: Product[] = [];
  private orders: Order[] = [];
  private users: User[] = [];

  constructor() {
    this.seed();
  }

  private save() {
    try {
      const data = {
        users: this.users,
        orders: this.orders,
        products: this.products,
        categories: this.categories
      };
      fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
    } catch (err) {
      console.warn('[DataStore] Failed to persist data to db_store.json:', err);
    }
  }

  private seed() {
    let loadedFromDb = false;
    try {
      if (fs.existsSync(DB_FILE)) {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        const parsed = JSON.parse(raw);
        if (parsed.users && Array.isArray(parsed.users)) {
          this.users = parsed.users;
        }
        if (parsed.orders && Array.isArray(parsed.orders)) {
          this.orders = parsed.orders;
        }
        if (parsed.products && Array.isArray(parsed.products) && parsed.products.length > 0) {
          this.products = parsed.products;
        }
        if (parsed.categories && Array.isArray(parsed.categories) && parsed.categories.length > 0) {
          this.categories = parsed.categories;
        }
        loadedFromDb = true;
      }
    } catch (e) {
      console.warn('[DataStore] Error reading db_store.json:', e);
    }

    if (!loadedFromDb || this.categories.length === 0) {
      this.categories = [...mockCategories];
    }
    if (!loadedFromDb || this.products.length === 0) {
      this.products = mockProducts.map(p => ({
        ...p,
        isVisible: true
      }));
    }

    // Ensure genuine Administrator account always exists
    const hasAdmin = this.users.some(u => u.email.toLowerCase() === 'adminsritelanganaruchulu@gmail.com' || u.email.toLowerCase() === 'admin@sritelanganaruchulu.com');
    if (!hasAdmin) {
      this.users.unshift({
        id: 1,
        email: 'adminsritelanganaruchulu@gmail.com',
        name: 'Administrator',
        password: 'admin123',
        role: 'ADMIN',
        phone: '+91 81213 45585',
        city: 'Warangal',
        address: 'Collectorate Road, Subedari',
        createdAt: new Date().toISOString()
      });
    }

    // Save initial state if freshly created
    if (!loadedFromDb) {
      this.save();
    }
  }

  public clearCustomerUsers(): void {
    this.users = this.users.filter(u => u.role === 'ADMIN');
    this.save();
  }

  // --- PRODUCTS ---
  public getProducts(options?: { category?: string; search?: string; inStock?: boolean; includeHidden?: boolean; limit?: number; offset?: number }): { products: Product[]; total: number } {
    let result = [...this.products];

    // Unless explicitly requested (e.g. in Admin dashboard), only return visible products to customers
    if (!options?.includeHidden) {
      result = result.filter(p => p.isVisible !== false);
    }

    if (options?.category) {
      const catSlug = options.category.toLowerCase();
      result = result.filter(p => 
        p.categories?.some(c => c.slug.toLowerCase() === catSlug || c.name.toLowerCase() === catSlug)
      );
    }

    if (options?.search) {
      const query = options.search.toLowerCase();
      result = result.filter(p => 
        p.name.toLowerCase().includes(query) ||
        p.description?.toLowerCase().includes(query) ||
        p.shortDescription?.toLowerCase().includes(query)
      );
    }

    if (options?.inStock !== undefined) {
      result = result.filter(p => p.isInStock === options.inStock);
    }

    const total = result.length;
    const offset = options?.offset || 0;
    const limit = options?.limit || total;
    
    return {
      products: result.slice(offset, offset + limit),
      total
    };
  }

  public getProductBySlugOrId(identifier: string | number): Product | undefined {
    return this.products.find(p => 
      p.slug === identifier || 
      p.id.toString() === identifier.toString()
    );
  }

  public createProduct(productData: Omit<Product, 'id'>): Product {
    const nextId = this.products.length > 0 ? Math.max(...this.products.map(p => p.id)) + 1 : 1;
    const newProduct: Product = {
      id: nextId,
      ...productData,
      slug: productData.slug || productData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
      isVisible: productData.isVisible !== undefined ? productData.isVisible : true,
      isInStock: productData.isInStock !== undefined ? productData.isInStock : true,
      categories: productData.categories || []
    };
    this.products.unshift(newProduct);
    this.save();
    return newProduct;
  }

  public updateProduct(id: number, updates: Partial<Product>): Product | null {
    const index = this.products.findIndex(p => p.id === id);
    if (index === -1) return null;
    this.products[index] = { ...this.products[index], ...updates };
    this.save();
    return this.products[index];
  }

  public deleteProduct(id: number): boolean {
    const initialLength = this.products.length;
    this.products = this.products.filter(p => p.id !== id);
    const deleted = this.products.length < initialLength;
    if (deleted) this.save();
    return deleted;
  }

  // --- CATEGORIES ---
  public getCategories(): Category[] {
    return this.categories;
  }

  public getCategoryBySlug(slug: string): Category | undefined {
    return this.categories.find(c => c.slug === slug);
  }

  public createCategory(categoryData: Omit<Category, 'id'>): Category {
    const nextId = this.categories.length > 0 ? Math.max(...this.categories.map(c => c.id)) + 1 : 1;
    const newCategory: Category = {
      id: nextId,
      ...categoryData,
      slug: categoryData.slug || categoryData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
    };
    this.categories.push(newCategory);
    this.save();
    return newCategory;
  }

  // --- ORDERS & TRACKING ---
  public getOrders(): Order[] {
    return [...this.orders].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  public getOrderById(id: number): Order | undefined {
    return this.orders.find(o => o.id === id);
  }

  public getOrderByTrackingOrNumber(query: string): Order | undefined {
    const q = query.trim().toLowerCase().replace(/^#/, '');
    return this.orders.find(o => 
      o.orderNumber.toLowerCase().replace(/^#/, '') === q || 
      (o.trackingId && o.trackingId.toLowerCase() === q) ||
      o.id.toString() === q
    );
  }

  public createOrder(orderData: Omit<Order, 'id' | 'orderNumber' | 'createdAt' | 'updatedAt' | 'status'> & { status?: Order['status']; estimatedDelivery?: string }): Order {
    const nextId = this.orders.length > 0 ? Math.max(...this.orders.map(o => o.id)) + 1 : 1001;
    const orderNumber = `STR-${new Date().getFullYear()}-${nextId}`;
    const trackingId = orderData.trackingId || `STR-TRK-${Math.floor(100000 + Math.random() * 900000)}`;
    const now = new Date().toISOString();
    const status: Order['status'] = orderData.status || 'PENDING';
    const statusInfo = STATUS_DESCRIPTIONS[status] || { title: 'Order Placed', desc: 'Order received in system' };

    const initialTimeline = [
      {
        status,
        title: statusInfo.title,
        description: statusInfo.desc,
        timestamp: now,
        location: 'Online Store'
      }
    ];

    const newOrder: Order = {
      id: nextId,
      orderNumber,
      status,
      trackingId,
      courierPartner: orderData.courierPartner || 'Sri Telangana Tri-City Express',
      trackingNotes: orderData.trackingNotes || 'Order received, kitchen preparation in progress',
      estimatedDelivery: orderData.estimatedDelivery || 'Within 2-3 business days',
      timeline: initialTimeline,
      createdAt: now,
      updatedAt: now,
      ...orderData
    };

    this.orders.unshift(newOrder);
    this.save();
    return newOrder;
  }

  public updateOrderStatus(id: number, status: Order['status']): Order | null {
    const order = this.orders.find(o => o.id === id);
    if (!order) return null;
    const now = new Date().toISOString();
    order.status = status;
    order.updatedAt = now;

    if (!order.trackingId) {
      order.trackingId = `STR-TRK-${Math.floor(100000 + Math.random() * 900000)}`;
    }

    const statusInfo = STATUS_DESCRIPTIONS[status] || { title: status, desc: `Status changed to ${status}` };
    if (!order.timeline) order.timeline = [];
    order.timeline.push({
      status,
      title: statusInfo.title,
      description: statusInfo.desc,
      timestamp: now,
      location: order.courierPartner || 'Warangal Hub'
    });

    this.save();
    return order;
  }

  public updateOrderTracking(id: number, updates: Partial<Pick<Order, 'status' | 'trackingId' | 'courierPartner' | 'trackingNotes' | 'estimatedDelivery'>>): Order | null {
    const order = this.orders.find(o => o.id === id);
    if (!order) return null;

    const now = new Date().toISOString();
    const oldStatus = order.status;

    if (updates.status) order.status = updates.status;
    if (updates.trackingId) order.trackingId = updates.trackingId;
    if (updates.courierPartner) order.courierPartner = updates.courierPartner;
    if (updates.trackingNotes !== undefined) order.trackingNotes = updates.trackingNotes;
    if (updates.estimatedDelivery !== undefined) order.estimatedDelivery = updates.estimatedDelivery;

    order.updatedAt = now;

    if (!order.timeline) order.timeline = [];
    if (updates.status && updates.status !== oldStatus) {
      const statusInfo = STATUS_DESCRIPTIONS[updates.status] || { title: updates.status, desc: `Status changed to ${updates.status}` };
      order.timeline.push({
        status: updates.status,
        title: statusInfo.title,
        description: updates.trackingNotes || statusInfo.desc,
        timestamp: now,
        location: order.courierPartner || 'Transit Hub'
      });
    } else if (updates.trackingNotes) {
      order.timeline.push({
        status: order.status,
        title: 'Tracking Update',
        description: updates.trackingNotes,
        timestamp: now,
        location: order.courierPartner || 'Transit Hub'
      });
    }

    this.save();
    return order;
  }

  // --- CUSTOMERS ---
  public getCustomers(): CustomerRecord[] {
    const customerMap = new Map<string, CustomerRecord>();
    
    // Seeded & registered customers
    this.users.filter(u => u.role === 'CUSTOMER').forEach(u => {
      customerMap.set(u.email.toLowerCase(), {
        id: u.id,
        name: u.name,
        email: u.email,
        phone: u.phone || '+91 81213 45585',
        address: u.address || '',
        city: u.city || '',
        totalOrders: 0,
        totalSpend: 0,
        createdAt: u.createdAt
      });
    });

    // Aggregate from orders
    this.orders.forEach(o => {
      const emailKey = o.email.toLowerCase();
      let record = customerMap.get(emailKey);
      if (!record) {
        record = {
          id: o.id,
          name: o.customerName,
          email: o.email,
          phone: o.phone,
          address: o.shippingAddress,
          city: o.shippingAddress.split(',')[1]?.trim() || 'Telangana',
          totalOrders: 0,
          totalSpend: 0,
          createdAt: o.createdAt
        };
        customerMap.set(emailKey, record);
      }
      record.totalOrders += 1;
      record.totalSpend += o.totalAmount;
      if (!record.lastOrderDate || new Date(o.createdAt) > new Date(record.lastOrderDate)) {
        record.lastOrderDate = o.createdAt;
      }
    });

    return Array.from(customerMap.values()).sort((a, b) => {
      if (b.totalOrders !== a.totalOrders) {
        return b.totalOrders - a.totalOrders;
      }
      return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
    });
  }

  // --- STATS & ANALYTICS ---
  public getStats() {
    const totalOrders = this.orders.length;
    const totalRevenue = this.orders.reduce((sum, o) => sum + (o.status !== 'CANCELLED' ? o.totalAmount : 0), 0);
    const totalProducts = this.products.length;
    const totalInStock = this.products.filter(p => p.isInStock).length;
    const totalCategories = this.categories.length;
    const totalCustomers = this.getCustomers().length;

    return {
      totalProducts,
      totalInStock,
      totalCategories,
      totalOrders,
      totalRevenue,
      totalCustomers,
      recentOrders: this.orders.slice(0, 5)
    };
  }

  // --- USERS & AUTH ---
  public findUserByEmail(email: string): User | undefined {
    return this.users.find(u => u.email.toLowerCase() === email.toLowerCase());
  }

  public createUser(userData: Omit<User, 'id' | 'createdAt'>): User {
    const nextId = this.users.length > 0 ? Math.max(...this.users.map(u => u.id)) + 1 : 1;
    const newUser: User = {
      id: nextId,
      createdAt: new Date().toISOString(),
      ...userData
    };
    this.users.push(newUser);
    this.save();
    return newUser;
  }

  public updateUserPassword(email: string, newPassword: string): boolean {
    const user = this.findUserByEmail(email);
    if (!user) return false;
    user.password = newPassword;
    this.save();
    return true;
  }
}

export const store = new DataStore();
