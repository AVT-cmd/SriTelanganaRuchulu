import { Link } from 'react-router-dom';
import type { Product } from '../types';
import { useCartStore } from '../store/cartStore';
import { useState } from 'react';
import { Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const teluguDict: Record<string, string> = {
  'pachadi': 'పచ్చడి', 'gongura': 'గోంగూర', 'allam': 'అల్లం', 'mixed': 'మిక్స్డ్', 
  'vegetable': 'వెజిటబుల్', 'tomato': 'టమాటా', 'mango': 'మామిడికాయ', 'sweet': 'స్వీట్',
  'sweets': 'స్వీట్లు', 'snacks': 'స్నాక్స్', 'chicken': 'చికెన్', 'mutton': 'మటన్', 
  'pickle': 'పచ్చడి', 'pickles': 'పచ్చళ్ళు', 'garlic': 'వెల్లుల్లి', 'avakaya': 'ఆవకాయ',
  'non': 'నాన్', 'veg': 'వెజ్', 'prawns': 'రొయ్యల', 'fish': 'చేపల', 'bellam': 'బెల్లం',
  'nuvvula': 'నువ్వుల', 'palli': 'పల్లి', 'chekkalu': 'చెక్కలు', 'sakinalu': 'సకినాలు'
};

const getTeluguTranslation = (englishName: string) => {
  return englishName.split(' ').map(word => {
    const w = word.toLowerCase().replace(/[^a-z]/g, ''); // strip punctuation
    return teluguDict[w] || word;
  }).join(' ');
};

export const ProductCard = ({ product }: { product: Product }) => {
  const addItem = useCartStore((state) => state.addItem);
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
  const currentRegularPrice = product.regularPrice ? Math.round(product.regularPrice * weightKg) : 0;

  return (
    <div className="bg-white rounded-xl sm:rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100/50 overflow-hidden hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] transition-all duration-500 group flex flex-col relative z-10">
      <Link to={`/product/${product.slug}`} className="relative block h-40 sm:h-56 overflow-hidden bg-gray-50 flex-shrink-0">
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        <img 
          src={imageToUse} 
          alt={product.name}
          loading="lazy"
          decoding="async"
          onError={(e) => { (e.target as HTMLImageElement).src = '/images/premium_snacks.jpg'; }}
          className="w-full h-full object-cover transition duration-700 group-hover:scale-110"
        />
        {!product.isInStock && (
          <div className="absolute top-3 left-3 bg-red-600/90 backdrop-blur-md text-white text-[11px] font-bold px-2.5 py-1 rounded-full z-20 shadow-lg">
            Out of Stock
          </div>
        )}
        <div className="absolute top-3 right-3 bg-amber-500/90 backdrop-blur-md text-white text-[10px] font-bold px-2 py-0.5 rounded-full z-20 shadow-sm">
          500g - 3KG
        </div>
        <div className="absolute bottom-3 left-3 z-20 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
          <span className="bg-white/90 backdrop-blur-md text-brand-dark text-xs font-bold px-3 py-1 rounded-full shadow-lg">
            View Details
          </span>
        </div>
      </Link>
      
      <div className="p-3 sm:p-5 flex flex-col flex-grow bg-white">
        <div className="mb-1">
          <span className="text-[10px] sm:text-[11px] font-bold tracking-wider text-brand-primary uppercase">
            {product.categories.map(c => c.name).join(', ')}
          </span>
        </div>
        <Link to={`/product/${product.slug}`}>
          <h3 className="font-heading font-bold text-sm sm:text-base text-brand-dark mb-0.5 line-clamp-2 group-hover:text-brand-primary transition-colors leading-snug">
            {product.name}
          </h3>
          <p className="text-xs text-brand-primary/80 font-semibold mb-1 font-telugu">
            {getTeluguTranslation(product.name)}
          </p>
        </Link>
        <p className="text-xs text-gray-500 mb-2 line-clamp-2 hidden sm:block leading-relaxed">
          {product.shortDescription || 'Authentic traditional recipe crafted with care and premium ingredients.'}
        </p>
        
        <div className="mt-auto pt-2 sm:pt-3 border-t border-gray-100 flex flex-col gap-2.5">
          <div className="flex items-baseline justify-between">
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-base sm:text-lg text-brand-dark">₹{currentPrice}</span>
              {currentRegularPrice > currentPrice && (
                <span className="text-xs text-gray-400 line-through decoration-red-400/50">₹{currentRegularPrice}</span>
              )}
            </div>
            <span className="text-[11px] text-gray-400 font-medium">
              (₹{product.price}/KG)
            </span>
          </div>
          
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full relative">
            <select 
              value={selectedQty}
              onChange={(e) => setSelectedQty(e.target.value)}
              className="bg-gray-50 border border-gray-200 text-brand-dark text-xs sm:text-sm rounded-lg focus:ring-brand-primary focus:border-brand-primary block p-2 sm:w-[45%] flex-shrink-0 cursor-pointer hover:border-brand-primary transition-colors font-medium"
              disabled={!product.isInStock}
            >
              <option value="500g">500g (Min)</option>
              <option value="1kg">1 KG</option>
              <option value="1.5kg">1.5 KG</option>
              <option value="2kg">2 KG</option>
              <option value="2.5kg">2.5 KG</option>
              <option value="3kg">3 KG (Max)</option>
            </select>

            <button 
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
              className={`w-full sm:w-[55%] px-2 sm:px-3 py-2 rounded-lg font-bold text-[10px] sm:text-xs transition-all flex items-center justify-center gap-1 relative overflow-hidden min-h-[40px] ${
                !product.isInStock 
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed shadow-none'
                  : 'bg-brand-dark text-white hover:bg-brand-primary hover:shadow-md active:scale-95 cursor-pointer'
              }`}
            >
              <AnimatePresence mode="wait">
                {showFeedback ? (
                  <motion.span 
                    key="success"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -20, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="absolute flex items-center justify-center gap-1 text-green-400 w-full font-semibold"
                  >
                    <Check size={14} /> {feedbackMsg}
                  </motion.span>
                ) : (
                  <motion.span 
                    key="add" 
                    initial={{ y: 20, opacity: 0 }} 
                    animate={{ y: 0, opacity: 1 }} 
                    exit={{ y: -20, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="absolute flex items-center justify-center w-full"
                  >
                    {product.isInStock ? 'Add to Cart' : 'Sold Out'}
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
