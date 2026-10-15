import { useState, useEffect } from 'react';
import { useCartStore } from '../store/cartStore';
import { useAuthStore } from '../store/authStore';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Trash2, 
  Plus, 
  Minus, 
  ShoppingBag, 
  Truck, 
  Info, 
  Scale, 
  CheckCircle2, 
  MapPin, 
  Edit3, 
  UserCheck, 
  Save, 
  ArrowRight
} from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import { calculateShipping } from '../utils/shipping';

export const Cart = () => {
  const { 
    items, 
    updateQuantity, 
    removeItem, 
    getTotalPrice, 
    getTotalWeightKg, 
    clearCart,
    deliveryAddress,
    setDeliveryAddress 
  } = useCartStore();
  
  const { user, isLoggedIn, updateUser } = useAuthStore();
  const navigate = useNavigate();

  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [saveToProfile, setSaveToProfile] = useState(false);
  const [addressSavedNotification, setAddressSavedNotification] = useState(false);

  // Sync profile address into cart when logged in if cart address is empty or not customized
  useEffect(() => {
    if (isLoggedIn && user) {
      if (user.address && !deliveryAddress.address) {
        setDeliveryAddress({
          address: user.address,
          city: user.city || 'Warangal',
          state: user.state || 'Telangana',
          postalCode: user.postalCode || ''
        });
      } else if (user.city && (!deliveryAddress.city || deliveryAddress.city === 'Warangal')) {
        setDeliveryAddress({
          city: user.city,
          state: user.state || 'Telangana'
        });
      }
    }
  }, [isLoggedIn, user]);

  const totalWeightKg = getTotalWeightKg();
  const subtotal = getTotalPrice();

  // Calculate dynamic shipping fee using current delivery address PIN code and total weight
  const shippingInfo = calculateShipping(
    deliveryAddress.postalCode || '506001',
    totalWeightKg,
    deliveryAddress.city
  );
  
  const grandTotal = Math.max(0, subtotal + shippingInfo.shippingFee);

  const handleAddressFieldChange = (field: string, value: string) => {
    setDeliveryAddress({ [field]: value });
  };

  const handleSaveAddress = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (saveToProfile && isLoggedIn && user) {
      updateUser({
        address: deliveryAddress.address,
        city: deliveryAddress.city,
        state: deliveryAddress.state,
        postalCode: deliveryAddress.postalCode
      });
    }
    setIsEditingAddress(false);
    setAddressSavedNotification(true);
    setTimeout(() => setAddressSavedNotification(false), 2500);
  };

  const handleCheckout = () => {
    if (!isLoggedIn) {
      alert("Please login to proceed with your purchase!");
      navigate('/login');
      return;
    }
    navigate('/checkout');
  };

  const handleWhatsAppOrder = () => {
    if (!isLoggedIn) {
      alert("Please login to place an order via WhatsApp!");
      navigate('/login');
      return;
    }
    const message = `Hello Sri Telangana Ruchulu! I would like to place an order from my cart.\n` +
      `Items: ${items.map(i => `${i.name} [${i.weight || '500g'} x ${i.quantity}]`).join(', ')}\n` +
      `Total Weight: ${totalWeightKg} KG\n` +
      `Delivery Address: ${deliveryAddress.address || 'Standard Address'}, ${deliveryAddress.city}, ${deliveryAddress.state} - ${deliveryAddress.postalCode}\n` +
      `Delivery Charge: ₹${shippingInfo.shippingFee} (${shippingInfo.zoneLabel})\n` +
      `Total Bill: ₹${grandTotal.toFixed(2)}`;

    window.open(`https://wa.me/919876543210?text=${encodeURIComponent(message)}`, '_blank');
  };

  const fallbackImage = "https://sritelanganaruchulu.com/wp-content/uploads/2026/01/Sri_Telangana_Ruchulu_Logo_-_2__White_bg_-1_2-removebg-preview-150x150.png";

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen pt-32 pb-16 bg-brand-light"
    >
      <Helmet>
        <title>Shopping Cart | Sri Telangana Ruchulu</title>
      </Helmet>

      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header with weight display */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-brand-dark flex items-center gap-3">
              <ShoppingBag className="text-brand-primary" /> Shopping Cart
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Select 500g to 3 KG per product. Delivery charges are calculated from your destination address.
            </p>
          </div>

          {items.length > 0 && (
            <div className="flex items-center gap-3 bg-white px-4 py-2.5 rounded-2xl border border-gray-200/80 shadow-sm self-start md:self-auto">
              <Scale size={20} className="text-brand-primary" />
              <div className="text-xs">
                <span className="text-gray-400 block font-medium">Total Order Weight</span>
                <span className="font-extrabold text-brand-dark text-sm sm:text-base">{totalWeightKg} KG</span>
              </div>
            </div>
          )}
        </div>

        {items.length === 0 ? (
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }} 
            animate={{ scale: 1, opacity: 1 }} 
            className="bg-white/95 backdrop-blur-md p-8 sm:p-12 rounded-3xl shadow-sm text-center border border-white/40 max-w-2xl mx-auto"
          >
            <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <ShoppingBag size={40} className="text-gray-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-700 mb-4">Your cart is empty</h2>
            <p className="text-gray-500 mb-8 max-w-md mx-auto">
              Explore our authentic traditional homemade pickles, sweets, and snacks (500g to 3 KG per item)!
            </p>
            <Link to="/categories" className="bg-brand-dark text-white font-bold py-3.5 sm:py-4 px-8 sm:px-10 rounded-full hover:bg-brand-primary transition shadow-lg hover:-translate-y-1 inline-block">
              Start Shopping
            </Link>
          </motion.div>
        ) : (
          <>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 sm:gap-10">
            {/* Left Column: Cart Items & Delivery Address Box */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* Delivery Address Integration in Cart */}
              <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-sm border border-gray-100/90 relative overflow-hidden">
                <div className="flex items-center justify-between pb-3 mb-4 border-b border-gray-100">
                  <div className="flex items-center gap-2">
                    <MapPin className="text-brand-primary" size={20} />
                    <h3 className="font-bold text-base text-brand-dark">
                      Shipping & Delivery Destination
                    </h3>
                  </div>
                  
                  {isLoggedIn && user?.address && !isEditingAddress && (
                    <button
                      onClick={() => setIsEditingAddress(true)}
                      className="text-xs text-brand-primary hover:text-yellow-700 font-bold flex items-center gap-1 transition"
                    >
                      <Edit3 size={14} /> Change Address
                    </button>
                  )}
                </div>

                {/* Profile Address Display Card (If logged in with profile address and not actively editing) */}
                {isLoggedIn && user?.address && !isEditingAddress ? (
                  <div className="bg-gradient-to-r from-amber-50/70 to-orange-50/40 border border-amber-200/60 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5">
                        <span className="bg-green-100 text-green-800 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                          <UserCheck size={12} /> Saved Profile Address
                        </span>
                        <span className="text-xs font-bold text-brand-dark">{user.name}</span>
                        {user.phone && <span className="text-xs text-gray-500">({user.phone})</span>}
                      </div>
                      <p className="text-xs sm:text-sm text-gray-700 font-medium">
                        {deliveryAddress.address || user.address}, <strong>{deliveryAddress.city || user.city}</strong>, {deliveryAddress.state || user.state || 'Telangana'} - {deliveryAddress.postalCode || user.postalCode || ''}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-xs text-brand-primary font-bold bg-white px-3 py-1.5 rounded-lg border border-amber-200 shadow-2xs whitespace-nowrap">
                        {shippingInfo.isFreeDelivery ? '🎉 FREE Delivery' : `Delivery: ₹${shippingInfo.shippingFee}`}
                      </span>
                    </div>
                  </div>
                ) : (
                  /* Interactive Address Input Form in Cart */
                  <form onSubmit={handleSaveAddress} className="space-y-4">
                    {/* PIN Code based Delivery Section */}
                    <div className="bg-amber-50/70 p-4 rounded-2xl border border-amber-200/80">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 mb-2">
                        <label className="block text-xs font-extrabold text-brand-dark uppercase tracking-wide">
                          Destination Postal PIN Code * (Determines Delivery Fee)
                        </label>
                        <span className="text-[11px] font-bold text-brand-primary bg-white px-2.5 py-0.5 rounded-full border border-amber-200 shadow-2xs self-start sm:self-auto">
                          {shippingInfo.isFreeDelivery ? '🎉 FREE Delivery' : `Delivery: ₹${shippingInfo.shippingFee}`}
                        </span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-center">
                        <div>
                          <input
                            type="text"
                            required
                            maxLength={6}
                            placeholder="e.g. 506001"
                            value={deliveryAddress.postalCode}
                            onChange={(e) => handleAddressFieldChange('postalCode', e.target.value.replace(/\D/g, ''))}
                            className="w-full bg-white border border-amber-300 rounded-xl px-3.5 py-2 text-sm font-bold text-brand-dark focus:outline-none focus:ring-2 focus:ring-brand-primary/50 shadow-inner"
                          />
                        </div>
                        <div className="sm:col-span-2 text-xs">
                          {deliveryAddress.postalCode?.startsWith('506') ? (
                            <span className="text-emerald-700 font-semibold flex items-center gap-1.5">
                              <CheckCircle2 size={15} /> Local Zone (PIN 506xxx): {totalWeightKg > 1 ? 'FREE Delivery (> 1 KG)' : '₹80 (≤ 1 KG)'}
                            </span>
                          ) : deliveryAddress.postalCode && deliveryAddress.postalCode.length >= 3 ? (
                            <span className="text-blue-700 font-semibold flex items-center gap-1.5">
                              <Truck size={15} /> Standard Express Delivery across India (₹350)
                            </span>
                          ) : (
                            <span className="text-gray-500">
                              Enter 6-digit PIN code to automatically calculate delivery charges
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div className="sm:col-span-2">
                        <label className="block text-[11px] font-bold text-gray-500 uppercase mb-1">
                          Delivery Street / Flat Address *
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="House/Flat No, Street, Landmark"
                          value={deliveryAddress.address}
                          onChange={(e) => handleAddressFieldChange('address', e.target.value)}
                          className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs sm:text-sm focus:outline-none focus:border-brand-primary"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-gray-500 uppercase mb-1">
                          City / District *
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="Enter City"
                          value={deliveryAddress.city}
                          onChange={(e) => handleAddressFieldChange('city', e.target.value)}
                          className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs sm:text-sm focus:outline-none focus:border-brand-primary"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-bold text-gray-500 uppercase mb-1">
                          State *
                        </label>
                        <select
                          value={deliveryAddress.state}
                          onChange={(e) => handleAddressFieldChange('state', e.target.value)}
                          className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs sm:text-sm focus:outline-none focus:border-brand-primary"
                        >
                          <option value="Telangana">Telangana</option>
                          <option value="Andhra Pradesh">Andhra Pradesh</option>
                          <option value="Other">Other State</option>
                        </select>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
                      {isLoggedIn && (
                        <label className="flex items-center gap-2 text-xs text-gray-600 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={saveToProfile}
                            onChange={(e) => setSaveToProfile(e.target.checked)}
                            className="rounded text-brand-primary focus:ring-brand-primary"
                          />
                          <span>Save this delivery address to my user profile</span>
                        </label>
                      )}

                      <div className="flex items-center gap-2">
                        {isLoggedIn && user?.address && (
                          <button
                            type="button"
                            onClick={() => setIsEditingAddress(false)}
                            className="px-4 py-2 text-xs font-bold text-gray-500 hover:text-gray-800 transition"
                          >
                            Cancel
                          </button>
                        )}
                        <button
                          type="submit"
                          className="bg-brand-dark text-white px-5 py-2 rounded-xl text-xs font-bold hover:bg-brand-primary transition flex items-center gap-1.5 shadow-sm"
                        >
                          <Save size={14} /> Confirm Address & Update Bill
                        </button>
                      </div>
                    </div>
                  </form>
                )}

                {addressSavedNotification && (
                  <div className="mt-3 p-2.5 bg-green-50 border border-green-200 text-green-700 text-xs rounded-xl flex items-center gap-2 font-medium">
                    <CheckCircle2 size={16} /> Delivery address confirmed and bill updated!
                  </div>
                )}
              </div>

              {/* Cart Items List */}
              <div className="space-y-4">
                <AnimatePresence>
                  {items.map(item => {
                    const itemKey = item.cartItemId || `${item.id}-${item.weight || '500g'}`;
                    const itemWeightKg = item.weightKg || 0.5;
                    const itemTotalWeight = Number((itemWeightKg * item.quantity).toFixed(2));
                    const canIncrease = itemTotalWeight + itemWeightKg <= 3.001;

                    return (
                      <motion.div 
                        key={itemKey}
                        layout
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 50, scale: 0.9 }}
                        transition={{ type: "spring", stiffness: 300, damping: 25 }}
                        className="bg-white/95 backdrop-blur-md p-4 sm:p-5 rounded-2xl shadow-sm border border-gray-100 flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 relative"
                      >
                        <img 
                          src={item.imageUrl || fallbackImage} 
                          alt={item.name} 
                          onError={(e) => { (e.target as HTMLImageElement).src = '/images/premium_snacks.jpg'; }}
                          className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-xl shadow-sm"
                        />
                        
                        <div className="flex-1 w-full pr-8 sm:pr-0">
                          <Link to={`/product/${item.slug}`} className="font-bold text-base sm:text-lg hover:text-brand-primary transition line-clamp-1">
                            {item.name}
                          </Link>
                          
                          <div className="flex flex-wrap items-center gap-2 mt-1.5">
                            <span className="bg-amber-100 text-amber-900 text-[11px] font-bold px-2.5 py-0.5 rounded-md">
                              Pack: {item.weight || '500g'}
                            </span>
                            <span className="text-xs text-gray-500 font-medium">
                              ₹{item.price} per pack
                            </span>
                            <span className="text-xs text-brand-primary font-semibold">
                              Total Item Weight: {itemTotalWeight} KG
                            </span>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between w-full sm:w-auto mt-2 sm:mt-0 border-t sm:border-0 border-gray-100 pt-3 sm:pt-0">
                          <div className="flex items-center gap-2 bg-gray-50 rounded-full p-1 border border-gray-200">
                            <button 
                              onClick={() => updateQuantity(itemKey, item.quantity - 1)}
                              className="p-1.5 sm:p-2 rounded-full bg-white hover:bg-gray-100 shadow-sm transition"
                              title="Decrease quantity"
                            >
                              <Minus size={14} className="sm:w-4 sm:h-4" />
                            </button>
                            <span className="w-6 sm:w-8 text-center font-bold text-sm sm:text-base">{item.quantity}</span>
                            <button 
                              onClick={() => {
                                if (canIncrease) {
                                  const res = updateQuantity(itemKey, item.quantity + 1);
                                  if (!res.success) alert(res.message);
                                } else {
                                  alert(`Maximum order limit is 3 KG per product. Current weight is ${itemTotalWeight} KG.`);
                                }
                              }}
                              className={`p-1.5 sm:p-2 rounded-full bg-white shadow-sm transition ${
                                canIncrease ? 'hover:bg-gray-100 text-gray-800' : 'opacity-40 cursor-not-allowed text-gray-400'
                              }`}
                              title={canIncrease ? "Add pack" : "Maximum 3 KG limit per item reached"}
                            >
                              <Plus size={14} className="sm:w-4 sm:h-4" />
                            </button>
                          </div>

                          <div className="font-bold text-brand-dark text-lg sm:text-xl sm:w-28 sm:text-right">
                            ₹{(item.price * item.quantity).toFixed(2)}
                          </div>
                        </div>

                        <button 
                          onClick={() => removeItem(itemKey)}
                          className="absolute top-4 right-4 sm:relative sm:top-0 sm:right-0 p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition"
                          title="Remove item"
                        >
                          <Trash2 size={20} />
                        </button>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>
              
              <div className="flex flex-col sm:flex-row justify-between items-center bg-white p-4 sm:p-5 rounded-2xl shadow-sm border border-gray-100 gap-4 sm:gap-0">
                <button 
                  onClick={clearCart}
                  className="text-gray-500 font-semibold hover:text-red-500 hover:bg-red-50 px-4 py-2 rounded-xl transition w-full sm:w-auto text-sm"
                >
                  Clear Cart
                </button>
                <Link to="/categories" className="text-brand-dark font-bold hover:bg-brand-primary/10 px-6 py-2.5 rounded-xl transition w-full sm:w-auto text-center border border-brand-dark/20 text-sm">
                  Continue Shopping
                </Link>
              </div>

              {/* Delivery Guidelines Card */}
              <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm space-y-3">
                <h3 className="font-bold text-sm text-brand-dark flex items-center gap-2">
                  <Truck className="text-brand-primary" size={18} />
                  Delivery & Shipping Rules (Calculated by PIN Code)
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-gray-600">
                  <div className="bg-amber-50/70 p-3 rounded-xl border border-amber-200/60">
                    <p className="font-bold text-brand-dark mb-1">📍 Local Zone (PINs starting with 506):</p>
                    <p className="text-green-700 font-semibold">• <strong>FREE Delivery</strong> on orders above 1 KG.</p>
                    <p className="text-gray-600">• <strong>₹80 delivery charge</strong> on orders 1 KG & below.</p>
                  </div>
                  <div className="bg-blue-50/70 p-3 rounded-xl border border-blue-200/60">
                    <p className="font-bold text-brand-dark mb-1">📍 All Other PIN Codes (Across India):</p>
                    <p className="text-gray-700">• Flat <strong>₹350 delivery charge</strong> express courier.</p>
                    <p className="text-gray-500">• Fast delivery across all districts & states.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Order Bill Breakdown & Checkout */}
            <motion.div 
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white p-6 sm:p-7 rounded-3xl shadow-xl border border-brand-primary/20 h-fit sticky top-24 space-y-5"
            >
              <h2 className="text-2xl font-bold border-b border-gray-100 pb-3 flex items-center justify-between">
                <span>Cart Bill</span>
                <span className="text-xs font-semibold text-brand-primary bg-amber-50 px-2.5 py-1 rounded-full">
                  {totalWeightKg} KG Order
                </span>
              </h2>

              {/* Delivery Address Summary in Bill */}
              <div className="bg-gray-50 p-3.5 rounded-2xl border border-gray-200 text-xs space-y-1">
                <div className="flex items-center justify-between text-gray-500 font-medium">
                  <span className="flex items-center gap-1">
                    <MapPin size={14} className="text-brand-primary" /> Delivery Destination:
                  </span>
                  <span className="font-bold text-brand-dark">
                    PIN: {deliveryAddress.postalCode || '506001'} {deliveryAddress.city ? `(${deliveryAddress.city})` : ''}
                  </span>
                </div>
                {deliveryAddress.address ? (
                  <p className="text-gray-600 text-[11px] truncate">
                    {deliveryAddress.address}, {deliveryAddress.city} - {deliveryAddress.postalCode}
                  </p>
                ) : (
                  <p className="text-amber-700 text-[11px] font-medium">
                    * Enter delivery PIN code to confirm delivery fee
                  </p>
                )}
              </div>

              {/* Bill Details */}
              <div className="space-y-3 text-sm">
                <div className="flex justify-between text-gray-600">
                  <span>Items Subtotal</span>
                  <span className="font-semibold text-gray-800">₹{subtotal.toFixed(2)}</span>
                </div>
                
                <div className="flex justify-between text-gray-600">
                  <span>Total Order Weight</span>
                  <span className="font-bold text-brand-dark">{totalWeightKg} KG</span>
                </div>

                <div className="flex justify-between items-center text-gray-600">
                  <div>
                    <span>Delivery Charges</span>
                    <span className="block text-[10px] text-gray-400">
                      {shippingInfo.zoneLabel}
                    </span>
                  </div>
                  <div className="text-right">
                    {shippingInfo.isFreeDelivery ? (
                      <span className="text-green-600 font-bold bg-green-50 px-2.5 py-0.5 rounded text-xs">
                        FREE (₹0)
                      </span>
                    ) : (
                      <span className="font-bold text-gray-800">₹{shippingInfo.shippingFee}</span>
                    )}
                  </div>
                </div>

              </div>

              {/* Dynamic Delivery Notification Badge */}
              <div className={`p-3 rounded-2xl text-xs flex items-center gap-2 ${
                shippingInfo.isFreeDelivery 
                  ? 'bg-green-50 text-green-700 border border-green-200'
                  : shippingInfo.zone === 'TRI_CITY'
                    ? 'bg-amber-50 text-amber-800 border border-amber-200'
                    : 'bg-blue-50 text-blue-700 border border-blue-200'
              }`}>
                {shippingInfo.isFreeDelivery ? (
                  <>
                    <CheckCircle2 size={16} className="text-green-600 flex-shrink-0" />
                    <span className="font-medium">{shippingInfo.message}</span>
                  </>
                ) : (
                  <>
                    <Info size={16} className="text-brand-primary flex-shrink-0" />
                    <span>{shippingInfo.message}</span>
                  </>
                )}
              </div>
              
              {/* Grand Total */}
              <div className="border-t border-gray-200 pt-4">
                <div className="flex justify-between items-baseline font-bold text-lg">
                  <span className="text-gray-700">Total Bill</span>
                  <span className="text-brand-dark text-2xl font-heading">
                    ₹{grandTotal.toFixed(2)}
                  </span>
                </div>
                <p className="text-[11px] text-gray-400 text-right mt-0.5">
                  (Inclusive of all taxes & delivery fees)
                </p>
              </div>

              {/* Checkout & WhatsApp Buttons */}
              <button 
                onClick={handleCheckout}
                className="w-full bg-brand-primary text-white font-bold py-4 rounded-2xl hover:bg-yellow-600 transition shadow-[0_10px_20px_rgba(209,161,85,0.3)] hover:shadow-[0_15px_30px_rgba(209,161,85,0.5)] transform hover:-translate-y-0.5 flex items-center justify-center gap-2 text-base"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight size={18} />
              </button>
              
              <button 
                onClick={handleWhatsAppOrder}
                className="flex items-center justify-center gap-2 w-full text-center bg-[#25D366] text-white font-bold py-3.5 rounded-2xl hover:bg-[#20bd5a] transition shadow-md hover:shadow-lg transform hover:-translate-y-0.5 text-sm"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M13.601 2.326A7.85 7.85 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.9 7.9 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.9 7.9 0 0 0 13.6 2.326zM7.994 14.521a6.6 6.6 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.56 6.56 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592m3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.73.73 0 0 0-.529.247c-.182.198-.691.677-.691 1.654s.71 1.916.81 2.049c.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232"/>
                </svg>
                Order via WhatsApp
              </button>
            </motion.div>
          </div>
          </>
        )}
      </div>
    </motion.div>
  );
};

