import { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Heart, MessageCircle, Share2, Sparkles, ShoppingBag, X, ChevronLeft, ChevronRight, ExternalLink, CheckCircle2 } from 'lucide-react';
import { useTranslation } from '../utils/translations';

interface InstagramReelItem {
  id: number;
  title: string;
  titleTe: string;
  desc: string;
  descTe: string;
  views: string;
  likes: string;
  comments: string;
  image: string;
  productName: string;
  productSlug: string;
  productPrice: number;
  category: string;
}

const INSTAGRAM_PROFILE = 'https://www.instagram.com/sri_telangana_ruchulu?cplk=YmN0dWRxdjR5NTB5&utm_source=qr';

const reelsData: InstagramReelItem[] = [
  {
    id: 1,
    title: "Making of Crunchy Warangal Sakinalu 🌀",
    titleTe: "కరకరలాడే వరంగల్ సకినాల తయారీ 🌀",
    desc: "Handcrafted circular spirals using freshly pounded rice flour, sesame seeds & fried in wooden-mill sesame oil.",
    descTe: "తాజా వరి పిండి, నువ్వులు కలిపి చెక్క గానుగ నూనెలో వేయించిన సాంప్రదాయ సకినాలు.",
    views: "64.2K",
    likes: "5.1K",
    comments: "248",
    image: "https://sritelanganaruchulu.com/wp-content/uploads/2025/12/72.png",
    productName: "Karam Sakinalu",
    productSlug: "karam-sakinalu",
    productPrice: 350,
    category: "Hot Snacks"
  },
  {
    id: 2,
    title: "Stone-Mortar Gongura Pachadi Live Batch 🌿",
    titleTe: "రోట్లో దంచిన తాజా గోంగూర పచ్చడి 🌿",
    desc: "Fresh red-stem gongura leaves sautéed with fiery Warangal chilies & hand-pounded to perfection.",
    descTe: "ఎర్ర గోంగూర, వరంగల్ మిరపకాయలతో రాతి రోట్లో దంచి చేసిన అచ్చమైన పచ్చడి.",
    views: "82.9K",
    likes: "7.4K",
    comments: "392",
    image: "https://commons.wikimedia.org/wiki/Special:FilePath/Gongura_Pickle.jpg",
    productName: "Gongura Pachadi",
    productSlug: "gongura-pachadi",
    productPrice: 400,
    category: "Veg Pickles"
  },
  {
    id: 3,
    title: "Pure Desi Ghee Badhusha & Mysore Pak 🧈",
    titleTe: "స్వచ్ఛమైన నేతి బాదుషా తయారీ 🧈",
    desc: "Flaky layered golden dough fried in pure cow ghee and dipped in warm cardamom sugar syrup.",
    descTe: "స్వచ్ఛమైన ఆవు నెయ్యితో చేసి, సువాసనల పాకంలో నానబెట్టిన రుచికరమైన బాదుషా.",
    views: "49.3K",
    likes: "4.2K",
    comments: "186",
    image: "https://sritelanganaruchulu.com/wp-content/uploads/2025/12/4.png",
    productName: "Badhusha Neyi",
    productSlug: "badhusha-neyi",
    productPrice: 500,
    category: "Sweets"
  },
  {
    id: 4,
    title: "Fiery Warangal Chicken Pickle Batch 🍗",
    titleTe: "ఘుమఘుమలాడే వరంగల్ చికెన్ పచ్చడి 🍗",
    desc: "Crispy boneless chicken chunks marinated with roasted spices and cold-pressed gingelly oil.",
    descTe: "ఎముకలు లేని తాజా చికెన్ ముక్కలను ప్రత్యేక మసాలాలు మరియు గానుగ నూనెతో చేసిన పచ్చడి.",
    views: "96.5K",
    likes: "9.3K",
    comments: "512",
    image: "https://commons.wikimedia.org/wiki/Special:FilePath/Andhra_Chicken_Pickle.jpg",
    productName: "Chicken Pachadi",
    productSlug: "chicken-pachadi",
    productPrice: 600,
    category: "Non Veg Pickles"
  },
  {
    id: 5,
    title: "Ancestral Stone Pounding of Kandi Podi 🌶️",
    titleTe: "సంప్రదాయ రోలు పద్ధతిలో కంది పొడి 🌶️",
    desc: "Golden roasted toor dal, cumin, garlic & red chilies pounded into hot steaming rice powder.",
    descTe: "దోరగా వేయించిన కందిపప్పు, జీలకర్ర, వెల్లుల్లితో దంచిన సువాసనల కంది పొడి.",
    views: "38.7K",
    likes: "3.1K",
    comments: "142",
    image: "https://commons.wikimedia.org/wiki/Special:FilePath/Idli_Podi.jpg",
    productName: "Kandi Podi",
    productSlug: "kandi-podi",
    productPrice: 400,
    category: "Podulu"
  }
];

