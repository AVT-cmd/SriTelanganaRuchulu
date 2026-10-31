import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Mail, Quote, ArrowRight, Sparkles, ShoppingBag } from 'lucide-react';
import { SEO } from '../components/SEO';
import { generateOrganizationSchema, generateWebSiteSchema } from '../utils/jsonLd';

const heroSlides = [
  {
    id: 1,
    image: "https://sritelanganaruchulu.com/wp-content/uploads/2026/01/ChatGPT-Image-Jan-12-2026-07_51_48-PM.webp",
    title: "The Authentic Taste of Telangana",
    subtitle: "Discover traditional flavours, beloved recipes, and the goodness of Telangana's food heritage."
  },
  {
    id: 2,
    image: "/images/premium_snacks.jpg",
    title: "Fresh & Homemade Pindi Vantalu",
    subtitle: "Crafted with love, premium ingredients, and zero preservatives."
  },
  {
    id: 3,
    image: "/images/premium_shipping.jpg",
    title: "Delivered Across the Globe",
    subtitle: "Experience the magic of your hometown, no matter where you live."
  }
];

const featuredCategories = [
  { id: 1, name: "Veg Pickles", telugu: "కూరగాయల పచ్చళ్ళు", link: "/category/1", count: "11 Products", image: "https://commons.wikimedia.org/wiki/Special:FilePath/Indian-pickle.jpg" },
  { id: 2, name: "Traditional Sweets", telugu: "సాంప్రదాయ మిఠాయిలు", link: "/category/2", count: "21 Products", image: "https://commons.wikimedia.org/wiki/Special:FilePath/Mysore_pak.jpg" },
  { id: 3, name: "Spice Podulu", telugu: "ఘుమఘుమలాడే పొడులు", link: "/category/3", count: "6 Products", image: "https://commons.wikimedia.org/wiki/Special:FilePath/Idli_Podi.jpg" },
  { id: 4, name: "Non Veg Pickles", telugu: "మాంసాహార పచ్చళ్ళు", link: "/category/4", count: "5 Products", image: "https://commons.wikimedia.org/wiki/Special:FilePath/Andhra_Chicken_Pickle.jpg" },
  { id: 5, name: "Hot Snacks & Sakinalu", telugu: "క్రిస్పీ పిండి వంటలు", link: "/category/5", count: "20 Products", image: "https://sritelanganaruchulu.com/wp-content/uploads/2025/12/72.png" }
];

const bestsellers = [
  { id: 2, name: "Gongura Pachadi", slug: "gongura-pachadi", price: 400, regularPrice: 450, category: "Veg Pickles", image: "https://commons.wikimedia.org/wiki/Special:FilePath/Gongura_Pickle.jpg" },
  { id: 60, name: "Karam Sakinalu", slug: "karam-sakinalu", price: 350, regularPrice: 400, category: "Hot Snacks", image: "https://sritelanganaruchulu.com/wp-content/uploads/2025/12/72.png" },
  { id: 14, name: "Kandi Podi", slug: "kandi-podi", price: 400, regularPrice: 450, category: "Podulu", image: "https://commons.wikimedia.org/wiki/Special:FilePath/Idli_Podi.jpg" },
  { id: 5, name: "Badhusha Neyi", slug: "badhusha-neyi", price: 500, regularPrice: 550, category: "Sweets", image: "https://sritelanganaruchulu.com/wp-content/uploads/2025/12/4.png" },
  { id: 21, name: "Chicken Pachadi", slug: "chicken-pachadi", price: 600, regularPrice: 700, category: "Non Veg Pickles", image: "https://commons.wikimedia.org/wiki/Special:FilePath/Andhra_Chicken_Pickle.jpg" },
  { id: 4, name: "Thati Bellam Palli Laddu", slug: "thati-bellam-palli-laddu", price: 500, regularPrice: 550, category: "Sweets", image: "https://sritelanganaruchulu.com/wp-content/uploads/2025/12/31.png" },
  { id: 1, name: "Mixed Vegetable Pachadi", slug: "mixed-vegetable-pachadi", price: 400, regularPrice: 450, category: "Veg Pickles", image: "https://commons.wikimedia.org/wiki/Special:FilePath/Indian-pickle.jpg" },
  { id: 12, name: "Munagaku Podi", slug: "munagaku-podi", price: 600, regularPrice: 650, category: "Podulu", image: "https://commons.wikimedia.org/wiki/Special:FilePath/Chutney_Powder_(Chutney_Pudi).jpg" }
];

