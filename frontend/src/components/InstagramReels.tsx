import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Heart, 
  MessageCircle, 
  Share2, 
  Sparkles, 
  ShoppingBag, 
  X, 
  ChevronLeft, 
  ChevronRight, 
  ExternalLink, 
  CheckCircle2 
} from 'lucide-react';
import { useTranslation } from '../utils/translations';

interface InstagramReelItem {
  id: number;
  shortcode: string;
  title: string;
  titleTe: string;
  desc: string;
  descTe: string;
  views: string;
  likes: string;
  comments: string;
  image: string;
  videoUrl: string;
  instaUrl: string;
  productName: string;
  productSlug: string;
  productPrice: number;
  category: string;
}

const INSTAGRAM_PROFILE = 'https://www.instagram.com/sri_telangana_ruchulu?cplk=YmN0dWRxdjR5NTB5&utm_source=qr';

// 100% Real Reels downloaded directly from official Instagram profile @sri_telangana_ruchulu
const reelsData: InstagramReelItem[] = [
  {
    id: 1,
    shortcode: "DbS9_9VTCNv",
    title: "Authentic Warangal Sakinalu Making 🌀",
    titleTe: "అసలైన వరంగల్ సకినాల ప్రత్యక్ష తయారీ 🌀",
    desc: "🔥 Ee Sakinalu making chusthunte… pandaga feel already start ayyindhi kada! Crispy ga… crunchy ga… authentic Telangana taste tho.",
    descTe: "కరకరలాడే అసలైన తెలంగాణ సాంప్రదాయ సకినాల తయారీ.. ప్రతి బైట్‌లో పండుగ అనుభూతి!",
    views: "18.6K",
    likes: "86",
    comments: "6",
    image: "/images/reels/thumb_sakinalu_insta.jpg",
    videoUrl: "/videos/reel_sakinalu_insta.mp4",
    instaUrl: "https://www.instagram.com/reel/DbS9_9VTCNv/",
    productName: "Karam Sakinalu",
    productSlug: "karam-sakinalu",
    productPrice: 350,
    category: "Hot Snacks"
  },
  {
    id: 2,
    shortcode: "DbnoB3fSl_h",
    title: "Handmade Traditional Laddus Pure Desi Touch 🟠",
    titleTe: "చేతితో చుట్టిన సాంప్రదాయ లడ్డూల తయారీ 🟠",
    desc: "Oka laddu ready avvadam ante… chethitho premaga shape chesthu… finally beautiful ga mana laddus ready avutayi! Traditional taste & Telangana touch.",
    descTe: "చేతితో ప్రేమగా చుట్టిన స్వచ్ఛమైన లడ్డూలు.. సంప్రదాయపు తియ్యదనం ప్రతి ముద్దలో!",
    views: "14.2K",
    likes: "43",
    comments: "6",
    image: "/images/reels/thumb_laddu_insta.jpg",
    videoUrl: "/videos/reel_laddu_insta.mp4",
    instaUrl: "https://www.instagram.com/reel/DbnoB3fSl_h/",
    productName: "Laddu",
    productSlug: "laddu",
    productPrice: 300,
    category: "Sweets"
  },
  {
    id: 3,
    shortcode: "Ddbfv0-S4VT",
    title: "Grand Srimantham Celebration Pindi Vantalu 🌸",
    titleTe: "శ్రీమంతం వేడుకల సాంప్రదాయ పిండి వంటలు 🌸",
    desc: "Some celebrations are remembered for the moments… some for the taste that stays with you. Authentic Telangana Pindi Vantalu for special functions.",
    descTe: "శ్రీమంతం, శుభకార్యాల కోసం నోరూరించే అచ్చమైన తెలంగాణ పిండి వంటల ఆర్డర్లు.",
    views: "22.8K",
    likes: "30",
    comments: "5",
    image: "/images/reels/thumb_srimantham_insta.jpg",
    videoUrl: "/videos/reel_srimantham_insta.mp4",
    instaUrl: "https://www.instagram.com/reel/Ddbfv0-S4VT/",
    productName: "Chekkalu",
    productSlug: "chekkalu",
    productPrice: 350,
    category: "Hot Snacks"
  },
  {
    id: 4,
    shortcode: "DeMZdYHSApt",
    title: "Gruhapravesham Special Traditional Sweets 🏡✨",
    titleTe: "గృహప్రవేశం స్పెషల్ సంప్రదాయ స్వీట్స్ 🏡✨",
    desc: "A beautiful Gruhapravesham deserves something sweet! Kottha inti shubhaarambham lo Sri Telangana Ruchulu traditional sweets.",
    descTe: "కొత్త ఇంటి శుభారంభంలో నోరు తీపి చేసే స్వచ్ఛమైన నేతి పిండి వంటలు మరియు స్వీట్లు.",
    views: "25.4K",
    likes: "106",
    comments: "4",
    image: "/images/reels/thumb_gruhapravesham_insta.jpg",
    videoUrl: "/videos/reel_gruhapravesham_insta.mp4",
    instaUrl: "https://www.instagram.com/reel/DeMZdYHSApt/",
    productName: "Badhusha Neyi",
    productSlug: "badhusha-neyi",
    productPrice: 500,
    category: "Sweets"
  },
  {
    id: 5,
    shortcode: "DaQWbIxyn5s",
    title: "Crispy Murukulu, Ariselu & Ribbon Pakoda 🥨",
    titleTe: "కరకరలాడే మురుకులు, అరిసెలు, రిబ్బన్ పకోడా 🥨",
    desc: "From crispy Murukulu to sweet Ariselu & golden Laddu—every bite is handcrafted with tradition, purity, and homemade love.",
    descTe: "చేతితో చేసిన మురుకులు, కమ్మని అరిసెలు, రిబ్బన్ పకోడీ.. ప్రతి ఇంట్లో ఉండాల్సిన రుచులు.",
    views: "31.9K",
    likes: "235",
    comments: "12",
    image: "/images/reels/thumb_snacks_insta.jpg",
    videoUrl: "/videos/reel_snacks_insta.mp4",
    instaUrl: "https://www.instagram.com/reel/DaQWbIxyn5s/",
    productName: "Karam Murukulu",
    productSlug: "karam-murukulu",
    productPrice: 350,
    category: "Hot Snacks"
  }
];