export const InstagramReels = () => {
  const { t, isTelugu, getProductName } = useTranslation();
  const [activeReel, setActiveReel] = useState<InstagramReelItem | null>(null);
  const [likedReels, setLikedReels] = useState<Record<number, boolean>>({});
  const carouselRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (carouselRef.current) {
      const scrollAmount = direction === 'left' ? -340 : 340;
      carouselRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const toggleLike = (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    setLikedReels((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-[#FDFBF7] via-amber-50/30 to-[#FDFBF7] overflow-hidden relative" style={{ perspective: 1200 }}>
      {/* Background Decorative Blobs */}
      <div className="absolute top-1/4 -left-32 w-80 h-80 bg-pink-500/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-1/4 -right-32 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="container mx-auto px-4 max-w-7xl relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-[#833AB4]/15 via-[#FD1D1D]/15 to-[#F77737]/15 border border-[#FD1D1D]/25 shadow-2xs mb-2">
              <svg className="w-4 h-4 text-[#FD1D1D]" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
              </svg>
              <span className="text-[11px] font-black uppercase tracking-widest bg-gradient-to-r from-[#833AB4] via-[#FD1D1D] to-[#F77737] bg-clip-text text-transparent">
                {t('reels.tag')}
              </span>
            </div>

            <h2 className={`text-2xl md:text-3xl lg:text-4xl font-black text-[#2A0800] tracking-tight mt-1 ${isTelugu ? 'font-telugu' : ''}`}>
              {t('reels.title')}
            </h2>
            <p className="text-[#5c3a21] font-semibold text-xs sm:text-sm mt-1.5 max-w-xl leading-relaxed">
              {t('reels.subtitle')}
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Follow Instagram Pill Button */}
            <a
              href={INSTAGRAM_PROFILE}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-gradient-to-r from-[#833AB4] via-[#FD1D1D] to-[#F77737] hover:opacity-95 text-white font-bold text-xs shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5 active:scale-95 cursor-pointer"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
              </svg>
              <span>{t('reels.follow')}</span>
              <CheckCircle2 size={13} className="text-white" />
            </a>

            {/* Desktop Navigation Arrows */}
            <div className="hidden sm:flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => scroll('left')}
                aria-label="Previous reel"
                className="w-9 h-9 rounded-full bg-white border border-gray-200 hover:border-amber-400 text-gray-700 hover:text-amber-800 flex items-center justify-center transition shadow-xs cursor-pointer hover:scale-105 active:scale-95"
              >
                <ChevronLeft size={18} />
              </button>
              <button
                type="button"
                onClick={() => scroll('right')}
                aria-label="Next reel"
                className="w-9 h-9 rounded-full bg-white border border-gray-200 hover:border-amber-400 text-gray-700 hover:text-amber-800 flex items-center justify-center transition shadow-xs cursor-pointer hover:scale-105 active:scale-95"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        </div>

        {/* 9:16 Vertical Reels Cards Slider */}
        <div
          ref={carouselRef}
          className="flex gap-4 sm:gap-6 overflow-x-auto pb-4 pt-2 scrollbar-none snap-x snap-mandatory"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {reelsData.map((reel) => {
            const isLiked = likedReels[reel.id];

            return (
              <motion.div
                key={reel.id}
                whileHover={{ y: -8, scale: 1.02 }}
                transition={{ duration: 0.3 }}
                onClick={() => setActiveReel(reel)}
                className="snap-start flex-shrink-0 w-[260px] sm:w-[280px] h-[460px] sm:h-[490px] rounded-3xl overflow-hidden relative shadow-lg hover:shadow-2xl cursor-pointer group bg-black transition-all border-2 border-transparent hover:border-pink-500/50"
              >
                {/* Background Image Poster */}
                <img
                  src={reel.image}
                  alt={reel.title}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 ease-out opacity-90 group-hover:opacity-100"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/images/premium_snacks.jpg';
                  }}
                />

                {/* Vertical Gradient Overlays for Readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/30 to-black/60 pointer-events-none" />

                {/* Top Header Bar inside Reel */}
                <div className="absolute top-3.5 left-3.5 right-3.5 flex items-center justify-between z-10">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full p-0.5 bg-gradient-to-tr from-[#F77737] via-[#FD1D1D] to-[#833AB4]">
                      <img
                        src="/images/brand_logo.png"
                        alt="Sri Telangana Ruchulu"
                        className="w-full h-full object-cover rounded-full bg-black"
                      />
                    </div>
                    <div>
                      <span className="text-white text-xs font-bold block leading-tight flex items-center gap-1 drop-shadow-sm">
                        sri_telangana_ruchulu
                        <CheckCircle2 size={11} className="text-blue-400 fill-blue-400 inline" />
                      </span>
                      <span className="text-white/70 text-[10px] font-medium block">Warangal Original</span>
                    </div>
                  </div>

                  {/* Views Pill */}
                  <span className="bg-black/50 backdrop-blur-md text-amber-300 text-[10px] font-black px-2.5 py-1 rounded-full border border-white/15 flex items-center gap-1 shadow-xs">
                    <Sparkles size={10} className="text-amber-400" />
                    {reel.views}
                  </span>
                </div>

                {/* Center Floating Play Button */}
                <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
                  <div className="w-14 h-14 rounded-full bg-white/25 group-hover:bg-[#FD1D1D] backdrop-blur-md border border-white/40 flex items-center justify-center text-white transition-all duration-300 transform group-hover:scale-115 shadow-xl">
                    <Play size={22} className="fill-current ml-0.5 text-white" />
                  </div>
                </div>

                {/* Right Floating Social Actions (Like, Comment, Share) */}
                <div className="absolute right-3 bottom-24 flex flex-col items-center gap-3 z-10">
                  <button
                    type="button"
                    onClick={(e) => toggleLike(e, reel.id)}
                    className="flex flex-col items-center cursor-pointer group/btn"
                    aria-label="Like reel"
                  >
                    <div className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${
                      isLiked ? 'bg-red-500 text-white scale-110' : 'bg-black/50 backdrop-blur-md text-white hover:bg-white/20'
                    }`}>
                      <Heart size={18} className={isLiked ? 'fill-current text-white' : ''} />
                    </div>
                    <span className="text-white text-[10px] font-bold mt-1 drop-shadow-sm">
                      {isLiked ? 'Liked' : reel.likes}
                    </span>
                  </button>

                  <div className="flex flex-col items-center">
                    <div className="w-9 h-9 rounded-full bg-black/50 backdrop-blur-md text-white flex items-center justify-center">
                      <MessageCircle size={18} />
                    </div>
                    <span className="text-white text-[10px] font-bold mt-1 drop-shadow-sm">
                      {reel.comments}
                    </span>
                  </div>

                  <a
                    href={INSTAGRAM_PROFILE}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="flex flex-col items-center text-white hover:text-amber-300 transition"
                    title="Watch on Instagram"
                  >
                    <div className="w-9 h-9 rounded-full bg-black/50 backdrop-blur-md flex items-center justify-center">
                      <Share2 size={16} />
                    </div>
                    <span className="text-[10px] font-bold mt-1 drop-shadow-sm">Share</span>
                  </a>
                </div>

                {/* Bottom Content Area */}
                <div className="absolute bottom-0 left-0 right-0 p-4 z-10">
                  {/* Reel Caption */}
                  <h3 className={`text-white font-extrabold text-sm sm:text-base leading-snug line-clamp-2 drop-shadow-md mb-1.5 ${isTelugu ? 'font-telugu' : ''}`}>
                    {isTelugu ? reel.titleTe : reel.title}
                  </h3>

                  <p className="text-gray-300 text-[11px] line-clamp-1 opacity-90 mb-3 font-medium">
                    {isTelugu ? reel.descTe : reel.desc}
                  </p>

                  {/* Tagged Product Pill (Amazon / Instagram Shop style) */}
                  <Link
                    to={`/product/${reel.productSlug}`}
                    onClick={(e) => e.stopPropagation()}
                    className="w-full flex items-center justify-between bg-white/15 hover:bg-amber-500/90 backdrop-blur-md border border-white/25 hover:border-amber-400 text-white p-2 rounded-xl text-xs font-bold transition-all shadow-md group/tag"
                  >
                    <div className="flex items-center gap-1.5 truncate">
                      <ShoppingBag size={14} className="text-amber-300 group-hover/tag:text-white flex-shrink-0" />
                      <span className="truncate">
                        {isTelugu ? getProductName(reel.productName) : reel.productName}
                      </span>
                    </div>
                    <span className="bg-black/50 px-2 py-0.5 rounded-lg text-amber-200 text-[11px] font-black flex-shrink-0">
                      ₹{reel.productPrice}
                    </span>
                  </Link>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* View All Reels Banner */}
        <div className="mt-8 text-center">
          <a
            href={INSTAGRAM_PROFILE}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-extrabold text-[#8B1E0F] hover:text-amber-800 transition group"
          >
            <span>{isTelugu ? 'ఇన్‌స్టాగ్రామ్‌లో మరిన్ని రీల్స్ చూడండి' : 'Discover All Reels on Instagram @sri_telangana_ruchulu'}</span>
            <ExternalLink size={14} className="group-hover:translate-x-1 group-hover:-translate-y-0.5 transition-transform" />
          </a>
        </div>
      </div>

      {/* Interactive Full-Screen Reel Modal Player */}
      <AnimatePresence>
        {activeReel && (
          <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveReel(null)}
              className="fixed inset-0 bg-black/85 backdrop-blur-md"
            />

            {/* Modal Container */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", stiffness: 350, damping: 25 }}
              className="relative w-full max-w-sm sm:max-w-md bg-brand-dark rounded-3xl overflow-hidden shadow-2xl border border-white/20 z-10 flex flex-col"
            >
              {/* Close Button */}
              <button
                type="button"
                onClick={() => setActiveReel(null)}
                aria-label="Close reel modal"
                className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-black/60 hover:bg-white/20 text-white flex items-center justify-center transition cursor-pointer backdrop-blur-md border border-white/10"
              >
                <X size={18} />
              </button>

              {/* 9:16 Aspect Ratio Video/Image Area */}
              <div className="relative aspect-[9/14] bg-black overflow-hidden flex items-center justify-center">
                <img
                  src={activeReel.image}
                  alt={activeReel.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/25 to-black/50" />

                {/* Profile Header */}
                <div className="absolute top-4 left-4 flex items-center gap-2.5 z-10">
                  <div className="w-9 h-9 rounded-full p-0.5 bg-gradient-to-tr from-[#F77737] via-[#FD1D1D] to-[#833AB4]">
                    <img
                      src="/images/brand_logo.png"
                      alt="Sri Telangana Ruchulu"
                      className="w-full h-full object-cover rounded-full bg-black"
                    />
                  </div>
                  <div>
                    <span className="text-white text-xs font-bold block flex items-center gap-1 drop-shadow-md">
                      sri_telangana_ruchulu
                      <CheckCircle2 size={12} className="text-blue-400 fill-blue-400 inline" />
                    </span>
                    <span className="text-white/80 text-[10px]">Warangal, Telangana</span>
                  </div>
                </div>

                {/* Pulse Play Icon */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-[#FD1D1D] to-[#833AB4] text-white flex items-center justify-center shadow-2xl">
                    <Play size={26} className="fill-current ml-0.5 text-white" />
                  </div>
                </div>

                {/* Reel Stats Overlay */}
                <div className="absolute bottom-28 left-4 right-4 z-10">
                  <h3 className={`text-white font-extrabold text-base sm:text-lg mb-1 leading-snug drop-shadow-md ${isTelugu ? 'font-telugu' : ''}`}>
                    {isTelugu ? activeReel.titleTe : activeReel.title}
                  </h3>
                  <p className="text-gray-200 text-xs leading-relaxed mb-3 drop-shadow-sm">
                    {isTelugu ? activeReel.descTe : activeReel.desc}
                  </p>
                  <div className="flex items-center gap-3 text-xs text-white/90">
                    <span className="font-bold flex items-center gap-1">
                      <Heart size={14} className="text-red-400 fill-red-400" /> {activeReel.likes}
                    </span>
                    <span className="font-bold flex items-center gap-1">
                      <MessageCircle size={14} className="text-blue-300" /> {activeReel.comments}
                    </span>
                    <span className="bg-amber-400/20 text-amber-300 font-bold px-2 py-0.5 rounded-full text-[10px] border border-amber-400/30">
                      {activeReel.views} {t('reels.views')}
                    </span>
                  </div>
                </div>

                {/* Bottom CTA Actions */}
                <div className="absolute bottom-4 left-4 right-4 z-10 flex flex-col gap-2">
                  <Link
                    to={`/product/${activeReel.productSlug}`}
                    onClick={() => setActiveReel(null)}
                    className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-black text-xs sm:text-sm text-center flex items-center justify-center gap-2 shadow-lg transition-all active:scale-98"
                  >
                    <ShoppingBag size={16} />
                    <span>{t('reels.shopDelicacy')} • ₹{activeReel.productPrice}</span>
                  </Link>

                  <a
                    href={INSTAGRAM_PROFILE}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-2.5 px-4 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs text-center flex items-center justify-center gap-2 border border-white/15 transition-all"
                  >
                    <span>{t('reels.watchOnInsta')}</span>
                    <ExternalLink size={13} />
                  </a>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};
