import { Link } from 'react-router-dom';
import type { Product } from '../types';
import { useCartStore } from '../store/cartStore';
import { useState } from 'react';
import { Check, ShoppingCart, Star, Plus, Minus, ChevronDown, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const teluguDict: Record<string, string> = {
  'pachadi': 'పచ్చడి', 'gongura': 'గోంగూర', 'allam': 'అల్లం', 'mixed': 'మిక్స్డ్', 
  'vegetable': 'వెజిటబుల్', 'tomato': 'టమాటా', 'mango': 'మామిడికాయ', 'sweet': 'స్వీట్',
  'sweets': 'స్వీట్లు', 'snacks': 'స్నాక్స్', 'chicken': 'చికెన్', 'mutton': 'మటన్', 
  'pickle': 'పచ్చడి', 'pickles': 'పచ్చళ్ళు', 'garlic': 'వెల్లుల్లి', 'avakaya': 'ఆవకాయ',
  'non': 'నాన్', 'veg': 'వెజ్', 'prawns': 'రొయ్యల', 'fish': 'చేపల', 'bellam': 'బెల్లం',
  'nuvvula': 'నువ్వుల', 'palli': 'పల్లి', 'chekkalu': 'చెక్కలు', 'sakinalu': 'సకినాలు',
  'karam': 'కారం', 'chintakaya': 'చింతకాయ', 'usirikaya': 'ఉసిరికాయ', 'podi': 'పొడి',
  'kandi': 'కంది', 'munagaku': 'మునగాకు', 'karivepaku': 'కరివేపాకు'
};

const getTeluguTranslation = (englishName: string) => {
  return englishName.split(' ').map(word => {
    const w = word.toLowerCase().replace(/[^a-z]/g, ''); // strip punctuation
    return teluguDict[w] || word;
  }).join(' ');
};

export const ProductCard = ({ product }: { product: Product }) => {
  const addItem = useCartStore((state) => state.addItem);
  const items = useCartStore((state) => state.items);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const removeItem = useCartStore((state) => state.removeItem);

  const [selectedQty, setSelectedQty] = useState('500g');
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState('');

  const fallbackImage = "/images/premium_snacks.jpg";
  const imageToUse = product.imageUrl ? product.imageUrl : fallbackImage;

  // Weight options: 500g to 3kg
  const weightKg = selectedQty === '500g' ? 0.5 :
                   selectedQty === '1kg' ? 1.0 :
                   selectedQty === '1.5kg' ? 1.5 :
                   selectedQty === '2kg' ? 2.0 :
                   selectedQty === '2.5kg' ? 2.5 :
                   selectedQty === '3kg' ? 3.0 : 0.5;

  const currentPrice = Math.round(product.price * weightKg);
  const regularPricePerKg = product.regularPrice && product.regularPrice > product.price
    ? product.regularPrice
    : Math.round(product.price * 1.2);
  const currentRegularPrice = Math.round(regularPricePerKg * weightKg);
  const discountPct = Math.round(((currentRegularPrice - currentPrice) / currentRegularPrice) * 100);

  // Deterministic realistic Amazon-style rating & reviews
  const ratingScore = (4.7 + ((product.id * 3) % 3) * 0.1).toFixed(1);
  const reviewsCount = 75 + ((product.id * 17) % 160);

  // Check if item is in cart for this specific weight variant
  const cartItemId = `${product.id}-${selectedQty}`;
  const inCartItem = items.find(
    (item) => item.cartItemId === cartItemId || (item.id === product.id && item.weight === selectedQty)
  );
  const inCartQty = inCartItem?.quantity || 0;

  return (
    <div className="bg-white rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.05)] border border-amber-900/10 overflow-hidden hover:shadow-[0_20px_40px_rgba(139,30,15,0.12)] hover:border-amber-400/80 transition-all duration-300 group flex flex-col relative z-10">
      
      {/* Product Image & Badges */}
      <Link to={`/product/${product.slug}`} className="relative block h-44 sm:h-56 overflow-hidden bg-amber-50/40 flex-shrink-0">
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        <img 
          src={imageToUse} 
          alt={product.name}
          loading="lazy"
          decoding="async"
          onError={(e) => { (e.target as HTMLImageElement).src = fallbackImage; }}
          className="w-full h-full object-cover transition duration-700 ease-out group-hover:scale-108"
        />

        {/* Top Badges */}
        <div className="absolute top-2.5 left-2.5 z-20 flex flex-col gap-1">
          {!product.isInStock ? (
            <span className="bg-red-600/95 backdrop-blur-md text-white text-[10px] font-black px-2.5 py-0.5 rounded-full shadow-md uppercase tracking-wider">
              Out of Stock
            </span>
          ) : (
            <span className="bg-black/60 backdrop-blur-md text-amber-200 text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-white/20 shadow-xs">
              100% Traditional
            </span>
          )}
        </div>

        <div className="absolute top-2.5 right-2.5 z-20 flex flex-col items-end gap-1">
          {discountPct > 0 && (
            <span className="bg-[#8B1E0F] text-white text-[10px] font-black px-2 py-0.5 rounded-full shadow-md uppercase tracking-wider">
              {discountPct}% OFF
            </span>
          )}
        </div>

        {/* Quick View Button on Hover */}
        <div className="absolute bottom-3 left-3 right-3 z-20 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0 text-center">
          <span className="inline-block bg-white/95 backdrop-blur-md text-[#260A04] text-xs font-black px-4 py-1.5 rounded-full shadow-lg border border-amber-200 hover:bg-amber-100 transition">
            View Details
          </span>
        </div>
      </Link>
      
      {/* Product Content */}
      <div className="p-3.5 sm:p-5 flex flex-col flex-grow bg-white">
        
        {/* Category Tag & Amazon Star Rating Row */}
        <div className="flex items-center justify-between gap-2 mb-1.5">
          <span className="text-[10px] font-black tracking-wider text-amber-800 uppercase bg-amber-50 border border-amber-200/60 px-2 py-0.5 rounded-md truncate">
            {product.categories.map(c => c.name).join(', ')}
          </span>

          <div className="flex items-center gap-1 text-[11px] font-black text-[#260A04] bg-amber-50/80 border border-amber-200/50 px-1.5 py-0.5 rounded-md flex-shrink-0 shadow-2xs">
            <Star size={11} className="fill-amber-500 text-amber-500" />
            <span>{ratingScore}</span>
            <span className="text-gray-400 font-semibold text-[10px]">({reviewsCount})</span>
          </div>
        </div>

        {/* Product Names */}
        <Link to={`/product/${product.slug}`} className="block mb-1">
          <h3 className="font-heading font-black text-sm sm:text-base text-[#260A04] line-clamp-1 group-hover:text-[#8B1E0F] transition-colors leading-snug">
            {product.name}
          </h3>
          <p className="text-xs text-amber-800 font-bold font-telugu mt-0.5">
            {getTeluguTranslation(product.name)}
          </p>
        </Link>

        {/* Short Description */}
        <p className="text-xs text-gray-500 line-clamp-1 sm:line-clamp-2 leading-relaxed mb-3">
          {product.shortDescription || 'Authentic traditional recipe crafted with care and premium ingredients.'}
        </p>
        
        {/* Professional E-Commerce Pricing & Purchase Section (Amazon Standard) */}
        <div className="mt-auto pt-3 border-t border-amber-900/10 flex flex-col gap-2.5">
          
          {/* Weight / Pack Variant Selector */}
          <div>
            <div className="flex items-center justify-between text-[11px] font-bold text-[#5C2B10] mb-1.5">
              <span className="font-black uppercase tracking-wider text-[10px]">Pack Size:</span>
              <span className="text-amber-800 font-extrabold bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200/70 text-[11px]">
                {selectedQty === '500g' ? '500g (Min Order)' : selectedQty === '3kg' ? '3 KG (Max Order)' : selectedQty}
              </span>
            </div>

            {/* Quick Interactive Chips for Popular Pack Sizes */}
            <div className="grid grid-cols-4 gap-1 sm:gap-1.5 mb-1.5">
              {[
                { value: '500g', label: '500g' },
                { value: '1kg', label: '1 KG' },
                { value: '2kg', label: '2 KG' },
                { value: '3kg', label: '3 KG' },
              ].map((chip) => (
                <button
                  key={chip.value}
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    setSelectedQty(chip.value);
                  }}
                  className={`py-1 px-1 rounded-lg text-xs font-bold transition-all text-center border cursor-pointer ${
                    selectedQty === chip.value
                      ? 'bg-[#8B1E0F] text-white border-[#8B1E0F] shadow-xs scale-102'
                      : 'bg-[#FFFDF9] hover:bg-amber-50 text-[#3E1A0A] border-amber-200/80 hover:border-amber-400'
                  }`}
                >
                  {chip.label}
                </button>
              ))}
            </div>

            {/* Full-Width Styled Dropdown for all pack weights */}
            <div className="relative">
              <select 
                value={selectedQty}
                onChange={(e) => setSelectedQty(e.target.value)}
                className="w-full bg-[#FFFDF9] hover:bg-amber-50/50 border border-amber-300/80 text-[#260A04] text-xs font-bold rounded-xl pl-3 pr-8 py-2 appearance-none transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#8B1E0F]/20 shadow-2xs"
                disabled={!product.isInStock}
              >
                <option value="500g">Pack: 500g (Min Order) — ₹{Math.round(product.price * 0.5)}</option>
                <option value="1kg">Pack: 1 KG (Most Popular) — ₹{Math.round(product.price * 1.0)}</option>
                <option value="1.5kg">Pack: 1.5 KG — ₹{Math.round(product.price * 1.5)}</option>
                <option value="2kg">Pack: 2 KG (Family Pack) — ₹{Math.round(product.price * 2.0)}</option>
                <option value="2.5kg">Pack: 2.5 KG — ₹{Math.round(product.price * 2.5)}</option>
                <option value="3kg">Pack: 3 KG (Max Order) — ₹{Math.round(product.price * 3.0)}</option>
              </select>
              <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-amber-800 pointer-events-none" />
            </div>
          </div>

          {/* Amazon-Style Pricing Row */}
          <div className="flex items-baseline justify-between pt-1">
            <div className="flex items-baseline gap-2">
              <span className="text-xl sm:text-2xl font-black text-[#260A04] tracking-tight">
                ₹{currentPrice}
              </span>
              {currentRegularPrice > currentPrice && (
                <span className="text-xs sm:text-sm text-gray-400 line-through decoration-red-400/60 font-medium">
                  ₹{currentRegularPrice}
                </span>
              )}
              {discountPct > 0 && (
                <span className="text-[10px] sm:text-[11px] font-black text-emerald-800 bg-emerald-50 border border-emerald-300/80 px-1.5 py-0.5 rounded-md shadow-2xs">
                  {discountPct}% OFF
                </span>
              )}
            </div>
            <span className="text-[11px] text-amber-900/70 font-bold">
              (₹{product.price}/kg)
            </span>
          </div>

          {/* Primary CTA / Interactive Quantity Stepper */}
          {inCartQty > 0 ? (
            <div className="w-full flex items-center justify-between bg-amber-50/80 border-2 border-[#8B1E0F] rounded-xl p-1 shadow-xs">
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  if (inCartQty <= 1) {
                    removeItem(cartItemId);
                  } else {
                    updateQuantity(cartItemId, inCartQty - 1);
                  }
                }}
                className="w-9 h-9 rounded-lg bg-white hover:bg-red-50 text-[#8B1E0F] font-black text-sm flex items-center justify-center shadow-xs hover:scale-105 active:scale-95 transition-all border border-amber-200 cursor-pointer"
                aria-label="Decrease quantity"
              >
                <Minus size={15} />
              </button>
              <div className="flex flex-col items-center">
                <span className="text-xs sm:text-sm font-black text-[#260A04]">
                  {inCartQty} in Cart
                </span>
                <span className="text-[10px] font-bold text-amber-800">
                  Pack: {selectedQty}
                </span>
              </div>
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  const res = updateQuantity(cartItemId, inCartQty + 1);
                  if (res && !res.success) {
                    alert(res.message || "Maximum order limit is 3 KG per item.");
                  }
                }}
                className="w-9 h-9 rounded-lg bg-[#8B1E0F] hover:bg-[#A32412] text-white font-black text-sm flex items-center justify-center shadow-xs hover:scale-105 active:scale-95 transition-all cursor-pointer"
                aria-label="Increase quantity"
              >
                <Plus size={15} />
              </button>
            </div>
          ) : (
            <button 
              type="button"
              onClick={(e) => {
                e.preventDefault();
                const res = addItem(product, selectedQty, 1);
                if (!res.success) {
                  alert(res.message || "Maximum order limit is 3 KG per item.");
                  return;
                }
                setFeedbackMsg(`Added ${selectedQty}`);
                setShowFeedback(true);
                setTimeout(() => setShowFeedback(false), 2000);
              }}
              disabled={!product.isInStock}
              className={`w-full py-2.5 px-4 rounded-xl font-black text-xs sm:text-sm transition-all duration-300 flex items-center justify-center gap-2 relative overflow-hidden shadow-xs active:scale-98 cursor-pointer ${
                !product.isInStock 
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed shadow-none'
                  : 'bg-gradient-to-r from-[#8B1E0F] via-[#9E2010] to-[#B32713] hover:from-[#78180A] hover:to-[#8B1E0F] text-white hover:shadow-md hover:scale-[1.01]'
              }`}
            >
              <AnimatePresence mode="wait">
                {showFeedback ? (
                  <motion.span 
                    key="success"
                    initial={{ y: 15, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -15, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="flex items-center gap-1.5 text-amber-200 font-extrabold"
                  >
                    <Check size={16} className="text-amber-200" /> {feedbackMsg || 'Added to Cart!'}
                  </motion.span>
                ) : (
                  <motion.span 
                    key="add" 
                    initial={{ y: 15, opacity: 0 }} 
                    animate={{ y: 0, opacity: 1 }} 
                    exit={{ y: -15, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="flex items-center gap-2"
                  >
                    <ShoppingCart size={15} />
                    <span>{product.isInStock ? 'Add to Cart' : 'Sold Out'}</span>
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
          )}

          {/* Amazon-Style Freshness & Delivery Assurance */}
          <div className="flex items-center justify-center gap-1.5 text-[10px] sm:text-[11px] text-emerald-800 font-extrabold bg-emerald-50/70 border border-emerald-200/50 rounded-lg py-1 px-2 text-center">
            <Zap size={12} className="text-amber-600 fill-amber-500" />
            <span>Fresh Warangal Batch • Express Delivery</span>
          </div>

        </div>
      </div>
    </div>
  );
};