import { useState, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  getAdminStats, 
  getAllProductsAdmin, 
  getOrders, 
  getCustomers, 
  updateOrderTracking, 
  updateOrderStatus,
  updateProduct, 
  createProduct, 
  deleteProduct,
  getCategories 
} from '../api';
import type { Product, Order, OrderStatus, CustomerRecord } from '../types';
import { 
  Package, 
  TrendingUp, 
  Users, 
  ShoppingBag, 
  Truck, 
  Edit3, 
  Trash2, 
  Eye, 
  EyeOff, 
  Plus, 
  Search, 
  X, 
  IndianRupee, 
  MapPin, 
  Phone, 
  Mail,
  Copy,
  Check,
  AlertTriangle,
  RefreshCw,
  ShieldCheck,
  Sparkles
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ORDER_STATUS_CONFIG: Record<OrderStatus, { label: string; color: string; bg: string; dot: string }> = {
  PENDING: { label: 'Pending Approval', color: 'text-amber-800', bg: 'bg-amber-100/80 border-amber-300', dot: 'bg-amber-500' },
  CONFIRMED: { label: 'Order Confirmed', color: 'text-blue-800', bg: 'bg-blue-100/80 border-blue-300', dot: 'bg-blue-500' },
  PREPARING: { label: 'Preparing / Packing', color: 'text-purple-800', bg: 'bg-purple-100/80 border-purple-300', dot: 'bg-purple-500' },
  SHIPPED: { label: 'Shipped / In Transit', color: 'text-indigo-800', bg: 'bg-indigo-100/80 border-indigo-300', dot: 'bg-indigo-500' },
  OUT_FOR_DELIVERY: { label: 'Out for Delivery', color: 'text-orange-800', bg: 'bg-orange-100/80 border-orange-300', dot: 'bg-orange-500' },
  DELIVERED: { label: 'Delivered', color: 'text-green-800', bg: 'bg-green-100/80 border-green-300', dot: 'bg-green-500' },
  CANCELLED: { label: 'Cancelled', color: 'text-red-800', bg: 'bg-red-100/80 border-red-300', dot: 'bg-red-500' }
};

const COURIER_PRESETS = [
  'DTDC Express',
  'BlueDart Express',
  'Sri Telangana Tri-City Express',
  'Delhivery Surface',
  'India Post Speed Post',
  'Tri-City Local Rider'
];

const PRESET_PRODUCT_IMAGES = [
  { label: 'Veg Pickles', url: '/images/veg_pickles.jpg' },
  { label: 'Non-Veg Pickles', url: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&q=80&w=800' },
  { label: 'Traditional Sweets', url: 'https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?auto=format&fit=crop&q=80&w=800' },
  { label: 'Hot Snacks (Sakinalu)', url: '/images/premium_snacks.jpg' },
  { label: 'Spice Podulu', url: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&q=80&w=800' }
];

export const AdminDashboard = () => {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<'overview' | 'orders' | 'products' | 'customers'>('overview');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Queries
  const { data: stats, isLoading: isStatsLoading, refetch: refetchStats } = useQuery({
    queryKey: ['adminStats'],
    queryFn: getAdminStats,
  });

  const { data: products, isLoading: isProductsLoading, refetch: refetchProducts } = useQuery({
    queryKey: ['adminProducts'],
    queryFn: getAllProductsAdmin,
  });

  const { data: orders, isLoading: isOrdersLoading, refetch: refetchOrders } = useQuery({
    queryKey: ['adminOrders'],
    queryFn: getOrders,
  });

  const { data: customers, isLoading: isCustomersLoading, refetch: refetchCustomers } = useQuery({
    queryKey: ['adminCustomers'],
    queryFn: getCustomers,
  });

  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: getCategories,
  });

  // Modals & Forms State
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [editingTrackingOrder, setEditingTrackingOrder] = useState<Order | null>(null);
  const [trackingForm, setTrackingForm] = useState({
    status: 'PENDING' as OrderStatus,
    trackingId: '',
    courierPartner: '',
    trackingNotes: '',
    estimatedDelivery: ''
  });

  // Customer Orders Modal
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerRecord | null>(null);

  // Product modal & quick edit
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [productForm, setProductForm] = useState({
    name: '',
    price: 400,
    regularPrice: 450,
    categoryId: 1,
    imageUrl: '/images/premium_snacks.jpg',
    shortDescription: 'Traditional homemade Andhra & Telangana product.',
    description: 'Handcrafted recipe using pure traditional spices.',
    isInStock: true,
    isVisible: true
  });

  // Inline Quick Price Modal
  const [quickPriceProduct, setQuickPriceProduct] = useState<Product | null>(null);
  const [quickPriceVal, setQuickPriceVal] = useState<number>(400);

  // Filters & search
  const [productSearch, setProductSearch] = useState('');
  const [productCategoryFilter, setProductCategoryFilter] = useState('ALL');
  const [productStockFilter, setProductStockFilter] = useState<'ALL' | 'IN_STOCK' | 'OUT_OF_STOCK' | 'HIDDEN'>('ALL');

  const [orderSearch, setOrderSearch] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState<string>('ALL');

  const [customerSearch, setCustomerSearch] = useState('');

  // Copy to clipboard helper
  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(text);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Mutations
  const trackingMutation = useMutation({
    mutationFn: ({ id, updates }: { id: number; updates: any }) => updateOrderTracking(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminOrders'] });
      queryClient.invalidateQueries({ queryKey: ['adminStats'] });
      queryClient.invalidateQueries({ queryKey: ['adminCustomers'] });
      setEditingTrackingOrder(null);
    }
  });

  const orderStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: number; status: OrderStatus }) => updateOrderStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminOrders'] });
      queryClient.invalidateQueries({ queryKey: ['adminStats'] });
      queryClient.invalidateQueries({ queryKey: ['adminCustomers'] });
    }
  });

  const updateProductMutation = useMutation({
    mutationFn: ({ id, updates }: { id: number; updates: Partial<Product> }) => updateProduct(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminProducts'] });
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['adminStats'] });
      setIsProductModalOpen(false);
      setEditingProduct(null);
      setQuickPriceProduct(null);
    }
  });

  const createProductMutation = useMutation({
    mutationFn: (data: Partial<Product>) => createProduct(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminProducts'] });
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['adminStats'] });
      setIsProductModalOpen(false);
      setEditingProduct(null);
    }
  });

  const deleteProductMutation = useMutation({
    mutationFn: (id: number) => deleteProduct(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminProducts'] });
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['adminStats'] });
    }
  });

  const handleRefreshAll = () => {
    refetchStats();
    refetchProducts();
    refetchOrders();
    refetchCustomers();
  };

  // Handlers for Tracking Modal
  const handleOpenTrackingModal = (order: Order) => {
    setEditingTrackingOrder(order);
    setTrackingForm({
      status: order.status,
      trackingId: order.trackingId || `STR-TRK-${Math.floor(100000 + Math.random() * 900000)}`,
      courierPartner: order.courierPartner || 'Sri Telangana Tri-City Express',
      trackingNotes: order.trackingNotes || 'Package in transit from Warangal hub',
      estimatedDelivery: order.estimatedDelivery || 'Within 24-48 hours'
    });
  };

  const handleGenerateTrackingId = () => {
    setTrackingForm(prev => ({
      ...prev,
      trackingId: `STR-TRK-${Math.floor(100000 + Math.random() * 900000)}`
    }));
  };

  const handleSaveTracking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTrackingOrder) return;
    trackingMutation.mutate({
      id: editingTrackingOrder.id,
      updates: trackingForm
    });
  };

  // Handlers for Products Modal
  const handleOpenAddProduct = () => {
    setEditingProduct(null);
    setProductForm({
      name: '',
      price: 400,
      regularPrice: 450,
      categoryId: categories?.[0]?.id || 1,
      imageUrl: '/images/veg_pickles.jpg',
      shortDescription: 'Traditional homemade Andhra & Telangana product.',
      description: 'Handcrafted recipe using pure traditional spices and fresh ingredients.',
      isInStock: true,
      isVisible: true
    });
    setIsProductModalOpen(true);
  };

  const handleOpenEditProduct = (p: Product) => {
    setEditingProduct(p);
    setProductForm({
      name: p.name,
      price: p.price,
      regularPrice: p.regularPrice || p.price,
      categoryId: p.categories?.[0]?.id || 1,
      imageUrl: p.imageUrl || '/images/premium_snacks.jpg',
      shortDescription: p.shortDescription || '',
      description: p.description || '',
      isInStock: p.isInStock,
      isVisible: p.isVisible !== false
    });
    setIsProductModalOpen(true);
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    const selectedCategory = categories?.find(c => c.id === Number(productForm.categoryId));
    const payload = {
      name: productForm.name,
      price: Number(productForm.price),
      regularPrice: Number(productForm.regularPrice),
      imageUrl: productForm.imageUrl,
      shortDescription: productForm.shortDescription,
      description: productForm.description,
      isInStock: productForm.isInStock,
      isVisible: productForm.isVisible,
      categories: selectedCategory ? [selectedCategory] : []
    };

    if (editingProduct) {
      updateProductMutation.mutate({ id: editingProduct.id, updates: payload });
    } else {
      createProductMutation.mutate(payload);
    }
  };

  // Filtered Lists
  const filteredProducts = useMemo(() => {
    if (!products) return [];
    return products.filter(p => {
      const matchSearch = p.name.toLowerCase().includes(productSearch.toLowerCase()) || 
                          p.slug.toLowerCase().includes(productSearch.toLowerCase());
      const matchCat = productCategoryFilter === 'ALL' || p.categories?.some(c => c.id.toString() === productCategoryFilter || c.slug === productCategoryFilter);
      
      let matchStock = true;
      if (productStockFilter === 'IN_STOCK') matchStock = p.isInStock;
      else if (productStockFilter === 'OUT_OF_STOCK') matchStock = !p.isInStock;
      else if (productStockFilter === 'HIDDEN') matchStock = p.isVisible === false;

      return matchSearch && matchCat && matchStock;
    });
  }, [products, productSearch, productCategoryFilter, productStockFilter]);

  const filteredOrders = useMemo(() => {
    if (!orders) return [];
    return orders.filter(o => {
      const matchSearch = o.orderNumber.toLowerCase().includes(orderSearch.toLowerCase()) ||
                          (o.trackingId && o.trackingId.toLowerCase().includes(orderSearch.toLowerCase())) ||
                          o.customerName.toLowerCase().includes(orderSearch.toLowerCase()) ||
                          o.shippingAddress.toLowerCase().includes(orderSearch.toLowerCase()) ||
                          o.phone.includes(orderSearch);
      const matchStatus = orderStatusFilter === 'ALL' || o.status === orderStatusFilter;
      return matchSearch && matchStatus;
    });
  }, [orders, orderSearch, orderStatusFilter]);

  const filteredCustomers = useMemo(() => {
    if (!customers) return [];
    return customers.filter(c => 
      c.name.toLowerCase().includes(customerSearch.toLowerCase()) ||
      c.email.toLowerCase().includes(customerSearch.toLowerCase()) ||
      (c.phone && c.phone.includes(customerSearch)) ||
      (c.city && c.city.toLowerCase().includes(customerSearch.toLowerCase())) ||
      (c.address && c.address.toLowerCase().includes(customerSearch.toLowerCase()))
    );
  }, [customers, customerSearch]);

  // Orders belonging to selected customer
  const customerSpecificOrders = useMemo(() => {
    if (!selectedCustomer || !orders) return [];
    const email = selectedCustomer.email.toLowerCase();
    const phone = selectedCustomer.phone?.replace(/[^0-9]/g, '');
    return orders.filter(o => 
      o.email.toLowerCase() === email || 
      (phone && o.phone.replace(/[^0-9]/g, '') === phone)
    );
  }, [selectedCustomer, orders]);

  // Metric counts
  const totalRevenue = useMemo(() => {
    if (!orders) return stats?.totalRevenue || 0;
    return orders.reduce((sum, o) => sum + (o.status !== 'CANCELLED' ? o.totalAmount : 0), 0);
  }, [orders, stats]);

  const activeDispatchesCount = useMemo(() => {
    if (!orders) return 0;
    return orders.filter(o => ['PREPARING', 'SHIPPED', 'OUT_FOR_DELIVERY'].includes(o.status)).length;
  }, [orders]);

  const inStockCount = useMemo(() => {
    return products?.filter(p => p.isInStock).length || 0;
  }, [products]);

  const hiddenProductsCount = useMemo(() => {
    return products?.filter(p => p.isVisible === false).length || 0;
  }, [products]);

  return (
    <div className="bg-gray-50/70 min-h-screen pt-24 pb-12 font-sans">
      <Helmet>
        <title>Admin Command Center | Sri Telangana Ruchulu</title>
      </Helmet>

      <div className="w-full px-2 sm:px-4 lg:px-6 max-w-[1700px] mx-auto">
        
        {/* Top Header Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-amber-100 text-amber-900 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider flex items-center gap-1.5 shadow-2xs">
                <ShieldCheck size={14} className="text-amber-700" /> Admin Command Center
              </span>
              <span className="text-xs text-gray-400 font-medium">Sri Telangana Ruchulu HQ</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-brand-dark mt-1.5 tracking-tight">
              Store Management & Live Tracking
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
              Comprehensive real-time tracking, customer records, stock inventory, and product pricing.
            </p>
          </div>

          <div className="flex items-center gap-3 self-start md:self-auto">
            <button
              onClick={handleRefreshAll}
              className="bg-white hover:bg-gray-100 text-gray-700 border border-gray-200 px-3.5 py-2.5 rounded-2xl text-xs font-bold transition flex items-center gap-1.5 shadow-xs"
              title="Refresh all store metrics"
            >
              <RefreshCw size={14} /> Refresh
            </button>

            <button
              onClick={handleOpenAddProduct}
              className="bg-brand-primary hover:bg-yellow-600 text-white font-bold px-4 py-2.5 rounded-2xl text-xs sm:text-sm transition flex items-center gap-1.5 shadow-md"
            >
              <Plus size={16} /> Add New Product
            </button>
          </div>
        </div>

        {/* 5 KPI Metric Cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 sm:gap-4 mb-8">
          {/* 1. Total Revenue */}
          <div className="bg-white p-4 sm:p-5 rounded-3xl shadow-xs border border-gray-100 relative overflow-hidden">
            <div className="flex items-center justify-between text-gray-400 mb-1.5">
              <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider">Total Revenue</span>
              <IndianRupee size={18} className="text-amber-500" />
            </div>
            <p className="text-xl sm:text-2xl font-black text-brand-dark">
              ₹{isStatsLoading ? '...' : totalRevenue.toLocaleString('en-IN')}
            </p>
            <p className="text-[10px] sm:text-[11px] text-green-600 font-bold mt-1 flex items-center gap-1">
              ✓ Lifetime Valid Bills
            </p>
          </div>

          {/* 2. Total Orders */}
          <div className="bg-white p-4 sm:p-5 rounded-3xl shadow-xs border border-gray-100 relative overflow-hidden">
            <div className="flex items-center justify-between text-gray-400 mb-1.5">
              <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider">Total Orders</span>
              <ShoppingBag size={18} className="text-blue-500" />
            </div>
            <p className="text-xl sm:text-2xl font-black text-blue-600">
              {isOrdersLoading ? '...' : (orders?.length || 0)}
            </p>
            <p className="text-[10px] sm:text-[11px] text-gray-400 font-medium mt-1">
              {orders?.filter(o => o.status === 'DELIVERED').length || 0} Delivered
            </p>
          </div>

          {/* 3. Active Dispatches */}
          <div className="bg-white p-4 sm:p-5 rounded-3xl shadow-xs border border-gray-100 relative overflow-hidden">
            <div className="flex items-center justify-between text-gray-400 mb-1.5">
              <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider">Live Dispatches</span>
              <Truck size={18} className="text-orange-500" />
            </div>
            <p className="text-xl sm:text-2xl font-black text-orange-600">
              {activeDispatchesCount}
            </p>
            <p className="text-[10px] sm:text-[11px] text-orange-700 font-semibold mt-1">
              In Kitchen / Transit
            </p>
          </div>

          {/* 4. Products Catalog */}
          <div className="bg-white p-4 sm:p-5 rounded-3xl shadow-xs border border-gray-100 relative overflow-hidden">
            <div className="flex items-center justify-between text-gray-400 mb-1.5">
              <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider">Products Catalog</span>
              <Package size={18} className="text-green-500" />
            </div>
            <p className="text-xl sm:text-2xl font-black text-green-600">
              {isProductsLoading ? '...' : (products?.length || 0)}
            </p>
            <p className="text-[10px] sm:text-[11px] text-gray-500 font-medium mt-1">
              <span className="text-green-700 font-bold">{inStockCount} In Stock</span> | <span className="text-red-600 font-bold">{products ? products.length - inStockCount : 0} Out</span>
            </p>
          </div>

          {/* 5. Customer Records */}
          <div className="bg-white p-4 sm:p-5 rounded-3xl shadow-xs border border-gray-100 relative overflow-hidden col-span-2 md:col-span-1">
            <div className="flex items-center justify-between text-gray-400 mb-1.5">
              <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider">Customer Records</span>
              <Users size={18} className="text-purple-500" />
            </div>
            <p className="text-xl sm:text-2xl font-black text-purple-600">
              {isCustomersLoading ? '...' : (customers?.length || 0)}
            </p>
            <p className="text-[10px] sm:text-[11px] text-purple-700 font-semibold mt-1">
              Verified Patron Base
            </p>
          </div>
        </div>

        {/* Tab Navigation Controls */}
        <div className="flex items-center bg-white p-1.5 rounded-2xl border border-gray-200/80 shadow-xs mb-8 overflow-x-auto max-w-full">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 sm:px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'overview'
                ? 'bg-brand-dark text-white shadow-sm'
                : 'text-gray-600 hover:text-brand-dark hover:bg-gray-50'
            }`}
          >
            <TrendingUp size={16} /> Overview & Analytics
          </button>
          
          <button
            onClick={() => setActiveTab('orders')}
            className={`px-4 sm:px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'orders'
                ? 'bg-brand-dark text-white shadow-sm'
                : 'text-gray-600 hover:text-brand-dark hover:bg-gray-50'
            }`}
          >
            <Truck size={16} /> Orders & Live Tracking 
            <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
              activeTab === 'orders' ? 'bg-amber-400 text-brand-dark' : 'bg-gray-100 text-gray-700'
            }`}>
              {orders?.length || 0}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('products')}
            className={`px-4 sm:px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'products'
                ? 'bg-brand-dark text-white shadow-sm'
                : 'text-gray-600 hover:text-brand-dark hover:bg-gray-50'
            }`}
          >
            <Package size={16} /> Products Catalog 
            <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
              activeTab === 'products' ? 'bg-amber-400 text-brand-dark' : 'bg-gray-100 text-gray-700'
            }`}>
              {products?.length || 0}
            </span>
            {hiddenProductsCount > 0 && (
              <span className="text-[10px] bg-red-100 text-red-700 px-1.5 py-0.2 rounded-md font-bold">
                {hiddenProductsCount} Hidden
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('customers')}
            className={`px-4 sm:px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'customers'
                ? 'bg-brand-dark text-white shadow-sm'
                : 'text-gray-600 hover:text-brand-dark hover:bg-gray-50'
            }`}
          >
            <Users size={16} /> Customers Directory 
            <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
              activeTab === 'customers' ? 'bg-amber-400 text-brand-dark' : 'bg-gray-100 text-gray-700'
            }`}>
              {customers?.length || 0}
            </span>
          </button>
        </div>

        {/* ============================================================ */}
        {/* TAB 1: OVERVIEW & REAL-TIME INSIGHTS */}
        {/* ============================================================ */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Quick Actions Panel Banner */}
            <div className="bg-gradient-to-r from-amber-600 via-amber-700 to-brand-dark rounded-3xl p-6 sm:p-8 text-white shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
              <div className="absolute right-0 top-0 bottom-0 w-80 bg-white/5 rounded-full blur-3xl pointer-events-none"></div>

              <div className="space-y-2 relative z-10">
                <span className="bg-white/20 text-white text-[10px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider">
                  Admin Master Controls
                </span>
                <h3 className="text-xl sm:text-2xl font-black tracking-tight">
                  Complete Catalog & Live Tracking Center
                </h3>
                <p className="text-white/80 text-xs sm:text-sm max-w-2xl leading-relaxed">
                  Manage orders, assign Tracking IDs to every dispatch, toggle stock availability, adjust 1 KG base pricing, hide products from customers, and inspect customer purchased items.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3 relative z-10">
                <button
                  onClick={handleOpenAddProduct}
                  className="bg-white text-brand-dark px-5 py-3 rounded-2xl font-bold text-xs sm:text-sm hover:bg-amber-50 transition shadow-md flex items-center gap-2"
                >
                  <Plus size={16} className="text-brand-primary" /> Add Product
                </button>
                <button
                  onClick={() => setActiveTab('orders')}
                  className="bg-black/30 hover:bg-black/40 text-white px-5 py-3 rounded-2xl font-bold text-xs sm:text-sm transition border border-white/20 flex items-center gap-2"
                >
                  <Truck size={16} /> Manage Live Orders
                </button>
              </div>
            </div>

            {/* Recent Orders Overview Table */}
            <div className="bg-white rounded-2xl shadow-xs border border-gray-100 overflow-hidden">
              <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h3 className="font-bold text-base text-brand-dark flex items-center gap-2">
                    <Truck size={18} className="text-brand-primary" /> Recent Orders & Live Tracking
                  </h3>
                  <p className="text-[11px] text-gray-400 mt-0.5">
                    Real-time customer dispatches with assigned Tracking IDs and live status updates
                  </p>
                </div>
                <button
                  onClick={() => setActiveTab('orders')}
                  className="text-xs font-bold text-brand-primary hover:text-yellow-700 flex items-center gap-1 self-start sm:self-auto"
                >
                  View All {orders?.length || 0} Orders →
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs table-auto">
                  <thead>
                    <tr className="border-b bg-gray-50/90 text-gray-500 text-[11px] uppercase tracking-wider">
                      <th className="py-2.5 px-2 font-bold whitespace-nowrap">Order ID</th>
                      <th className="py-2.5 px-2 font-bold whitespace-nowrap">Tracking ID</th>
                      <th className="py-2.5 px-2 font-bold whitespace-nowrap">Customer</th>
                      <th className="py-2.5 px-2 font-bold whitespace-nowrap">Items</th>
                      <th className="py-2.5 px-2 font-bold whitespace-nowrap">Total</th>
                      <th className="py-2.5 px-2 font-bold whitespace-nowrap">Status</th>
                      <th className="py-2.5 px-2 font-bold text-right whitespace-nowrap">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {orders?.slice(0, 5).map((order) => {
                      const cfg = ORDER_STATUS_CONFIG[order.status] || ORDER_STATUS_CONFIG.PENDING;
                      return (
                        <tr key={order.id} className="hover:bg-amber-50/20 transition">
                          <td className="py-2 px-2 align-top whitespace-nowrap">
                            <div className="flex items-center gap-1">
                              <span className="font-mono font-bold text-brand-dark text-xs">{order.orderNumber}</span>
                              <button
                                onClick={() => handleCopy(order.orderNumber)}
                                className="text-gray-400 hover:text-brand-dark p-0.5 rounded"
                                title="Copy Order Number"
                              >
                                {copiedId === order.orderNumber ? <Check size={11} className="text-green-600" /> : <Copy size={11} />}
                              </button>
                            </div>
                            <span className="text-[10px] text-gray-400 block whitespace-nowrap mt-0.5">
                              {new Date(order.createdAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}
                            </span>
                          </td>
                          <td className="py-2 px-2 align-top">
                            {order.trackingId ? (
                              <div className="flex items-center gap-1">
                                <span className="bg-amber-50 text-amber-900 border border-amber-300 font-mono font-bold px-1.5 py-0.5 rounded text-[11px] whitespace-nowrap">
                                  {order.trackingId}
                                </span>
                                <button
                                  onClick={() => handleCopy(order.trackingId!)}
                                  className="text-gray-400 hover:text-brand-dark p-0.5 rounded"
                                  title="Copy Tracking ID"
                                >
                                  {copiedId === order.trackingId ? <Check size={11} className="text-green-600" /> : <Copy size={11} />}
                                </button>
                              </div>
                            ) : (
                              <button
                                onClick={() => {
                                  const generated = `STR-TRK-${Math.floor(100000 + Math.random() * 900000)}`;
                                  trackingMutation.mutate({
                                    id: order.id,
                                    updates: { trackingId: generated, status: order.status === 'PENDING' ? 'CONFIRMED' : order.status }
                                  });
                                }}
                                className="bg-amber-100 hover:bg-amber-200 text-amber-900 border border-amber-300 text-[10px] font-bold px-1.5 py-0.5 rounded flex items-center gap-1 transition shadow-2xs whitespace-nowrap"
                                title="Assign live tracking ID instantly"
                              >
                                <Sparkles size={10} className="text-amber-700" /> Assign ID
                              </button>
                            )}
                            <span className="text-[10px] text-gray-400 block mt-0.5 truncate max-w-[140px]">{order.courierPartner || 'Sri Telangana Express'}</span>
                          </td>
                          <td className="py-2 px-2 align-top">
                            <div className="font-bold text-gray-800 text-xs truncate max-w-[120px]">{order.customerName}</div>
                            <div className="text-[10px] text-gray-400 whitespace-nowrap mt-0.5">{order.phone}</div>
                          </td>
                          <td className="py-2 px-2 align-top">
                            <span className="font-medium text-gray-700 text-[11px] line-clamp-1 max-w-[150px]">
                              {order.items.map(i => `${i.productName} (${i.weight || '500g'})`).join(', ')}
                            </span>
                          </td>
                          <td className="py-2 px-2 align-top font-black text-brand-dark text-xs whitespace-nowrap">
                            ₹{order.totalAmount.toFixed(2)}
                          </td>
                          <td className="py-2 px-2 align-top">
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border flex items-center gap-1 w-fit whitespace-nowrap ${cfg.bg} ${cfg.color}`}>
                              <span className={`w-1 h-1 rounded-full ${cfg.dot}`}></span>
                              {cfg.label}
                            </span>
                          </td>
                          <td className="py-2 px-2 align-top text-right whitespace-nowrap">
                            <div className="flex items-center justify-end gap-1">
                              <button
                                onClick={() => handleOpenTrackingModal(order)}
                                className="bg-brand-dark hover:bg-brand-primary text-white px-2 py-1 rounded-lg text-[10px] font-bold transition shadow-2xs"
                              >
                                Edit Track
                              </button>
                              <button
                                onClick={() => setSelectedOrder(order)}
                                className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-2 py-1 rounded-lg text-[10px] font-bold transition"
                              >
                                Details
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Quick Catalog Stock Alerts */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Out of Stock Products */}
              <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-xs">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-bold text-brand-dark flex items-center gap-2 text-sm sm:text-base">
                    <AlertTriangle size={18} className="text-red-500" /> Out of Stock Products ({products?.filter(p => !p.isInStock).length || 0})
                  </h4>
                  <button
                    onClick={() => { setActiveTab('products'); setProductStockFilter('OUT_OF_STOCK'); }}
                    className="text-xs font-bold text-brand-primary hover:underline"
                  >
                    Manage Stock →
                  </button>
                </div>

                <div className="space-y-3">
                  {products?.filter(p => !p.isInStock).length === 0 ? (
                    <p className="text-xs text-gray-400 py-3 text-center">All products are currently In Stock! 🎉</p>
                  ) : (
                    products?.filter(p => !p.isInStock).slice(0, 4).map(p => (
                      <div key={p.id} className="flex items-center justify-between p-3 rounded-2xl bg-red-50/50 border border-red-100 text-xs">
                        <div className="flex items-center gap-3">
                          <img src={p.imageUrl} alt={p.name} className="w-9 h-9 rounded-xl object-cover" />
                          <div>
                            <span className="font-bold text-gray-800">{p.name}</span>
                            <span className="text-[10px] text-gray-400 block">₹{p.price}/KG</span>
                          </div>
                        </div>
                        <button
                          onClick={() => updateProductMutation.mutate({ id: p.id, updates: { isInStock: true } })}
                          className="bg-green-600 hover:bg-green-700 text-white font-bold px-3 py-1 rounded-xl text-[11px] transition"
                        >
                          Mark In Stock
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Hidden / Stopped Products */}
              <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-xs">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-bold text-brand-dark flex items-center gap-2 text-sm sm:text-base">
                    <EyeOff size={18} className="text-gray-500" /> Hidden / Stopped Products ({hiddenProductsCount})
                  </h4>
                  <button
                    onClick={() => { setActiveTab('products'); setProductStockFilter('HIDDEN'); }}
                    className="text-xs font-bold text-brand-primary hover:underline"
                  >
                    Manage Visibility →
                  </button>
                </div>

                <div className="space-y-3">
                  {hiddenProductsCount === 0 ? (
                    <p className="text-xs text-gray-400 py-3 text-center">No products are stopped from users. All are visible.</p>
                  ) : (
                    products?.filter(p => p.isVisible === false).slice(0, 4).map(p => (
                      <div key={p.id} className="flex items-center justify-between p-3 rounded-2xl bg-gray-50 border border-gray-200 text-xs">
                        <div className="flex items-center gap-3">
                          <img src={p.imageUrl} alt={p.name} className="w-9 h-9 rounded-xl object-cover" />
                          <div>
                            <span className="font-bold text-gray-800">{p.name}</span>
                            <span className="text-[10px] text-gray-400 block">Hidden from storefront</span>
                          </div>
                        </div>
                        <button
                          onClick={() => updateProductMutation.mutate({ id: p.id, updates: { isVisible: true } })}
                          className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-3 py-1 rounded-xl text-[11px] transition flex items-center gap-1"
                        >
                          <Eye size={12} /> Show to Users
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* TAB 2: ORDERS & LIVE TRACKING WITH FULL DETAILS */}
        {/* ============================================================ */}
        {activeTab === 'orders' && (
          <div className="bg-white rounded-2xl shadow-xs border border-gray-100 p-3 sm:p-5 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-lg sm:text-xl font-black text-brand-dark flex items-center gap-2">
                  <Truck className="text-brand-primary" size={20} /> Order History & Live Tracking Details
                </h2>
                <p className="text-[11px] text-gray-400 mt-0.5">
                  Full order records, tracking IDs, courier updates, inline status adjustments, and timeline audits.
                </p>
              </div>

              {/* Search & Status Filters */}
              <div className="flex flex-wrap items-center gap-2">
                <div className="relative">
                  <Search size={14} className="absolute left-3 top-2.5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search Order, Tracking ID, Customer..."
                    value={orderSearch}
                    onChange={(e) => setOrderSearch(e.target.value)}
                    className="pl-8 pr-3 py-1.5 border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-brand-primary w-52 sm:w-64 shadow-2xs"
                  />
                </div>

                <select
                  value={orderStatusFilter}
                  onChange={(e) => setOrderStatusFilter(e.target.value)}
                  className="py-1.5 px-2.5 border border-gray-200 rounded-xl text-xs font-bold text-gray-700 focus:outline-none focus:border-brand-primary bg-white shadow-2xs"
                >
                  <option value="ALL">All Statuses ({orders?.length || 0})</option>
                  <option value="PENDING">Pending Approval</option>
                  <option value="CONFIRMED">Confirmed</option>
                  <option value="PREPARING">Preparing / Packing</option>
                  <option value="SHIPPED">Shipped / In Transit</option>
                  <option value="OUT_FOR_DELIVERY">Out for Delivery</option>
                  <option value="DELIVERED">Delivered</option>
                  <option value="CANCELLED">Cancelled</option>
                </select>
              </div>
            </div>

            {/* Orders Table - Compact Fitted Layout */}
            <div className="overflow-x-auto rounded-xl border border-gray-100">
              <table className="w-full text-left border-collapse text-xs table-auto">
                <thead>
                  <tr className="border-b bg-gray-50/90 text-gray-500 text-[11px] uppercase tracking-wider">
                    <th className="py-2.5 px-2 font-bold whitespace-nowrap">Order ID</th>
                    <th className="py-2.5 px-2 font-bold whitespace-nowrap">Tracking ID & Courier</th>
                    <th className="py-2.5 px-2 font-bold whitespace-nowrap">Customer</th>
                    <th className="py-2.5 px-2 font-bold whitespace-nowrap">Delivery Address</th>
                    <th className="py-2.5 px-2 font-bold whitespace-nowrap">Total Bill</th>
                    <th className="py-2.5 px-2 font-bold whitespace-nowrap">Status</th>
                    <th className="py-2.5 px-2 font-bold text-right whitespace-nowrap">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {isOrdersLoading ? (
                    <tr>
                      <td colSpan={7} className="p-6 text-center text-gray-400 text-xs">Loading order records...</td>
                    </tr>
                  ) : filteredOrders.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="p-6 text-center text-gray-400 text-xs">No matching orders found.</td>
                    </tr>
                  ) : (
                    filteredOrders.map((order) => {
                      const cfg = ORDER_STATUS_CONFIG[order.status] || ORDER_STATUS_CONFIG.PENDING;
                      return (
                        <tr key={order.id} className="hover:bg-amber-50/20 transition">
                          {/* Order Number & Timestamp */}
                          <td className="py-2 px-2 align-top whitespace-nowrap">
                            <div className="flex items-center gap-1">
                              <span className="font-mono font-bold text-brand-dark text-xs whitespace-nowrap">
                                {order.orderNumber}
                              </span>
                              <button
                                onClick={() => handleCopy(order.orderNumber)}
                                className="text-gray-400 hover:text-brand-dark p-0.5 rounded"
                                title="Copy Order Number"
                              >
                                {copiedId === order.orderNumber ? <Check size={11} className="text-green-600" /> : <Copy size={11} />}
                              </button>
                            </div>
                            <span className="text-[10px] text-gray-400 block whitespace-nowrap mt-0.5">
                              {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                            </span>
                          </td>

                          {/* Tracking ID & Courier Partner */}
                          <td className="py-2 px-2 align-top">
                            {order.trackingId ? (
                              <div className="flex items-center gap-1">
                                <span className="bg-amber-50 text-amber-900 border border-amber-300 font-mono font-bold px-1.5 py-0.5 rounded text-[11px] whitespace-nowrap">
                                  {order.trackingId}
                                </span>
                                <button
                                  onClick={() => handleCopy(order.trackingId!)}
                                  className="text-gray-400 hover:text-brand-dark p-0.5 rounded"
                                  title="Copy Tracking ID"
                                >
                                  {copiedId === order.trackingId ? <Check size={11} className="text-green-600" /> : <Copy size={11} />}
                                </button>
                              </div>
                            ) : (
                              <button
                                onClick={() => {
                                  const generated = `STR-TRK-${Math.floor(100000 + Math.random() * 900000)}`;
                                  trackingMutation.mutate({
                                    id: order.id,
                                    updates: { trackingId: generated, status: order.status === 'PENDING' ? 'CONFIRMED' : order.status }
                                  });
                                }}
                                className="bg-amber-100 hover:bg-amber-200 text-amber-900 border border-amber-300 text-[10px] font-bold px-2 py-0.5 rounded flex items-center gap-1 transition shadow-2xs whitespace-nowrap"
                                title="Assign live tracking ID instantly"
                              >
                                <Sparkles size={10} className="text-amber-700" /> Assign ID
                              </button>
                            )}
                            <div className="font-semibold text-gray-700 text-[10px] mt-0.5 truncate max-w-[150px]">
                              {order.courierPartner || 'Sri Telangana Express'}
                            </div>
                            {order.trackingNotes && (
                              <div className="text-[9px] text-gray-400 truncate max-w-[150px] italic" title={order.trackingNotes}>
                                "{order.trackingNotes}"
                              </div>
                            )}
                          </td>

                          {/* Customer Details */}
                          <td className="py-2 px-2 align-top">
                            <div className="font-bold text-gray-900 text-xs truncate max-w-[130px]">{order.customerName}</div>
                            <div className="text-[10px] text-gray-500 flex items-center gap-1 mt-0.5 whitespace-nowrap">
                              <Phone size={9} className="text-gray-400" /> {order.phone}
                            </div>
                            <div className="text-[9px] text-gray-400 truncate max-w-[130px]" title={order.email}>{order.email}</div>
                          </td>

                          {/* Shipping Destination */}
                          <td className="py-2 px-2 align-top">
                            <div className="flex items-start gap-1">
                              <MapPin size={11} className="text-brand-primary flex-shrink-0 mt-0.5" />
                              <span className="line-clamp-2 text-[10px] leading-tight text-gray-600 max-w-[160px]" title={order.shippingAddress}>
                                {order.shippingAddress}
                              </span>
                            </div>
                          </td>

                          {/* Bill Total */}
                          <td className="py-2 px-2 align-top whitespace-nowrap">
                            <div className="font-black text-brand-dark text-xs">₹{order.totalAmount.toFixed(2)}</div>
                            <span className="text-[9px] text-gray-400 block mt-0.5">
                              {order.paymentMethod} {order.shippingFee === 0 ? '• Free' : `• +₹${order.shippingFee}`}
                            </span>
                          </td>

                          {/* Tracking Status Dropdown */}
                          <td className="py-2 px-2 align-top">
                            <div className="space-y-0.5">
                              <select
                                value={order.status}
                                onChange={(e) => {
                                  orderStatusMutation.mutate({
                                    id: order.id,
                                    status: e.target.value as OrderStatus
                                  });
                                }}
                                className={`text-[10px] font-bold rounded-lg border py-1 px-1.5 focus:outline-none cursor-pointer shadow-2xs w-full max-w-[140px] ${cfg.bg} ${cfg.color}`}
                                title="Change tracking status directly"
                              >
                                <option value="PENDING">Pending</option>
                                <option value="CONFIRMED">Confirmed</option>
                                <option value="PREPARING">Preparing</option>
                                <option value="SHIPPED">Shipped</option>
                                <option value="OUT_FOR_DELIVERY">Out for Delivery</option>
                                <option value="DELIVERED">Delivered</option>
                                <option value="CANCELLED">Cancelled</option>
                              </select>
                              {order.estimatedDelivery && (
                                <span className="text-[9px] text-gray-400 block truncate max-w-[140px]">
                                  ETA: {order.estimatedDelivery}
                                </span>
                              )}
                            </div>
                          </td>

                          {/* Actions */}
                          <td className="py-2 px-2 align-top text-right whitespace-nowrap">
                            <div className="flex items-center justify-end gap-1">
                              <button
                                onClick={() => handleOpenTrackingModal(order)}
                                className="bg-brand-dark hover:bg-brand-primary text-white px-2 py-1 rounded-lg text-[10px] font-bold transition shadow-2xs"
                                title="Update tracking number, courier, or notes"
                              >
                                Edit Track
                              </button>
                              <button
                                onClick={() => setSelectedOrder(order)}
                                className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-2 py-1 rounded-lg text-[10px] font-bold transition"
                                title="View full order details and breakdown"
                              >
                                Details
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* TAB 3: PRODUCTS CATALOG MANAGEMENT (STOCK, PRICING, VISIBILITY) */}
        {/* ============================================================ */}
        {activeTab === 'products' && (
          <div className="bg-white rounded-2xl shadow-xs border border-gray-100 p-3 sm:p-5 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-lg sm:text-xl font-black text-brand-dark flex items-center gap-2">
                  <Package className="text-brand-primary" size={20} /> Product Catalog, Stock & Pricing
                </h2>
                <p className="text-[11px] text-gray-400 mt-0.5">
                  Update 1 KG base pricing, toggle In/Out of Stock instantly, stop/show products to customers, or publish new items.
                </p>
              </div>

              {/* Search & Stock Filter Controls */}
              <div className="flex flex-wrap items-center gap-2">
                <div className="relative">
                  <Search size={14} className="absolute left-3 top-2.5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search product..."
                    value={productSearch}
                    onChange={(e) => setProductSearch(e.target.value)}
                    className="pl-8 pr-3 py-1.5 border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-brand-primary w-44 sm:w-56 shadow-2xs"
                  />
                </div>

                <select
                  value={productCategoryFilter}
                  onChange={(e) => setProductCategoryFilter(e.target.value)}
                  className="py-1.5 px-2 border border-gray-200 rounded-xl text-xs font-bold text-gray-700 focus:outline-none focus:border-brand-primary bg-white shadow-2xs"
                >
                  <option value="ALL">All Categories</option>
                  {categories?.map(c => (
                    <option key={c.id} value={c.id.toString()}>{c.name}</option>
                  ))}
                </select>

                <select
                  value={productStockFilter}
                  onChange={(e) => setProductStockFilter(e.target.value as any)}
                  className="py-1.5 px-2 border border-gray-200 rounded-xl text-xs font-bold text-gray-700 focus:outline-none focus:border-brand-primary bg-white shadow-2xs"
                >
                  <option value="ALL">All Stock ({products?.length || 0})</option>
                  <option value="IN_STOCK">In Stock ({inStockCount})</option>
                  <option value="OUT_OF_STOCK">Out of Stock ({products ? products.length - inStockCount : 0})</option>
                  <option value="HIDDEN">Hidden ({hiddenProductsCount})</option>
                </select>

                <button
                  onClick={handleOpenAddProduct}
                  className="bg-brand-primary hover:bg-yellow-600 text-white font-bold px-3 py-1.5 rounded-xl text-xs transition flex items-center gap-1 shadow-sm"
                >
                  <Plus size={14} /> Add Product
                </button>
              </div>
            </div>

            {/* Products Table */}
            <div className="overflow-x-auto rounded-xl border border-gray-100">
              <table className="w-full text-left border-collapse text-xs table-auto">
                <thead>
                  <tr className="border-b bg-gray-50/90 text-gray-500 text-[11px] uppercase tracking-wider">
                    <th className="py-2.5 px-2 font-bold w-12 text-center">Image</th>
                    <th className="py-2.5 px-2 font-bold">Product & Category</th>
                    <th className="py-2.5 px-2 font-bold whitespace-nowrap">Base Price (1 KG)</th>
                    <th className="py-2.5 px-2 font-bold whitespace-nowrap">Stock Status</th>
                    <th className="py-2.5 px-2 font-bold whitespace-nowrap">Shop Visibility</th>
                    <th className="py-2.5 px-2 font-bold text-right whitespace-nowrap">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {isProductsLoading ? (
                    <tr>
                      <td colSpan={6} className="p-6 text-center text-gray-400 text-xs">Loading catalog...</td>
                    </tr>
                  ) : filteredProducts.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="p-6 text-center text-gray-400 text-xs">No products match your filter.</td>
                    </tr>
                  ) : (
                    filteredProducts.map((p) => {
                      const isVisible = p.isVisible !== false;
                      return (
                        <tr key={p.id} className="hover:bg-amber-50/20 transition">
                          {/* Image */}
                          <td className="py-2 px-2 text-center align-middle">
                            <img
                              src={p.imageUrl || '/images/premium_snacks.jpg'}
                              alt={p.name}
                              onError={(e) => { (e.target as HTMLImageElement).src = '/images/premium_snacks.jpg'; }}
                              className="w-8 h-8 rounded-lg object-cover border border-gray-100 shadow-2xs mx-auto"
                            />
                          </td>

                          {/* Name & Category */}
                          <td className="py-2 px-2 align-middle">
                            <div className="font-bold text-brand-dark text-xs">{p.name}</div>
                            <span className="text-[10px] text-brand-primary uppercase font-bold tracking-wider">
                              {p.categories?.[0]?.name || 'Traditional Product'}
                            </span>
                          </td>

                          {/* Base Price / 1 KG with Quick Price Edit */}
                          <td className="py-2 px-2 align-middle whitespace-nowrap">
                            <div className="flex items-center gap-1.5">
                              <span className="font-black text-xs text-brand-dark">₹{p.price}</span>
                              <span className="text-[10px] text-gray-400">/ 1 KG</span>
                              <button
                                onClick={() => {
                                  setQuickPriceProduct(p);
                                  setQuickPriceVal(p.price);
                                }}
                                className="p-0.5 text-gray-400 hover:text-brand-primary rounded"
                                title="Quick edit price"
                              >
                                <Edit3 size={11} />
                              </button>
                            </div>
                            {p.regularPrice > p.price && (
                              <span className="text-[10px] text-gray-400 line-through block">MRP: ₹{p.regularPrice}</span>
                            )}
                          </td>

                          {/* Stock Status Toggle */}
                          <td className="py-2 px-2 align-middle whitespace-nowrap">
                            <button
                              onClick={() => {
                                updateProductMutation.mutate({
                                  id: p.id,
                                  updates: { isInStock: !p.isInStock }
                                });
                              }}
                              className={`px-2 py-0.5 rounded-full text-[10px] font-bold transition flex items-center gap-1 shadow-2xs ${
                                p.isInStock
                                  ? 'bg-green-100 text-green-800 hover:bg-green-200 border border-green-200'
                                  : 'bg-red-100 text-red-800 hover:bg-red-200 border border-red-200'
                              }`}
                              title="Click to toggle In Stock / Out of Stock"
                            >
                              <span className={`w-1.5 h-1.5 rounded-full ${p.isInStock ? 'bg-green-600' : 'bg-red-600'}`}></span>
                              {p.isInStock ? '✓ In Stock' : '✕ Out of Stock'}
                            </button>
                          </td>

                          {/* Visibility Toggle */}
                          <td className="py-2 px-2 align-middle whitespace-nowrap">
                            <button
                              onClick={() => {
                                updateProductMutation.mutate({
                                  id: p.id,
                                  updates: { isVisible: !isVisible }
                                });
                              }}
                              className={`px-2 py-0.5 rounded-full text-[10px] font-bold transition flex items-center gap-1 shadow-2xs ${
                                isVisible
                                  ? 'bg-blue-100 text-blue-800 hover:bg-blue-200 border border-blue-200'
                                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300 border border-gray-300'
                              }`}
                              title={isVisible ? "Visible to users. Click to stop showing to users" : "Stopped showing to users. Click to make visible"}
                            >
                              {isVisible ? <Eye size={11} className="text-blue-600" /> : <EyeOff size={11} className="text-gray-500" />}
                              {isVisible ? 'Visible' : 'Hidden'}
                            </button>
                          </td>

                          {/* Actions */}
                          <td className="py-2 px-2 align-middle text-right whitespace-nowrap">
                            <div className="flex items-center justify-end gap-1">
                              <button
                                onClick={() => handleOpenEditProduct(p)}
                                className="bg-gray-100 hover:bg-brand-primary hover:text-white text-gray-700 p-1.5 rounded-lg transition"
                                title="Edit product details"
                              >
                                <Edit3 size={13} />
                              </button>
                              <button
                                onClick={() => {
                                  if (confirm(`Are you sure you want to delete '${p.name}' from the catalog?`)) {
                                    deleteProductMutation.mutate(p.id);
                                  }
                                }}
                                className="bg-red-50 hover:bg-red-600 hover:text-white text-red-600 p-1.5 rounded-lg transition"
                                title="Delete Product"
                              >
                                <Trash2 size={13} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* TAB 4: CUSTOMERS DIRECTORY WITH PURCHASED ITEMS */}
        {/* ============================================================ */}
        {activeTab === 'customers' && (
          <div className="bg-white rounded-2xl shadow-xs border border-gray-100 p-3 sm:p-5 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-lg sm:text-xl font-black text-brand-dark flex items-center gap-2">
                  <Users className="text-brand-primary" size={20} /> Customer Records & Purchased Items
                </h2>
                <p className="text-[11px] text-gray-400 mt-0.5">
                  Complete patron directory, contact information, delivery destinations, and lifetime order histories.
                </p>
              </div>

              <div className="relative">
                <Search size={14} className="absolute left-3 top-2.5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search customer, phone, city..."
                  value={customerSearch}
                  onChange={(e) => setCustomerSearch(e.target.value)}
                  className="pl-8 pr-3 py-1.5 border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-brand-primary w-52 sm:w-64 shadow-2xs"
                />
              </div>
            </div>

            <div className="overflow-x-auto rounded-xl border border-gray-100">
              <table className="w-full text-left border-collapse text-xs table-auto">
                <thead>
                  <tr className="border-b bg-gray-50/90 text-gray-500 text-[11px] uppercase tracking-wider">
                    <th className="py-2.5 px-2 font-bold whitespace-nowrap">Customer Name</th>
                    <th className="py-2.5 px-2 font-bold whitespace-nowrap">Contact Info</th>
                    <th className="py-2.5 px-2 font-bold whitespace-nowrap">Location</th>
                    <th className="py-2.5 px-2 font-bold whitespace-nowrap">Orders</th>
                    <th className="py-2.5 px-2 font-bold whitespace-nowrap">Spend</th>
                    <th className="py-2.5 px-2 font-bold whitespace-nowrap">Last Active</th>
                    <th className="py-2.5 px-2 font-bold text-right whitespace-nowrap">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {isCustomersLoading ? (
                    <tr>
                      <td colSpan={7} className="p-6 text-center text-gray-400 text-xs">Loading customer records...</td>
                    </tr>
                  ) : filteredCustomers.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="p-6 text-center text-gray-400 text-xs">No customer records found.</td>
                    </tr>
                  ) : (
                    filteredCustomers.map((c) => (
                      <tr key={c.email} className="hover:bg-amber-50/20 transition">
                        <td className="py-2 px-2 align-middle">
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-full bg-amber-100 text-brand-primary font-black text-xs flex items-center justify-center border border-amber-200 flex-shrink-0">
                              {c.name.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <div className="font-bold text-brand-dark text-xs truncate max-w-[130px]">{c.name}</div>
                              <span className="text-[9px] text-gray-400 font-mono">#{c.id}</span>
                            </div>
                          </div>
                        </td>

                        <td className="py-2 px-2 align-middle">
                          <div className="flex items-center gap-1 text-gray-700 text-[11px]">
                            <Mail size={11} className="text-gray-400 flex-shrink-0" />
                            <a href={`mailto:${c.email}`} className="hover:underline truncate max-w-[130px]" title={c.email}>{c.email}</a>
                          </div>
                          {c.phone && (
                            <div className="flex items-center gap-1 text-gray-500 text-[10px] mt-0.5 whitespace-nowrap">
                              <Phone size={10} className="text-gray-400 flex-shrink-0" />
                              <a href={`tel:${c.phone}`} className="hover:underline">{c.phone}</a>
                            </div>
                          )}
                        </td>

                        <td className="py-2 px-2 align-middle text-gray-700">
                          <div className="flex items-center gap-1 text-[11px] font-bold text-gray-800">
                            <MapPin size={11} className="text-brand-primary flex-shrink-0" />
                            <span className="truncate max-w-[120px]">{c.city || 'Telangana'}</span>
                          </div>
                          {c.address && (
                            <span className="text-[9px] text-gray-400 block truncate max-w-[130px] mt-0.5" title={c.address}>
                              {c.address}
                            </span>
                          )}
                        </td>

                        <td className="py-2 px-2 align-middle whitespace-nowrap">
                          <span className="bg-blue-50 text-blue-700 border border-blue-200 font-extrabold px-2 py-0.5 rounded-full text-[10px]">
                            {c.totalOrders} {c.totalOrders === 1 ? 'Order' : 'Orders'}
                          </span>
                        </td>

                        <td className="py-2 px-2 align-middle font-black text-brand-dark text-xs whitespace-nowrap">
                          ₹{c.totalSpend.toLocaleString('en-IN')}
                        </td>

                        <td className="py-2 px-2 align-middle text-[10px] text-gray-500 whitespace-nowrap">
                          {c.lastOrderDate ? new Date(c.lastOrderDate).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' }) : 'Registered'}
                        </td>

                        <td className="py-2 px-2 align-middle text-right whitespace-nowrap">
                          <button
                            onClick={() => setSelectedCustomer(c)}
                            className="bg-brand-dark hover:bg-brand-primary text-white px-2.5 py-1 rounded-lg text-[10px] font-bold transition shadow-2xs"
                          >
                            View Items ({c.totalOrders})
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* MODAL 1: UPDATE ORDER TRACKING & STATUS */}
        {/* ============================================================ */}
        <AnimatePresence>
          {editingTrackingOrder && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-gray-100 relative max-h-[90vh] overflow-y-auto"
              >
                <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-6">
                  <div>
                    <h3 className="font-bold text-lg text-brand-dark flex items-center gap-2">
                      <Truck className="text-brand-primary" /> Update Order Tracking Details
                    </h3>
                    <p className="text-xs text-gray-400 mt-0.5">
                      Order: <strong className="text-brand-dark font-mono">{editingTrackingOrder.orderNumber}</strong> ({editingTrackingOrder.customerName})
                    </p>
                  </div>
                  <button
                    onClick={() => setEditingTrackingOrder(null)}
                    className="p-2 text-gray-400 hover:text-gray-700 rounded-full hover:bg-gray-100 transition"
                  >
                    <X size={20} />
                  </button>
                </div>

                <form onSubmit={handleSaveTracking} className="space-y-4">
                  {/* Status */}
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                      Tracking / Delivery Status *
                    </label>
                    <select
                      value={trackingForm.status}
                      onChange={(e) => setTrackingForm({ ...trackingForm, status: e.target.value as OrderStatus })}
                      className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:border-brand-primary font-bold bg-white"
                    >
                      <option value="PENDING">Pending Approval</option>
                      <option value="CONFIRMED">Order Confirmed</option>
                      <option value="PREPARING">Preparing & Packing in Kitchen</option>
                      <option value="SHIPPED">Dispatched / In Transit via Courier</option>
                      <option value="OUT_FOR_DELIVERY">Out for Delivery with Rider</option>
                      <option value="DELIVERED">Delivered to Customer</option>
                      <option value="CANCELLED">Cancelled</option>
                    </select>
                  </div>

                  {/* Courier Tracking ID */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-xs font-bold text-gray-700 uppercase">
                        Courier Tracking ID *
                      </label>
                      <button
                        type="button"
                        onClick={handleGenerateTrackingId}
                        className="text-[11px] font-bold text-brand-primary hover:underline flex items-center gap-1"
                      >
                        <Sparkles size={12} /> Auto-Generate ID
                      </button>
                    </div>
                    <input
                      type="text"
                      required
                      placeholder="e.g. STR-TRK-784920"
                      value={trackingForm.trackingId}
                      onChange={(e) => setTrackingForm({ ...trackingForm, trackingId: e.target.value })}
                      className="w-full border border-gray-200 rounded-xl p-3 text-sm font-mono font-bold text-amber-900 bg-amber-50/50 focus:outline-none focus:border-brand-primary"
                    />
                  </div>

                  {/* Courier Partner */}
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                      Courier Partner / Delivery Service
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. DTDC Express, BlueDart, Tri-City Local"
                      value={trackingForm.courierPartner}
                      onChange={(e) => setTrackingForm({ ...trackingForm, courierPartner: e.target.value })}
                      className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:border-brand-primary mb-2"
                    />

                    {/* Quick Preset Buttons */}
                    <div className="flex flex-wrap gap-1.5">
                      {COURIER_PRESETS.map(preset => (
                        <button
                          key={preset}
                          type="button"
                          onClick={() => setTrackingForm({ ...trackingForm, courierPartner: preset })}
                          className={`text-[10px] font-semibold px-2.5 py-1 rounded-lg border transition ${
                            trackingForm.courierPartner === preset
                              ? 'bg-brand-dark text-white border-brand-dark'
                              : 'bg-gray-100 text-gray-700 border-gray-200 hover:bg-gray-200'
                          }`}
                        >
                          {preset}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Estimated Delivery Date */}
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                      Estimated Delivery Date
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Today by 6 PM or Oct 16, 2026"
                      value={trackingForm.estimatedDelivery}
                      onChange={(e) => setTrackingForm({ ...trackingForm, estimatedDelivery: e.target.value })}
                      className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:border-brand-primary"
                    />
                  </div>

                  {/* Tracking Notes / Location log */}
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                      Tracking Notes / Latest Location Update
                    </label>
                    <textarea
                      rows={3}
                      placeholder="e.g. Package arrived at Hyderabad hub. Handed over to delivery rider Ramesh."
                      value={trackingForm.trackingNotes}
                      onChange={(e) => setTrackingForm({ ...trackingForm, trackingNotes: e.target.value })}
                      className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:border-brand-primary"
                    />
                  </div>

                  <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                    <button
                      type="button"
                      onClick={() => setEditingTrackingOrder(null)}
                      className="px-5 py-2.5 rounded-xl text-xs font-bold text-gray-500 hover:bg-gray-100 transition"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={trackingMutation.isPending}
                      className="bg-brand-primary text-white px-6 py-2.5 rounded-xl text-xs font-bold hover:bg-yellow-600 transition shadow-md disabled:opacity-50"
                    >
                      {trackingMutation.isPending ? 'Updating...' : 'Save Tracking Information'}
                    </button>
                  </div>
                </form>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* ============================================================ */}
        {/* MODAL 2: COMPLETE ORDER BREAKDOWN & TRACKING TIMELINE */}
        {/* ============================================================ */}
        <AnimatePresence>
          {selectedOrder && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white rounded-3xl p-6 sm:p-8 max-w-xl w-full shadow-2xl border border-gray-100 max-h-[90vh] overflow-y-auto"
              >
                <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-6">
                  <div>
                    <h3 className="font-black text-xl text-brand-dark">Complete Order & Tracking Breakdown</h3>
                    <p className="text-xs text-gray-400 font-mono mt-0.5">Order #{selectedOrder.orderNumber}</p>
                  </div>
                  <button
                    onClick={() => setSelectedOrder(null)}
                    className="p-2 text-gray-400 hover:text-gray-700 rounded-full hover:bg-gray-100 transition"
                  >
                    <X size={20} />
                  </button>
                </div>

                <div className="space-y-6 text-sm">
                  {/* Tracking Badge Card */}
                  <div className="bg-amber-50/80 border border-amber-200 rounded-2xl p-4 space-y-2.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-amber-900">Courier Tracking ID:</span>
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono font-bold bg-white px-2.5 py-0.5 rounded-lg border border-amber-300 text-amber-900">
                          {selectedOrder.trackingId || 'Pending Allocation'}
                        </span>
                        {selectedOrder.trackingId && (
                          <button
                            onClick={() => handleCopy(selectedOrder.trackingId!)}
                            className="p-1 hover:bg-amber-100 rounded"
                            title="Copy Tracking ID"
                          >
                            {copiedId === selectedOrder.trackingId ? <Check size={12} className="text-green-600" /> : <Copy size={12} />}
                          </button>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-xs text-amber-800">
                      <span>Live Status:</span>
                      <span className="font-bold px-2 py-0.5 bg-amber-100 rounded-md">
                        {selectedOrder.status}
                      </span>
                    </div>

                    <div className="text-xs text-amber-900 pt-2 border-t border-amber-200/60 flex justify-between">
                      <span><strong>Courier:</strong> {selectedOrder.courierPartner || 'Sri Telangana Tri-City Express'}</span>
                      {selectedOrder.estimatedDelivery && (
                        <span><strong>ETA:</strong> {selectedOrder.estimatedDelivery}</span>
                      )}
                    </div>

                    {selectedOrder.trackingNotes && (
                      <div className="text-xs text-gray-600 italic bg-white/70 p-2.5 rounded-xl border border-amber-100">
                        "{selectedOrder.trackingNotes}"
                      </div>
                    )}
                  </div>

                  {/* Customer Information */}
                  <div className="bg-gray-50 rounded-2xl p-4 space-y-1.5 text-xs">
                    <span className="text-gray-400 font-bold uppercase text-[10px]">Customer & Destination</span>
                    <div className="font-bold text-gray-900 text-sm">{selectedOrder.customerName}</div>
                    <div className="text-gray-600">{selectedOrder.email} | {selectedOrder.phone}</div>
                    <div className="text-gray-700 pt-1 flex items-start gap-1">
                      <MapPin size={13} className="text-brand-primary flex-shrink-0 mt-0.5" />
                      <span>{selectedOrder.shippingAddress}</span>
                    </div>
                  </div>

                  {/* Tracking Timeline Audit */}
                  {selectedOrder.timeline && selectedOrder.timeline.length > 0 && (
                    <div>
                      <h4 className="font-bold text-gray-700 text-xs uppercase mb-3 tracking-wider">Tracking Progression Timeline</h4>
                      <div className="space-y-3 border-l-2 border-amber-300 pl-4 ml-2">
                        {selectedOrder.timeline.map((event, i) => (
                          <div key={i} className="relative text-xs">
                            <div className="w-2.5 h-2.5 bg-brand-primary rounded-full absolute -left-[21px] top-1"></div>
                            <div className="font-bold text-brand-dark flex items-center justify-between">
                              <span>{event.title}</span>
                              <span className="text-[10px] text-gray-400 font-normal">
                                {new Date(event.timestamp).toLocaleString('en-IN', { dateStyle: 'short', timeStyle: 'short' })}
                              </span>
                            </div>
                            <p className="text-gray-600 mt-0.5">{event.description}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Items Ordered */}
                  <div>
                    <h4 className="font-bold text-gray-700 text-xs uppercase mb-3 tracking-wider">Items in Package</h4>
                    <div className="divide-y divide-gray-100 border rounded-2xl overflow-hidden">
                      {selectedOrder.items.map((item, idx) => (
                        <div key={idx} className="p-3 flex justify-between items-center text-xs">
                          <div>
                            <span className="font-bold text-brand-dark">{item.quantity}x {item.productName}</span>
                            <span className="text-gray-400 block text-[11px]">Weight Pack: {item.weight || '500g'}</span>
                          </div>
                          <span className="font-bold text-gray-800">₹{(item.price * item.quantity).toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Financial Breakdown */}
                  <div className="space-y-1.5 pt-2 border-t text-xs">
                    <div className="flex justify-between text-gray-500">
                      <span>Delivery Shipping Fee</span>
                      <span>{selectedOrder.shippingFee === 0 ? 'FREE (₹0)' : `₹${selectedOrder.shippingFee}`}</span>
                    </div>
                    {selectedOrder.discount ? (
                      <div className="flex justify-between text-green-700 font-semibold">
                        <span>First User / Promo Discount</span>
                        <span>-₹{selectedOrder.discount.toFixed(2)}</span>
                      </div>
                    ) : null}
                    <div className="flex justify-between items-center text-base font-black text-brand-dark pt-2 border-t">
                      <span>Total Paid / COD Amount</span>
                      <span>₹{selectedOrder.totalAmount.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex justify-between items-center">
                  <button
                    onClick={() => {
                      const cur = selectedOrder;
                      setSelectedOrder(null);
                      handleOpenTrackingModal(cur);
                    }}
                    className="bg-brand-dark text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-brand-primary transition flex items-center gap-1.5"
                  >
                    <Truck size={14} /> Edit Tracking & Courier
                  </button>

                  <button
                    onClick={() => setSelectedOrder(null)}
                    className="bg-gray-100 text-gray-700 px-5 py-2 rounded-xl font-bold text-xs hover:bg-gray-200 transition"
                  >
                    Close
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* ============================================================ */}
        {/* MODAL 3: CUSTOMER ORDER HISTORY & PURCHASED ITEMS */}
        {/* ============================================================ */}
        <AnimatePresence>
          {selectedCustomer && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white rounded-3xl p-6 sm:p-8 max-w-2xl w-full shadow-2xl border border-gray-100 max-h-[90vh] overflow-y-auto"
              >
                <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-brand-primary text-white font-black text-lg flex items-center justify-center shadow-md">
                      {selectedCustomer.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="font-black text-xl text-brand-dark">{selectedCustomer.name}</h3>
                      <p className="text-xs text-gray-400">Customer ID: #{selectedCustomer.id} | Joined: {new Date(selectedCustomer.createdAt).toLocaleDateString('en-IN')}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedCustomer(null)}
                    className="p-2 text-gray-400 hover:text-gray-700 rounded-full hover:bg-gray-100 transition"
                  >
                    <X size={20} />
                  </button>
                </div>

                {/* Customer Metrics */}
                <div className="grid grid-cols-3 gap-3 mb-6 text-center">
                  <div className="bg-amber-50 p-3 rounded-2xl border border-amber-200">
                    <span className="text-[10px] text-gray-500 uppercase font-bold">Total Orders</span>
                    <p className="text-lg font-black text-amber-900">{selectedCustomer.totalOrders}</p>
                  </div>
                  <div className="bg-green-50 p-3 rounded-2xl border border-green-200">
                    <span className="text-[10px] text-gray-500 uppercase font-bold">Lifetime Spend</span>
                    <p className="text-lg font-black text-green-900">₹{selectedCustomer.totalSpend.toLocaleString('en-IN')}</p>
                  </div>
                  <div className="bg-blue-50 p-3 rounded-2xl border border-blue-200">
                    <span className="text-[10px] text-gray-500 uppercase font-bold">Location</span>
                    <p className="text-sm font-bold text-blue-900 truncate mt-1">{selectedCustomer.city || 'Telangana'}</p>
                  </div>
                </div>

                {/* Contact Card */}
                <div className="bg-gray-50 p-4 rounded-2xl text-xs space-y-1.5 mb-6">
                  <div className="flex items-center gap-2 text-gray-700">
                    <Mail size={14} className="text-gray-400" />
                    <span className="font-semibold">{selectedCustomer.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-700">
                    <Phone size={14} className="text-gray-400" />
                    <span className="font-semibold">{selectedCustomer.phone || '+91 98765 43210'}</span>
                  </div>
                  <div className="flex items-start gap-2 text-gray-700 pt-1">
                    <MapPin size={14} className="text-brand-primary flex-shrink-0 mt-0.5" />
                    <span>{selectedCustomer.address || 'Address registered on file'}</span>
                  </div>
                </div>

                {/* Orders History List */}
                <div>
                  <h4 className="font-bold text-gray-700 text-xs uppercase mb-3 tracking-wider">
                    Past Orders & Items by {selectedCustomer.name} ({customerSpecificOrders.length})
                  </h4>

                  {customerSpecificOrders.length === 0 ? (
                    <p className="text-xs text-gray-400 py-4 text-center">No past orders found in records for this profile.</p>
                  ) : (
                    <div className="space-y-3">
                      {customerSpecificOrders.map(ord => {
                        const cfg = ORDER_STATUS_CONFIG[ord.status] || ORDER_STATUS_CONFIG.PENDING;
                        return (
                          <div key={ord.id} className="p-4 rounded-2xl border border-gray-200 bg-white hover:border-brand-primary/50 transition text-xs space-y-2 shadow-2xs">
                            <div className="flex justify-between items-center">
                              <div>
                                <span className="font-mono font-bold text-brand-dark text-sm">{ord.orderNumber}</span>
                                <span className="text-[10px] text-gray-400 block">
                                  {new Date(ord.createdAt).toLocaleDateString('en-IN', { dateStyle: 'medium' })}
                                </span>
                              </div>
                              <div className="text-right">
                                <span className="font-black text-brand-dark text-sm">₹{ord.totalAmount.toFixed(2)}</span>
                                <span className={`text-[10px] font-bold block px-2 py-0.5 rounded-full border ${cfg.bg} ${cfg.color}`}>
                                  {cfg.label}
                                </span>
                              </div>
                            </div>

                            {/* Ordered Items Breakdown */}
                            {ord.items && ord.items.length > 0 && (
                              <div className="bg-gray-50/80 rounded-xl p-2.5 my-1.5 space-y-1 border border-gray-100">
                                <span className="text-[10px] uppercase font-bold text-gray-400 block tracking-wider">Ordered Items:</span>
                                {ord.items.map((it, idx) => (
                                  <div key={idx} className="flex justify-between items-center text-[11px] text-gray-700">
                                    <span>
                                      <strong className="text-brand-dark">{it.quantity}x</strong> {it.productName} <span className="text-gray-400">({it.weight || '500g'})</span>
                                    </span>
                                    <span className="font-semibold text-gray-900">₹{(it.price * it.quantity).toFixed(2)}</span>
                                  </div>
                                ))}
                              </div>
                            )}

                            <div className="flex items-center justify-between text-xs pt-2 border-t border-gray-100">
                              <span className="text-gray-500 font-mono">
                                Tracking: <strong className="text-amber-900 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">{ord.trackingId || 'Unassigned'}</strong>
                              </span>

                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => {
                                    setSelectedCustomer(null);
                                    handleOpenTrackingModal(ord);
                                  }}
                                  className="text-[11px] font-bold text-brand-primary hover:underline"
                                >
                                  Update Tracking →
                                </button>
                                <button
                                  onClick={() => {
                                    setSelectedCustomer(null);
                                    setSelectedOrder(ord);
                                  }}
                                  className="text-[11px] font-bold text-gray-700 hover:underline"
                                >
                                  View Details
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                <div className="mt-6 flex justify-end">
                  <button
                    onClick={() => setSelectedCustomer(null)}
                    className="bg-brand-dark text-white px-6 py-2.5 rounded-xl font-bold text-xs hover:bg-brand-primary transition"
                  >
                    Close Items View
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* ============================================================ */}
        {/* MODAL 4: ADD / EDIT PRODUCT (STOCK, PRICING, VISIBILITY) */}
        {/* ============================================================ */}
        <AnimatePresence>
          {isProductModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-gray-100 max-h-[90vh] overflow-y-auto"
              >
                <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-6">
                  <div>
                    <h3 className="font-black text-xl text-brand-dark">
                      {editingProduct ? 'Edit Product & Pricing' : 'Add New Product to Catalog'}
                    </h3>
                    <p className="text-xs text-gray-400 mt-0.5">
                      Configure product name, base price per 1 KG, stock availability, and shop visibility.
                    </p>
                  </div>
                  <button
                    onClick={() => setIsProductModalOpen(false)}
                    className="p-2 text-gray-400 hover:text-gray-700 rounded-full hover:bg-gray-100 transition"
                  >
                    <X size={20} />
                  </button>
                </div>

                <form onSubmit={handleSaveProduct} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                      Product Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Traditional Gongura Mutton Pachadi"
                      value={productForm.name}
                      onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                      className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:border-brand-primary font-bold"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                        Base Price (1 KG) *
                      </label>
                      <input
                        type="number"
                        required
                        min="10"
                        value={productForm.price}
                        onChange={(e) => setProductForm({ ...productForm, price: Number(e.target.value) })}
                        className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:border-brand-primary font-black text-brand-dark"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                        Regular MRP Price
                      </label>
                      <input
                        type="number"
                        min="10"
                        value={productForm.regularPrice}
                        onChange={(e) => setProductForm({ ...productForm, regularPrice: Number(e.target.value) })}
                        className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:border-brand-primary"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                      Category
                    </label>
                    <select
                      value={productForm.categoryId}
                      onChange={(e) => setProductForm({ ...productForm, categoryId: Number(e.target.value) })}
                      className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:border-brand-primary font-bold bg-white"
                    >
                      {categories?.map(c => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                    </select>
                  </div>

                  {/* Image URL & Preset Selection */}
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                      Image URL or Preset
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. /images/veg_pickles.jpg or https://..."
                      value={productForm.imageUrl}
                      onChange={(e) => setProductForm({ ...productForm, imageUrl: e.target.value })}
                      className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:border-brand-primary text-xs font-mono mb-2"
                    />

                    {/* Presets */}
                    <span className="text-[10px] text-gray-400 font-bold block mb-1">Quick Preset Images:</span>
                    <div className="flex flex-wrap gap-2">
                      {PRESET_PRODUCT_IMAGES.map((preset) => (
                        <button
                          key={preset.label}
                          type="button"
                          onClick={() => setProductForm({ ...productForm, imageUrl: preset.url })}
                          className={`text-[10px] font-semibold px-2.5 py-1 rounded-lg border transition ${
                            productForm.imageUrl === preset.url
                              ? 'bg-amber-600 text-white border-amber-600'
                              : 'bg-gray-100 text-gray-700 border-gray-200 hover:bg-gray-200'
                          }`}
                        >
                          {preset.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                      Short Highlight Description
                    </label>
                    <input
                      type="text"
                      placeholder="Brief highlight of the recipe"
                      value={productForm.shortDescription}
                      onChange={(e) => setProductForm({ ...productForm, shortDescription: e.target.value })}
                      className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:border-brand-primary"
                    />
                  </div>

                  {/* Stock & Shop Visibility Toggles */}
                  <div className="bg-gray-50 rounded-2xl p-4 space-y-3.5 border border-gray-200/60">
                    {/* Stock Status */}
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-xs font-bold text-gray-800 block">Inventory Stock Status</span>
                        <span className="text-[10px] text-gray-400">
                          {productForm.isInStock ? 'Product is ready and in stock' : 'Customer cannot order out-of-stock items'}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setProductForm({ ...productForm, isInStock: !productForm.isInStock })}
                        className={`px-4 py-1.5 rounded-full text-xs font-bold transition shadow-2xs ${
                          productForm.isInStock
                            ? 'bg-green-100 text-green-800 border border-green-300'
                            : 'bg-red-100 text-red-800 border border-red-300'
                        }`}
                      >
                        {productForm.isInStock ? '✓ In Stock' : '✕ Out of Stock'}
                      </button>
                    </div>

                    {/* Shop Visibility (Stop showing to users) */}
                    <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                      <div>
                        <span className="text-xs font-bold text-gray-800 block">Shopfront Visibility</span>
                        <span className="text-[10px] text-gray-400">
                          {productForm.isVisible ? 'Visible to users on website' : 'Stopped showing to users (Hidden / Draft)'}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setProductForm({ ...productForm, isVisible: !productForm.isVisible })}
                        className={`px-4 py-1.5 rounded-full text-xs font-bold transition flex items-center gap-1 shadow-2xs ${
                          productForm.isVisible
                            ? 'bg-blue-100 text-blue-800 border border-blue-300'
                            : 'bg-gray-200 text-gray-700 border border-gray-300'
                        }`}
                      >
                        {productForm.isVisible ? <Eye size={12} /> : <EyeOff size={12} />}
                        {productForm.isVisible ? 'Visible to Users' : 'Stopped Showing'}
                      </button>
                    </div>
                  </div>

                  <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                    <button
                      type="button"
                      onClick={() => setIsProductModalOpen(false)}
                      className="px-5 py-2.5 rounded-xl text-xs font-bold text-gray-500 hover:bg-gray-100 transition"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={updateProductMutation.isPending || createProductMutation.isPending}
                      className="bg-brand-primary text-white px-6 py-2.5 rounded-xl text-xs font-bold hover:bg-yellow-600 transition shadow-md disabled:opacity-50"
                    >
                      {editingProduct ? 'Save Product Changes' : 'Create & Publish Product'}
                    </button>
                  </div>
                </form>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* ============================================================ */}
        {/* MODAL 5: QUICK INLINE PRICE EDIT */}
        {/* ============================================================ */}
        <AnimatePresence>
          {quickPriceProduct && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl border border-gray-100"
              >
                <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-4">
                  <h3 className="font-bold text-base text-brand-dark">Quick Edit Price</h3>
                  <button onClick={() => setQuickPriceProduct(null)} className="p-1 text-gray-400 hover:text-gray-700">
                    <X size={18} />
                  </button>
                </div>

                <div className="space-y-4">
                  <p className="text-xs text-gray-600 font-semibold">{quickPriceProduct.name}</p>
                  <div>
                    <label className="block text-[11px] font-bold text-gray-500 uppercase mb-1">
                      New Price per 1 KG (₹)
                    </label>
                    <input
                      type="number"
                      min="10"
                      value={quickPriceVal}
                      onChange={(e) => setQuickPriceVal(Number(e.target.value))}
                      className="w-full border border-gray-200 rounded-xl p-3 text-lg font-black text-brand-dark focus:outline-none focus:border-brand-primary"
                    />
                  </div>

                  <div className="flex justify-end gap-2 pt-3 border-t border-gray-100">
                    <button
                      type="button"
                      onClick={() => setQuickPriceProduct(null)}
                      className="px-4 py-2 rounded-xl text-xs font-bold text-gray-500 hover:bg-gray-100"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        updateProductMutation.mutate({
                          id: quickPriceProduct.id,
                          updates: { price: quickPriceVal }
                        });
                      }}
                      className="bg-brand-primary text-white px-5 py-2 rounded-xl text-xs font-bold hover:bg-yellow-600 shadow-sm"
                    >
                      Update Price
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
};
