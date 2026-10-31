import { InfoPage } from '../components/InfoPage';
import { Mail, Phone, MapPin, Search } from 'lucide-react';

export const FAQ = () => (
  <InfoPage title="Frequently Asked Questions">
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-bold text-brand-dark mb-2">Are your pickles homemade?</h3>
        <p>Yes, all our pickles and sweets are 100% handcrafted using traditional Telangana recipes passed down through generations. We use hand-pounded spices and cold-pressed oils.</p>
      </div>
      <div>
        <h3 className="text-xl font-bold text-brand-dark mb-2">How long do the products stay fresh?</h3>
        <p>Our vegetarian pickles have a shelf life of 6-8 months when stored in a cool, dry place. Non-vegetarian pickles are best consumed within 3 months. Sweets vary from 2 to 4 weeks depending on the item.</p>
      </div>
      <div>
        <h3 className="text-xl font-bold text-brand-dark mb-2">Do you ship internationally?</h3>
        <p>Currently, we ship across India. However, we are working on expanding our logistics to serve our global Telangana diaspora very soon.</p>
      </div>
    </div>
  </InfoPage>
);

export const ShippingPolicy = () => (
  <InfoPage title="Shipping Policy">
    <p>We take extreme care in packaging our premium authentic foods to ensure they reach you perfectly intact.</p>
    <ul className="list-disc pl-5 space-y-2 mt-4">
      <li><strong>Processing Time:</strong> All orders are prepared fresh and dispatched within 2-3 business days.</li>
      <li><strong>Delivery Time:</strong> Standard delivery takes 3-5 business days across major Indian cities.</li>
      <li><strong>Shipping Charges:</strong> Free shipping on orders above ₹1000. For orders below, a standard flat rate of ₹80 applies.</li>
      <li><strong>Packaging:</strong> We use food-grade, leak-proof, and secure packaging to ensure maximum freshness and safety during transit.</li>
    </ul>
  </InfoPage>
);

export const ReturnPolicy = () => (
  <InfoPage title="Return & Refund Policy">
    <p>Due to the perishable nature of our premium food products, we do not accept returns. However, your satisfaction is our highest priority.</p>
    <p className="mt-4">If you receive a damaged, leaked, or incorrect product, please contact us within 24 hours of delivery with photographic evidence. We will gladly issue a full refund or send a replacement order immediately.</p>
  </InfoPage>
);

export const ContactUs = () => (
  <InfoPage title="Contact Us">
    <p>We'd love to hear from you! Whether you have a question about our traditional recipes, an order inquiry, or bulk corporate gifting requests, we are here to help.</p>
    
    <div className="mt-8 space-y-6 bg-brand-light p-6 rounded-2xl">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm">
          <Phone className="text-brand-primary" />
        </div>
        <div>
          <h4 className="font-bold text-brand-dark">Call Us</h4>
          <p><a href="tel:+918121345585" className="hover:text-brand-primary transition-colors">+91 81213 45585</a> (Mon-Sat, 9AM to 6PM)</p>
        </div>
      </div>
      
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm">
          <Mail className="text-brand-primary" />
        </div>
        <div>
          <h4 className="font-bold text-brand-dark">Email Us</h4>
          <p>
            <a 
              href="https://mail.google.com/mail/?view=cm&fs=1&to=sritelanganaruchulu@gmail.com" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="hover:text-brand-primary transition-colors font-medium text-brand-dark"
              title="Send email to sritelanganaruchulu@gmail.com"
            >
              sritelanganaruchulu@gmail.com
            </a>
          </p>
        </div>
      </div>

      <a 
        href="https://maps.app.goo.gl/zopqiWgNNhhbxqjE8?g_st=iw" 
        target="_blank" 
        rel="noopener noreferrer" 
        className="flex items-center gap-4 hover:opacity-80 transition-opacity"
      >
        <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm">
          <MapPin className="text-brand-primary" />
        </div>
        <div>
          <h4 className="font-bold text-brand-dark">Visit Our Kitchen</h4>
          <p>Warangal, Telangana, India - 506002</p>
        </div>
      </a>
    </div>
  </InfoPage>
);

export const PrivacyPolicy = () => (
  <InfoPage title="Privacy Policy">
    <p>At Sri Telangana Ruchulu, we deeply respect your privacy. This policy outlines how we handle your data.</p>
    <h3 className="text-xl font-bold text-brand-dark mt-6 mb-2">Data Collection</h3>
    <p>We collect essential information (name, email, address, phone number) exclusively for order fulfillment and improving your shopping experience.</p>
    <h3 className="text-xl font-bold text-brand-dark mt-6 mb-2">Data Security</h3>
    <p>Your payment information is processed through secure, encrypted gateways. We never store your credit card details on our servers.</p>
  </InfoPage>
);

