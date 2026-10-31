import { useState, useEffect, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, Sparkles, TrendingUp, ShoppingBag, ArrowRight } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { getProducts } from '../api';
import type { Product } from '../types';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const POPULAR_SEARCHES = [
  'Sakinalu',
  'Gongura Pickle',
  'Avakaya',
  'Chekkalu',
  'Bellam Ariselu',
  'Nuvvula Laddu',
  'Chicken Pickle',
  'Tomato Pickle'
];

export const SearchModal = ({ isOpen, onClose }: SearchModalProps) => {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const { data: products } = useQuery({
    queryKey: ['products'],
    queryFn: getProducts,
    enabled: isOpen,
  });

  // Focus input when opened and lock background scroll
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      const timer = setTimeout(() => inputRef.current?.focus(), 80);
      return () => clearTimeout(timer);
    } else {
      document.body.style.overflow = '';
      setQuery('');
    }
  }, [isOpen]);

  // Handle ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const filteredProducts = useMemo(() => {
    if (!query.trim() || !products) return [];
    const q = query.toLowerCase().trim();
    return products.filter((p) => {
      if (p.isVisible === false) return false;
      const nameMatch = p.name?.toLowerCase().includes(q);
      const catMatch = p.categories?.some((c) => c.name?.toLowerCase().includes(q));
      const descMatch = p.shortDescription?.toLowerCase().includes(q);
      return nameMatch || catMatch || descMatch;
    }).slice(0, 6);
  }, [query, products]);

  const getProductCategoryId = (product: Product): number => {
    if (product.categories && product.categories.length > 0) {
      const cat = product.categories[0];
      if (typeof cat.id === 'number' && cat.id > 0) return cat.id;
      const catName = (cat.name || '').toLowerCase();
      if (catName.includes('veg') && !catName.includes('non')) return 1;
      if (catName.includes('sweet')) return 2;
      if (catName.includes('podi') || catName.includes('podulu') || catName.includes('spice')) return 3;
      if (catName.includes('non')) return 4;
      if (catName.includes('snack') || catName.includes('sakinalu') || catName.includes('chekkalu')) return 5;
    }
    // Fallback by product name
    const pName = (product.name || '').toLowerCase();
    if (pName.includes('chicken') || pName.includes('mutton') || pName.includes('fish') || pName.includes('prawn') || pName.includes('chepala') || pName.includes('royalla') || pName.includes('kheema')) return 4;
    if (pName.includes('sakinalu') || pName.includes('chekkalu') || pName.includes('boondi') || pName.includes('sev') || pName.includes('chuduva') || pName.includes('murukku') || pName.includes('mixture') || pName.includes('snack')) return 5;
    if (pName.includes('podi') || pName.includes('karam') || pName.includes('munagaku') || pName.includes('kandi') || pName.includes('karivepaku')) return 3;
    if (pName.includes('laddu') || pName.includes('ariselu') || pName.includes('badhusha') || pName.includes('halwa') || pName.includes('pak') || pName.includes('kova') || pName.includes('poornalu') || pName.includes('kaja') || pName.includes('sweet') || pName.includes('pongali') || pName.includes('paramannam')) return 2;
    return 1;
  };

  const handleSelectProduct = (product: Product) => {
    onClose();
    // Redirect directly to the category products page according to the product's category
    const catId = getProductCategoryId(product);
    navigate(`/category/${catId}`);
  };

  const handleSearchSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const clean = query.trim();
    if (!clean) return;
    onClose();

    // If matching products exist, redirect directly to the category products page of the top match
    if (filteredProducts.length > 0) {
      const catId = getProductCategoryId(filteredProducts[0]);
      navigate(`/category/${catId}`);
      return;
    }

    const qLower = clean.toLowerCase();
    if (qLower.includes('veg') && !qLower.includes('non')) {
      navigate('/category/1');
      return;
    }
    if (qLower.includes('sweet')) {
      navigate('/category/2');
      return;
    }
    if (qLower.includes('podi') || qLower.includes('podulu')) {
      navigate('/category/3');
      return;
    }
    if (qLower.includes('non') || qLower.includes('chicken') || qLower.includes('mutton') || qLower.includes('fish') || qLower.includes('prawn')) {
      navigate('/category/4');
      return;
    }
    if (qLower.includes('snack') || qLower.includes('sakinalu') || qLower.includes('chekkalu')) {
      navigate('/category/5');
      return;
    }

    navigate(`/shop?q=${encodeURIComponent(clean)}`);
  };

  const handlePopularSearch = (term: string) => {
    setQuery(term);
    inputRef.current?.focus();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-start justify-center pt-16 sm:pt-24 px-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 bg-brand-dark/85 backdrop-blur-md"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative w-full max-w-2xl bg-brand-dark/95 border border-brand-accent/25 rounded-3xl shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8)] backdrop-blur-2xl overflow-hidden flex flex-col z-10 max-h-[82vh]"
          >
            {/* Header / Input Field with Search Button */}
            <form onSubmit={handleSearchSubmit} className="p-4 sm:p-5 border-b border-white/10 flex items-center gap-3 relative">
              <button 
                type="submit"
                title="Search products"
                className="w-10 h-10 rounded-xl bg-brand-primary/25 hover:bg-brand-primary text-brand-accent hover:text-white flex items-center justify-center flex-shrink-0 shadow-inner transition cursor-pointer"
              >
                <Search size={20} />
              </button>
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search traditional snacks, sweets, pickles..."
                className="w-full bg-transparent text-white placeholder-gray-400 text-base sm:text-lg focus:outline-none"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery('')}
                  aria-label="Clear query"
                  className="text-gray-400 hover:text-white transition-colors p-1 rounded-full hover:bg-white/10 cursor-pointer"
                >
                  <X size={18} />
                </button>
              )}
              <button
                type="submit"
                disabled={!query.trim()}
                className="hidden sm:flex px-4 py-2 rounded-xl bg-brand-primary hover:bg-yellow-600 disabled:opacity-40 text-brand-dark font-bold text-xs items-center gap-1.5 transition cursor-pointer shadow-sm"
              >
                Search
              </button>
              <button
                type="button"
                onClick={onClose}
                className="text-gray-400 hover:text-brand-accent transition-colors p-1.5 rounded-xl hover:bg-white/10 flex items-center gap-1 text-xs border border-white/10 flex-shrink-0 cursor-pointer"
              >
                <span className="hidden sm:inline font-semibold">ESC</span>
                <X size={16} />
              </button>
            </form>

            {/* Results & Quick Cravings Area */}
            <div className="overflow-y-auto p-4 sm:p-6 flex-grow">
              {query.trim() === '' ? (
                <div>
                  <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-brand-accent mb-3">
                    <TrendingUp size={16} />
                    Popular Searches
                  </div>
                  <div className="flex flex-wrap gap-2 mb-6">
                    {POPULAR_SEARCHES.map((term) => (
                      <button
                        key={term}
                        type="button"
                        onClick={() => handlePopularSearch(term)}
                        className="px-3.5 py-1.5 rounded-full bg-white/5 hover:bg-brand-primary/20 hover:border-brand-primary/40 border border-white/10 text-gray-200 hover:text-brand-accent text-xs sm:text-sm font-medium transition-all duration-200 cursor-pointer"
                      >
                        {term}
                      </button>
                    ))}
                  </div>

                  <div className="rounded-2xl bg-gradient-to-r from-brand-primary/15 via-brand-accent/10 to-transparent p-4 border border-brand-accent/15 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-brand-accent/20 flex items-center justify-center text-brand-accent flex-shrink-0">
                        <Sparkles size={20} />
                      </div>
                      <div>
                        <h4 className="text-white text-sm font-bold">Looking for all categories?</h4>
                        <p className="text-gray-400 text-xs">Browse our complete authentic catalog</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        onClose();
                        navigate('/categories');
                      }}
                      className="px-4 py-2 rounded-xl bg-brand-primary text-brand-dark text-xs font-bold hover:bg-yellow-600 transition flex items-center gap-1.5 flex-shrink-0 cursor-pointer shadow-sm"
                    >
                      Browse
                      <ArrowRight size={14} />
                    </button>
                  </div>
                </div>
              ) : filteredProducts.length > 0 ? (
                <div>
                  <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-gray-400 mb-3 px-1">
                    <span>Matching Products ({filteredProducts.length})</span>
                    <button 
                      type="button"
                      onClick={() => handleSearchSubmit()} 
                      className="text-brand-accent hover:underline font-semibold cursor-pointer"
                    >
                      View in full catalog →
                    </button>
                  </div>
                  <div className="space-y-2">
                    {filteredProducts.map((product) => {
                      const image = product.imageUrl || '/images/premium_snacks.jpg';
                      return (
                        <div
                          key={product.id}
                          onClick={() => handleSelectProduct(product)}
                          className="group flex items-center gap-3.5 p-3 rounded-2xl hover:bg-white/10 border border-transparent hover:border-amber-400/40 cursor-pointer transition-all duration-200"
                        >
                          <div className="w-14 h-14 rounded-xl overflow-hidden bg-black/40 flex-shrink-0 border border-white/10 group-hover:border-amber-400/50 transition">
                            <img
                              src={image}
                              alt={product.name}
                              className="w-full h-full object-cover group-hover:scale-108 transition duration-300"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = '/images/premium_snacks.jpg';
                              }}
                            />
                          </div>
                          <div className="flex-grow min-w-0">
                            <div className="flex items-center gap-2">
                              <h4 className="text-white font-semibold text-sm sm:text-base truncate group-hover:text-amber-300 transition-colors">
                                {product.name}
                              </h4>
                              {product.categories?.[0] && (
                                <span className="inline-block px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 text-[10px] font-bold border border-amber-400/30">
                                  {product.categories[0].name}
                                </span>
                              )}
                            </div>
                            <p className="text-gray-400 text-xs truncate">
                              {product.shortDescription || 'Fresh, homemade authentic recipe'}
                            </p>
                          </div>
                          <div className="text-right flex-shrink-0 flex items-center gap-2.5">
                            <div>
                              <div className="text-amber-300 font-bold text-sm sm:text-base">
                                ₹{product.price}
                              </div>
                              <div className="text-[10px] text-gray-400 font-medium">
                                (1 KG)
                              </div>
                            </div>
                            <ArrowRight size={16} className="text-amber-400 opacity-60 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="pt-4 text-center">
                    <button
                      type="button"
                      onClick={() => handleSearchSubmit()}
                      className="text-xs text-brand-accent hover:underline font-bold inline-flex items-center gap-1.5 cursor-pointer py-1 px-3 rounded-lg hover:bg-white/5 transition"
                    >
                      View all products matching "{query}" in store catalog <ArrowRight size={13} />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="py-12 text-center">
                  <div className="w-14 h-14 rounded-2xl bg-white/5 mx-auto flex items-center justify-center text-gray-500 mb-3 border border-white/10">
                    <ShoppingBag size={24} />
                  </div>
                  <h3 className="text-white font-semibold text-base mb-1">No instant results found</h3>
                  <p className="text-gray-400 text-xs max-w-sm mx-auto mb-4">
                    We couldn't find items matching "<span className="text-brand-accent">{query}</span>". Search our complete catalog or explore our categories.
                  </p>
                  <div className="flex justify-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleSearchSubmit()}
                      className="px-4 py-2 rounded-xl bg-brand-primary text-brand-dark text-xs font-bold hover:bg-yellow-600 transition inline-flex items-center gap-1.5 cursor-pointer shadow-sm"
                    >
                      Search All Store Products
                      <Search size={14} />
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        onClose();
                        navigate('/categories');
                      }}
                      className="px-4 py-2 rounded-xl bg-white/10 text-white text-xs font-bold hover:bg-white/20 transition inline-flex items-center gap-1.5 cursor-pointer"
                    >
                      View All Categories
                      <ArrowRight size={14} />
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-3 bg-black/40 border-t border-white/5 flex items-center justify-between text-[11px] text-gray-400 px-6">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                Fresh Homemade Telangana Flavours
              </span>
              <span className="hidden sm:inline">Press <kbd className="px-1.5 py-0.5 rounded bg-white/10 text-gray-300">ESC</kbd> to exit</span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
