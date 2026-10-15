import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export const SplashScreen = ({ onComplete }: { onComplete: () => void }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Extended to 6 seconds to allow the four images and text to appear before the logo bursts from the center
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 6000);

    return () => clearTimeout(timer);
  }, []);

  const categoryImages = [
    { src: "/images/premium_snacks.jpg", text: "Welcome to...", pos: "top-10 left-4 md:top-16 md:left-16" }, 
    { src: "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&q=80&w=600", text: "...the authentic taste...", pos: "top-10 right-4 md:top-16 md:right-16" }, 
    { src: "/images/premium_shipping.jpg", text: "...of the world of...", pos: "bottom-10 left-4 md:bottom-16 md:left-16" }, 
    { src: "/images/veg_pickles.jpg", text: "...Telangana Ruchulu", pos: "bottom-10 right-4 md:bottom-16 md:right-16" } 
  ];

  return (
    <AnimatePresence onExitComplete={onComplete}>
      {isVisible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.8, ease: "easeInOut" } }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-brand-dark overflow-hidden"
        >
          {/* 3D Animated Video Background */}
          <div className="absolute inset-0 z-0 bg-brand-dark">
            <video 
              autoPlay 
              loop 
              muted 
              playsInline 
              className="w-full h-full object-cover opacity-60 mix-blend-screen"
              onError={(e) => {
                // If the user hasn't uploaded the video yet, hide the broken video icon
                (e.target as HTMLVideoElement).style.display = 'none';
              }}
            >
              <source src="/images/intro_video.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>

          {/* Fallback Background Soft Glow (Visible if video is missing) */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1.2, opacity: 0.3 }}
            transition={{ duration: 3, ease: "easeOut" }}
            className="absolute w-[30rem] h-[30rem] bg-brand-accent rounded-full blur-[150px] z-[1]"
          />

          {/* Small Category Images with Text Surrounding Center */}
          {categoryImages.map((item, index) => (
            <motion.div
              key={index}
              className={`absolute ${item.pos} z-[2] flex flex-col items-center gap-2`}
              initial={{ opacity: 0, scale: 0, rotate: (Math.random() - 0.5) * 20 }}
              animate={{ opacity: 1, scale: 1, rotate: (Math.random() - 0.5) * 10 }}
              transition={{ 
                duration: 0.8, 
                delay: index * 0.6, 
                type: "spring",
                bounce: 0.4
              }}
            >
              <div className="w-20 h-20 sm:w-28 sm:h-28 md:w-36 md:h-36 rounded-xl md:rounded-2xl overflow-hidden border-2 md:border-3 border-brand-primary/60 shadow-[0_0_20px_rgba(209,161,85,0.3)]">
                <img src={item.src} alt="Category" className="w-full h-full object-cover" />
              </div>
              <span className="text-brand-accent font-heading font-bold text-sm md:text-lg drop-shadow-lg text-center bg-black/60 px-4 py-1.5 rounded-full backdrop-blur-sm">
                {item.text}
              </span>
            </motion.div>
          ))}

          {/* Flash transitioning from montage to logo */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 0] }}
            transition={{ duration: 0.8, delay: categoryImages.length * 0.6, ease: "easeOut" }}
            className="absolute inset-0 bg-white z-[3]"
            style={{ pointerEvents: 'none' }}
          />

          {/* Glowing Logo bursting from the middle of the images */}
          <motion.div
            initial={{ opacity: 0, scale: 0, filter: "blur(20px)" }}
            animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
            transition={{ duration: 1.5, delay: categoryImages.length * 0.6, type: "spring", bounce: 0.3 }} 
            className="relative z-10 w-36 h-36 sm:w-48 sm:h-48 md:w-60 md:h-60"
          >
            <img 
              src="/images/brand_logo.png" 
              alt="Sri Telangana Ruchulu" 
              className="w-full h-full object-contain rounded-2xl md:rounded-3xl drop-shadow-[0_0_30px_rgba(209,161,85,0.6)]"
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
