import { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Package,
  Truck,
  Search,
  X,
  CheckCircle2,
  Clock,
  MapPin,
  Phone,
  Copy,
  Check,
  RefreshCw,
  ShoppingBag,
  RotateCcw,
  Printer,
  ChevronDown,
  ChevronUp,
  CreditCard,
  Banknote,
  AlertCircle,
  MessageCircle,
  Sparkles,
  User
} from 'lucide-react';
import { SEO } from '../components/SEO';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { getCustomerOrders, getProducts } from '../api';
import { useAuthStore } from '../store/authStore';
import { useCartStore } from '../store/cartStore';
import { useTranslation } from '../utils/translations';
import type { Order, OrderStatus, Product } from '../types';

const STATUS_STEPS: OrderStatus[] = [
  'PENDING',
  'CONFIRMED',
  'PREPARING',
  'SHIPPED',
  'OUT_FOR_DELIVERY',
  'DELIVERED'
];

const STATUS_META: Record<
  OrderStatus,
  {
    en: string;
    te: string;
    shortEn: string;
    shortTe: string;
    badgeBg: string;
    badgeText: string;
    dot: string;
  }
> = {
  PENDING: {
    en: 'Order Placed',
    te: 'ఆర్డర్ స్వీకరించబడింది',
    shortEn: 'Placed',
    shortTe: 'పెట్టబడింది',
    badgeBg: 'bg-amber-50 border-amber-300',
    badgeText: 'text-amber-900',
    dot: 'bg-amber-500'
  },
  CONFIRMED: {
    en: 'Order Confirmed',
    te: 'ఆర్డర్ నిర్ధారించబడింది',
    shortEn: 'Confirmed',
    shortTe: 'నిర్ధారణ',
    badgeBg: 'bg-blue-50 border-blue-300',
    badgeText: 'text-blue-800',
    dot: 'bg-blue-500'
  },
  PREPARING: {
    en: 'Fresh Kitchen Prep',
    te: 'తాజా తయారీ & ప్యాకింగ్',
    shortEn: 'Preparing',
    shortTe: 'తయారీలో',
    badgeBg: 'bg-purple-50 border-purple-300',
    badgeText: 'text-purple-800',
    dot: 'bg-purple-500'
  },
  SHIPPED: {
    en: 'Shipped / In Transit',
    te: 'కొరియర్‌లో పంపబడింది',
    shortEn: 'Shipped',
    shortTe: 'షిప్ అయింది',
    badgeBg: 'bg-indigo-50 border-indigo-300',
    badgeText: 'text-indigo-800',
    dot: 'bg-indigo-500'
  },
  OUT_FOR_DELIVERY: {
    en: 'Out for Delivery',
    te: 'డెలివరీకి బయలుదేరింది',
    shortEn: 'Out for Delivery',
    shortTe: 'డెలివరీలో',
    badgeBg: 'bg-orange-50 border-orange-300',
    badgeText: 'text-orange-800',
    dot: 'bg-orange-500'
  },
  DELIVERED: {
    en: 'Delivered',
    te: 'డెలివరీ పూర్తయింది',
    shortEn: 'Delivered',
    shortTe: 'చేరింది',
    badgeBg: 'bg-emerald-50 border-emerald-300',
    badgeText: 'text-emerald-800',
    dot: 'bg-emerald-500'
  },
  CANCELLED: {
    en: 'Cancelled',
    te: 'రద్దు చేయబడింది',
    shortEn: 'Cancelled',
    shortTe: 'రద్దయింది',
    badgeBg: 'bg-rose-50 border-rose-300',
    badgeText: 'text-rose-800',
    dot: 'bg-rose-500'
  }
};

type FilterTab = 'ALL' | 'ACTIVE' | 'DELIVERED' | 'CANCELLED';

