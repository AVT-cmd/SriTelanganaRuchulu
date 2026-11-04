import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { Category, Product, Order, User, CustomerRecord, OrderStatus } from '../types/index.js';
import { mockCategories, mockProducts } from './seedData.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const resolveDbFile = () => {
  if (process.env.VERCEL) {
    const tmpFile = '/tmp/db_store.json';
    if (!fs.existsSync(tmpFile)) {
      const candidates = [
        path.join(__dirname, 'db_store.json'),
        path.resolve(process.cwd(), 'src/data/db_store.json'),
        path.resolve(process.cwd(), 'backend/src/data/db_store.json'),
        path.resolve(__dirname, '../../src/data/db_store.json')
      ];
      for (const c of candidates) {
        if (fs.existsSync(c)) {
          try {
            fs.copyFileSync(c, tmpFile);
            return tmpFile;
          } catch (_) {}
        }
      }
    } else {
      return tmpFile;
    }
  }

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

const CLOUD_KV_KEY = 'str_full_db_store_v1';
const getCloudKvConfig = (): { url: string; token: string } | null => {
  const url = (process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL || '').trim().replace(/\/+$/, '');
  const token = (process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN || '').trim();
  if (url && token) return { url, token };
  return null;
};

// Persistent JSON + Cloud-KV-backed DataStore for Sri Telangana Ruchulu
class DataStore {
  private categories: Category[] = [];
  private products: Product[] = [];
  private orders: Order[] = [];
  private users: User[] = [];
  private lastCloudHydrateAt = 0;
  private pendingCloudSave: Promise<void> | null = null;

  constructor() {
    this.seed();
  }

  public isCloudPersistenceEnabled(): boolean {
    return getCloudKvConfig() !== null;
  }

  public async ensureCloudHydrated(force = false): Promise<void> {
    const kv = getCloudKvConfig();
    if (!kv) return;
    const now = Date.now();
    if (!force && this.lastCloudHydrateAt > 0 && now - this.lastCloudHydrateAt < 3000) {
      return;
    }
    if (this.pendingCloudSave) {
      await this.pendingCloudSave.catch(() => {});
    }
    try {
      const res = await fetch(`${kv.url}/get/${encodeURIComponent(CLOUD_KV_KEY)}`, {
        method: 'GET',
        headers: { Authorization: `Bearer ${kv.token}` }
      });
      if (!res.ok) return;
      const body: any = await res.json();
      if (!body || body.result === null || body.result === undefined) {
        // First time connecting Cloud KV: seed Cloud KV with current state
        this.lastCloudHydrateAt = now;
        await this.pushToCloud();
        return;
      }
      const parsed = typeof body.result === 'string' ? JSON.parse(body.result) : body.result;
      if (parsed && typeof parsed === 'object') {
        if (Array.isArray(parsed.users) && parsed.users.length > 0) this.users = parsed.users;
        if (Array.isArray(parsed.orders)) this.orders = parsed.orders;
        if (Array.isArray(parsed.products) && parsed.products.length > 0) this.products = parsed.products;
        if (Array.isArray(parsed.categories) && parsed.categories.length > 0) this.categories = parsed.categories;
        this.lastCloudHydrateAt = now;
      }
    } catch (err) {
      console.warn('[DataStore] Cloud KV hydrate skipped:', err);
    }
  }