export const Home = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Slideshow timer
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="overflow-hidden">
      <SEO
        title="Traditional Pickles & Sweets"
        description="Authentic Telangana & Andhra pickles, handcrafted sweets, crunchy sakinalu, and spice podulu made fresh in Warangal. Order online with express delivery."
        canonical="/"
        jsonLd={[generateOrganizationSchema(), generateWebSiteSchema()]}
      />

      {/* Hero Section Slideshow */}
      <section className="relative h-screen flex items-center justify-center bg-brand-dark text-white overflow-hidden perspective-1000">
        <AnimatePresence>
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 1.2, ease: "easeInOut" }}
            className="absolute inset-0 z-0"
          >
            <div className="absolute inset-0 bg-black/60 z-10" />
            <img
              src={heroSlides[currentSlide].image}
              alt="Sri Telangana Ruchulu Traditional Food"
              className="w-full h-full object-cover"
            />
          </motion.div>
        </AnimatePresence>

        <div className="container mx-auto px-4 relative z-20 text-center">
          <div className="inline-flex items-center gap-2 bg-brand-primary/80 backdrop-blur-md px-4 py-1.5 rounded-full mb-3 text-white text-xs font-bold uppercase tracking-widest shadow-md">
            <Sparkles size={14} className="text-yellow-300" /> Authentic Telangana & Andhra Kitchen
          </div>

          <h1 className="text-3xl md:text-5xl lg:text-6xl font-black text-brand-accent tracking-tight drop-shadow-xl mb-3">
            Sri Telangana Ruchulu
            <span className="block text-lg md:text-2xl font-bold text-white/95 mt-1 font-heading">
              Authentic Traditional Pickles, Sweets &amp; Snacks
            </span>
          </h1>

          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              <h2 className="text-xl md:text-2xl lg:text-3xl font-extrabold text-white mb-3 drop-shadow-md">
                {heroSlides[currentSlide].title}
              </h2>
              <p className="text-xs md:text-base max-w-xl mx-auto mb-8 text-gray-200 drop-shadow-md leading-relaxed font-medium">
                {heroSlides[currentSlide].subtitle}
              </p>
            </motion.div>
          </AnimatePresence>

          <motion.div
            className="flex justify-center gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            <Link to="/categories" className="bg-brand-primary text-white font-bold py-3.5 px-8 text-sm rounded-full hover:bg-yellow-600 transition shadow-[0_0_20px_rgba(209,161,85,0.4)] hover:shadow-[0_0_30px_rgba(209,161,85,0.7)] hover:-translate-y-0.5 transform duration-300 flex items-center gap-2">
              <ShoppingBag size={16} /> Explore All Products
            </Link>
            <Link to="/about" className="bg-transparent border-2 border-brand-accent text-brand-accent font-bold py-3.5 px-8 text-sm rounded-full hover:bg-brand-accent hover:text-brand-dark transition shadow-lg hover:-translate-y-0.5 transform duration-300">
              Our Heritage
            </Link>
          </motion.div>
        </div>

        {/* Slide Indicators */}
        <div className="absolute bottom-8 left-0 right-0 z-20 flex justify-center gap-3">
          {heroSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${currentSlide === index ? "bg-brand-accent w-8" : "bg-white/50 hover:bg-white"
                }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </section>

      {/* SEO INTERNAL LINKS: FEATURED CATEGORIES SECTION */}
      <section className="py-16 md:py-20 bg-white border-b border-gray-100 overflow-hidden" style={{ perspective: 1200 }}>
        <div className="container mx-auto px-4 max-w-7xl">
          <motion.div 
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col md:flex-row md:items-end justify-between mb-10"
          >
            <div>
              <span className="inline-flex items-center gap-1.5 text-[11px] font-black uppercase tracking-widest px-3.5 py-1 rounded-full bg-gradient-to-r from-amber-100 to-amber-200/80 text-[#8B1E0F] border border-amber-300 shadow-2xs mb-2">
                <Sparkles size={13} className="text-amber-700" /> Handcrafted Delicacies
              </span>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-[#260A04] mt-1 tracking-tight">
                Explore Traditional Categories
              </h2>
              <p className="text-[#64260D] font-bold text-xs sm:text-sm mt-1.5 leading-relaxed">
                Fresh batches prepared daily in Warangal with cold-pressed oils &amp; stone-ground spices.
              </p>
            </div>
            <Link to="/categories" className="inline-flex items-center gap-1.5 text-[#8B1E0F] hover:text-amber-800 font-extrabold text-sm mt-3 md:mt-0 transition hover:translate-x-1 group">
              View All Categories <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>

          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: { staggerChildren: 0.1 }
              }
            }}
            className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6"
          >
            {featuredCategories.map((cat, idx) => (
              <motion.div
                key={cat.id}
                variants={{
                  hidden: { opacity: 0, y: 35, rotateX: 10 },
                  visible: { 
                    opacity: 1, 
                    y: 0, 
                    rotateX: 0,
                    transition: { type: "spring", stiffness: 260, damping: 22 }
                  }
                }}
                whileHover={{
                  y: -10,
                  rotateX: 6,
                  rotateY: idx % 2 === 0 ? 5 : -5,
                  scale: 1.04,
                  boxShadow: "0 22px 35px -10px rgba(74, 46, 31, 0.25)",
                  transition: { type: "spring", stiffness: 350, damping: 22 }
                }}
                style={{ transformStyle: "preserve-3d" }}
                className="group relative rounded-2xl overflow-hidden bg-brand-light border border-amber-900/10 shadow-sm transition-all duration-300 flex flex-col"
              >
                <Link to={cat.link} className="flex flex-col h-full">
                  <div className="h-32 sm:h-36 overflow-hidden relative">
                    <img
                      src={cat.image}
                      alt={cat.name}
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full object-cover group-hover:scale-115 transition duration-700 ease-out"
                      onError={(e) => { (e.target as HTMLImageElement).src = '/images/veg_pickles.jpg'; }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent group-hover:from-black/75 transition-all"></div>
                    <span 
                      style={{ transform: "translateZ(30px)" }}
                      className="absolute bottom-2.5 left-2.5 text-[10px] font-bold bg-white/25 backdrop-blur-md text-white px-2.5 py-0.5 rounded-full border border-white/20 shadow-xs"
                    >
                      {cat.count}
                    </span>
                  </div>
                  <div 
                    style={{ transform: "translateZ(20px)" }}
                    className="p-3.5 text-left flex-grow flex flex-col justify-center"
                  >
                    <h3 className="font-extrabold text-sm text-brand-dark group-hover:text-brand-primary transition leading-tight">
                      {cat.name}
                    </h3>
                    <p className="text-[11px] text-amber-950/70 font-medium mt-0.5">{cat.telugu}</p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* SEO INTERNAL LINKS: BESTSELLING PRODUCTS SECTION */}
      <section className="py-16 md:py-20 bg-[#FDFBF7] border-b border-amber-900/10 overflow-hidden" style={{ perspective: 1200 }}>
        <div className="container mx-auto px-4 max-w-7xl">
          <motion.div 
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col md:flex-row md:items-end justify-between mb-10"
          >
            <div>
              <span className="inline-flex items-center gap-1.5 text-[11px] font-black uppercase tracking-widest px-3.5 py-1 rounded-full bg-gradient-to-r from-amber-100 to-amber-200/80 text-[#8B1E0F] border border-amber-300 shadow-2xs mb-2">
                <Sparkles size={13} className="text-amber-700" /> Patron Favorites
              </span>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-[#260A04] mt-1 tracking-tight">
                Authentic Bestsellers &amp; Fresh Batches
              </h2>
              <p className="text-[#64260D] font-bold text-xs sm:text-sm mt-1.5 leading-relaxed">
                Made in Warangal with cold-pressed oil, stone-ground spices &amp; zero preservatives.
              </p>
            </div>
            <Link to="/categories" className="inline-flex items-center gap-1.5 text-[#8B1E0F] hover:text-amber-800 font-extrabold text-sm mt-3 md:mt-0 transition hover:translate-x-1 group">
              Browse Full Catalog <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>

          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.15 }}
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: { staggerChildren: 0.08 }
              }
            }}
            className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6"
          >
            {bestsellers.map((prod, idx) => (
              <motion.div
                key={prod.id}
                variants={{
                  hidden: { opacity: 0, y: 40, rotateX: 8 },
                  visible: { 
                    opacity: 1, 
                    y: 0, 
                    rotateX: 0,
                    transition: { type: "spring", stiffness: 280, damping: 24 }
                  }
                }}
                whileHover={{
                  y: -10,
                  rotateX: 5,
                  rotateY: idx % 2 === 0 ? 4 : -4,
                  scale: 1.03,
                  boxShadow: "0 25px 45px -12px rgba(74, 46, 31, 0.22)",
                  transition: { type: "spring", stiffness: 350, damping: 22 }
                }}
                style={{ transformStyle: "preserve-3d" }}
                className="bg-white rounded-2xl overflow-hidden border border-amber-900/10 shadow-xs transition-all duration-300 flex flex-col group"
              >
                <Link to={`/product/${prod.slug}`} className="block relative h-40 sm:h-48 overflow-hidden bg-gray-50">
                  <img
                    src={prod.image}
                    alt={prod.name}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover group-hover:scale-110 transition duration-700 ease-out"
                    onError={(e) => { (e.target as HTMLImageElement).src = '/images/premium_snacks.jpg'; }}
                  />
                  <span 
                    style={{ transform: "translateZ(35px)" }}
                    className="absolute top-2.5 right-2.5 bg-green-600 text-white text-[10px] font-extrabold px-2.5 py-0.5 rounded-full shadow-md animate-pulse"
                  >
                    In Stock
                  </span>
                  <span 
                    style={{ transform: "translateZ(25px)" }}
                    className="absolute bottom-2.5 left-2.5 text-[10px] font-bold bg-black/65 backdrop-blur-xs text-white px-2.5 py-0.5 rounded-md border border-white/10"
                  >
                    {prod.category}
                  </span>
                </Link>

                <div 
                  style={{ transform: "translateZ(20px)" }}
                  className="p-4 flex flex-col flex-grow"
                >
                  <h3 className="font-extrabold text-sm sm:text-base text-brand-dark group-hover:text-brand-primary transition line-clamp-1">
                    <Link to={`/product/${prod.slug}`}>{prod.name}</Link>
                  </h3>

                  <div className="flex items-center gap-1.5 text-yellow-500 text-xs mt-1">
                    <Star fill="currentColor" size={12} />
                    <Star fill="currentColor" size={12} />
                    <Star fill="currentColor" size={12} />
                    <Star fill="currentColor" size={12} />
                    <Star fill="currentColor" size={12} />
                    <span className="text-[#5c3a21] text-[10px] ml-0.5 font-bold">(4.9)</span>
                  </div>

                  <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between">
                    <div>
                      <span className="text-base sm:text-lg font-black text-brand-dark">₹{prod.price}</span>
                      <span className="text-xs text-gray-400 line-through ml-1.5 font-medium">₹{prod.regularPrice}</span>
                    </div>
                    <Link
                      to={`/product/${prod.slug}`}
                      className="bg-brand-primary text-white hover:bg-yellow-600 text-xs font-bold px-3.5 py-1.5 rounded-xl transition shadow-xs hover:shadow-md hover:scale-105 transform active:scale-95"
                    >
                      View
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* 3D Value Proposition Section */}
      <section className="py-16 md:py-24 bg-white overflow-hidden" style={{ perspective: 1200 }}>
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-14"
          >
            <span className="inline-block text-[11px] font-black uppercase tracking-widest px-3 py-1 rounded-full bg-amber-100 text-[#8B1E0F] border border-amber-200 shadow-2xs mb-2">
              Uncompromising Quality
            </span>
            <h2 className="text-2xl md:text-3xl font-black text-brand-dark mb-2">Why Choose Sri Telangana Ruchulu?</h2>
            <p className="text-[#3E1F11] font-semibold text-xs sm:text-sm max-w-xl mx-auto leading-relaxed">
              Experience the pinnacle of traditional culinary excellence with our carefully curated processes.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: "👵", title: "Generational Recipes", desc: "Authentic formulas passed down through families, preserving the exact taste of the past." },
              { icon: "🌿", title: "Premium Ingredients", desc: "Zero compromises on quality. We use only the finest spices, cold-pressed oils, and farm grains." },
              { icon: "📦", title: "Global Delivery", desc: "Vacuum-sealed for ultimate freshness and shipped worldwide directly to your doorstep." }
            ].map((feature, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 40, rotateX: 10 }}
                whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.8, delay: idx * 0.15, type: "spring", stiffness: 220 }}
                whileHover={{
                  scale: 1.05,
                  rotateX: 8,
                  rotateY: idx === 0 ? 8 : idx === 2 ? -8 : 0,
                  y: -8,
                  boxShadow: "0 30px 60px -15px rgba(209, 161, 85, 0.3)"
                }}
                className="bg-gradient-to-b from-brand-light to-amber-50/40 p-8 rounded-3xl text-center shadow-sm border border-amber-900/10 transition-all duration-300 relative group overflow-hidden"
                style={{ transformStyle: "preserve-3d" }}
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-brand-primary/10 rounded-full blur-2xl group-hover:bg-brand-primary/20 transition-all"></div>
                
                <motion.div
                  animate={{ y: [0, -4, 0] }}
                  transition={{ repeat: Infinity, duration: 3.5, ease: "easeInOut", delay: idx * 0.5 }}
                  className="w-20 h-20 bg-gradient-to-br from-brand-primary to-yellow-600 text-white rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl border-2 border-white/50"
                  style={{ transform: "translateZ(45px)" }}
                >
                  <span className="text-3xl filter drop-shadow-md">{feature.icon}</span>
                </motion.div>
                <h3 className="text-lg md:text-xl font-black mb-3 text-brand-dark" style={{ transform: "translateZ(25px)" }}>
                  {feature.title}
                </h3>
                <p className="text-[#3E1F11] font-medium text-xs sm:text-sm leading-relaxed" style={{ transform: "translateZ(15px)" }}>
                  {feature.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* About the Brand / History Section */}
      <section className="py-24 bg-brand-light relative overflow-hidden" style={{ perspective: 1200 }}>
        <div className="absolute top-0 right-0 w-96 h-96 bg-brand-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-brand-primary/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/3"></div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="inline-block text-[11px] font-black uppercase tracking-widest px-3 py-1 rounded-full bg-amber-100 text-[#8B1E0F] border border-amber-200 shadow-2xs mb-2">
              Our Heritage
            </span>
            <h3 className="text-2xl md:text-4xl font-black text-brand-dark mb-3 leading-tight tracking-tight">
              A Culinary Journey Back in Time
            </h3>
            <div className="w-20 h-1.5 bg-brand-primary mx-auto rounded-full"></div>
          </div>

          <div className="flex flex-col lg:flex-row gap-12 items-center">
            {/* Image Grid with 3D Tilt */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.8, type: "spring" }}
              className="lg:w-1/2 grid grid-cols-2 gap-4 relative"
              style={{ transformStyle: "preserve-3d" }}
            >
              <div className="flex flex-col gap-4 mt-6">
                <motion.div 
                  whileHover={{ rotate: 0, scale: 1.04, y: -4 }}
                  className="rounded-2xl overflow-hidden shadow-xl border-2 border-white transform -rotate-2 transition-transform duration-300"
                >
                  <img
                    src="/images/veg_pickles.jpg"
                    alt="Ancient Stone Grinding"
                    className="object-cover aspect-square max-h-48 w-full"
                  />
                </motion.div>
                <motion.div 
                  whileHover={{ scale: 1.04, y: -4 }}
                  className="bg-gradient-to-br from-brand-primary to-yellow-600 text-white p-6 rounded-2xl shadow-xl flex flex-col justify-center items-center text-center border-2 border-amber-200/50"
                  style={{ transform: "translateZ(30px)" }}
                >
                  <span className="text-3xl sm:text-4xl font-black mb-1 drop-shadow-md">25+</span>
                  <span className="font-extrabold uppercase tracking-wider text-xs">Years of Traditional Legacy</span>
                </motion.div>
              </div>
              <div className="flex flex-col gap-4">
                <motion.div 
                  whileHover={{ rotate: 0, scale: 1.04, y: -4 }}
                  className="rounded-2xl overflow-hidden shadow-xl border-2 border-white transform rotate-2 transition-transform duration-300"
                >
                  <img
                    src="/images/premium_snacks.jpg"
                    alt="Telangana Spices"
                    className="object-cover h-48 w-full"
                  />
                </motion.div>
                <motion.div 
                  whileHover={{ scale: 1.04, y: -4 }}
                  className="rounded-2xl overflow-hidden shadow-xl border-2 border-white transition-transform duration-300"
                >
                  <img
                    src="/images/premium_shipping.jpg"
                    alt="Traditional Cooking"
                    className="object-cover h-36 w-full"
                  />
                </motion.div>
              </div>
            </motion.div>

            {/* Historical Text Content */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.8, type: "spring" }}
              className="lg:w-1/2"
            >
              <h4 className="text-xl md:text-2xl font-black text-brand-dark mb-3">The Golden Era of Telangana Cuisine</h4>
              <p className="text-gray-700 text-sm mb-4 leading-relaxed font-medium">
                The roots of Sri Telangana Ruchulu stretch back to an era where cooking was not just a chore, but a deeply revered art form. Influenced by the rich cultural tapestry of the <strong>Kakatiya dynasty</strong> and the historic spice routes of the Deccan Plateau, our recipes carry the soul of ancient India.
              </p>
              <p className="text-gray-700 text-sm mb-4 leading-relaxed font-medium">
                In the old days, our grandmothers would wake up before dawn to hand-pound spices in a traditional stone <em>'Rolu'</em> (mortar). Red chilies were sun-dried on vast rooftops, and pure sesame oil was pressed in wooden mills. These slow, deliberate methods are what gave Telangana's <strong>Pindi Vantalu</strong> (snacks) and <strong>Pachadlu</strong> (pickles) their legendary fiery, robust, and earthy flavors.
              </p>
              <ul className="space-y-3 mb-6">
                {[
                  "Authentic Stone-Ground Spices & Zero Chemical Additives",
                  "Sun-Dried Ingredients for Natural Longevity",
                  "Pure Cold-Pressed Gingelly & Sesame Oils",
                  "Handcrafted in Fresh Warangal Batches Daily"
                ].map((item, i) => (
                  <motion.li 
                    key={i} 
                    whileHover={{ x: 6 }}
                    className="flex items-center text-brand-dark font-bold text-xs sm:text-sm transition-transform"
                  >
                    <div className="w-5 h-5 rounded-full bg-brand-primary/20 flex items-center justify-center mr-2.5 text-brand-primary text-xs flex-shrink-0">
                      ✓
                    </div>
                    {item}
                  </motion.li>
                ))}
              </ul>

              <Link to="/about" className="inline-flex items-center gap-2 bg-brand-dark text-white font-bold py-3.5 px-7 text-sm rounded-full hover:bg-brand-primary transition shadow-xl hover:shadow-2xl hover:-translate-y-1 transform group">
                Discover Our Full History
                <Star size={16} className="text-yellow-400 group-hover:rotate-180 transition duration-500" />
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Bulk Orders Section */}
      <section className="py-16 md:py-24 bg-brand-dark text-white relative overflow-hidden" style={{ perspective: 1200 }}>
        <div className="absolute top-0 right-0 w-96 h-96 bg-brand-accent/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-brand-primary/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 pointer-events-none"></div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col lg:flex-row gap-12 items-center">

            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.8, type: "spring" }}
              className="lg:w-1/2"
            >
              <span className="inline-block text-[11px] font-black uppercase tracking-widest px-3 py-1 rounded-full bg-amber-500/20 text-brand-accent border border-brand-accent/30 shadow-2xs mb-2">
                Special Occasions & Corporate
              </span>
              <h3 className="text-2xl md:text-4xl font-black text-brand-accent mb-4 leading-tight">
                We Accept Bulk & Corporate Orders
              </h3>
              <p className="text-gray-200 text-sm mb-4 leading-relaxed font-medium">
                Make your weddings, corporate events, and family gatherings unforgettable with our authentic Telangana delicacies. We specialize in curating premium, hand-crafted bulk orders tailored to your specific event needs.
              </p>
              <ul className="space-y-3 mb-8">
                {[
                  "Customized Wedding Hampers & Sweet Boxes",
                  "Corporate Gifting & International Courier Support",
                  "Festival & Bulk Party Orders at Wholesale Rates",
                  "Freshly Prepared Batches with Custom Packaging"
                ].map((item, i) => (
                  <motion.li 
                    key={i} 
                    whileHover={{ x: 6 }}
                    className="flex items-center font-bold text-gray-100 text-xs sm:text-sm transition-transform"
                  >
                    <div className="w-5 h-5 rounded-full bg-brand-primary/30 flex items-center justify-center mr-2.5 text-brand-accent text-xs flex-shrink-0">
                      ✓
                    </div>
                    {item}
                  </motion.li>
                ))}
              </ul>
              <motion.a
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.98 }}
                href="https://wa.me/918121345585?text=Hello!%20I%20am%20interested%20in%20placing%20a%20bulk%20order."
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2.5 bg-brand-primary text-white font-black py-4 px-8 text-sm rounded-full hover:bg-brand-accent hover:text-brand-dark transition shadow-[0_0_25px_rgba(209,161,85,0.5)]"
              >
                <Mail size={18} />
                Enquire for Bulk Order
              </motion.a>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.8, type: "spring" }}
              className="lg:w-1/2 grid grid-cols-2 gap-4"
              style={{ transformStyle: "preserve-3d" }}
            >
              <motion.img
                whileHover={{ scale: 1.05, rotate: -1 }}
                src="https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&q=80&w=800"
                alt="Indian Sweets Bulk"
                onError={(e) => { (e.target as HTMLImageElement).src = '/images/premium_snacks.jpg'; }}
                className="rounded-2xl shadow-xl object-cover h-48 w-full border border-white/10 transition-transform"
              />
              <motion.img
                whileHover={{ scale: 1.05, rotate: 1 }}
                src="/images/premium_snacks.jpg"
                alt="Traditional Event Snacks"
                onError={(e) => { (e.target as HTMLImageElement).src = '/images/premium_snacks.jpg'; }}
                className="rounded-2xl shadow-xl object-cover h-48 w-full border border-white/10 translate-y-4 transition-transform"
              />
              <motion.img
                whileHover={{ scale: 1.05, rotate: 1 }}
                src="https://images.unsplash.com/photo-1505253758473-96b7015fcd40?auto=format&fit=crop&q=80&w=800"
                alt="Spices and Ingredients"
                onError={(e) => { (e.target as HTMLImageElement).src = '/images/veg_pickles.jpg'; }}
                className="rounded-2xl shadow-xl object-cover h-48 w-full border border-white/10 -translate-y-4 transition-transform"
              />
              <motion.img
                whileHover={{ scale: 1.05, rotate: -1 }}
                src="/images/veg_pickles.jpg"
                alt="Festive Treats and Pickles"
                onError={(e) => { (e.target as HTMLImageElement).src = '/images/premium_snacks.jpg'; }}
                className="rounded-2xl shadow-xl object-cover h-48 w-full border border-white/10 transition-transform"
              />
            </motion.div>

          </div>
        </div>
      </section>

      {/* Testimonials / Community Reviews */}
      <section className="py-16 md:py-24 bg-white overflow-hidden" style={{ perspective: 1200 }}>
        <div className="container mx-auto px-4 max-w-7xl">
          <motion.div 
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-14"
          >
            <span className="inline-block text-[11px] font-black uppercase tracking-widest px-3 py-1 rounded-full bg-amber-100 text-[#8B1E0F] border border-amber-200 shadow-2xs mb-2">
              Customer Love
            </span>
            <h2 className="text-2xl md:text-3xl font-black text-brand-dark mb-2">
              What Our <span className="text-brand-primary">Community</span> Says
            </h2>
            <p className="text-[#3E1F11] font-semibold text-xs sm:text-sm max-w-xl mx-auto leading-relaxed">
              Join thousands of families across the globe who trust us for their authentic cravings.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {[
              { name: "Priya Sharma", loc: "Hyderabad", text: "The Sakinalu are absolutely divine! They taste exactly like the ones my grandmother used to make. So glad I found an authentic source." },
              { name: "Rajesh Kumar", loc: "Bangalore", text: "Their Gongura pickle is the best I have ever had. The quality of oil and spices is evident. No preservatives makes it even better." },
              { name: "Anjali Reddy", loc: "USA", text: "Ordering these snacks to the US has been a blessing. Vacuum packed perfectly, keeping them fresh and crunchy. Highly recommended!" }
            ].map((review, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 35, rotateX: 8 }}
                whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ delay: idx * 0.15, type: "spring", stiffness: 240 }}
                whileHover={{ 
                  y: -10, 
                  rotateX: 5, 
                  rotateY: idx === 0 ? 4 : idx === 2 ? -4 : 0, 
                  scale: 1.03,
                  boxShadow: "0 25px 45px -12px rgba(74, 46, 31, 0.18)"
                }}
                style={{ transformStyle: "preserve-3d" }}
                className="bg-gradient-to-b from-gray-50 to-amber-50/20 p-8 rounded-3xl relative border border-amber-900/10 shadow-sm transition-all duration-300 flex flex-col justify-between"
              >
                <div style={{ transform: "translateZ(25px)" }} className="relative z-10">
                  <Quote className="absolute -top-2 -right-2 text-amber-200/50" size={56} />
                  <div className="flex gap-1 text-yellow-400 mb-4">
                    <Star fill="currentColor" size={16} /><Star fill="currentColor" size={16} /><Star fill="currentColor" size={16} /><Star fill="currentColor" size={16} /><Star fill="currentColor" size={16} />
                  </div>
                  <p className="text-gray-800 text-xs sm:text-sm mb-6 italic leading-relaxed font-medium">"{review.text}"</p>
                </div>
                <div style={{ transform: "translateZ(15px)" }} className="flex flex-col relative z-10 pt-3 border-t border-amber-900/10">
                  <span className="font-black text-brand-dark text-sm">{review.name}</span>
                  <span className="text-xs text-amber-950/70 font-semibold">{review.loc}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
};
