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

  const handleSelectProduct = (product: Product) => {
    onClose();
    navigate(`/product/${product.slug}`);
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
            {/* Header / Input Field */}
            <div className="p-4 sm:p-5 border-b border-white/10 flex items-center gap-3 relative">
              <div className="w-10 h-10 rounded-xl bg-brand-primary/20 text-brand-accent flex items-center justify-center flex-shrink-0 shadow-inner">
                <Search size={20} className="text-brand-accent" />
              </div>
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search traditional snacks, sweets, pickles..."
                className="w-full bg-transparent text-white placeholder-gray-400 text-base sm:text-lg focus:outline-none pr-8"
              />
              {query && (
                <button
                  onClick={() => setQuery('')}
                  aria-label="Clear query"
                  className="text-gray-400 hover:text-white transition-colors p-1 rounded-full hover:bg-white/10 mr-1"
                >
                  <X size={18} />
                </button>
              )}
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-brand-accent transition-colors p-1.5 rounded-xl hover:bg-white/10 flex items-center gap-1 text-xs border border-white/10 flex-shrink-0"
              >
                <span className="hidden sm:inline font-semibold">ESC</span>
                <X size={16} />
              </button>
            </div>

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
                        onClick={() => handlePopularSearch(term)}
                        className="px-3.5 py-1.5 rounded-full bg-white/5 hover:bg-brand-primary/20 hover:border-brand-primary/40 border border-white/10 text-gray-200 hover:text-brand-accent text-xs sm:text-sm font-medium transition-all duration-200"
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
                      onClick={() => {
                        onClose();
                        navigate('/categories');
                      }}
                      className="px-4 py-2 rounded-xl bg-brand-primary text-white text-xs font-bold hover:bg-brand-primary/80 transition flex items-center gap-1.5 flex-shrink-0"
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
                    <span className="text-brand-accent">Click to view details</span>
                  </div>
                  <div className="space-y-2">
                    {filteredProducts.map((product) => {
                      const image = product.imageUrl || '/images/premium_snacks.jpg';
                      return (
                        <div
                          key={product.id}
                          onClick={() => handleSelectProduct(product)}
                          className="group flex items-center gap-3.5 p-2.5 rounded-2xl hover:bg-white/10 border border-transparent hover:border-brand-accent/25 cursor-pointer transition-all duration-200"
                        >
                          <div className="w-14 h-14 rounded-xl overflow-hidden bg-black/40 flex-shrink-0 border border-white/10 group-hover:border-brand-primary/40 transition">
                            <img
                              src={image}
                              alt={product.name}
                              className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = '/images/premium_snacks.jpg';
                              }}
                            />
                          </div>
                          <div className="flex-grow min-w-0">
                            <div className="flex items-center gap-2">
                              <h4 className="text-white font-semibold text-sm sm:text-base truncate group-hover:text-brand-accent transition-colors">
                                {product.name}
                              </h4>
                              {product.categories?.[0] && (
                                <span className="hidden sm:inline-block px-2 py-0.5 rounded-md bg-white/10 text-[10px] text-gray-300 font-medium">
                                  {product.categories[0].name}
                                </span>
                              )}
                            </div>
                            <p className="text-gray-400 text-xs truncate">
                              {product.shortDescription || 'Fresh, homemade authentic recipe'}
                            </p>
                          </div>
                          <div className="text-right flex-shrink-0">
                            <div className="text-brand-accent font-bold text-sm sm:text-base">
                              ₹{product.price}
                            </div>
                            {product.regularPrice > product.price && (
                              <div className="text-gray-500 text-[10px] line-through">
                                ₹{product.regularPrice}
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <div className="py-12 text-center">
                  <div className="w-14 h-14 rounded-2xl bg-white/5 mx-auto flex items-center justify-center text-gray-500 mb-3 border border-white/10">
                    <ShoppingBag size={24} />
                  </div>
                  <h3 className="text-white font-semibold text-base mb-1">No products found</h3>
                  <p className="text-gray-400 text-xs max-w-sm mx-auto mb-4">
                    We couldn't find any items matching "<span className="text-brand-accent">{query}</span>". Try another term or explore our full category collection.
                  </p>
                  <button
                    onClick={() => {
                      onClose();
                      navigate('/categories');
                    }}
                    className="px-4 py-2 rounded-full bg-brand-primary text-white text-xs font-bold hover:bg-brand-primary/80 transition inline-flex items-center gap-1.5"
                  >
                    View All Categories
                    <ArrowRight size={14} />
                  </button>
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
