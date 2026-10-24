import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Mail, Quote } from 'lucide-react';
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
        title="Authentic Traditional Pickles, Sweets & Snacks"
        description="Taste the authentic heritage of Telangana & Andhra with handcrafted veg & non-veg pickles, traditional sweets, crunchy sakinalu, and aromatic spice podulu. Freshly made in Warangal."
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
              alt="Slide Background" 
              className="w-full h-full object-cover" 
            />
          </motion.div>
        </AnimatePresence>

        <div className="container mx-auto px-4 relative z-20 text-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0, y: 50, rotateX: 20 }}
              animate={{ opacity: 1, y: 0, rotateX: 0 }}
              exit={{ opacity: 0, y: -50, rotateX: -20 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              style={{ perspective: 1000 }}
            >
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold mb-4 text-brand-accent drop-shadow-xl">
                {heroSlides[currentSlide].title}
              </h1>
              <p className="text-sm md:text-lg max-w-xl mx-auto mb-8 text-gray-200 drop-shadow-md leading-relaxed">
                {heroSlides[currentSlide].subtitle}
              </p>
            </motion.div>
          </AnimatePresence>

          <motion.div 
            className="flex justify-center gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
          >
            <Link to="/categories" className="bg-brand-primary text-white font-bold py-3 px-8 text-sm rounded-full hover:bg-yellow-600 transition shadow-[0_0_20px_rgba(209,161,85,0.4)] hover:shadow-[0_0_30px_rgba(209,161,85,0.7)] hover:-translate-y-0.5 transform duration-300">
              Shop Now
            </Link>
            <Link to="/about" className="bg-transparent border border-brand-accent text-brand-accent font-bold py-3 px-8 text-sm rounded-full hover:bg-brand-accent hover:text-brand-dark transition shadow-lg hover:-translate-y-0.5 transform duration-300">
              Our Story
            </Link>
          </motion.div>
        </div>

        {/* Slide Indicators */}
        <div className="absolute bottom-8 left-0 right-0 z-20 flex justify-center gap-3">
          {heroSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                currentSlide === index ? "bg-brand-accent w-8" : "bg-white/50 hover:bg-white"
              }`}
            />
          ))}
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
                href="https://wa.me/919876543210?text=Hello!%20I%20am%20interested%20in%20placing%20a%20bulk%20order." 
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