export const Orders = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const initialUrlQuery = searchParams.get('q') || '';

  const { user, isLoggedIn } = useAuthStore();
  const addItemToCart = useCartStore((state) => state.addItem);
  const { isTelugu, getProductName } = useTranslation();

  const [searchInput, setSearchInput] = useState(initialUrlQuery);
  const [activeLookupQuery, setActiveLookupQuery] = useState(initialUrlQuery);
  const [statusFilter, setStatusFilter] = useState<FilterTab>('ALL');
  const [expandedTimelineIds, setExpandedTimelineIds] = useState<Record<string, boolean>>({});
  const [copiedText, setCopiedText] = useState<string | null>(null);
  const [reorderNotice, setReorderNotice] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    const q = searchParams.get('q') || '';
    setSearchInput(q);
    setActiveLookupQuery(q);
  }, [searchParams]);

  const { data: catalogProducts } = useQuery({
    queryKey: ['products'],
    queryFn: getProducts
  });

  const productMap = useMemo(() => {
    const map = new Map<number, Product>();
    const nameMap = new Map<string, Product>();
    if (catalogProducts) {
      for (const p of catalogProducts) {
        map.set(p.id, p);
        nameMap.set(p.name.toLowerCase().trim(), p);
      }
    }
    return { byId: map, byName: nameMap };
  }, [catalogProducts]);

  const {
    data: orders = [],
    isLoading,
    refetch
  } = useQuery({
    queryKey: ['customerOrders', user?.email || '', user?.phone || '', activeLookupQuery],
    queryFn: () =>
      getCustomerOrders({
        email: isLoggedIn ? user?.email : undefined,
        phone: isLoggedIn ? user?.phone : undefined,
        lookupQuery: activeLookupQuery || undefined
      }),
    refetchInterval: 15000,
    staleTime: 0
  });

  const handleLookupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = searchInput.trim();
    setActiveLookupQuery(trimmed);
    if (trimmed) {
      setSearchParams({ q: trimmed });
    } else {
      setSearchParams({});
    }
  };

  const handleClearLookup = () => {
    setSearchInput('');
    setActiveLookupQuery('');
    setSearchParams({});
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await refetch();
    } finally {
      setTimeout(() => setIsRefreshing(false), 500);
    }
  };

  const handleCopy = (value: string) => {
    navigator.clipboard.writeText(value);
    setCopiedText(value);
    setTimeout(() => setCopiedText(null), 2000);
  };

  const toggleTimeline = (orderNumber: string) => {
    setExpandedTimelineIds((prev) => ({
      ...prev,
      [orderNumber]: !prev[orderNumber]
    }));
  };

  const handleReorder = (order: Order) => {
    let addedCount = 0;
    for (const item of order.items) {
      const matchedProduct =
        productMap.byId.get(item.productId) ||
        productMap.byName.get(item.productName.toLowerCase().trim());

      const weightStr = item.weight || '500g';
      const fallbackProduct: Product = matchedProduct || {
        id: item.productId || Date.now(),
        name: item.productName,
        slug: item.productName.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        price: item.price * 2,
        regularPrice: item.price * 2,
        imageUrl: '/images/veg_pickles.jpg',
        isInStock: true,
        categories: []
      };

      if (fallbackProduct.isInStock !== false) {
        const res = addItemToCart(fallbackProduct, weightStr, item.quantity);
        if (res.success) addedCount++;
      }
    }

    if (addedCount > 0) {
      setReorderNotice(
        isTelugu
          ? `${order.orderNumber} నుండి రుచులు కార్ట్‌కు జోడించబడ్డాయి!`
          : `Added items from ${order.orderNumber} to your cart!`
      );
      setTimeout(() => {
        setReorderNotice(null);
        navigate('/cart');
      }, 900);
    } else {
      setReorderNotice(
        isTelugu
          ? 'కార్ట్ గరిష్ట పరిమితి (3 KG) చేరుకుంది లేదా స్టాక్ ముగిసింది.'
          : 'Items are currently out of stock or already at the 3 KG cart limit.'
      );
      setTimeout(() => setReorderNotice(null), 3500);
    }
  };

  const handlePrintInvoice = (order: Order) => {
    const win = window.open('', '_blank', 'width=820,height=900');
    if (!win) return;

    const placedDate = order.createdAt
      ? new Date(order.createdAt).toLocaleString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
      : 'Recent';

    const subtotal = order.items.reduce((sum, it) => sum + it.price * it.quantity, 0);
    const rowsHtml = order.items
      .map(
        (it, i) => `
        <tr>
          <td style="padding:10px 8px;border-bottom:1px solid #eee;">${i + 1}</td>
          <td style="padding:10px 8px;border-bottom:1px solid #eee;font-weight:600;">${it.productName} (${it.weight || '500g'})</td>
          <td style="padding:10px 8px;border-bottom:1px solid #eee;text-align:center;">${it.quantity}</td>
          <td style="padding:10px 8px;border-bottom:1px solid #eee;text-align:right;">₹${it.price.toFixed(2)}</td>
          <td style="padding:10px 8px;border-bottom:1px solid #eee;text-align:right;font-weight:700;">₹${(it.price * it.quantity).toFixed(2)}</td>
        </tr>`
      )
      .join('');

    win.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Invoice - ${order.orderNumber} | Sri Telangana Ruchulu</title>
          <style>
            body { font-family: system-ui, -apple-system, sans-serif; color: #2A0800; padding: 32px; max-width: 760px; margin: 0 auto; }
            .header { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2px solid #D1A155; padding-bottom: 16px; margin-bottom: 20px; }
            .brand { font-size: 22px; font-weight: 800; color: #2A0800; }
            .sub { font-size: 12px; color: #666; margin-top: 4px; }
            .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 22px; font-size: 13px; background: #FDFBF7; padding: 14px; border-radius: 10px; border: 1px solid #eadcc8; }
            table { width: 100%; border-collapse: collapse; font-size: 13px; margin-bottom: 20px; }
            th { background: #2A0800; color: #fff; text-align: left; padding: 10px 8px; font-size: 12px; text-transform: uppercase; }
            .totals { margin-left: auto; width: 280px; font-size: 13px; }
            .totals div { display: flex; justify-content: space-between; padding: 5px 0; }
            .totals .grand { font-size: 16px; font-weight: 800; border-top: 2px solid #2A0800; padding-top: 8px; margin-top: 4px; }
            @media print { .no-print { display: none; } }
          </style>
        </head>
        <body>
          <div class="header">
            <div>
              <div class="brand">Sri Telangana Ruchulu</div>
              <div class="sub">Collectorate Road, Subedari, Warangal, Telangana - 506001</div>
              <div class="sub">Phone: +91 81213 45585 | Email: sritelanganaruchulu@gmail.com</div>
            </div>
            <div style="text-align:right;">
              <div style="font-size:18px;font-weight:800;">ORDER INVOICE</div>
              <div class="sub"><strong>Order #:</strong> ${order.orderNumber}</div>
              <div class="sub"><strong>Date:</strong> ${placedDate}</div>
              <div class="sub"><strong>Status:</strong> ${STATUS_META[order.status]?.en || order.status}</div>
            </div>
          </div>

          <div class="grid">
            <div>
              <strong>Billed & Shipped To:</strong><br/>
              ${order.customerName}<br/>
              ${order.shippingAddress}<br/>
              Phone: ${order.phone || '-'}<br/>
              ${order.email ? `Email: ${order.email}` : ''}
            </div>
            <div>
              <strong>Shipment & Payment Info:</strong><br/>
              Tracking ID: <strong>${order.trackingId || 'Assigned Shortly'}</strong><br/>
              Courier: ${order.courierPartner || 'Sri Telangana Tri-City Express'}<br/>
              Payment: ${order.paymentMethod === 'RAZORPAY' ? 'Paid Online (Razorpay)' : 'Cash on Delivery (COD)'}
              ${order.razorpayPaymentId ? `<br/>Txn ID: ${order.razorpayPaymentId}` : ''}
            </div>
          </div>

          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Delicacy & Pack</th>
                <th style="text-align:center;">Qty</th>
                <th style="text-align:right;">Unit Price</th>
                <th style="text-align:right;">Amount</th>
              </tr>
            </thead>
            <tbody>
              ${rowsHtml}
            </tbody>
          </table>

          <div class="totals">
            <div><span>Items Subtotal:</span><span>₹${subtotal.toFixed(2)}</span></div>
            <div><span>Delivery Fee:</span><span>${!order.shippingFee ? 'FREE (₹0.00)' : `₹${order.shippingFee.toFixed(2)}`}</span></div>
            ${order.discount ? `<div><span>Discount:</span><span>-₹${order.discount.toFixed(2)}</span></div>` : ''}
            <div class="grand"><span>Total Amount:</span><span>₹${order.totalAmount.toFixed(2)}</span></div>
          </div>

          <p style="margin-top:30px;font-size:12px;color:#666;text-align:center;">
            Thank you for choosing authentic homemade flavors from Sri Telangana Ruchulu, Warangal!
          </p>
          <div class="no-print" style="text-align:center;margin-top:16px;">
            <button onclick="window.print()" style="background:#2A0800;color:#fff;border:none;padding:10px 22px;border-radius:8px;font-weight:700;cursor:pointer;">Print / Save as PDF</button>
          </div>
        </body>
      </html>
    `);
    win.document.close();
  };

  // Counts & Filtered Orders
  const stats = useMemo(() => {
    const active = orders.filter(
      (o) => o.status !== 'DELIVERED' && o.status !== 'CANCELLED'
    ).length;
    const delivered = orders.filter((o) => o.status === 'DELIVERED').length;
    const cancelled = orders.filter((o) => o.status === 'CANCELLED').length;
    return {
      total: orders.length,
      active,
      delivered,
      cancelled
    };
  }, [orders]);

  const filteredOrders = useMemo(() => {
    if (statusFilter === 'ACTIVE') {
      return orders.filter((o) => o.status !== 'DELIVERED' && o.status !== 'CANCELLED');
    }
    if (statusFilter === 'DELIVERED') {
      return orders.filter((o) => o.status === 'DELIVERED');
    }
    if (statusFilter === 'CANCELLED') {
      return orders.filter((o) => o.status === 'CANCELLED');
    }
    return orders;
  }, [orders, statusFilter]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen pt-24 sm:pt-32 pb-16 bg-[#FDFBF7]"
    >
      <SEO
        title={isTelugu ? 'నా ఆర్డర్లు & లైవ్ స్టేటస్' : 'My Orders & Live Shipment Status'}
        description="View your Sri Telangana Ruchulu orders, live delivery progress, courier tracking IDs, itemized invoices, and one-tap reorder."
        canonical="/orders"
      />

      <div className="container mx-auto px-3 sm:px-4 max-w-5xl">
        <Breadcrumbs
          items={[{ name: isTelugu ? 'ఆర్డర్లు' : 'Orders', url: '/orders' }]}
          className="mb-4"
        />

        {/* Reorder Toast Notification */}
        <AnimatePresence>
          {reorderNotice && (
            <motion.div
              initial={{ opacity: 0, y: -16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-brand-dark text-white px-5 py-3 rounded-2xl shadow-2xl border border-amber-400/40 flex items-center gap-2.5 text-xs sm:text-sm font-bold"
            >
              <CheckCircle2 size={18} className="text-amber-400 flex-shrink-0" />
              <span>{reorderNotice}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Page Hero Header */}
        <div className="bg-gradient-to-r from-[#2A0800] via-[#3D1005] to-[#2A0800] rounded-3xl p-5 sm:p-8 text-white shadow-xl border border-amber-500/25 mb-6 relative overflow-hidden">
          <div className="absolute -right-12 -top-12 w-56 h-56 rounded-full bg-brand-primary/15 blur-3xl pointer-events-none" />

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
            <div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/15 border border-amber-400/30 text-amber-300 text-[11px] font-extrabold uppercase tracking-wider mb-2.5">
                <Sparkles size={13} />
                {isTelugu ? 'ఆర్డర్ హిస్టరీ & లైవ్ ట్రాకింగ్' : 'Order Center & Live Delivery'}
              </span>
              <h1
                style={{ color: '#FFFFFF' }}
                className={`text-2xl sm:text-3xl md:text-4xl font-black tracking-tight !text-white text-white drop-shadow-md flex items-center gap-3 ${isTelugu ? 'font-telugu' : ''
                  }`}
              >
                <span className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-amber-400/20 border border-amber-300/40 flex items-center justify-center flex-shrink-0 shadow-sm">
                  <Package className="text-amber-300 flex-shrink-0" size={24} />
                </span>
                <span className="text-white !text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.45)]">
                  {isTelugu ? 'మీ ఆర్డర్లు' : 'Your Orders'}
                </span>
              </h1>
              <p className="text-xs sm:text-sm text-amber-100/80 mt-1 max-w-xl">
                {isTelugu
                  ? 'మీ ఆర్డర్ వివరాలు, కొరియర్ ట్రాకింగ్ ఐడి, డెలివరీ స్టేటస్ మరియు బిల్లు రసీదులను ఇక్కడ చూడండి.'
                  : 'Check live kitchen preparation, courier tracking IDs, delivery timelines, invoices, or reorder your favorite delicacies.'}
              </p>
            </div>

            <div className="flex items-center gap-2.5 self-start sm:self-center">
              <button
                type="button"
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="bg-white/10 hover:bg-white/20 text-white border border-white/20 px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
              >
                <RefreshCw size={14} className={isRefreshing ? 'animate-spin text-amber-300' : 'text-amber-300'} />
                <span>{isTelugu ? 'రిఫ్రెష్' : 'Refresh Status'}</span>
              </button>

              <Link
                to="/shop"
                className="bg-brand-primary hover:bg-yellow-600 text-white px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-md"
              >
                <ShoppingBag size={14} />
                <span>{isTelugu ? 'షాప్' : 'Shop More'}</span>
              </Link>
            </div>
          </div>

          {/* Quick Summary Counters */}
          <div className="grid grid-cols-3 gap-2.5 sm:gap-4 mt-5 pt-5 border-t border-white/10 relative z-10">
            <div className="bg-white/5 border border-white/10 rounded-2xl px-3.5 py-2.5">
              <span className="text-[10px] sm:text-xs text-amber-200/80 font-semibold block">
                {isTelugu ? 'మొత్తం ఆర్డర్లు' : 'Total Orders'}
              </span>
              <span className="text-lg sm:text-2xl font-black text-white">{stats.total}</span>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-2xl px-3.5 py-2.5">
              <span className="text-[10px] sm:text-xs text-amber-200/80 font-semibold block">
                {isTelugu ? 'డెలివరీలో ఉన్నవి' : 'In Progress'}
              </span>
              <span className="text-lg sm:text-2xl font-black text-amber-300">{stats.active}</span>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-2xl px-3.5 py-2.5">
              <span className="text-[10px] sm:text-xs text-amber-200/80 font-semibold block">
                {isTelugu ? 'చేరినవి' : 'Delivered'}
              </span>
              <span className="text-lg sm:text-2xl font-black text-emerald-400">{stats.delivered}</span>
            </div>
          </div>
        </div>

        {/* Instant Order Finder (Search by Order #, Tracking ID, Phone, or Email) */}
        <div className="bg-white rounded-3xl p-4 sm:p-5 shadow-xs border border-amber-900/10 mb-6">
          <form onSubmit={handleLookupSubmit} className="flex flex-col sm:flex-row gap-2.5">
            <div className="relative flex-1">
              <Search size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder={
                  isTelugu
                    ? 'ఆర్డర్ నంబర్ (STR-...), ఫోన్ నంబర్ లేదా ఇమెయిల్‌తో వెతకండి...'
                    : 'Find order by Order # (STR-...), Tracking ID, Phone Number, or Email...'
                }
                className="w-full pl-10 pr-9 py-2.5 sm:py-3 bg-gray-50 border border-gray-200 rounded-2xl text-xs sm:text-sm text-brand-dark focus:outline-none focus:border-brand-primary focus:bg-white transition"
              />
              {searchInput && (
                <button
                  type="button"
                  onClick={handleClearLookup}
                  aria-label="Clear search"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 cursor-pointer"
                >
                  <X size={16} />
                </button>
              )}
            </div>
            <button
              type="submit"
              className="bg-brand-dark hover:bg-brand-primary text-white font-bold px-6 py-2.5 sm:py-3 rounded-2xl text-xs sm:text-sm transition shadow-sm flex items-center justify-center gap-2 cursor-pointer"
            >
              <Search size={15} />
              <span>{isTelugu ? 'ఆర్డర్ వెతకండి' : 'Find Orders'}</span>
            </button>
          </form>

          {!isLoggedIn && !activeLookupQuery && (
            <div className="mt-3 pt-3 border-t border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-gray-500">
              <span className="flex items-center gap-1.5">
                <User size={14} className="text-brand-primary flex-shrink-0" />
                {isTelugu
                  ? 'ఈ ఫోన్/బ్రౌజర్‌లో పెట్టిన ఆర్డర్లు ఆటోమేటిక్‌గా కనిపిస్తాయి, లేదా మీ మొబైల్ నంబర్‌తో వెతకండి.'
                  : 'Orders placed on this device appear automatically below, or sign in / search with your mobile number.'}
              </span>
              <Link
                to="/login?redirect=/orders"
                className="text-brand-primary hover:underline font-bold whitespace-nowrap"
              >
                {isTelugu ? 'లాగిన్ అవ్వండి →' : 'Sign In to Sync Account →'}
              </Link>
            </div>
          )}
        </div>

        {/* Status Filter Pills */}
        {orders.length > 0 && (
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-2 mb-5">
            {(
              [
                { key: 'ALL', labelEn: `All Orders (${stats.total})`, labelTe: `అన్నీ (${stats.total})` },
                { key: 'ACTIVE', labelEn: `Active (${stats.active})`, labelTe: `డెలివరీలో (${stats.active})` },
                { key: 'DELIVERED', labelEn: `Delivered (${stats.delivered})`, labelTe: `చేరినవి (${stats.delivered})` },
                { key: 'CANCELLED', labelEn: `Cancelled (${stats.cancelled})`, labelTe: `రద్దయినవి (${stats.cancelled})` }
              ] as { key: FilterTab; labelEn: string; labelTe: string }[]
            ).map((tab) => {
              const active = statusFilter === tab.key;
              return (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => setStatusFilter(tab.key)}
                  className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition cursor-pointer border ${active
                      ? 'bg-brand-dark text-white border-brand-dark shadow-xs'
                      : 'bg-white text-gray-600 border-gray-200 hover:border-brand-primary hover:text-brand-dark'
                    }`}
                >
                  {isTelugu ? tab.labelTe : tab.labelEn}
                </button>
              );
            })}
          </div>
        )}

        {/* Orders List / Loading / Empty State */}
        {isLoading ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-gray-100 shadow-xs">
            <div className="w-9 h-9 border-4 border-brand-primary border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-sm font-semibold text-gray-600">
              {isTelugu ? 'మీ ఆర్డర్ వివరాలను లోడ్ చేస్తోంది...' : 'Loading your orders & live delivery updates...'}
            </p>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="bg-white rounded-3xl p-8 sm:p-12 text-center border border-gray-100 shadow-xs space-y-4">
            <div className="w-16 h-16 rounded-full bg-amber-50 border border-amber-200 text-brand-primary flex items-center justify-center mx-auto">
              {activeLookupQuery ? <AlertCircle size={30} /> : <Package size={30} />}
            </div>
            <div className="space-y-1.5 max-w-md mx-auto">
              <h2 className="text-lg sm:text-xl font-black text-brand-dark">
                {activeLookupQuery
                  ? isTelugu
                    ? `"${activeLookupQuery}" కి ఆర్డర్లు కనిపించలేదు`
                    : `No orders found for "${activeLookupQuery}"`
                  : isTelugu
                    ? 'ఇంకా ఆర్డర్లు లేవు'
                    : 'No Orders Found Yet'}
              </h2>
              <p className="text-xs sm:text-sm text-gray-500 leading-relaxed">
                {activeLookupQuery
                  ? isTelugu
                    ? 'దయచేసి మీ ఆర్డర్ నంబర్ (STR-...), ట్రాకింగ్ ఐడి లేదా 10-అంకెల ఫోన్ నంబర్‌ను సరిచూసుకోండి.'
                    : 'Please check your Order Number (e.g. STR-2026-1001), Tracking ID, or enter the 10-digit mobile number used during checkout.'
                  : isTelugu
                    ? 'వరంగల్ సంప్రదాయ పచ్చళ్ళు, స్వీట్లు మరియు కరకరలాడే సకినాలను ఇప్పుడే ఆర్డర్ చేయండి!'
                    : 'Explore our authentic Warangal pickles, pure ghee sweets, crunchy sakinalu, and spice podulu made fresh for your family.'}
              </p>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              {activeLookupQuery && (
                <button
                  type="button"
                  onClick={handleClearLookup}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold px-5 py-2.5 rounded-full text-xs transition cursor-pointer"
                >
                  {isTelugu ? 'అన్ని ఆర్డర్లు చూడండి' : 'Reset Search'}
                </button>
              )}
              <Link
                to="/categories"
                className="bg-brand-primary hover:bg-yellow-600 text-white font-bold px-6 py-2.5 rounded-full text-xs sm:text-sm transition shadow-md inline-flex items-center gap-2"
              >
                <ShoppingBag size={15} />
                <span>{isTelugu ? 'రుచులను చూడండి' : 'Browse Categories'}</span>
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-5">
            {filteredOrders.map((order) => {
              const meta = STATUS_META[order.status] || STATUS_META.PENDING;
              const stepIdx = STATUS_STEPS.indexOf(order.status);
              const progressPct =
                order.status === 'CANCELLED'
                  ? 0
                  : Math.max(8, Math.round(((Math.max(0, stepIdx) + 1) / STATUS_STEPS.length) * 100));

              const placedFormatted = order.createdAt
                ? new Date(order.createdAt).toLocaleString('en-IN', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })
                : 'Recent';

              const itemsSubtotal = order.items.reduce(
                (sum, item) => sum + item.price * item.quantity,
                0
              );
              const isTimelineOpen = Boolean(expandedTimelineIds[order.orderNumber]);

              const whatsappHelpUrl = `https://wa.me/918121345585?text=${encodeURIComponent(
                `Hello Sri Telangana Ruchulu! I need help regarding my Order #${order.orderNumber}${order.trackingId ? ` (Tracking ID: ${order.trackingId})` : ''
                }.`
              )}`;

              return (
                <motion.div
                  key={order.orderNumber || order.id}
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-3xl border border-gray-200/80 shadow-xs hover:shadow-md transition-shadow overflow-hidden"
                >
                  {/* Top Order Summary Bar */}
                  <div className="bg-gradient-to-r from-amber-50/70 via-white to-amber-50/40 px-4 sm:px-6 py-4 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-mono font-black text-base sm:text-lg text-brand-dark">
                          {order.orderNumber}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleCopy(order.orderNumber)}
                          className="text-gray-400 hover:text-brand-primary p-1 rounded-lg hover:bg-amber-50 transition cursor-pointer"
                          title="Copy Order Number"
                        >
                          {copiedText === order.orderNumber ? (
                            <Check size={14} className="text-emerald-600" />
                          ) : (
                            <Copy size={14} />
                          )}
                        </button>

                        <span
                          className={`inline-flex items-center gap-1.5 text-[11px] font-extrabold px-3 py-0.5 rounded-full border ${meta.badgeBg} ${meta.badgeText}`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${meta.dot}`} />
                          {isTelugu ? meta.te : meta.en}
                        </span>

                        <span
                          className={`inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${order.paymentMethod === 'RAZORPAY'
                              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                              : 'bg-gray-100 text-gray-700 border-gray-200'
                            }`}
                        >
                          {order.paymentMethod === 'RAZORPAY' ? (
                            <>
                              <CreditCard size={11} /> Paid Online
                            </>
                          ) : (
                            <>
                              <Banknote size={11} /> COD
                            </>
                          )}
                        </span>
                      </div>

                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-500">
                        <span className="inline-flex items-center gap-1">
                          <Clock size={13} className="text-gray-400" />
                          {placedFormatted}
                        </span>
                        <span>•</span>
                        <span>
                          {order.items.reduce((s, i) => s + i.quantity, 0)}{' '}
                          {isTelugu ? 'ప్యాక్‌లు' : 'pack(s)'}
                        </span>
                      </div>
                    </div>

                    <div className="flex sm:flex-col items-baseline sm:items-end justify-between border-t sm:border-t-0 pt-2.5 sm:pt-0 border-gray-100">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400">
                        {isTelugu ? 'మొత్తం బిల్లు' : 'Total Amount'}
                      </span>
                      <span className="text-lg sm:text-xl font-black text-brand-dark">
                        ₹{order.totalAmount.toFixed(2)}
                      </span>
                    </div>
                  </div>

                  <div className="p-4 sm:p-6 space-y-5">
                    {/* 6-Step Live Shipment Progress Tracker */}
                    {order.status !== 'CANCELLED' ? (
                      <div className="bg-[#FDFBF7] border border-amber-900/10 rounded-2xl p-3.5 sm:p-5">
                        <div className="flex items-center justify-between text-xs mb-2.5 sm:mb-4">
                          <span className="font-extrabold text-brand-dark flex items-center gap-1.5">
                            <Truck size={15} className="text-brand-primary" />
                            {isTelugu ? 'లైవ్ డెలివరీ ప్రోగ్రెస్' : 'Live Shipment Progress'}
                          </span>
                          <span className="text-[11px] font-bold text-emerald-700">
                            {order.estimatedDelivery
                              ? `${isTelugu ? 'అంచనా డెలివరీ:' : 'Est. Delivery:'} ${order.estimatedDelivery}`
                              : isTelugu
                                ? 'తాజా బ్యాచ్ సిద్ధమవుతోంది'
                                : 'Fresh Batch Dispatch'}
                          </span>
                        </div>

                        {/* Mobile Smooth Progress Bar + Stepper */}
                        <div className="sm:hidden space-y-2">
                          <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-amber-500 to-emerald-600 rounded-full transition-all duration-500"
                              style={{ width: `${progressPct}%` }}
                            />
                          </div>
                          <div className="flex items-center justify-between text-[11px] font-bold text-gray-600">
                            <span>
                              Step {Math.max(1, stepIdx + 1)} of {STATUS_STEPS.length}:{' '}
                              <strong className="text-brand-dark">
                                {isTelugu ? meta.te : meta.en}
                              </strong>
                            </span>
                            <span className="text-emerald-700">{progressPct}%</span>
                          </div>
                        </div>

                        {/* Desktop Full 6-Node Horizontal Stepper */}
                        <div className="hidden sm:block relative pt-1">
                          <div className="absolute top-4 left-6 right-6 h-1 bg-gray-200 rounded-full" />
                          <div
                            className="absolute top-4 left-6 h-1 bg-emerald-500 rounded-full transition-all duration-500"
                            style={{
                              width: `calc(${Math.max(
                                0,
                                (Math.max(0, stepIdx) / (STATUS_STEPS.length - 1)) * 100
                              )}% - 24px)`
                            }}
                          />
                          <div className="relative z-10 grid grid-cols-6 gap-1">
                            {STATUS_STEPS.map((step, idx) => {
                              const passed = stepIdx >= idx;
                              const current = stepIdx === idx;
                              const stepInfo = STATUS_META[step];
                              return (
                                <div key={step} className="flex flex-col items-center text-center">
                                  <div
                                    className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black transition-all ${passed
                                        ? 'bg-emerald-600 text-white ring-4 ring-emerald-100'
                                        : 'bg-white text-gray-400 border-2 border-gray-300'
                                      }`}
                                  >
                                    {passed ? <Check size={14} /> : idx + 1}
                                  </div>
                                  <span
                                    className={`text-[11px] mt-2 leading-tight ${current
                                        ? 'font-black text-emerald-800'
                                        : passed
                                          ? 'font-bold text-gray-800'
                                          : 'font-medium text-gray-400'
                                      }`}
                                  >
                                    {isTelugu ? stepInfo.shortTe : stepInfo.shortEn}
                                  </span>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="bg-rose-50 border border-rose-200 rounded-2xl p-4 text-rose-800 text-xs sm:text-sm font-bold flex items-center gap-2">
                        <AlertCircle size={18} className="text-rose-600 flex-shrink-0" />
                        <span>
                          {isTelugu
                            ? 'ఈ ఆర్డర్ రద్దు చేయబడింది. సహాయం కోసం వాట్సాప్‌లో సంప్రదించండి.'
                            : 'This order was cancelled. Contact our Warangal support team on WhatsApp if you need assistance.'}
                        </span>
                      </div>
                    )}

                    {/* Tracking, Courier & Shipping Address Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 text-xs">
                      <div className="p-3.5 rounded-2xl bg-amber-50/50 border border-amber-200/70 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-900/70">
                            {isTelugu ? 'ట్రాకింగ్ & కొరియర్ వివరాలు' : 'Shipment & Tracking'}
                          </span>
                          {order.trackingId && (
                            <button
                              type="button"
                              onClick={() => handleCopy(order.trackingId!)}
                              className="inline-flex items-center gap-1 font-mono font-bold text-amber-950 bg-white px-2.5 py-0.5 rounded-lg border border-amber-300 hover:border-brand-primary cursor-pointer"
                              title="Copy Tracking ID"
                            >
                              <span>{order.trackingId}</span>
                              {copiedText === order.trackingId ? (
                                <Check size={12} className="text-emerald-600" />
                              ) : (
                                <Copy size={12} className="text-gray-400" />
                              )}
                            </button>
                          )}
                        </div>
                        <p className="text-gray-800 font-semibold">
                          <span className="text-gray-500 font-normal">
                            {isTelugu ? 'కొరియర్:' : 'Courier Partner:'}{' '}
                          </span>
                          {order.courierPartner || 'Sri Telangana Tri-City Express'}
                        </p>
                        {order.trackingNotes && (
                          <p className="text-amber-950 bg-white/80 p-2 rounded-xl border border-amber-200/60">
                            <strong>{isTelugu ? 'అప్‌డేట్:' : 'Latest Note:'}</strong> {order.trackingNotes}
                          </p>
                        )}
                      </div>

                      <div className="p-3.5 rounded-2xl bg-gray-50/90 border border-gray-200/70 space-y-1.5">
                        <span className="text-[10px] font-extrabold uppercase tracking-wider text-gray-400 block">
                          {isTelugu ? 'డెలివరీ చిరునామా' : 'Delivery Destination'}
                        </span>
                        <p className="font-bold text-brand-dark text-xs sm:text-sm">{order.customerName}</p>
                        <p className="text-gray-600 flex items-start gap-1.5 leading-relaxed">
                          <MapPin size={13} className="text-brand-primary flex-shrink-0 mt-0.5" />
                          <span>{order.shippingAddress}</span>
                        </p>
                        {order.phone && (
                          <p className="text-gray-600 flex items-center gap-1.5">
                            <Phone size={12} className="text-brand-primary flex-shrink-0" />
                            <span>{order.phone}</span>
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Ordered Products & Bill Breakdown */}
                    <div className="border border-gray-100 rounded-2xl overflow-hidden">
                      <div className="bg-gray-50/80 px-4 py-2.5 border-b border-gray-100 text-[11px] font-extrabold uppercase tracking-wider text-gray-500">
                        {isTelugu ? 'ఆర్డర్ చేసిన రుచులు' : 'Ordered Delicacies'}
                      </div>
                      <div className="divide-y divide-gray-100">
                        {order.items.map((item, idx) => {
                          const matchedProd =
                            productMap.byId.get(item.productId) ||
                            productMap.byName.get(item.productName.toLowerCase().trim());
                          const thumb = matchedProd?.imageUrl || '/images/veg_pickles.jpg';
                          const displayName = getProductName(item.productName);

                          return (
                            <div
                              key={`${order.orderNumber}-item-${idx}`}
                              className="p-3 sm:px-4 flex items-center justify-between gap-3 hover:bg-amber-50/20 transition"
                            >
                              <div className="flex items-center gap-3 min-w-0">
                                <img
                                  src={thumb}
                                  alt={item.productName}
                                  onError={(e) => {
                                    (e.target as HTMLImageElement).src = '/images/veg_pickles.jpg';
                                  }}
                                  className="w-12 h-12 rounded-xl object-cover border border-gray-200 flex-shrink-0"
                                />
                                <div className="min-w-0">
                                  {matchedProd ? (
                                    <Link
                                      to={`/product/${matchedProd.slug}`}
                                      className={`font-bold text-xs sm:text-sm text-brand-dark hover:text-brand-primary truncate block ${isTelugu ? 'font-telugu' : ''
                                        }`}
                                    >
                                      {displayName}
                                    </Link>
                                  ) : (
                                    <span
                                      className={`font-bold text-xs sm:text-sm text-brand-dark truncate block ${isTelugu ? 'font-telugu' : ''
                                        }`}
                                    >
                                      {displayName}
                                    </span>
                                  )}
                                  <div className="flex items-center gap-2 text-[11px] text-gray-500 mt-0.5">
                                    <span className="bg-amber-50 text-amber-900 border border-amber-200 px-2 py-0.2 rounded font-bold">
                                      {item.weight || '500g'}
                                    </span>
                                    <span>Qty: {item.quantity}</span>
                                    <span>× ₹{item.price.toFixed(0)}</span>
                                  </div>
                                </div>
                              </div>

                              <span className="font-extrabold text-xs sm:text-sm text-brand-dark whitespace-nowrap">
                                ₹{(item.price * item.quantity).toFixed(2)}
                              </span>
                            </div>
                          );
                        })}
                      </div>

                      {/* Bill Totals Strip */}
                      <div className="bg-gray-50/70 px-4 py-3 border-t border-gray-100 space-y-1 text-xs">
                        <div className="flex justify-between text-gray-500">
                          <span>{isTelugu ? 'వస్తువుల మొత్తం' : 'Items Subtotal'}</span>
                          <span>₹{itemsSubtotal.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-gray-500">
                          <span>{isTelugu ? 'డెలివరీ ఛార్జీలు' : 'Delivery Partner Fee'}</span>
                          <span className={!order.shippingFee ? 'text-emerald-700 font-bold' : ''}>
                            {!order.shippingFee ? 'FREE (₹0.00)' : `₹${order.shippingFee.toFixed(2)}`}
                          </span>
                        </div>
                        {Boolean(order.discount && order.discount > 0) && (
                          <div className="flex justify-between text-emerald-700 font-semibold">
                            <span>{isTelugu ? 'డిస్కౌంట్' : 'Discount'}</span>
                            <span>-₹{order.discount!.toFixed(2)}</span>
                          </div>
                        )}
                        <div className="flex justify-between font-black text-brand-dark text-sm pt-1.5 border-t border-gray-200">
                          <span>{isTelugu ? 'మొత్తం చెల్లించవలసినది' : 'Grand Total'}</span>
                          <span>₹{order.totalAmount.toFixed(2)}</span>
                        </div>
                      </div>
                    </div>

                    {/* Expandable Detailed Shipment Timeline */}
                    {order.timeline && order.timeline.length > 0 && (
                      <div>
                        <button
                          type="button"
                          onClick={() => toggleTimeline(order.orderNumber)}
                          className="text-xs font-bold text-brand-primary hover:text-brand-dark flex items-center gap-1.5 cursor-pointer"
                        >
                          {isTimelineOpen ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
                          <span>
                            {isTimelineOpen
                              ? isTelugu
                                ? 'ట్రాకింగ్ టైమ్‌లైన్ దాచండి'
                                : 'Hide Detailed Shipment Timeline'
                              : isTelugu
                                ? `పూర్తి ట్రాకింగ్ టైమ్‌లైన్ చూడండి (${order.timeline.length} అప్‌డేట్స్)`
                                : `View Detailed Shipment Timeline (${order.timeline.length} updates)`}
                          </span>
                        </button>

                        <AnimatePresence>
                          {isTimelineOpen && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              className="overflow-hidden"
                            >
                              <div className="mt-3 pl-4 ml-2 border-l-2 border-amber-300 space-y-3 py-1">
                                {[...order.timeline].reverse().map((ev, i) => (
                                  <div key={i} className="relative text-xs">
                                    <span className="w-2.5 h-2.5 rounded-full bg-brand-primary absolute -left-[21px] top-1 ring-4 ring-amber-50" />
                                    <div className="flex flex-wrap items-center justify-between gap-2">
                                      <span className="font-bold text-brand-dark">{ev.title}</span>
                                      <span className="text-[11px] text-gray-400">
                                        {new Date(ev.timestamp).toLocaleString('en-IN', {
                                          dateStyle: 'medium',
                                          timeStyle: 'short'
                                        })}
                                      </span>
                                    </div>
                                    <p className="text-gray-600 mt-0.5">{ev.description}</p>
                                    {ev.location && (
                                      <span className="text-[11px] text-amber-800 font-medium block mt-0.5">
                                        📍 {ev.location}
                                      </span>
                                    )}
                                  </div>
                                ))}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    )}

                    {/* Action Buttons Footer */}
                    <div className="pt-3 border-t border-gray-100 flex flex-wrap items-center justify-between gap-2.5">
                      <div className="flex flex-wrap items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleReorder(order)}
                          className="bg-brand-dark hover:bg-brand-primary text-white font-bold px-4 py-2 rounded-xl text-xs transition flex items-center gap-1.5 shadow-2xs cursor-pointer"
                        >
                          <RotateCcw size={13} />
                          <span>{isTelugu ? 'మళ్ళీ ఆర్డర్ చేయండి' : 'Order Again'}</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handlePrintInvoice(order)}
                          className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold px-3.5 py-2 rounded-xl text-xs transition flex items-center gap-1.5 cursor-pointer"
                        >
                          <Printer size={13} />
                          <span>{isTelugu ? 'ఇన్‌వాయిస్ / రసీదు' : 'Invoice Receipt'}</span>
                        </button>
                      </div>

                      <a
                        href={whatsappHelpUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 font-bold px-3.5 py-2 rounded-xl text-xs transition inline-flex items-center gap-1.5"
                      >
                        <MessageCircle size={14} className="text-emerald-600" />
                        <span>{isTelugu ? 'వాట్సాప్ సహాయం' : 'Order Help on WhatsApp'}</span>
                      </a>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </motion.div>
  );
};