  private async pushToCloud(): Promise<void> {
    const kv = getCloudKvConfig();
    if (!kv) return;
    try {
      const snapshot = JSON.stringify(this.getFullDbSnapshot());
      await fetch(`${kv.url}/set/${encodeURIComponent(CLOUD_KV_KEY)}`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${kv.token}`,
          'Content-Type': 'text/plain; charset=utf-8'
        },
        body: snapshot
      });
      this.lastCloudHydrateAt = Date.now();
    } catch (err) {
      console.warn('[DataStore] Cloud KV save failed:', err);
    }
  }

  public async flushCloudSave(): Promise<void> {
    if (this.pendingCloudSave) {
      await this.pendingCloudSave.catch(() => {});
      this.pendingCloudSave = null;
    }
  }

  public getFullDbSnapshot() {
    return {
      users: this.users,
      orders: this.orders,
      products: this.products,
      categories: this.categories
    };
  }

  private save() {
    const data = this.getFullDbSnapshot();
    try {
      fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
    } catch (err) {
      if (process.env.VERCEL) {
        try {
          fs.writeFileSync('/tmp/db_store.json', JSON.stringify(data, null, 2), 'utf-8');
        } catch (_) {}
      }
      console.warn('[DataStore] Failed to persist data to db_store.json:', err);
    }
    if (getCloudKvConfig()) {
      this.pendingCloudSave = this.pushToCloud();
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

    // Ensure genuine Administrator account always exists (including official Gmail inbox)
    const defaultAdminPassword = process.env.ADMIN_PASSWORD || this.users.find(u => u.role === 'ADMIN')?.password || 'admin123';
    const hasOfficialGmailAdmin = this.users.some(u => u.email.toLowerCase() === 'adminsritelanganaruchulu@gmail.com');
    if (!hasOfficialGmailAdmin) {
      this.users.unshift({
        id: this.users.some(u => u.id === 1) ? Math.max(...this.users.map(u => u.id)) + 1 : 1,
        email: 'adminsritelanganaruchulu@gmail.com',
        name: 'Administrator',
        password: defaultAdminPassword,
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
    const clean = identifier ? identifier.toString().toLowerCase().trim() : '';
    return this.products.find(p => 
      p.slug?.toLowerCase() === clean || 
      p.id.toString() === clean ||
      p.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') === clean
    );
  }

  public createProduct(productData: Omit<Product, 'id'> & { id?: number }): Product {
    const requestedId = productData.id ? Number(productData.id) : 0;
    const nextId = requestedId > 0
      ? requestedId
      : (this.products.length > 0 ? Math.max(...this.products.map(p => p.id)) + 1 : 1);

    const existingIdx = this.products.findIndex(p => p.id === nextId);
    const newProduct: Product = {
      ...(existingIdx !== -1 ? this.products[existingIdx] : {}),
      ...productData,
      id: nextId,
      price: Number(productData.price),
      regularPrice: productData.regularPrice !== undefined ? Number(productData.regularPrice) : Number(productData.price),
      slug: productData.slug || productData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
      isVisible: productData.isVisible !== undefined ? productData.isVisible : true,
      isInStock: productData.isInStock !== undefined ? productData.isInStock : true,
      categories: productData.categories || []
    };

    if (existingIdx !== -1) {
      this.products[existingIdx] = newProduct;
    } else {
      this.products.unshift(newProduct);
    }
    this.save();
    return newProduct;
  }

  public updateProduct(id: number, updates: Partial<Product>): Product | null {
    const numId = Number(id);
    const cleanUpdates = { ...updates };
    if (cleanUpdates.price !== undefined) cleanUpdates.price = Number(cleanUpdates.price);
    if (cleanUpdates.regularPrice !== undefined) cleanUpdates.regularPrice = Number(cleanUpdates.regularPrice);

    const index = this.products.findIndex(p => p.id === numId);
    if (index === -1) {
      // Upsert custom-created product if full details arrive at a cold container
      if (cleanUpdates.name) {
        const upserted: Product = {
          id: numId,
          name: cleanUpdates.name,
          slug: cleanUpdates.slug || cleanUpdates.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
          price: cleanUpdates.price ?? 400,
          regularPrice: cleanUpdates.regularPrice ?? cleanUpdates.price ?? 450,
          imageUrl: cleanUpdates.imageUrl || '/images/premium_snacks.jpg',
          isInStock: cleanUpdates.isInStock !== undefined ? Boolean(cleanUpdates.isInStock) : true,
          isVisible: cleanUpdates.isVisible !== undefined ? Boolean(cleanUpdates.isVisible) : true,
          categories: cleanUpdates.categories || [],
          shortDescription: cleanUpdates.shortDescription || '',
          description: cleanUpdates.description || ''
        };
        this.products.unshift(upserted);
        this.save();
        return upserted;
      }
      return null;
    }
    this.products[index] = { ...this.products[index], ...cleanUpdates, id: numId };
    this.save();
    return this.products[index];
  }

  public syncCatalogSnapshot(payload: {
    overrides?: Record<string, Partial<Product>>;
    created?: Product[];
    deletedIds?: number[];
    replaceProducts?: Product[];
  }): { products: Product[]; appliedCount: number } {
    let appliedCount = 0;

    if (Array.isArray(payload.replaceProducts) && payload.replaceProducts.length > 0) {
      this.products = payload.replaceProducts.map((p, i) => ({
        ...p,
        id: Number(p.id) || i + 1,
        price: Number(p.price) || 0,
        regularPrice: p.regularPrice !== undefined ? Number(p.regularPrice) : Number(p.price) || 0,
        slug: p.slug || (p.name || `product-${i + 1}`).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
        isInStock: p.isInStock !== undefined ? Boolean(p.isInStock) : true,
        isVisible: p.isVisible !== undefined ? Boolean(p.isVisible) : true,
        categories: Array.isArray(p.categories) ? p.categories : []
      }));
      appliedCount = this.products.length;
      this.save();
      return { products: this.products, appliedCount };
    }

    if (Array.isArray(payload.deletedIds) && payload.deletedIds.length > 0) {
      const delSet = new Set(payload.deletedIds.map(Number));
      const before = this.products.length;
      this.products = this.products.filter(p => !delSet.has(p.id));
      appliedCount += before - this.products.length;
    }

    if (Array.isArray(payload.created) && payload.created.length > 0) {
      for (const item of [...payload.created].reverse()) {
        if (!item || !item.name) continue;
        const itemId = Number(item.id);
        if (!itemId) continue;
        const existingIdx = this.products.findIndex(p => p.id === itemId);
        const normalized: Product = {
          ...(existingIdx !== -1 ? this.products[existingIdx] : {}),
          ...item,
          id: itemId,
          price: Number(item.price) || 350,
          regularPrice: item.regularPrice !== undefined ? Number(item.regularPrice) : Number(item.price) || 350,
          slug: item.slug || item.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
          isInStock: item.isInStock !== undefined ? Boolean(item.isInStock) : true,
          isVisible: item.isVisible !== undefined ? Boolean(item.isVisible) : true,
          categories: Array.isArray(item.categories) ? item.categories : []
        };
        if (existingIdx !== -1) {
          this.products[existingIdx] = normalized;
        } else {
          this.products.unshift(normalized);
        }
        appliedCount++;
      }
    }

    if (payload.overrides && typeof payload.overrides === 'object') {
      for (const [key, rawUpdates] of Object.entries(payload.overrides)) {
        const numId = Number(key);
        if (!numId || !rawUpdates) continue;
        const idx = this.products.findIndex(p => p.id === numId);
        const clean: Partial<Product> = { ...rawUpdates };
        if (clean.price !== undefined) clean.price = Number(clean.price);
        if (clean.regularPrice !== undefined) clean.regularPrice = Number(clean.regularPrice);
        if (idx !== -1) {
          this.products[idx] = { ...this.products[idx], ...clean, id: numId };
          appliedCount++;
        } else if (clean.name) {
          this.products.unshift({
            id: numId,
            name: clean.name,
            slug: clean.slug || clean.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
            price: clean.price ?? 400,
            regularPrice: clean.regularPrice ?? clean.price ?? 450,
            imageUrl: clean.imageUrl || '/images/premium_snacks.jpg',
            isInStock: clean.isInStock !== undefined ? Boolean(clean.isInStock) : true,
            isVisible: clean.isVisible !== undefined ? Boolean(clean.isVisible) : true,
            categories: clean.categories || [],
            shortDescription: clean.shortDescription || '',
            description: clean.description || ''
          });
          appliedCount++;
        }
      }
    }

    if (appliedCount > 0) {
      this.save();
    }
    return { products: this.products, appliedCount };
  }

  public deleteProduct(id: number): boolean {
    const initialLength = this.products.length;
    this.products = this.products.filter(p => p.id !== id);
    const deleted = this.products.length < initialLength;
    if (deleted) this.save();
    return deleted;
  }

  public resetProducts(): Product[] {
    this.products = mockProducts.map(p => ({
      ...p,
      isVisible: true
    }));
    this.save();
    return this.products;
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
    const clean = email.toLowerCase().trim();
    const direct = this.users.find(u => u.email.toLowerCase() === clean);
    if (direct) return direct;

    const adminAliases = [
      'adminsritelanganaruchulu@gmail.com',
      'admin@sritelanganaruchulu.com',
      'sritelanganaruchulu@gmail.com',
      'sritelaganaruchuluu@gmail.com'
    ];
    if (adminAliases.includes(clean)) {
      return this.users.find(u => u.role === 'ADMIN');
    }
    return undefined;
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

  public updateAdminPassword(newPassword: string): boolean {
    let updatedAny = false;
    for (const u of this.users) {
      if (u.role === 'ADMIN') {
        u.password = newPassword;
        updatedAny = true;
      }
    }
    if (!updatedAny) {
      this.users.unshift({
        id: this.users.length > 0 ? Math.max(...this.users.map(u => u.id)) + 1 : 1,
        email: 'adminsritelanganaruchulu@gmail.com',
        name: 'Administrator',
        password: newPassword,
        role: 'ADMIN',
        phone: '+91 81213 45585',
        city: 'Warangal',
        address: 'Collectorate Road, Subedari',
        createdAt: new Date().toISOString()
      });
    }
    this.save();
    return true;
  }
}

export const store = new DataStore();
