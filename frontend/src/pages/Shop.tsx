import { useState, useMemo, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useParams, useNavigate, useSearchParams, Link } from 'react-router-dom';
import { getProducts, getCategories } from '../api';
import { ProductCard } from '../components/ProductCard';
import { SEO } from '../components/SEO';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { Search, X } from 'lucide-react';
import { motion } from 'framer-motion';
import { getCategoryDetails } from '../utils/categoryData';
import type { Product } from '../types';

export const Shop = () => {
  const { categoryId } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const urlQuery = searchParams.get('q') || searchParams.get('search') || '';
  
  const { data: products, isLoading: isLoadingProducts } = useQuery({
    queryKey: ['products'],
    queryFn: getProducts,
  });

  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: getCategories,
  });

  const [searchQuery, setSearchQuery] = useState(urlQuery);
  const [sortBy, setSortBy] = useState('featured');

  // Sync search query if URL parameter changes
  useEffect(() => {
    if (urlQuery !== searchQuery) {
      setSearchQuery(urlQuery);
    }
  }, [urlQuery]);

  const { filteredProducts, matchedInOtherCategories } = useMemo(() => {
    if (!products) return { filteredProducts: [], matchedInOtherCategories: [] };
    
    const visibleProducts = products.filter(p => p.isVisible !== false);
    const q = searchQuery.toLowerCase().trim();

    const matchesSearch = (p: Product) => {
      if (!q) return true;
      const nameMatch = p.name?.toLowerCase().includes(q);
      const catMatch = p.categories?.some(c => c.name?.toLowerCase().includes(q) || c.slug?.toLowerCase().includes(q));
      const descMatch = p.shortDescription?.toLowerCase().includes(q) || p.description?.toLowerCase().includes(q);
      const slugMatch = p.slug?.toLowerCase().includes(q);
      return Boolean(nameMatch || catMatch || descMatch || slugMatch);
    };

    let allMatching = visibleProducts.filter(matchesSearch);

    let result = allMatching;
    let otherCats: Product[] = [];

    // Filter by specific Category if provided and not "all"
    if (categoryId && categoryId !== 'all') {
      const inCategory = allMatching.filter(p => p.categories?.some(c => c.id === Number(categoryId)));
      if (inCategory.length === 0 && q && allMatching.length > 0) {
        // No match in current category, but matches exist in other categories across store
        result = [];
        otherCats = allMatching;
      } else {
        result = inCategory;
      }
    }

    // Sort
    const sortList = (list: Product[]) => {
      if (sortBy === 'price-low') {
        list.sort((a, b) => a.price - b.price);
      } else if (sortBy === 'price-high') {
        list.sort((a, b) => b.price - a.price);
      }
      return list;
    };

    return { 
      filteredProducts: sortList([...result]), 
      matchedInOtherCategories: sortList([...otherCats]) 
    };
  }, [products, categoryId, searchQuery, sortBy]);

  const currentCategory = categories?.find(c => c.id === Number(categoryId));
  const categoryDetails = currentCategory ? getCategoryDetails(currentCategory.name) : null;

  const categoryBreadcrumbs = [
    { name: 'Categories', url: '/categories' },
    ...(currentCategory ? [{ name: currentCategory.name, url: `/category/${categoryId}` }] : [{ name: 'All Products', url: '/shop' }])
  ];

  const pageTitle = currentCategory
    ? `${currentCategory.name} - Authentic Traditional Products`
    : searchQuery
    ? `Search Results for "${searchQuery}" - Sri Telangana Ruchulu`
    : 'Shop Traditional Telangana Products';

  const pageDesc = currentCategory
    ? `Buy authentic handcrafted ${currentCategory.name} online from Sri Telangana Ruchulu. Fresh batches prepared with pure spices and delivered across India.`
    : 'Browse our complete catalog of authentic Telangana snacks, sweets, pickles, and traditional spice podulu.';

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen pt-32 pb-12"
    >
      <SEO
        title={pageTitle}
        description={pageDesc}
        canonical={categoryId ? `/category/${categoryId}` : '/shop'}
      />

      <div className="container mx-auto px-4 mb-4">
        <Breadcrumbs items={categoryBreadcrumbs} />
      </div>

      {/* Hero Header for Category or Search */}
      {currentCategory && categoryDetails ? (
        <div className="container mx-auto px-4 mb-8">
          <div className="relative rounded-3xl overflow-hidden shadow-2xl h-[260px] sm:h-[300px]">
            <div className="absolute inset-0 bg-black/60 z-10"></div>
            <img 
              src={categoryDetails.image} 
              alt={currentCategory.name} 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 flex flex-col items-center justify-center z-20 text-white text-center px-4">
              <h1 className="text-2xl md:text-3xl font-extrabold mb-1 drop-shadow-xl text-yellow-400">{currentCategory.name}</h1>
              <p className="text-sm sm:text-base text-white/95 font-semibold drop-shadow-md">{categoryDetails.telugu}</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="container mx-auto px-4 mb-8">
          <div className="relative rounded-3xl overflow-hidden shadow-xl bg-gradient-to-r from-brand-dark via-[#381c10] to-brand-dark py-10 px-6 text-center text-white border border-brand-primary/30">
            <h1 className="text-2xl md:text-3xl font-black mb-2 text-brand-primary">
              {searchQuery ? `Search Results for "${searchQuery}"` : 'All Traditional Delicacies'}
            </h1>
            <p className="text-xs sm:text-sm text-gray-300 max-w-xl mx-auto">
              {searchQuery 
                ? `Showing authentic homemade Telangana products matching "${searchQuery}"` 
                : 'Explore handcrafted pickles, festive sweets, crispy sakinalu snacks, and stone-ground podulu.'}
            </p>
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
                  placeholder="Search sweets, snacks, pickles, podulu..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-11 pr-24 py-3 bg-gray-50/80 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary text-sm sm:text-base transition-all duration-300 placeholder-gray-400 text-brand-dark"
                />
                <div className="absolute right-3 flex items-center gap-1.5">
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      aria-label="Clear search"
                      className="p-1 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-200 transition-colors cursor-pointer"
                    >
                      <X size={16} />
                    </button>
                  )}
                  <span className="hidden sm:inline-block px-2.5 py-1 rounded-full bg-brand-light text-brand-dark font-semibold text-xs border border-gray-200">
                    {filteredProducts.length || matchedInOtherCategories.length} items
                  </span>
                </div>
              </div>
            </div>

            {/* Filter Dropdowns */}
            <div className="flex flex-wrap sm:flex-nowrap gap-3 w-full lg:w-auto justify-end items-center">
              {/* Category Switcher */}
              <div className="relative flex-1 sm:flex-none">
                <select 
                  value={categoryId || 'all'} 
                  onChange={(e) => {
                    const val = e.target.value;
                    if (val === 'all') {
                      navigate('/shop' + (searchQuery ? `?q=${encodeURIComponent(searchQuery)}` : ''));
                    } else {
                      navigate(`/category/${val}` + (searchQuery ? `?q=${encodeURIComponent(searchQuery)}` : ''));
                    }
                  }}
                  className="w-full sm:w-auto px-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:border-brand-primary bg-gray-50/80 text-gray-700 font-semibold text-sm cursor-pointer hover:border-brand-primary transition-colors"
                >
                  <option value="all">All Categories ({products?.length || 0})</option>
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

        {/* Informational banner when matched in other categories */}
        {matchedInOtherCategories.length > 0 && currentCategory && (
          <div className="mb-6 p-4 rounded-2xl bg-amber-50 border border-amber-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-amber-900">
            <div>
              <span className="font-bold">No items found in "{currentCategory.name}".</span>
              <span className="ml-1 text-amber-800">Showing {matchedInOtherCategories.length} matching products from other categories across our kitchen:</span>
            </div>
            <button
              onClick={() => navigate('/shop' + (searchQuery ? `?q=${encodeURIComponent(searchQuery)}` : ''))}
              className="font-bold text-brand-dark underline hover:text-brand-primary cursor-pointer whitespace-nowrap"
            >
              Browse All Categories →
            </button>
          </div>
        )}

        {/* Product Grid */}
        {isLoadingProducts ? (
          <div className="text-center py-20 text-gray-500">Loading premium products...</div>
        ) : (filteredProducts.length > 0 || matchedInOtherCategories.length > 0) ? (
          <motion.div 
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0 },
              visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
            }}
            className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-8"
          >
            {(filteredProducts.length > 0 ? filteredProducts : matchedInOtherCategories).map(product => (
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
            className="text-center py-16 px-4 bg-white rounded-3xl shadow-sm border border-gray-100 max-w-xl mx-auto"
          >
            <div className="w-16 h-16 rounded-2xl bg-amber-50 text-brand-primary mx-auto flex items-center justify-center mb-4">
              <Search size={28} />
            </div>
            <h2 className="text-xl font-bold text-gray-800 mb-2">No products found matching "{searchQuery}"</h2>
            <p className="text-gray-500 text-xs sm:text-sm mb-6">
              Try checking your spelling or explore these popular homemade Telangana favorites:
            </p>
            <div className="flex flex-wrap justify-center gap-2 mb-6">
              {['Sakinalu', 'Gongura', 'Ariselu', 'Avakaya', 'Chicken Pickle', 'Spice Podi'].map(term => (
                <button
                  key={term}
                  onClick={() => setSearchQuery(term)}
                  className="px-3 py-1.5 bg-gray-50 hover:bg-amber-100/70 border border-gray-200 text-gray-700 hover:text-brand-dark rounded-full text-xs font-semibold transition cursor-pointer"
                >
                  {term}
                </button>
              ))}
            </div>
            <div className="flex justify-center gap-3">
              <button 
                onClick={() => setSearchQuery('')}
                className="px-4 py-2 border border-gray-200 text-gray-700 text-xs font-bold rounded-xl hover:bg-gray-100 transition cursor-pointer"
              >
                Clear Search
              </button>
              <Link
                to="/categories"
                className="px-4 py-2 bg-brand-primary text-white text-xs font-bold rounded-xl hover:bg-yellow-600 transition shadow-sm"
              >
                View All Categories
              </Link>
            </div>
          </motion.div>
        )}

      </div>
    </motion.div>
  );
};
