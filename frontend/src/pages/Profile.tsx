import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Package, 
  LogOut, 
  ShieldCheck, 
  Edit3, 
  Check, 
  Clock, 
  ShoppingBag,
  ExternalLink,
  Truck
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { getOrders } from '../api';
import type { Order } from '../types';

export const Profile = () => {
  const navigate = useNavigate();
  const { user, isLoggedIn, logout, updateUser } = useAuthStore();

  const [activeTab, setActiveTab] = useState<'profile' | 'orders' | 'addresses'>('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const [customerOrders, setCustomerOrders] = useState<Order[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(false);

  const [formData, setFormData] = useState({
    name: user?.name || 'Valued Customer',
    email: user?.email || 'customer@sritelanganaruchulu.com',
    phone: user?.phone || '+91 98765 43210',
    address: user?.address || 'Plot 42, Road No. 10, Jubilee Hills',
    city: user?.city || 'Hyderabad',
    postalCode: user?.postalCode || '500033'
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || 'Valued Customer',
        email: user.email || '',
        phone: user.phone || '',
        address: user.address || '',
        city: user.city || '',
        postalCode: user.postalCode || ''
      });
    }
  }, [user]);

  // Fetch real customer orders from database
  useEffect(() => {
    if (isLoggedIn && user?.email) {
      setLoadingOrders(true);
      getOrders()
        .then((allOrders) => {
          const userEmail = (user.email || '').toLowerCase().trim();
          const userPhone = user.phone ? user.phone.replace(/[^0-9]/g, '') : '';
          const filtered = allOrders.filter(o => {
            const orderEmail = (o.email || '').toLowerCase().trim();
            const orderPhone = o.phone ? o.phone.replace(/[^0-9]/g, '') : '';
            return (
              (orderEmail && orderEmail === userEmail) ||
              (userPhone.length >= 10 && orderPhone && orderPhone.endsWith(userPhone.slice(-10)))
            );
          });
          setCustomerOrders(filtered);
        })
        .catch(err => console.warn('Failed to load user orders:', err))
        .finally(() => setLoadingOrders(false));
    }
  }, [isLoggedIn, user?.email, user?.phone]);

  if (!isLoggedIn) {
    return (
      <div className="bg-brand-light min-h-screen pt-36 pb-20 flex items-center justify-center px-4">
        <Helmet>
          <title>My Profile | Sri Telangana Ruchulu</title>
        </Helmet>
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-10 rounded-3xl shadow-xl max-w-md w-full text-center border border-gray-100"
        >
          <div className="w-20 h-20 bg-brand-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <User size={38} className="text-brand-primary" />
          </div>
          <h2 className="text-2xl font-bold text-brand-dark mb-2">Sign In Required</h2>
          <p className="text-gray-500 mb-8">Please log in to view your profile, manage addresses, and track your traditional orders.</p>
          <div className="flex flex-col gap-3">
            <Link
              to="/login"
              className="w-full bg-brand-dark text-white font-bold py-3.5 rounded-xl hover:bg-brand-primary hover:text-brand-dark transition shadow-md flex items-center justify-center gap-2"
            >
              Sign In with Email OTP
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateUser(formData);
    setIsEditing(false);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="bg-brand-light min-h-screen pt-32 pb-20">
      <Helmet>
        <title>My Account | Sri Telangana Ruchulu</title>
      </Helmet>

      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header Profile Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 mb-8 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-80 h-80 bg-brand-primary/5 rounded-full blur-3xl pointer-events-none"></div>

          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
            <div className="flex items-center gap-6">
              <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-brand-primary to-yellow-600 text-white font-black text-3xl flex items-center justify-center shadow-lg ring-4 ring-brand-primary/20">
                {formData.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <div className="flex items-center gap-3">
                  <h1 className="text-3xl font-extrabold text-brand-dark">{formData.name}</h1>
                  <span className={`text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider ${
                    user?.role === 'ADMIN' ? 'bg-amber-100 text-amber-800 border border-amber-300' : 'bg-green-100 text-green-800'
                  }`}>
                    {user?.role === 'ADMIN' ? 'Administrator' : 'Premium Member'}
                  </span>
                </div>
                <p className="text-gray-500 mt-1 flex items-center gap-2 text-sm">
                  <Mail size={16} /> {formData.email}
                </p>
                <p className="text-gray-400 text-xs mt-1">
                  Member since {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' }) : '2026'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 w-full md:w-auto">
              {user?.role === 'ADMIN' && (
                <Link
                  to="/admin"
                  className="flex items-center gap-2 bg-brand-primary text-white font-bold px-5 py-2.5 rounded-xl hover:bg-yellow-600 transition text-sm shadow-sm"
                >
                  <ShieldCheck size={18} /> Admin Dashboard
                </Link>
              )}
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 bg-gray-100 hover:bg-red-50 text-gray-700 hover:text-red-600 font-bold px-5 py-2.5 rounded-xl transition text-sm border border-gray-200"
              >
                <LogOut size={18} /> Logout
              </button>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex gap-4 border-b border-gray-100 mt-8 pt-4">
            <button
              onClick={() => setActiveTab('profile')}
              className={`pb-3 font-bold text-sm tracking-wide border-b-2 transition-colors flex items-center gap-2 ${
                activeTab === 'profile'
                  ? 'border-brand-primary text-brand-dark'
                  : 'border-transparent text-gray-400 hover:text-gray-600'
              }`}
            >
              <User size={18} /> Personal Details
            </button>
            <button
              onClick={() => setActiveTab('orders')}
              className={`pb-3 font-bold text-sm tracking-wide border-b-2 transition-colors flex items-center gap-2 ${
                activeTab === 'orders'
                  ? 'border-brand-primary text-brand-dark'
                  : 'border-transparent text-gray-400 hover:text-gray-600'
              }`}
            >
              <Package size={18} /> Order History
            </button>
            <button
              onClick={() => setActiveTab('addresses')}
              className={`pb-3 font-bold text-sm tracking-wide border-b-2 transition-colors flex items-center gap-2 ${
                activeTab === 'addresses'
                  ? 'border-brand-primary text-brand-dark'
                  : 'border-transparent text-gray-400 hover:text-gray-600'
              }`}
            >
              <MapPin size={18} /> Delivery Addresses
            </button>
          </div>
        </motion.div>

        {/* Tab 1: Profile Details */}
        {activeTab === 'profile' && (
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8"
          >
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-xl font-bold text-brand-dark">Account Details</h2>
                <p className="text-gray-500 text-sm">Manage your personal information and contact details</p>
              </div>
              {!isEditing && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold px-4 py-2 rounded-xl text-sm transition"
                >
                  <Edit3 size={16} /> Edit Info
                </button>
              )}
            </div>

            {saveSuccess && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-700 rounded-xl flex items-center gap-3 text-sm">
                <Check size={18} /> Profile details updated successfully!
              </div>
            )}

            {isEditing ? (
              <form onSubmit={handleSave} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Full Name</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 focus:outline-none focus:border-brand-primary text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Email Address</label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 focus:outline-none focus:border-brand-primary text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Phone Number</label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 focus:outline-none focus:border-brand-primary text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">City</label>
                    <input
                      type="text"
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 focus:outline-none focus:border-brand-primary text-sm"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-bold text-gray-700 mb-2">Delivery Address</label>
                    <input
                      type="text"
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 focus:outline-none focus:border-brand-primary text-sm"
                    />
                  </div>
                </div>

                <div className="flex gap-3 pt-4 border-t">
                  <button
                    type="submit"
                    className="bg-brand-primary text-white font-bold px-6 py-2.5 rounded-xl hover:bg-yellow-600 transition text-sm shadow-sm"
                  >
                    Save Changes
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="bg-gray-100 text-gray-600 font-bold px-6 py-2.5 rounded-xl hover:bg-gray-200 transition text-sm"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100">
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1">Full Name</span>
                  <span className="font-semibold text-brand-dark text-base">{formData.name}</span>
                </div>
                <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100">
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1">Email Address</span>
                  <span className="font-semibold text-brand-dark text-base">{formData.email}</span>
                </div>
                <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100">
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1.5 mb-1">
                    <Phone size={14} /> Phone Number
                  </span>
                  <span className="font-semibold text-brand-dark text-base">{formData.phone}</span>
                </div>
                <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100">
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1">City & Postal Code</span>
                  <span className="font-semibold text-brand-dark text-base">{formData.city} - {formData.postalCode}</span>
                </div>
                <div className="md:col-span-2 p-4 rounded-2xl bg-gray-50 border border-gray-100">
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1">Primary Address</span>
                  <span className="font-semibold text-brand-dark text-base">{formData.address}</span>
                </div>
              </div>
            )}
          </motion.div>
        )}

        {/* Tab 2: Orders */}
        {activeTab === 'orders' && (
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-xl font-bold text-brand-dark">Order History ({customerOrders.length})</h2>
              <Link to="/shop" className="text-brand-primary text-sm font-bold flex items-center gap-1 hover:underline">
                <ShoppingBag size={16} /> Explore Catalog
              </Link>
            </div>

            {loadingOrders ? (
              <div className="bg-white rounded-3xl p-12 text-center text-gray-500 border border-gray-100 shadow-sm">
                <div className="animate-spin w-8 h-8 border-3 border-brand-primary border-t-transparent rounded-full mx-auto mb-3"></div>
                <p className="text-sm font-medium">Fetching your orders & tracking status...</p>
              </div>
            ) : customerOrders.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center border border-gray-100 shadow-sm space-y-3">
                <div className="w-16 h-16 bg-amber-50 rounded-full flex items-center justify-center mx-auto text-brand-primary">
                  <Package size={32} />
                </div>
                <h3 className="text-base font-bold text-gray-800">No Orders Placed Yet</h3>
                <p className="text-xs text-gray-500 max-w-sm mx-auto">
                  You have not placed any traditional delicacy orders with this account yet.
                </p>
                <div className="pt-2">
                  <Link to="/categories" className="bg-brand-dark hover:bg-brand-primary text-white text-xs font-bold px-6 py-2.5 rounded-full inline-block transition shadow-sm">
                    Start Shopping
                  </Link>
                </div>
              </div>
            ) : (
              customerOrders.map((order) => {
                const formattedDate = order.createdAt 
                  ? new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
                  : 'Recent';

                const statusColor = order.status === 'DELIVERED' 
                  ? 'bg-green-100 text-green-800 border-green-300'
                  : order.status === 'CANCELLED'
                  ? 'bg-red-100 text-red-800 border-red-300'
                  : order.status === 'SHIPPED' || order.status === 'OUT_FOR_DELIVERY'
                  ? 'bg-blue-100 text-blue-800 border-blue-300'
                  : 'bg-amber-100 text-amber-900 border-amber-300';

                return (
                  <div key={order.id} className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition">
                    <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 pb-4 border-b border-gray-100">
                      <div>
                        <div className="flex flex-wrap items-center gap-3">
                          <span className="font-mono font-bold text-brand-dark text-lg">{order.orderNumber}</span>
                          <span className={`text-xs font-extrabold px-3 py-1 rounded-full border ${statusColor}`}>
                            {order.status}
                          </span>
                          {order.trackingId && (
                            <span className="text-[11px] font-mono font-bold bg-amber-50 text-amber-900 border border-amber-200 px-2.5 py-0.5 rounded-lg">
                              Track ID: {order.trackingId}
                            </span>
                          )}
                        </div>
                        <span className="text-gray-400 text-xs flex items-center gap-1 mt-1.5">
                          <Clock size={14} /> Placed on {formattedDate}
                        </span>
                      </div>

                      <div className="text-left sm:text-right">
                        <span className="text-xs text-gray-400 block">Total Amount</span>
                        <span className="font-bold text-brand-dark text-lg">₹{order.totalAmount.toFixed(2)}</span>
                      </div>
                    </div>

                    {order.trackingNotes && (
                      <div className="my-3 p-3 bg-amber-50/80 rounded-xl border border-amber-200/80 text-xs text-amber-950 flex items-center gap-2">
                        <Truck size={16} className="text-brand-primary flex-shrink-0" />
                        <span><strong>Latest Tracking Note:</strong> {order.trackingNotes}</span>
                      </div>
                    )}

                    <div className="py-4 space-y-3">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="flex justify-between items-center text-sm">
                          <div className="flex items-center gap-2.5">
                            <span className="font-bold text-brand-primary bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-md text-xs">
                              {item.quantity}x
                            </span>
                            <span className="font-medium text-gray-800">{item.productName}</span>
                            {item.weight && (
                              <span className="text-xs text-gray-400">({item.weight})</span>
                            )}
                          </div>
                          <span className="font-semibold text-gray-700">₹{(item.price * item.quantity).toFixed(2)}</span>
                        </div>
                      ))}
                    </div>

                    <div className="pt-4 border-t border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                      <span className="text-xs text-gray-500">
                        {order.courierPartner ? `Courier: ${order.courierPartner}` : 'Fast Express Dispatch across India'}
                      </span>
                      <Link
                        to={`/track-order?q=${order.orderNumber}`}
                        className="bg-brand-dark hover:bg-brand-primary text-white font-bold text-xs px-4 py-2 rounded-xl transition flex items-center gap-1.5 shadow-sm"
                      >
                        <Truck size={14} /> Live Track Shipment <ExternalLink size={12} />
                      </Link>
                    </div>
                  </div>
                );
              })
            )}
          </motion.div>
        )}

        {/* Tab 3: Saved Addresses */}
        {activeTab === 'addresses' && (
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            <div className="bg-white rounded-3xl p-6 shadow-sm border-2 border-brand-primary relative">
              <span className="absolute top-6 right-6 bg-brand-primary text-white text-xs font-bold px-2.5 py-1 rounded-full">
                Primary
              </span>
              <div className="flex items-center gap-2 text-brand-primary font-bold text-sm mb-3">
                <MapPin size={18} /> Home Address
              </div>
              <h3 className="font-bold text-brand-dark text-lg mb-1">{formData.name}</h3>
              <p className="text-gray-600 text-sm leading-relaxed mb-4">
                {formData.address}<br />
                {formData.city}, Telangana - {formData.postalCode}<br />
                Phone: {formData.phone}
              </p>
              <button onClick={() => { setActiveTab('profile'); setIsEditing(true); }} className="text-brand-primary font-bold text-xs hover:underline">
                Edit Address
              </button>
            </div>

            <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center gap-2 text-gray-400 font-bold text-sm mb-3">
                <MapPin size={18} /> Office / Secondary
              </div>
              <h3 className="font-bold text-brand-dark text-lg mb-1">{formData.name}</h3>
              <p className="text-gray-600 text-sm leading-relaxed mb-4">
                Hitech City, Cyber Towers Phase 2<br />
                Hyderabad, Telangana - 500081<br />
                Phone: {formData.phone}
              </p>
              <span className="text-xs text-gray-400 italic">Saved alternate address</span>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};
