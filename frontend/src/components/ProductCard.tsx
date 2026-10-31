import { Link } from 'react-router-dom';
import type { Product } from '../types';
import { useCartStore } from '../store/cartStore';
import { useState } from 'react';
import { Check, ShoppingCart, Star, Plus, Minus } from 'lucide-react';
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
    const w = word.toLowerCase().replace(/[^a-z]/g, '');
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

  const fallbackImage = "/images/premium_snacks.jpg";
  const imageToUse = product.imageUrl ? product.imageUrl : fallbackImage;

  // Weight options: 500g to 3kg
  const weightKg = selectedQty === '500g' ? 0.5 :
                   selectedQty === '1kg' ? 1.0 :
                   selectedQty === '2kg' ? 2.0 :
                   selectedQty === '3kg' ? 3.0 : 0.5;

  const currentPrice = Math.round(product.price * weightKg);

  // Clean, realistic rating
  const ratingScore = (4.7 + ((product.id * 3) % 3) * 0.1).toFixed(1);
  const reviewsCount = 75 + ((product.id * 17) % 160);

  // Check if item is in cart for this specific weight
  const cartItemId = `${product.id}-${selectedQty}`;
  const inCartItem = items.find(
    (item) => item.cartItemId === cartItemId || (item.id === product.id && item.weight === selectedQty)
  );
  const inCartQty = inCartItem?.quantity || 0;

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_4px_16px_rgba(0,0,0,0.04)] hover:shadow-[0_12px_28px_rgba(0,0,0,0.08)] hover:border-amber-300 transition-all duration-300 group flex flex-col overflow-hidden">
      
      {/* Product Image */}
      <Link to={`/product/${product.slug}`} className="relative block h-44 sm:h-52 overflow-hidden bg-gray-50 flex-shrink-0">
        <img 
          src={imageToUse} 
          alt={product.name}
          loading="lazy"
          decoding="async"
          onError={(e) => { (e.target as HTMLImageElement).src = fallbackImage; }}
          className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
        />

        {!product.isInStock && (
          <div className="absolute top-2.5 left-2.5 z-10">
            <span className="bg-red-600 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full shadow-xs uppercase tracking-wider">
              Out of Stock
            </span>
          </div>
        )}
      </Link>
      
      {/* Content */}
      <div className="p-4 flex flex-col flex-grow">
        
        {/* Category & Star Rating */}
        <div className="flex items-center justify-between gap-2 mb-1.5">
          <span className="text-[11px] font-semibold tracking-wider text-amber-800 uppercase truncate">
            {product.categories.map(c => c.name).join(', ')}
          </span>

          <div className="flex items-center gap-1 text-xs font-semibold text-gray-700 flex-shrink-0">
            <Star size={12} className="fill-amber-400 text-amber-400" />
            <span>{ratingScore}</span>
            <span className="text-gray-400 text-[11px]">({reviewsCount})</span>
          </div>
        </div>

        {/* Product Names */}
        <Link to={`/product/${product.slug}`} className="block mb-1">
          <h3 className="font-heading font-bold text-sm sm:text-base text-gray-900 line-clamp-1 group-hover:text-[#8B1E0F] transition-colors leading-snug">
            {product.name}
          </h3>
          <p className="text-xs text-amber-700 font-medium font-telugu mt-0.5">
            {getTeluguTranslation(product.name)}
          </p>
        </Link>

        {/* Short Description */}
        <p className="text-xs text-gray-500 line-clamp-1 leading-relaxed mb-3">
          {product.shortDescription || 'Authentic traditional recipe crafted with care and premium ingredients.'}
        </p>
        
        {/* Comfortable Pack Selector & Pricing Section */}
        <div className="mt-auto pt-3 border-t border-gray-100 flex flex-col gap-2.5">
          
          {/* Clean Segmented Pack Selector */}
          <div className="flex items-center gap-1.5">
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
                className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all text-center border cursor-pointer ${
                  selectedQty === chip.value
                    ? 'bg-[#8B1E0F] text-white border-[#8B1E0F] shadow-xs'
                    : 'bg-gray-50 hover:bg-gray-100 text-gray-700 border-gray-200'
                }`}
              >
                {chip.label}
              </button>
            ))}
          </div>

          {/* Clean Price Row (Without 17% off clutter) */}
          <div className="flex items-baseline justify-between py-0.5">
            <span className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight">
              ₹{currentPrice}
            </span>
            <span className="text-xs text-gray-500 font-medium">
              (₹{product.price}/kg)
            </span>
          </div>

          {/* Action Button / Stepper */}
          {inCartQty > 0 ? (
            <div className="w-full flex items-center justify-between bg-amber-50/70 border border-amber-300 rounded-xl p-1">
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
                className="w-9 h-9 rounded-lg bg-white text-[#8B1E0F] font-bold text-sm flex items-center justify-center shadow-xs hover:bg-red-50 border border-gray-200 transition-all cursor-pointer"
                aria-label="Decrease quantity"
              >
                <Minus size={15} />
              </button>
              <div className="flex flex-col items-center">
                <span className="text-xs sm:text-sm font-bold text-gray-900">
                  {inCartQty} in Cart
                </span>
                <span className="text-[10px] text-gray-500 font-medium">
                  {selectedQty}
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
                className="w-9 h-9 rounded-lg bg-[#8B1E0F] text-white font-bold text-sm flex items-center justify-center shadow-xs hover:bg-[#72180C] transition-all cursor-pointer"
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
                setShowFeedback(true);
                setTimeout(() => setShowFeedback(false), 1800);
              }}
              disabled={!product.isInStock}
              className={`w-full py-2.5 px-4 rounded-xl font-bold text-xs sm:text-sm transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer ${
                !product.isInStock 
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed shadow-none'
                  : 'bg-[#8B1E0F] hover:bg-[#72180C] text-white shadow-xs hover:shadow-sm active:scale-[0.99]'
              }`}
            >
              <AnimatePresence mode="wait">
                {showFeedback ? (
                  <motion.span 
                    key="success"
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -10, opacity: 0 }}
                    className="flex items-center gap-1.5 text-amber-200 font-bold"
                  >
                    <Check size={16} /> Added!
                  </motion.span>
                ) : (
                  <motion.span 
                    key="add" 
                    initial={{ y: 10, opacity: 0 }} 
                    animate={{ y: 0, opacity: 1 }} 
                    exit={{ y: -10, opacity: 0 }}
                    className="flex items-center gap-2"
                  >
                    <ShoppingCart size={15} />
                    <span>{product.isInStock ? 'Add to Cart' : 'Sold Out'}</span>
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
          )}

        </div>
      </div>
    </div>
  );
};