import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useParams, Navigate, useNavigate } from 'react-router-dom';
import { getProducts, getCategories } from '../api';
import { ProductCard } from '../components/ProductCard';
import { Helmet } from 'react-helmet-async';
import { Search, X } from 'lucide-react';
import { motion } from 'framer-motion';
import { getCategoryDetails } from '../utils/categoryData';

export const Shop = () => {
  const { categoryId } = useParams();
  const navigate = useNavigate();
  
  const { data: products, isLoading: isLoadingProducts } = useQuery({
    queryKey: ['products'],
    queryFn: getProducts,
  });

  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: getCategories,
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('featured');

  const filteredProducts = useMemo(() => {
    if (!products) return [];
    
    let result = products.filter(p => p.isVisible !== false);

    // Filter by Category
    if (categoryId) {
      result = result.filter(p => p.categories.some(c => c.id === Number(categoryId)));
    }

    // Filter by Search
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(p => p.name.toLowerCase().includes(q));
    }

    // Sort
    if (sortBy === 'price-low') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-high') {
      result.sort((a, b) => b.price - a.price);
    }

    return result;
  }, [products, categoryId, searchQuery, sortBy]);

  const currentCategory = categories?.find(c => c.id === Number(categoryId));
  const categoryDetails = currentCategory ? getCategoryDetails(currentCategory.name) : null;

  if (!categoryId && categories?.length) {
    return <Navigate to="/categories" replace />;
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen pt-32 pb-12"
    >
      <Helmet>
        <title>Shop All Products | Sri Telangana Ruchulu</title>
        <meta name="description" content="Browse our wide selection of authentic Telangana snacks, sweets, and pickles." />
      </Helmet>

      {/* Hero Header for Category */}
      {currentCategory && categoryDetails && (
        <div className="container mx-auto px-4 mb-8">
          <div className="relative rounded-3xl overflow-hidden shadow-2xl h-[300px]">
            <div className="absolute inset-0 bg-black/60 z-10"></div>
            <img 
              src={categoryDetails.image} 
              alt={currentCategory.name} 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 flex flex-col items-center justify-center z-20 text-white">
              <h1 className="text-2xl md:text-3xl font-extrabold mb-1 drop-shadow-xl text-yellow-400">{currentCategory.name}</h1>
              <p className="text-sm sm:text-base text-white/95 font-semibold drop-shadow-md">{categoryDetails.telugu}</p>
            </div>
          </div>
        </div>
      )}

      <div className="container mx-auto px-4 max-w-7xl">
        
        <motion.div 
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="mb-10 bg-white/80 backdrop-blur-xl p-5 sm:p-6 rounded-3xl shadow-sm border border-gray-100 relative z-20"
        >
          <div className="flex flex-col lg:flex-row gap-4 justify-between items-center">
            {/* Search Input Container */}
            <div className="relative w-full lg:w-1/2">
              <div className="relative flex items-center group">
                <div className="absolute left-4 pointer-events-none text-gray-400 group-focus-within:text-brand-primary transition-colors">
                  <Search size={18} />
                </div>
                <input 
                  type="text" 
                  placeholder="Search traditional sweets, snacks, pickles..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-11 pr-24 py-3 bg-gray-50/80 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary text-sm sm:text-base transition-all duration-300 placeholder-gray-400 text-brand-dark"
                />
                <div className="absolute right-3 flex items-center gap-1.5">
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      aria-label="Clear search"
                      className="p-1 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-200 transition-colors"
                    >
                      <X size={16} />
                    </button>
                  )}
                  <span className="hidden sm:inline-block px-2.5 py-1 rounded-full bg-brand-light text-brand-dark font-semibold text-xs border border-gray-200">
                    {filteredProducts.length} items
                  </span>
                </div>
              </div>
            </div>

            {/* Filter Dropdowns */}
            <div className="flex flex-wrap sm:flex-nowrap gap-3 w-full lg:w-auto justify-end items-center">
              {/* Category Switcher */}
              <div className="relative flex-1 sm:flex-none">
                <select 
                  value={categoryId || ''} 
                  onChange={(e) => navigate(`/category/${e.target.value}`)}
                  className="w-full sm:w-auto px-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:border-brand-primary bg-gray-50/80 text-gray-700 font-semibold text-sm cursor-pointer hover:border-brand-primary transition-colors"
                >
                  {categories?.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>

              {/* Sort */}
              <div className="relative flex-1 sm:flex-none">
                <select 
                  value={sortBy} 
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full sm:w-auto px-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:border-brand-primary bg-gray-50/80 text-gray-700 font-semibold text-sm cursor-pointer hover:border-brand-primary transition-colors"
                >
                  <option value="featured">Sort: Featured</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                </select>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Product Grid */}
        {isLoadingProducts ? (
          <div className="text-center py-20 text-gray-500">Loading premium products...</div>
        ) : filteredProducts.length > 0 ? (
          <motion.div 
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0 },
              visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
            }}
            className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-8"
          >
            {filteredProducts.map(product => (
              <motion.div
                key={product.id}
                variants={{
                  hidden: { opacity: 0, y: 30, scale: 0.95 },
                  visible: { opacity: 1, y: 0, scale: 1 }
                }}
                whileHover={{ scale: 1.03, rotateY: 3, rotateX: 3, z: 20 }}
                style={{ perspective: 1000 }}
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="text-center py-20 bg-white rounded-2xl shadow-sm border border-gray-100"
          >
            <h2 className="text-xl font-bold text-gray-700 mb-2">No products found</h2>
            <p className="text-gray-500">Try adjusting your search or filters.</p>
            <button 
              onClick={() => {setSearchQuery('');}}
              className="mt-4 text-brand-primary font-bold hover:underline"
            >
              Clear search
            </button>
          </motion.div>
        )}

      </div>
    </motion.div>
  );
};
