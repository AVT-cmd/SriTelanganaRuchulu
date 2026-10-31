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
  { id: 1, name: "Veg Pickles", telugu: "కూరగాయల పచ్చళ్ళు", link: "/category/1", count: "11 Products", image: "/images/veg_pickles.jpg" },
  { id: 2, name: "Traditional Sweets", telugu: "సాంప్రదాయ మిఠాయిలు", link: "/category/2", count: "21 Products", image: "https://sritelanganaruchulu.com/wp-content/uploads/2025/12/4.png" },
  { id: 3, name: "Spice Podulu", telugu: "ఘుమఘుమలాడే పొడులు", link: "/category/3", count: "6 Products", image: "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&q=80&w=800" },
  { id: 4, name: "Non Veg Pickles", telugu: "మాంసాహార పచ్చళ్ళు", link: "/category/4", count: "5 Products", image: "https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&q=80&w=800" },
  { id: 5, name: "Hot Snacks & Sakinalu", telugu: "క్రిస్పీ పిండి వంటలు", link: "/category/5", count: "20 Products", image: "/images/premium_snacks.jpg" }
];

const bestsellers = [
  { id: 2, name: "Gongura Pachadi", slug: "gongura-pachadi", price: 400, regularPrice: 450, category: "Veg Pickles", image: "https://images.unsplash.com/photo-1606471191009-63994c53433b?auto=format&fit=crop&q=80&w=800" },
  { id: 60, name: "Karam Sakinalu", slug: "karam-sakinalu", price: 350, regularPrice: 400, category: "Hot Snacks", image: "https://sritelanganaruchulu.com/wp-content/uploads/2025/12/72.png" },
  { id: 14, name: "Kandi Podi", slug: "kandi-podi", price: 400, regularPrice: 450, category: "Podulu", image: "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&q=80&w=800" },
  { id: 5, name: "Badhusha Neyi", slug: "badhusha-neyi", price: 500, regularPrice: 550, category: "Sweets", image: "https://sritelanganaruchulu.com/wp-content/uploads/2025/12/4.png" },
  { id: 21, name: "Chicken Pachadi", slug: "chicken-pachadi", price: 600, regularPrice: 700, category: "Non Veg Pickles", image: "https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&q=80&w=800" },
  { id: 4, name: "Thati Bellam Palli Laddu", slug: "thati-bellam-palli-laddu", price: 500, regularPrice: 550, category: "Sweets", image: "https://sritelanganaruchulu.com/wp-content/uploads/2025/12/31.png" },
  { id: 1, name: "Mixed Vegetable Pachadi", slug: "mixed-vegetable-pachadi", price: 400, regularPrice: 450, category: "Veg Pickles", image: "https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&q=80&w=800" },
  { id: 12, name: "Munagaku Podi", slug: "munagaku-podi", price: 600, regularPrice: 650, category: "Podulu", image: "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&q=80&w=800" }
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
      <section className="py-16 bg-white border-b border-gray-100">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10">
            <div>
              <span className="text-xs font-bold text-brand-primary uppercase tracking-widest">Handcrafted Delicacies</span>
              <h2 className="text-2xl md:text-3xl font-black text-brand-dark mt-1">Explore Traditional Categories</h2>
              <p className="text-gray-500 text-xs sm:text-sm mt-1">Fresh batches prepared in Warangal with pure traditional ingredients.</p>
            </div>
            <Link to="/categories" className="inline-flex items-center gap-1.5 text-brand-primary hover:text-yellow-700 font-bold text-sm mt-3 md:mt-0 transition">
              View All Categories <ArrowRight size={16} />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {featuredCategories.map((cat) => (
              <Link
                key={cat.id}
                to={cat.link}
                className="group relative rounded-2xl overflow-hidden bg-brand-light border border-gray-100 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col hover:-translate-y-1"
              >
                <div className="h-32 sm:h-36 overflow-hidden relative">
                  <img
                    src={cat.image}
                    alt={cat.name}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
                    onError={(e) => { (e.target as HTMLImageElement).src = '/images/veg_pickles.jpg'; }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                  <span className="absolute bottom-2 left-2 text-[10px] font-bold bg-white/20 backdrop-blur-xs text-white px-2 py-0.5 rounded-full">
                    {cat.count}
                  </span>
                </div>
                <div className="p-3 text-left">
                  <h3 className="font-extrabold text-sm text-brand-dark group-hover:text-brand-primary transition leading-tight">
                    {cat.name}
                  </h3>
                  <p className="text-[11px] text-gray-500 font-medium mt-0.5">{cat.telugu}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* SEO INTERNAL LINKS: BESTSELLING PRODUCTS SECTION */}
      <section className="py-16 bg-brand-light/60">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10">
            <div>
              <span className="text-xs font-bold text-brand-primary uppercase tracking-widest">Patron Favorites</span>
              <h2 className="text-2xl md:text-3xl font-black text-brand-dark mt-1">Authentic Bestsellers &amp; Fresh Batches</h2>
              <p className="text-gray-500 text-xs sm:text-sm mt-1">Made in Warangal with cold-pressed oil, stone-ground spices &amp; zero preservatives.</p>
            </div>
            <Link to="/categories" className="inline-flex items-center gap-1.5 text-brand-primary hover:text-yellow-700 font-bold text-sm mt-3 md:mt-0 transition">
              Browse Full Catalog <ArrowRight size={16} />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {bestsellers.map((prod) => (
              <div
                key={prod.id}
                className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col group hover:-translate-y-1"
              >
                <Link to={`/product/${prod.slug}`} className="block relative h-40 sm:h-48 overflow-hidden bg-gray-50">
                  <img
                    src={prod.image}
                    alt={prod.name}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                    onError={(e) => { (e.target as HTMLImageElement).src = '/images/premium_snacks.jpg'; }}
                  />
                  <span className="absolute top-2.5 right-2.5 bg-green-600 text-white text-[10px] font-extrabold px-2 py-0.5 rounded-full shadow-xs">
                    In Stock
                  </span>
                  <span className="absolute bottom-2 left-2 text-[10px] font-bold bg-black/60 text-white px-2 py-0.5 rounded-md">
                    {prod.category}
                  </span>
                </Link>

                <div className="p-4 flex flex-col flex-grow">
                  <h3 className="font-extrabold text-sm sm:text-base text-brand-dark group-hover:text-brand-primary transition line-clamp-1">
                    <Link to={`/product/${prod.slug}`}>{prod.name}</Link>
                  </h3>

                  <div className="flex items-center gap-1.5 text-yellow-500 text-xs mt-1">
                    <Star fill="currentColor" size={12} />
                    <Star fill="currentColor" size={12} />
                    <Star fill="currentColor" size={12} />
                    <Star fill="currentColor" size={12} />
                    <Star fill="currentColor" size={12} />
                    <span className="text-gray-400 text-[10px] ml-0.5">(4.9)</span>
                  </div>

                  <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between">
                    <div>
                      <span className="text-base sm:text-lg font-black text-brand-dark">₹{prod.price}</span>
                      <span className="text-xs text-gray-400 line-through ml-1.5 font-medium">₹{prod.regularPrice}</span>
                    </div>
                    <Link
                      to={`/product/${prod.slug}`}
                      className="bg-brand-primary text-white hover:bg-yellow-600 text-xs font-bold px-3 py-1.5 rounded-xl transition shadow-xs"
                    >
                      View
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3D Value Proposition Section */}
      <section className="py-16 md:py-20 bg-white overflow-hidden">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-2xl md:text-3xl font-bold text-brand-dark mb-2">Why Choose Sri Telangana Ruchulu?</h2>
            <p className="text-gray-600 text-sm max-w-xl mx-auto">Experience the pinnacle of traditional culinary excellence with our carefully curated processes.</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: "👵", title: "Generational Recipes", desc: "Authentic formulas passed down through families, preserving the exact taste of the past." },
              { icon: "🌿", title: "Premium Ingredients", desc: "Zero compromises on quality. We use only the finest spices, oils, and grains." },
              { icon: "📦", title: "Global Delivery", desc: "Vacuum-sealed for ultimate freshness and shipped worldwide directly to your door." }
            ].map((feature, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: idx === 0 ? -50 : idx === 2 ? 50 : 0, y: idx === 1 ? 50 : 0 }}
                whileInView={{ opacity: 1, x: 0, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, type: "spring" }}
                whileHover={{
                  scale: 1.03,
                  rotateY: idx === 0 ? 10 : idx === 2 ? -10 : 0,
                  boxShadow: "0 20px 40px -12px rgba(0, 0, 0, 0.15)"
                }}
                className="bg-brand-light p-8 rounded-2xl text-center transform transition-transform duration-300 shadow-sm border border-gray-100"
                style={{ transformStyle: "preserve-3d", perspective: 1000 }}
              >
                <div
                  className="w-16 h-16 bg-brand-primary text-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-md"
                  style={{ transform: "translateZ(30px)" }}
                >
                  <span className="text-3xl">{feature.icon}</span>
                </div>
                <h3 className="text-lg md:text-xl font-bold mb-2 text-brand-dark" style={{ transform: "translateZ(20px)" }}>{feature.title}</h3>
                <p className="text-gray-600 text-xs sm:text-sm leading-relaxed" style={{ transform: "translateZ(10px)" }}>{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* About the Brand / History Section */}
      <section className="py-24 bg-brand-light relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-brand-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-brand-primary/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/3"></div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-xs font-bold text-brand-primary uppercase tracking-widest mb-2">Our Heritage</h2>
            <h3 className="text-2xl md:text-3xl font-bold text-brand-dark mb-3 leading-tight">A Culinary Journey Back in Time</h3>
            <div className="w-16 h-1 bg-brand-primary mx-auto rounded-full"></div>
          </div>

          <div className="flex flex-col lg:flex-row gap-12 items-center">
            {/* Image Grid */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="lg:w-1/2 grid grid-cols-2 gap-4 relative"
            >
              <div className="flex flex-col gap-4 mt-6">
                <img
                  src="/images/veg_pickles.jpg"
                  alt="Ancient Stone Grinding"
                  className="rounded-2xl shadow-lg border-2 border-white object-cover aspect-square max-h-48"
                />
                <div className="bg-brand-primary text-white p-5 rounded-2xl shadow-lg flex flex-col justify-center items-center text-center">
                  <span className="text-3xl font-extrabold mb-1">25+</span>
                  <span className="font-semibold uppercase tracking-wider text-xs">Years of Traditional Legacy</span>
                </div>
              </div>
              <div className="flex flex-col gap-4">
                <img
                  src="/images/premium_snacks.jpg"
                  alt="Telangana Spices"
                  className="rounded-2xl shadow-lg border-2 border-white object-cover h-48 w-full"
                />
                <img
                  src="/images/premium_shipping.jpg"
                  alt="Traditional Cooking"
                  className="rounded-2xl shadow-lg border-2 border-white object-cover h-36 w-full"
                />
              </div>
            </motion.div>

            {/* Historical Text Content */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="lg:w-1/2"
            >
              <h4 className="text-xl md:text-2xl font-bold text-brand-dark mb-3">The Golden Era of Telangana Cuisine</h4>
              <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                The roots of Sri Telangana Ruchulu stretch back to an era where cooking was not just a chore, but a deeply revered art form. Influenced by the rich cultural tapestry of the <strong>Kakatiya dynasty</strong> and the historic spice routes of the Deccan Plateau, our recipes carry the soul of ancient India.
              </p>
              <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                In the old days, our grandmothers would wake up before dawn to hand-pound spices in a traditional stone <em>'Rolu'</em> (mortar). Red chilies were sun-dried on vast rooftops, and pure sesame oil was pressed in wooden mills. These slow, deliberate methods are what gave Telangana's <strong>Pindi Vantalu</strong> (snacks) and <strong>Pachadlu</strong> (pickles) their legendary fiery, robust, and earthy flavors.
              </p>
              <ul className="space-y-3 mb-6">
                {[
                  "Authentic Stone-Ground Spices",
                  "Sun-Dried Ingredients for Natural Preservation",
                  "Zero Artificial Colors or Chemicals",
                  "Handcrafted in Small Batches for Perfection"
                ].map((item, i) => (
                  <li key={i} className="flex items-center text-brand-dark font-semibold text-xs sm:text-sm">
                    <Star className="text-brand-primary mr-2.5 flex-shrink-0" size={16} />
                    {item}
                  </li>
                ))}
              </ul>

              <Link to="/about" className="inline-flex items-center gap-2 bg-brand-dark text-white font-bold py-3 px-6 text-sm rounded-full hover:bg-brand-primary transition shadow-md group">
                Discover Our Full History
                <Star size={16} className="group-hover:rotate-180 transition duration-500" />
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Bulk Orders Section */}
      <section className="py-16 md:py-20 bg-brand-dark text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-brand-accent/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-brand-primary/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 pointer-events-none"></div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col lg:flex-row gap-12 items-center">

            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="lg:w-1/2"
            >
              <h2 className="text-xs font-bold text-brand-primary uppercase tracking-widest mb-2">Special Occasions</h2>
              <h3 className="text-2xl md:text-3xl font-bold text-brand-accent mb-4 leading-tight">We Accept Bulk & Corporate Orders</h3>
              <p className="text-gray-300 text-sm mb-4 leading-relaxed">
                Make your weddings, corporate events, and family gatherings unforgettable with our authentic Telangana products. We specialize in curating premium, hand-crafted bulk orders tailored to your specific event needs.
              </p>
              <ul className="space-y-3 mb-6">
                {[
                  "Customized Wedding Hampers & Sweets",
                  "Corporate Gifting Solutions",
                  "Festival & Bulk Party Orders",
                  "Special Discounts on Large Quantities"
                ].map((item, i) => (
                  <li key={i} className="flex items-center font-semibold text-gray-200 text-xs sm:text-sm">
                    <div className="w-5 h-5 rounded-full bg-brand-primary/20 flex items-center justify-center mr-2.5 text-brand-primary text-xs">✓</div>
                    {item}
                  </li>
                ))}
              </ul>
              <a
                href="https://wa.me/918121345585?text=Hello!%20I%20am%20interested%20in%20placing%20a%20bulk%20order."
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-brand-primary text-white font-bold py-3 px-6 text-sm rounded-full hover:bg-brand-accent hover:text-brand-dark transition shadow-[0_0_20px_rgba(209,161,85,0.4)] hover:-translate-y-0.5"
              >
                <Mail size={18} />
                Enquire for Bulk Order
              </a>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="lg:w-1/2 grid grid-cols-2 gap-4"
            >
              <img
                src="https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&q=80&w=800"
                alt="Indian Sweets Bulk"
                onError={(e) => { (e.target as HTMLImageElement).src = '/images/premium_snacks.jpg'; }}
                className="rounded-2xl shadow-xl object-cover h-48 w-full border border-white/10"
              />
              <img
                src="/images/premium_snacks.jpg"
                alt="Traditional Event Snacks"
                onError={(e) => { (e.target as HTMLImageElement).src = '/images/premium_snacks.jpg'; }}
                className="rounded-2xl shadow-xl object-cover h-48 w-full border border-white/10 translate-y-4"
              />
              <img
                src="https://images.unsplash.com/photo-1505253758473-96b7015fcd40?auto=format&fit=crop&q=80&w=800"
                alt="Spices and Ingredients"
                onError={(e) => { (e.target as HTMLImageElement).src = '/images/veg_pickles.jpg'; }}
                className="rounded-2xl shadow-xl object-cover h-48 w-full border border-white/10 -translate-y-4"
              />
              <img
                src="/images/veg_pickles.jpg"
                alt="Festive Treats and Pickles"
                onError={(e) => { (e.target as HTMLImageElement).src = '/images/premium_snacks.jpg'; }}
                className="rounded-2xl shadow-xl object-cover h-48 w-full border border-white/10"
              />
            </motion.div>

          </div>
        </div>
      </section>

      {/* Testimonials / Community Reviews */}
      <section className="py-16 md:py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-brand-dark mb-2">What Our <span className="text-brand-primary">Community</span> Says</h2>
            <p className="text-gray-600 text-sm max-w-xl mx-auto">Join thousands of families across the globe who trust us for their authentic cravings.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { name: "Priya Sharma", loc: "Hyderabad", text: "The Sakinalu are absolutely divine! They taste exactly like the ones my grandmother used to make. So glad I found an authentic source." },
              { name: "Rajesh Kumar", loc: "Bangalore", text: "Their Gongura pickle is the best I have ever had. The quality of oil and spices is evident. No preservatives makes it even better." },
              { name: "Anjali Reddy", loc: "USA", text: "Ordering these snacks to the US has been a blessing. Vacuum packed perfectly, keeping them fresh and crunchy. Highly recommended!" }
            ].map((review, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.2 }}
                className="bg-gray-50 p-6 rounded-2xl relative border border-gray-100 shadow-sm hover:shadow-md transition"
              >
                <Quote className="absolute top-5 right-5 text-gray-200" size={48} />
                <div className="flex gap-1 text-yellow-400 mb-4 relative z-10">
                  <Star fill="currentColor" size={16} /><Star fill="currentColor" size={16} /><Star fill="currentColor" size={16} /><Star fill="currentColor" size={16} /><Star fill="currentColor" size={16} />
                </div>
                <p className="text-gray-700 text-xs sm:text-sm mb-6 italic relative z-10 leading-relaxed">"{review.text}"</p>
                <div className="flex flex-col relative z-10">
                  <span className="font-bold text-brand-dark text-sm">{review.name}</span>
                  <span className="text-xs text-gray-500">{review.loc}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
};
