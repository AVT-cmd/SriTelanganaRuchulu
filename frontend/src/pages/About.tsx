import { motion } from 'framer-motion';
import { SEO } from '../components/SEO';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { ShieldCheck, Heart, Leaf, MapPin } from 'lucide-react';

export const About = () => {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="bg-brand-light min-h-screen pt-32 pb-12"
    >
      <SEO
        title="About Our Heritage & Traditional Recipes"
        description="Discover the heritage of Sri Telangana Ruchulu. Handcrafting traditional Telugu pickles, sweets, and snacks in Warangal using authentic ancestral recipes."
        canonical="/about"
      />

      <div className="container mx-auto px-4 mb-6">
        <Breadcrumbs items={[{ name: 'About Us', url: '/about' }]} />
      </div>

      {/* Hero Section */}
      <section className="container mx-auto px-4 mb-20 relative">
        <div className="relative rounded-3xl overflow-hidden shadow-2xl h-[400px] md:h-[500px]">
          <div className="absolute inset-0 bg-black/40 z-10"></div>
          <img 
            src="/images/veg_pickles.jpg" 
            alt="Authentic Telangana Food" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 flex items-center justify-center z-20">
            <div className="text-center text-white p-6 max-w-3xl">
              <motion.div 
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center gap-2 bg-brand-primary/80 backdrop-blur-sm px-4 py-2 rounded-full mb-6 font-bold uppercase tracking-widest text-sm"
              >
                <MapPin size={16} /> Warangal, Telangana, India
              </motion.div>
              <motion.h1 
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-5xl md:text-7xl font-extrabold mb-4 drop-shadow-lg text-brand-primary"
              >
                Our Heritage
              </motion.h1>
              <motion.p 
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-xl md:text-2xl font-semibold opacity-90 drop-shadow-md"
              >
                Rooted in tradition, handcrafted with love.
              </motion.p>
            </div>
          </div>
        </div>
      </section>

      {/* The Story Section */}
      <section className="container mx-auto px-4 mb-24">
        <div className="flex flex-col lg:flex-row gap-16 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:w-1/2"
          >
            <h2 className="text-sm font-bold text-brand-primary uppercase tracking-widest mb-3">Where It All Began</h2>
            <h3 className="text-4xl font-bold text-brand-dark mb-6 leading-tight">From the Heart of Warangal to the World.</h3>
            <p className="text-gray-600 text-lg mb-6 leading-relaxed">
              <strong>Sri Telangana Ruchulu</strong> was born in the historic city of Warangal, the ancient capital of the Kakatiya dynasty. Known for its rich cultural heritage and legendary spice trade, Warangal has always been a epicenter of robust, fiery, and deeply flavorful cuisine.
            </p>
            <p className="text-gray-600 text-lg mb-6 leading-relaxed">
              For over 25 years, our family has dedicated itself to preserving these ancient culinary arts. We don't just cook; we honor a legacy. From carefully selecting the perfect Guntur chilies to cold-pressing sesame oil, every step of our process remains fiercely traditional.
            </p>
            <p className="text-gray-600 text-lg leading-relaxed">
              When you taste our <em>Pindi Vantalu</em> (traditional snacks) and <em>Pachadlu</em> (pickles), you aren't just tasting food—you are experiencing centuries of unbroken tradition, handcrafted exactly as our ancestors did.
            </p>
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:w-1/2 grid grid-cols-2 gap-4"
          >
            <img src="/images/premium_snacks.jpg" alt="Traditional Spices" className="rounded-3xl shadow-lg border-4 border-white object-cover aspect-square" />
            <img src="/images/warangal_fort.jpg" alt="Warangal Fort Architecture" className="rounded-3xl shadow-lg border-4 border-white object-cover aspect-square mt-8" />
          </motion.div>
        </div>
      </section>

      {/* Visual Heritage Gallery */}
      <section className="py-20 bg-brand-dark relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-brand-primary/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-sm font-bold text-brand-primary uppercase tracking-widest mb-3">Visual Journey</h2>
            <h3 className="text-4xl md:text-5xl font-bold text-white">The Spirit of Telangana</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { src: "/images/thousand_pillar.jpg", title: "Thousand Pillar Temple", delay: 0.1 },
              { src: "/images/veg_pickles.jpg", title: "Authentic Pachadlu", delay: 0.2 },
              { src: "/images/ramappa.jpg", title: "Historic Architecture", delay: 0.3 },
              { src: "/images/premium_snacks.jpg", title: "Pindi Vantalu", delay: 0.4 }
            ].map((img, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: img.delay }}
                className="group relative h-80 rounded-3xl overflow-hidden shadow-2xl border-2 border-white/10"
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10 opacity-80 group-hover:opacity-100 transition-opacity"></div>
                <img 
                  src={img.src} 
                  alt={img.title} 
                  className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute bottom-6 left-6 z-20">
                  <h4 className="text-white font-bold text-xl">{img.title}</h4>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="bg-white py-24">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-brand-dark mb-16">Our Promise to You</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              { 
                icon: <Leaf className="text-brand-primary" size={48} />, 
                title: "100% Natural Ingredients", 
                desc: "We source our ingredients directly from local farmers in Telangana. No artificial colors, no hidden chemicals." 
              },
              { 
                icon: <Heart className="text-brand-primary" size={48} />, 
                title: "Handcrafted with Love", 
                desc: "Every pickle and snack is made in small batches by skilled local women, using traditional stone-grinding techniques." 
              },
              { 
                icon: <ShieldCheck className="text-brand-primary" size={48} />, 
                title: "Zero Preservatives", 
                desc: "Our food relies on natural preservation methods like sun-drying and high-quality oils, just as it was done centuries ago." 
              }
            ].map((val, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.2 }}
                className="bg-gray-50 p-10 rounded-3xl border-2 border-gray-100 shadow-sm hover:shadow-lg hover:-translate-y-2 transition-all duration-300"
              >
                <div className="bg-brand-primary/10 w-20 h-20 mx-auto rounded-full flex items-center justify-center mb-6">
                  {val.icon}
                </div>
                <h3 className="text-2xl font-bold text-brand-dark mb-4">{val.title}</h3>
                <p className="text-gray-600 leading-relaxed">{val.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </motion.div>
  );
};