export const TermsOfService = () => (
  <InfoPage title="Terms of Service">
    <p>Welcome to Sri Telangana Ruchulu. By using our website and purchasing our products, you agree to the following terms:</p>
    <ul className="list-disc pl-5 space-y-2 mt-4">
      <li>All products are subject to availability.</li>
      <li>Prices are subject to change without prior notice.</li>
      <li>We reserve the right to refuse service or cancel orders in cases of fraud or inaccurate information.</li>
      <li>The content on this website is for general information and is subject to change.</li>
    </ul>
  </InfoPage>
);

import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { trackOrderByQuery } from '../api';
import type { Order, OrderStatus } from '../types';
import { Truck, CheckCircle, AlertCircle } from 'lucide-react';

const STATUS_PROGRESS: OrderStatus[] = ['PENDING', 'CONFIRMED', 'PREPARING', 'SHIPPED', 'OUT_FOR_DELIVERY', 'DELIVERED'];

const STATUS_LABELS: Record<OrderStatus, string> = {
  PENDING: 'Order Placed',
  CONFIRMED: 'Confirmed',
  PREPARING: 'Preparing & Packing',
  SHIPPED: 'Dispatched in Transit',
  OUT_FOR_DELIVERY: 'Out for Delivery',
  DELIVERED: 'Delivered',
  CANCELLED: 'Cancelled'
};