export const InstagramReels = () => {
  const { t, isTelugu, getProductName } = useTranslation();
  const [activeReel, setActiveReel] = useState<InstagramReelItem | null>(null);
  const [likedReels, setLikedReels] = useState<Record<number, boolean>>({});
  
  // Modal player states
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [showPlayStateAnim, setShowPlayStateAnim] = useState<boolean>(false);
  
  const carouselRef = useRef<HTMLDivElement>(null);
  const modalVideoRef = useRef<HTMLVideoElement>(null);

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

  // Keyboard navigation & escape listener for modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setActiveReel(null);
      } else if (e.key === ' ' && activeReel) {
        e.preventDefault();
        togglePlayPause();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeReel, isPlaying]);

  // When activeReel opens, reset playback & attempt autoplay
  useEffect(() => {
    if (activeReel) {
      setIsPlaying(true);
      setProgress(0);
      if (modalVideoRef.current) {
        modalVideoRef.current.currentTime = 0;
        const playPromise = modalVideoRef.current.play();
        if (playPromise !== undefined) {
          playPromise.catch(() => {
            // If browser blocks unmuted autoplay, mute and retry
            setIsMuted(true);
            if (modalVideoRef.current) {
              modalVideoRef.current.muted = true;
              modalVideoRef.current.play().catch(() => {});
            }
          });
        }
      }
    }
  }, [activeReel]);

  const togglePlayPause = () => {
    if (modalVideoRef.current) {
      if (modalVideoRef.current.paused) {
        modalVideoRef.current.play().catch(() => {});
        setIsPlaying(true);
      } else {
        modalVideoRef.current.pause();
        setIsPlaying(false);
      }
      setShowPlayStateAnim(true);
      setTimeout(() => setShowPlayStateAnim(false), 700);
    }
  };

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (modalVideoRef.current) {
      modalVideoRef.current.muted = !modalVideoRef.current.muted;
      setIsMuted(modalVideoRef.current.muted);
    }
  };

  const handleTimeUpdate = () => {
    if (modalVideoRef.current) {
      const current = modalVideoRef.current.currentTime;
      const total = modalVideoRef.current.duration;
      if (total > 0) {
        setProgress((current / total) * 100);
      }
    }
  };

  const handleShare = async (e: React.MouseEvent, reel: InstagramReelItem) => {
    e.stopPropagation();
    if (navigator.share) {
      try {
        await navigator.share({
          title: reel.title,
          text: `${reel.title} - Sri Telangana Ruchulu`,
          url: reel.instaUrl
        });
      } catch {
        // Ignored or cancelled
      }
    } else {
      window.open(reel.instaUrl, '_blank');
    }
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
                onMouseEnter={(e) => {
                  const video = e.currentTarget.querySelector('video');
                  if (video) {
                    video.play().catch(() => {});
                  }
                }}
                onMouseLeave={(e) => {
                  const video = e.currentTarget.querySelector('video');
                  if (video) {
                    video.pause();
                    video.currentTime = 0;
                  }
                }}
                className="snap-start flex-shrink-0 w-[260px] sm:w-[280px] h-[460px] sm:h-[490px] rounded-3xl overflow-hidden relative shadow-lg hover:shadow-2xl cursor-pointer group bg-black transition-all border-2 border-transparent hover:border-pink-500/50"
              >
                {/* Embedded Video Element with Poster Fallback */}
                <video
                  src={reel.videoUrl}
                  poster={reel.image}
                  muted
                  loop
                  playsInline
                  preload="metadata"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
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

                {/* Center Floating Play Button (Subtly fades on hover when video starts playing) */}
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
                      {isLiked ? (Number(reel.likes) + 1).toString() : reel.likes}
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

                  <button
                    type="button"
                    onClick={(e) => handleShare(e, reel)}
                    className="flex flex-col items-center text-white hover:text-amber-300 transition cursor-pointer"
                    title="Share reel"
                    aria-label="Share reel"
                  >
                    <div className="w-9 h-9 rounded-full bg-black/50 backdrop-blur-md flex items-center justify-center">
                      <Share2 size={16} />
                    </div>
                    <span className="text-[10px] font-bold mt-1 drop-shadow-sm">Share</span>
                  </button>
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

      {/* Interactive Full-Screen Reel Modal Video Player */}
      <AnimatePresence>
        {activeReel && (
          <div className="fixed inset-0 z-[120] flex items-center justify-center p-3 sm:p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveReel(null)}
              className="fixed inset-0 bg-black/90 backdrop-blur-md cursor-pointer"
            />

            {/* Modal Container */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", stiffness: 350, damping: 25 }}
              className="relative w-full max-w-[340px] sm:max-w-[390px] h-[82vh] max-h-[720px] bg-black rounded-3xl overflow-hidden shadow-2xl border border-white/20 z-10 flex flex-col select-none"
            >
              {/* Top Controls Header */}
              <div className="absolute top-3.5 left-3.5 right-3.5 flex items-center justify-between z-30 pointer-events-auto">
                {/* Profile Header */}
                <div className="flex items-center gap-2 bg-black/40 backdrop-blur-md px-2.5 py-1.5 rounded-full border border-white/10">
                  <div className="w-7 h-7 rounded-full p-0.5 bg-gradient-to-tr from-[#F77737] via-[#FD1D1D] to-[#833AB4]">
                    <img
                      src="/images/brand_logo.png"
                      alt="Sri Telangana Ruchulu"
                      className="w-full h-full object-cover rounded-full bg-black"
                    />
                  </div>
                  <div>
                    <span className="text-white text-[11px] font-bold block flex items-center gap-1 drop-shadow-md leading-none">
                      sri_telangana_ruchulu
                      <CheckCircle2 size={11} className="text-blue-400 fill-blue-400 inline" />
                    </span>
                    <span className="text-white/70 text-[9px]">Warangal, Telangana</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {/* Mute/Unmute Audio Toggle */}
                  <button
                    type="button"
                    onClick={toggleMute}
                    aria-label={isMuted ? "Unmute reel" : "Mute reel"}
                    className="w-8 h-8 rounded-full bg-black/60 hover:bg-white/20 text-white flex items-center justify-center transition cursor-pointer backdrop-blur-md border border-white/15"
                  >
                    {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} className="text-amber-400" />}
                  </button>

                  {/* Close Modal Button */}
                  <button
                    type="button"
                    onClick={() => setActiveReel(null)}
                    aria-label="Close reel player"
                    className="w-8 h-8 rounded-full bg-black/60 hover:bg-white/20 text-white flex items-center justify-center transition cursor-pointer backdrop-blur-md border border-white/15"
                  >
                    <X size={16} />
                  </button>
                </div>
              </div>

              {/* Top Video Progress Scrubber Bar */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-white/20 z-30">
                <div
                  className="h-full bg-gradient-to-r from-amber-400 to-[#FD1D1D] transition-all duration-100 ease-linear"
                  style={{ width: `${progress}%` }}
                />
              </div>

              {/* Main Video Viewport (Tap to Play/Pause) */}
              <div 
                onClick={togglePlayPause}
                className="relative flex-1 w-full h-full bg-black flex items-center justify-center cursor-pointer overflow-hidden"
              >
                <video
                  ref={modalVideoRef}
                  src={activeReel.videoUrl}
                  poster={activeReel.image}
                  playsInline
                  autoPlay
                  loop
                  muted={isMuted}
                  onTimeUpdate={handleTimeUpdate}
                  className="w-full h-full object-cover"
                />

                {/* Center Temporary Play/Pause Indicator Animation */}
                <AnimatePresence>
                  {showPlayStateAnim && (
                    <motion.div
                      initial={{ scale: 0.5, opacity: 0 }}
                      animate={{ scale: 1.1, opacity: 1 }}
                      exit={{ scale: 0.8, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none"
                    >
                      <div className="w-16 h-16 rounded-full bg-black/70 backdrop-blur-md text-white flex items-center justify-center shadow-2xl border border-white/20">
                        {isPlaying ? (
                          <Play size={28} className="fill-current ml-0.5 text-white" />
                        ) : (
                          <Pause size={28} className="fill-current text-white" />
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Subtle Gradient Overlays */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-black/40 pointer-events-none" />

                {/* Right Side Social Actions Column */}
                <div className="absolute right-3 bottom-24 flex flex-col items-center gap-3.5 z-20">
                  {/* Like Button */}
                  <button
                    type="button"
                    onClick={(e) => toggleLike(e, activeReel.id)}
                    className="flex flex-col items-center cursor-pointer"
                    aria-label="Like reel"
                  >
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                      likedReels[activeReel.id] ? 'bg-red-500 text-white scale-110 shadow-lg' : 'bg-black/50 backdrop-blur-md text-white hover:bg-white/20'
                    }`}>
                      <Heart size={20} className={likedReels[activeReel.id] ? 'fill-current text-white' : ''} />
                    </div>
                    <span className="text-white text-[10px] font-bold mt-1 drop-shadow-md">
                      {likedReels[activeReel.id] ? (Number(activeReel.likes) + 1).toString() : activeReel.likes}
                    </span>
                  </button>

                  {/* Comment */}
                  <div className="flex flex-col items-center">
                    <div className="w-10 h-10 rounded-full bg-black/50 backdrop-blur-md text-white flex items-center justify-center">
                      <MessageCircle size={20} />
                    </div>
                    <span className="text-white text-[10px] font-bold mt-1 drop-shadow-md">
                      {activeReel.comments}
                    </span>
                  </div>

                  {/* Share */}
                  <button
                    type="button"
                    onClick={(e) => handleShare(e, activeReel)}
                    className="flex flex-col items-center text-white hover:text-amber-300 transition cursor-pointer"
                    aria-label="Share"
                  >
                    <div className="w-10 h-10 rounded-full bg-black/50 backdrop-blur-md flex items-center justify-center">
                      <Share2 size={18} />
                    </div>
                    <span className="text-[10px] font-bold mt-1 drop-shadow-md">Share</span>
                  </button>
                </div>

                {/* Reel Captions & Info Overlay */}
                <div className="absolute bottom-20 left-3.5 right-16 z-20 pointer-events-none">
                  <h3 className={`text-white font-black text-sm sm:text-base leading-snug drop-shadow-md mb-1 ${isTelugu ? 'font-telugu' : ''}`}>
                    {isTelugu ? activeReel.titleTe : activeReel.title}
                  </h3>
                  <p className="text-gray-200 text-[11px] leading-relaxed line-clamp-2 drop-shadow-sm mb-2">
                    {isTelugu ? activeReel.descTe : activeReel.desc}
                  </p>
                  <div className="flex items-center gap-2">
                    <span className="bg-amber-400/25 text-amber-300 font-extrabold px-2 py-0.5 rounded-md text-[10px] border border-amber-400/40 backdrop-blur-xs flex items-center gap-1">
                      <Sparkles size={10} />
                      {activeReel.views} {t('reels.views')}
                    </span>
                    <span className="text-white/60 text-[10px]">• Original Instagram Audio</span>
                  </div>
                </div>

                {/* Bottom CTA Shopping & Instagram Buttons */}
                <div className="absolute bottom-3 left-3.5 right-3.5 z-20 flex gap-2 pointer-events-auto">
                  <Link
                    to={`/product/${activeReel.productSlug}`}
                    onClick={() => setActiveReel(null)}
                    className="flex-1 py-2.5 px-3 rounded-xl bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 hover:opacity-95 text-white font-black text-xs text-center flex items-center justify-center gap-1.5 shadow-lg transition-all active:scale-98"
                  >
                    <ShoppingBag size={14} />
                    <span className="truncate">{t('reels.shopDelicacy')} • ₹{activeReel.productPrice}</span>
                  </Link>

                  <a
                    href={activeReel.instaUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="py-2.5 px-3 rounded-xl bg-white/15 hover:bg-white/25 text-white font-bold text-xs flex items-center justify-center gap-1 border border-white/20 transition-all"
                    title="Watch this reel on Instagram"
                  >
                    <ExternalLink size={14} />
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
