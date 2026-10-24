import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { getProductBySlug } from '../api';
import { useCartStore } from '../store/cartStore';
import { SEO } from '../components/SEO';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { generateProductSchema } from '../utils/jsonLd';
import { Minus, Plus, ShoppingCart, ArrowLeft, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const ProductDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const [selectedWeight, setSelectedWeight] = useState('500g');
  const [quantity, setQuantity] = useState(1);
  const addItem = useCartStore(state => state.addItem);

  const { data: product, isLoading, isError } = useQuery({
    queryKey: ['product', slug],
    queryFn: () => getProductBySlug(slug!),
    enabled: !!slug,
  });

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center text-gray-500">Loading product...</div>;
  }

  if (isError || !product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-brand-light">
        <h2 className="text-2xl font-bold mb-4">Product Not Found</h2>
        <Link to="/shop" className="text-brand-primary font-bold hover:underline">Return to Shop</Link>
      </div>
    );
  }

  const fallbackImage = "/images/premium_snacks.jpg";
  const imageToUse = product.imageUrl ? product.imageUrl : fallbackImage;

  const [isAdded, setIsAdded] = useState(false);
  const [feedbackError, setFeedbackError] = useState<string | null>(null);

  const weightOptions = [
    { label: '500g', value: '500g', weightKg: 0.5 },
    { label: '1 KG', value: '1kg', weightKg: 1.0 },
    { label: '1.5 KG', value: '1.5kg', weightKg: 1.5 },
    { label: '2 KG', value: '2kg', weightKg: 2.0 },
    { label: '2.5 KG', value: '2.5kg', weightKg: 2.5 },
    { label: '3 KG', value: '3kg', weightKg: 3.0 },
  ];

  const currentWeightObj = weightOptions.find(w => w.value === selectedWeight) || weightOptions[0];
  const unitPrice = Math.round(product.price * currentWeightObj.weightKg);
  const totalPrice = unitPrice * quantity;
  const currentTotalItemWeight = currentWeightObj.weightKg * quantity;

  const maxAllowedQuantity = Math.max(1, Math.floor(3.0 / currentWeightObj.weightKg));

  const handleWeightChange = (val: string) => {
    setSelectedWeight(val);
    const newWeightObj = weightOptions.find(w => w.value === val) || weightOptions[0];
    const newMaxQty = Math.max(1, Math.floor(3.0 / newWeightObj.weightKg));
    if (quantity > newMaxQty) {
      setQuantity(newMaxQty);
    }
  };

  const handleAddToCart = () => {
    setFeedbackError(null);
    const res = addItem(product, selectedWeight, quantity);
    if (!res.success) {
      setFeedbackError(res.message || 'Maximum 3 KG limit exceeded per item.');
      return;
    }
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

    const primaryCategory = product.categories?.[0];
    const breadcrumbItems = [
      { name: 'Categories', url: '/categories' },
      ...(primaryCategory ? [{ name: primaryCategory.name, url: `/category/${primaryCategory.id}` }] : []),
      { name: product.name, url: `/product/${product.slug}` }
    ];

    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-brand-light min-h-screen py-10 sm:py-12"
      >
        <SEO
          title={product.name}
          description={product.description || product.shortDescription || `Buy authentic handcrafted ${product.name} online from Sri Telangana Ruchulu.`}
          image={product.imageUrl}
          ogType="product"
          canonical={`/product/${product.slug}`}
          jsonLd={generateProductSchema(product)}
        />

        <div className="container mx-auto px-4 max-w-6xl">
          <Breadcrumbs items={breadcrumbItems} className="mb-4" />

          <Link to="/categories" className="inline-flex items-center text-gray-500 hover:text-brand-primary font-semibold transition mb-6 group text-sm">
            <ArrowLeft size={16} className="mr-2 transform group-hover:-translate-x-1 transition" /> Back to Shop
          </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Image */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="bg-white rounded-2xl p-8 flex items-center justify-center h-[350px] md:h-[500px] shadow-sm border border-gray-100 relative"
          >
            <motion.img 
              whileHover={{ scale: 1.05 }}
              src={imageToUse} 
              alt={product.name} 
              onError={(e) => { (e.target as HTMLImageElement).src = '/images/premium_snacks.jpg'; }}
              className={`max-w-full max-h-full rounded-xl shadow-md ${!product.imageUrl ? 'object-contain' : 'object-cover w-full h-full'}`} 
            />
            <div className="absolute top-4 right-4 bg-brand-dark/80 backdrop-blur-md text-amber-300 text-xs font-bold px-3 py-1.5 rounded-full shadow-md">
              Order: 500g - 3 KG
            </div>
          </motion.div>

          {/* Details */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="flex flex-col justify-center"
          >
            <div className="mb-2">
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                {product.categories?.map(c => c.name).join(', ')}
              </span>
            </div>
            
            <h1 className="text-2xl md:text-3xl font-heading font-bold text-brand-dark mb-2">{product.name}</h1>
            
            {/* Price Display */}
            <div className="flex items-baseline gap-3 mb-4">
              <span className="text-3xl font-bold text-brand-primary">₹{totalPrice}</span>
              <span className="text-sm text-gray-500 font-medium">
                ({currentWeightObj.label} @ ₹{product.price}/KG)
              </span>
              {product.regularPrice > product.price && (
                <span className="text-base text-gray-400 line-through">
                  ₹{Math.round(product.regularPrice * currentWeightObj.weightKg * quantity)}
                </span>
              )}
            </div>

            <div className="prose prose-sm text-gray-600 mb-6 max-w-none">
              <p>{product.shortDescription || product.description || 'Authentic traditional recipe crafted with care and premium ingredients.'}</p>
            </div>

            {/* Weight Selection (500g to 3kg) */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Select Quantity / Weight (Min 500g - Max 3 KG)
                </label>
                <span className="text-xs text-brand-primary font-bold">
                  Weight: {currentTotalItemWeight} KG
                </span>
              </div>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                {weightOptions.map((opt) => {
                  const isSelected = selectedWeight === opt.value;
                  const optPrice = Math.round(product.price * opt.weightKg);
                  return (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => handleWeightChange(opt.value)}
                      className={`py-2 px-1 text-center rounded-xl border transition-all ${
                        isSelected
                          ? 'border-brand-primary bg-amber-50/80 text-brand-dark font-bold shadow-sm'
                          : 'border-gray-200 bg-white text-gray-700 hover:border-brand-primary/40 font-medium'
                      }`}
                    >
                      <div className="text-xs sm:text-sm font-bold">{opt.label}</div>
                      <div className="text-[10px] text-gray-500 mt-0.5">₹{optPrice}</div>
                    </button>
                  );
                })}
              </div>
              <p className="text-[11px] text-gray-500 mt-2">
                * Available in packs from 500g up to 3 KG per item.
              </p>
            </div>

            <div className="mb-6 flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${product.isInStock ? 'bg-green-500' : 'bg-red-500'}`}></div>
              <span className={`font-semibold text-sm ${product.isInStock ? 'text-green-600' : 'text-red-600'}`}>
                {product.isInStock ? 'In Stock and ready to pack fresh' : 'Out of Stock'}
              </span>
            </div>

            {feedbackError && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs font-semibold">
                ⚠️ {feedbackError}
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-4 mb-6 border-t border-b border-gray-200 py-6">
              <div className="flex items-center border-2 border-gray-200 rounded-xl overflow-hidden bg-white">
                <button 
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-4 py-3 hover:bg-gray-50 transition text-gray-600"
                  disabled={!product.isInStock || quantity <= 1}
                >
                  <Minus size={18} />
                </button>
                <div className="w-12 text-center font-bold text-lg">{quantity}</div>
                <button 
                  onClick={() => {
                    if (quantity < maxAllowedQuantity) {
                      setQuantity(quantity + 1);
                    } else {
                      alert(`Cannot exceed 3 KG for this product. Maximum is ${maxAllowedQuantity} pack(s) of ${currentWeightObj.label}.`);
                    }
                  }}
                  className="px-4 py-3 hover:bg-gray-50 transition text-gray-600"
                  disabled={!product.isInStock || quantity >= maxAllowedQuantity}
                  title={quantity >= maxAllowedQuantity ? "Max 3 KG limit per item" : "Add pack"}
                >
                  <Plus size={18} />
                </button>
              </div>

              <motion.button 
                whileHover={{ scale: product.isInStock ? 1.02 : 1 }}
                whileTap={{ scale: product.isInStock ? 0.98 : 1 }}
                onClick={handleAddToCart}
                disabled={!product.isInStock}
                className={`flex-1 flex items-center justify-center gap-2 font-bold py-3.5 px-6 rounded-xl transition ${
                  product.isInStock 
                    ? isAdded 
                      ? 'bg-green-500 text-white shadow-[0_10px_20px_rgba(34,197,94,0.3)]'
                      : 'bg-brand-primary text-white hover:bg-yellow-600 shadow-[0_10px_20px_rgba(209,161,85,0.3)]' 
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
              >
                <AnimatePresence mode="wait">
                  {isAdded ? (
                    <motion.div key="added" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} className="flex items-center gap-2">
                      <CheckCircle size={20} /> Added {currentTotalItemWeight} KG to Cart
                    </motion.div>
                  ) : (
                    <motion.div key="add" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} className="flex items-center gap-2">
                      <ShoppingCart size={20} /> {product.isInStock ? `Add to Cart (₹${totalPrice})` : 'Out of Stock'}
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.button>
            </div>

            {/* Delivery Terms Callout */}
            <div className="bg-amber-50/70 border border-amber-200/70 rounded-xl p-3 mb-6 text-xs text-brand-dark/90 space-y-1">
              <div className="font-bold flex items-center gap-1.5 text-brand-dark">
                <span>🚚</span> Delivery & Shipping Policy:
              </div>
              <p>• <strong>Kazipet, Hanamkonda & Warangal:</strong> FREE Delivery on orders above 1 KG (₹80 for 1 KG & below).</p>
              <p>• <strong>Hyderabad & All Telangana / Andhra Pradesh:</strong> Flat ₹350 delivery charge.</p>
            </div>

            {/* Guarantees */}
            <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <span className="text-brand-primary">✓</span> Authentic Taste
              </div>
              <div className="flex items-center gap-2">
                <span className="text-brand-primary">✓</span> Premium Quality
              </div>
              <div className="flex items-center gap-2">
                <span className="text-brand-primary">✓</span> Secure Payment
              </div>
              <div className="flex items-center gap-2">
                <span className="text-brand-primary">✓</span> Worldwide Delivery
              </div>
            </div>

          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};
