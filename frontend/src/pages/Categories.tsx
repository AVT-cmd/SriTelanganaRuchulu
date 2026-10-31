import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { getCategories } from '../api';
import { SEO } from '../components/SEO';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { motion } from 'framer-motion';
import { LayoutGrid, Sparkles, ArrowRight } from 'lucide-react';
import { getCategoryDetails } from '../utils/categoryData';

export const Categories = () => {
  const { data: categories, isLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: getCategories,
  });

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen pt-28 sm:pt-32 pb-16 bg-[#FDFBF7]"
      style={{ perspective: 1200 }}
    >
      <SEO
        title="Browse All Categories - Traditional Pickles, Sweets & Snacks"
        description="Explore our full collection of authentic Telangana & Andhra pickles, handcrafted festive sweets, spicy podulu, and crunchy traditional hot snacks."
        canonical="/categories"
      />

      <div className="container mx-auto px-4 max-w-7xl">
        <Breadcrumbs items={[{ name: 'Categories', url: '/categories' }]} className="mb-6" />
        
        {/* Header Section */}
        <div className="mb-12 text-center">
          <motion.div
            initial={{ y: -15, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-amber-100 text-[#8B1E0F] border border-amber-200 shadow-2xs font-black text-xs uppercase tracking-widest mb-3">
              <Sparkles size={14} className="text-amber-700" />
              Handcrafted Heritage Collections
            </span>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#2A0800] tracking-tight flex items-center justify-center gap-3">
              <LayoutGrid className="text-brand-primary" size={32} />
              Explore Categories
            </h1>
          </motion.div>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="text-[#5c3a21] font-semibold text-sm sm:text-base max-w-2xl mx-auto mt-2 leading-relaxed"
          >
            Discover our premium selection of authentic Telangana foods, made with cold-pressed oils, stone-ground spices & zero preservatives.
          </motion.p>
        </div>

        {isLoading ? (
          <div className="text-center py-20 text-[#5c3a21] font-semibold text-sm">
            <div className="w-8 h-8 border-4 border-brand-primary border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
            Loading premium collections...
          </div>
        ) : (
          <motion.div 
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0 },
              visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
            }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8"
          >
            {categories?.map((category, idx) => {
              const details = getCategoryDetails(category.name);
              return (
                <motion.div
                  key={category.id}
                  variants={{
                    hidden: { opacity: 0, y: 35, rotateX: 8 },
                    visible: { 
                      opacity: 1, 
                      y: 0, 
                      rotateX: 0,
                      transition: { type: "spring", stiffness: 260, damping: 22 }
                    }
                  }}
                  whileHover={{ 
                    scale: 1.03, 
                    y: -8,
                    rotateX: 4,
                    rotateY: idx % 2 === 0 ? 3 : -3,
                    boxShadow: "0 25px 45px -12px rgba(74, 46, 31, 0.22)"
                  }}
                  style={{ transformStyle: "preserve-3d" }}
                  className="group cursor-pointer rounded-3xl overflow-hidden bg-white border border-amber-900/10 hover:border-amber-400 shadow-md transition-all duration-300 flex flex-col"
                >
                  <Link to={`/category/${category.id}`} className="block flex flex-col h-full">
                    {/* Category Image Container */}
                    <div className="h-52 sm:h-64 overflow-hidden relative flex items-center justify-center bg-gray-100">
                      <img 
                        src={details.image} 
                        alt={category.name} 
                        className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                        onError={(e) => { (e.target as HTMLImageElement).src = '/images/premium_snacks.jpg'; }}
                      />
                      {/* Gradient for text contrast */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent group-hover:from-black/75 transition-colors duration-300"></div>
                      
                      {/* Fresh Batch Pill */}
                      <span 
                        style={{ transform: "translateZ(30px)" }}
                        className="absolute top-3.5 right-3.5 text-[11px] font-black bg-white/20 backdrop-blur-md text-amber-200 px-3 py-1 rounded-full border border-white/25 shadow-sm"
                      >
                        Fresh Batches
                      </span>

                      {/* Floating Text Overlay Inside Image */}
                      <div 
                        style={{ transform: "translateZ(25px)" }}
                        className="absolute bottom-0 left-0 right-0 p-5 sm:p-6 text-left"
                      >
                        <h2 className="text-2xl sm:text-3xl font-black text-white drop-shadow-md leading-tight mb-0.5">
                          {category.name}
                        </h2>
                        <h3 className="text-sm sm:text-base text-amber-300 font-extrabold drop-shadow-sm mb-2">
                          {details.telugu}
                        </h3>
                        <p className="text-xs text-gray-200 line-clamp-1 opacity-90 mb-3 font-medium">
                          {details.description}
                        </p>
                        <span className="inline-flex items-center gap-1.5 text-white font-extrabold bg-gradient-to-r from-amber-600 to-amber-700 group-hover:from-amber-500 group-hover:to-yellow-600 px-4 py-1.5 rounded-full text-xs shadow-md transition-all">
                          View Products <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                        </span>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};
