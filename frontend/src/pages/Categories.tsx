import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { getCategories } from '../api';
import { SEO } from '../components/SEO';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { motion } from 'framer-motion';
import { LayoutGrid } from 'lucide-react';
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
      className="min-h-screen pt-32 pb-12"
    >
      <SEO
        title="Browse All Categories - Traditional Pickles, Sweets & Snacks"
        description="Explore our full collection of authentic Telangana & Andhra pickles, handcrafted festive sweets, spicy podulu, and crunchy traditional hot snacks."
        canonical="/categories"
      />

      <div className="container mx-auto px-4 max-w-7xl">
        <Breadcrumbs items={[{ name: 'Categories', url: '/categories' }]} className="mb-4" />
        <div className="mb-12 text-center">
          <motion.h1 
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-2xl md:text-3xl font-bold text-brand-dark flex items-center justify-center gap-3 mb-2"
          >
            <LayoutGrid className="text-brand-primary" size={28} />
            Explore Categories
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-gray-600 text-sm max-w-xl mx-auto"
          >
            Discover our premium selection of authentic Telangana products, meticulously categorized for your convenience.
          </motion.p>
        </div>

        {isLoading ? (
          <div className="text-center py-20 text-gray-500 text-sm">Loading premium collections...</div>
        ) : (
          <motion.div 
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0 },
              visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
            }}
            className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-3 sm:gap-6"
          >
            {categories?.map((category) => {
              const details = getCategoryDetails(category.name);
              return (
                <motion.div
                  key={category.id}
                  variants={{
                    hidden: { opacity: 0, y: 30, scale: 0.95 },
                    visible: { opacity: 1, y: 0, scale: 1 }
                  }}
                  whileHover={{ scale: 1.03, translateY: -6 }}
                  className="group cursor-pointer"
                >
                  <Link to={`/category/${category.id}`} className="block">
                    <div className="h-36 sm:h-56 rounded-xl sm:rounded-2xl shadow-md overflow-hidden relative flex items-center justify-center bg-gray-900">
                      <img 
                        src={details.image} 
                        alt={category.name} 
                        className="absolute inset-0 w-full h-full object-cover opacity-70 group-hover:opacity-40 transition duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                      
                      <div className="relative z-10 text-center p-2 sm:p-5 transform group-hover:scale-105 transition duration-500 w-full flex flex-col items-center justify-center h-full pt-6 sm:pt-0">
                        <h2 className="text-lg sm:text-2xl font-bold text-white mb-0.5 drop-shadow-md leading-tight">{category.name}</h2>
                        <h3 className="text-xs sm:text-base text-brand-accent font-semibold mb-2 drop-shadow-sm">{details.telugu}</h3>
                        <span className="text-white/95 font-semibold bg-brand-primary/80 px-3 py-1 rounded-full text-xs inline-block shadow-sm group-hover:bg-brand-primary transition">
                          View
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