export const TrackOrder = () => {
  const [searchParams] = useSearchParams();
  const getSearchQuery = () => {
    return (
      searchParams.get('q') ||
      searchParams.get('order') ||
      searchParams.get('trackingId') ||
      searchParams.get('orderNumber') ||
      searchParams.get('id') ||
      ''
    ).trim();
  };

  const initialQuery = getSearchQuery();
  const [query, setQuery] = useState(initialQuery);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [order, setOrder] = useState<Order | null>(null);

  const handleTrack = async (searchId: string) => {
    const q = searchId.trim().replace(/^#/, '');
    if (!q) return;
    setLoading(true);
    setSearched(true);
    try {
      const res = await trackOrderByQuery(q);
      setOrder(res);
    } catch (err) {
      console.error(err);
      setOrder(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const targetQ = getSearchQuery();
    if (targetQ) {
      setQuery(targetQ);
      handleTrack(targetQ);
    }
  }, [searchParams]);

  const currentStepIndex = order ? STATUS_PROGRESS.indexOf(order.status) : -1;

  return (
    <InfoPage title="Live Order Tracking & Shipment Status">
      <div className="max-w-2xl mx-auto py-6">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-amber-100 text-brand-primary rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
            <Truck size={36} />
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-brand-dark mb-2">
            Track Your Ordered Items
          </h2>
          <p className="text-gray-500 text-sm">
            Enter your Order Number (e.g. <code>STR-2026-1001</code>) or Tracking ID (e.g. <code>STR-TRK-784920</code>) below.
          </p>
        </div>

        <form 
          onSubmit={(e) => { e.preventDefault(); handleTrack(query); }}
          className="flex flex-col sm:flex-row gap-3 mb-8"
        >
          <div className="relative flex-1">
            <Search className="absolute left-4 top-3.5 text-gray-400" size={18} />
            <input
              type="text"
              required
              placeholder="e.g. STR-2026-1001 or STR-TRK-784920"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3 border-2 border-gray-200 rounded-2xl text-sm font-mono font-bold focus:outline-none focus:border-brand-primary shadow-xs"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="bg-brand-dark hover:bg-brand-primary text-white font-bold px-8 py-3 rounded-2xl transition shadow-md disabled:opacity-50 text-sm flex items-center justify-center gap-2"
          >
            {loading ? 'Searching...' : 'Track Package'}
          </button>
        </form>

        {searched && !order && !loading && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center text-red-700">
            <AlertCircle size={32} className="mx-auto mb-2 text-red-500" />
            <h4 className="font-bold">No Order Found</h4>
            <p className="text-xs text-red-600 mt-1">
              We couldn't find an order matching "<strong>{query}</strong>". Please verify your Order Number or Tracking ID from your confirmation receipt.
            </p>
          </div>
        )}

        {order && (
          <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden space-y-6 p-6 sm:p-8">
            {/* Header Status Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-gray-100">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-amber-800 bg-amber-100 px-2.5 py-1 rounded-full">
                  Verified Shipment
                </span>
                <h3 className="text-xl font-bold text-brand-dark mt-2 font-mono">
                  {order.orderNumber}
                </h3>
                <p className="text-xs text-gray-400">
                  Placed on {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                </p>
              </div>

              <div className="sm:text-right">
                <div className="text-xs text-gray-500">Tracking ID:</div>
                <div className="font-mono font-bold text-amber-900 bg-amber-50 border border-amber-300 px-3 py-1 rounded-xl text-sm inline-block mt-0.5">
                  {order.trackingId || 'Pending Allocation'}
                </div>
              </div>
            </div>

            {/* Stepper Progress Bar */}
            {order.status !== 'CANCELLED' ? (
              <div className="py-2">
                <div className="relative flex items-center justify-between">
                  <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-200 -translate-y-1/2 -z-0"></div>
                  <div 
                    className="absolute top-1/2 left-0 h-1 bg-green-500 -translate-y-1/2 -z-0 transition-all duration-500"
                    style={{ width: `${Math.max(0, (currentStepIndex / (STATUS_PROGRESS.length - 1)) * 100)}%` }}
                  ></div>

                  {STATUS_PROGRESS.map((step, idx) => {
                    const isPassed = currentStepIndex >= idx;
                    const isCurrent = currentStepIndex === idx;
                    return (
                      <div key={step} className="flex flex-col items-center relative z-10">
                        <div 
                          className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all shadow-sm ${
                            isPassed 
                              ? 'bg-green-600 text-white ring-4 ring-green-100' 
                              : 'bg-white text-gray-400 border-2 border-gray-300'
                          }`}
                        >
                          {isPassed ? <CheckCircle size={14} /> : idx + 1}
                        </div>
                        <span className={`text-[10px] mt-2 font-semibold text-center hidden sm:block max-w-[70px] ${
                          isCurrent ? 'text-green-700 font-extrabold' : isPassed ? 'text-gray-800' : 'text-gray-400'
                        }`}>
                          {STATUS_LABELS[step]}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="bg-red-50 text-red-700 p-4 rounded-xl text-center font-bold text-sm">
                Order Cancelled
              </div>
            )}

            {/* Current Details Box */}
            <div className="bg-amber-50/60 rounded-2xl p-5 border border-amber-100 space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-gray-500 block uppercase font-bold text-[10px]">Current Status</span>
                  <span className="text-sm font-bold text-brand-dark">{STATUS_LABELS[order.status]}</span>
                </div>
                <div>
                  <span className="text-gray-500 block uppercase font-bold text-[10px]">Courier Service</span>
                  <span className="text-sm font-semibold text-gray-800">{order.courierPartner || 'Sri Telangana Tri-City Express'}</span>
                </div>
                {order.estimatedDelivery && (
                  <div>
                    <span className="text-gray-500 block uppercase font-bold text-[10px]">Estimated Delivery</span>
                    <span className="text-sm font-bold text-green-700">{order.estimatedDelivery}</span>
                  </div>
                )}
                <div>
                  <span className="text-gray-500 block uppercase font-bold text-[10px]">Destination City</span>
                  <span className="text-sm font-semibold text-gray-800">{order.shippingAddress}</span>
                </div>
              </div>

              {order.trackingNotes && (
                <div className="pt-2 border-t border-amber-200/60 text-xs text-amber-900">
                  <strong>Latest Dispatch Note:</strong> <em>"{order.trackingNotes}"</em>
                </div>
              )}
            </div>

            {/* Timeline Events Audit */}
            {order.timeline && order.timeline.length > 0 && (
              <div>
                <h4 className="font-bold text-xs uppercase text-gray-400 mb-3 tracking-wider">
                  Detailed Tracking Timeline
                </h4>
                <div className="space-y-3 border-l-2 border-amber-300 pl-4 ml-2">
                  {order.timeline.map((event, i) => (
                    <div key={i} className="relative text-xs">
                      <div className="w-2.5 h-2.5 bg-brand-primary rounded-full absolute -left-[21px] top-1"></div>
                      <div className="font-bold text-brand-dark flex items-center justify-between">
                        <span>{event.title}</span>
                        <span className="text-[10px] text-gray-400 font-normal">
                          {new Date(event.timestamp).toLocaleString('en-IN', { dateStyle: 'short', timeStyle: 'short' })}
                        </span>
                      </div>
                      <p className="text-gray-600 mt-0.5">{event.description}</p>
                      {event.location && (
                        <span className="text-[10px] text-amber-800 block mt-0.5 font-medium">
                          📍 {event.location}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Package Contents */}
            <div>
              <h4 className="font-bold text-xs uppercase text-gray-400 mb-2 tracking-wider">
                Items in this Package
              </h4>
              <div className="divide-y divide-gray-100 border border-gray-100 rounded-xl overflow-hidden">
                {order.items.map((it, idx) => (
                  <div key={idx} className="p-3 flex justify-between items-center text-xs">
                    <span className="font-semibold text-gray-800">
                      {it.quantity}x {it.productName} ({it.weight || '500g'})
                    </span>
                    <span className="font-bold text-brand-dark">₹{(it.price * it.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </InfoPage>
  );
};
