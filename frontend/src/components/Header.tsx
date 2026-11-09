import { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ShoppingCart, Menu, Search, User, X, Phone, Package, ChevronRight, ChevronDown, LogOut, ShieldCheck, MapPin, LogIn } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCartStore } from '../store/cartStore';
import { useAuthStore } from '../store/authStore';
import { SearchModal } from './SearchModal';
import { LanguageToggle } from './LanguageToggle';
import { useTranslation } from '../utils/translations';

export const Header = () => {
  const totalItems = useCartStore((state) => state.getTotalItems());
  const { isLoggedIn, user, logout } = useAuthStore();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isDrawerProfileOpen, setIsDrawerProfileOpen] = useState(true);
  const profileDropdownRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close profile dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target as Node)) {
        setIsProfileMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);

  // Close menus on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsProfileMenuOpen(false);
  }, [location.pathname, location.search]);

  const { t, isTelugu } = useTranslation();

  const navLinks = [
    { name: t('nav.home'), path: '/' },
    { name: t('nav.categories'), path: '/categories' },
    { name: t('nav.shop') || 'Shop All', path: '/shop' },
    { name: t('nav.about'), path: '/about' }
  ];

  const isHomePage = location.pathname === '/';

  return (
    <header className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ease-in-out ${
      isScrolled 
        ? 'bg-brand-dark/95 backdrop-blur-md shadow-[0_4px_20px_rgba(0,0,0,0.3)] py-2 sm:py-2.5 border-b border-white/10' 
        : isHomePage
          ? 'bg-gradient-to-b from-black/80 via-black/40 to-transparent py-2.5 sm:py-4 border-b border-white/5'
          : 'bg-brand-dark py-2.5 sm:py-4 border-b border-white/10 shadow-md'
    }`}>
      {/* Admin Mode Top Banner for Admin browsing customer storefront */}
      {isLoggedIn && user?.role === 'ADMIN' && (
        <div className="bg-gradient-to-r from-amber-600 to-amber-700 text-white px-3 sm:px-4 py-1 sm:py-1.5 text-xs font-semibold flex items-center justify-between border-b border-white/20 shadow-sm">
          <div className="flex items-center gap-2">
            <span className="bg-black/30 text-amber-200 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider">
              Admin Mode
            </span>
            <span className="hidden sm:inline">Storefront View as Administrator ({user.email})</span>
          </div>
          <div className="flex items-center gap-3">
            <Link 
              to="/admin" 
              className="bg-brand-dark hover:bg-black text-amber-300 px-2.5 py-0.5 rounded-lg text-xs font-bold transition flex items-center gap-1 shadow-xs"
            >
              Return to Dashboard →
            </Link>
            <button
              onClick={() => {
                useAuthStore.getState().logout();
              }}
              className="text-white hover:text-red-200 underline text-xs font-bold cursor-pointer"
            >
              Log Out
            </button>
          </div>
        </div>
      )}

      {/* Main Navbar Bar */}
      <div className="container mx-auto px-3 sm:px-4 max-w-7xl flex items-center justify-between gap-2">
        
        {/* Left Side: Mobile Menu Button + Brand Logo & Title */}
        <div className="flex items-center gap-1.5 sm:gap-3 min-w-0 flex-1 sm:flex-initial">
          {/* Mobile Menu Trigger Button */}
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden w-9 h-9 flex items-center justify-center rounded-xl bg-white/5 hover:bg-white/10 active:bg-white/20 text-white hover:text-brand-primary transition-all flex-shrink-0 cursor-pointer border border-white/10"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>

          {/* Brand Logo & Name */}
          <Link to="/" className="flex items-center gap-2 sm:gap-2.5 min-w-0 group">
            <div className={`transition-all duration-300 flex items-center justify-center flex-shrink-0 group-hover:scale-105 ${
              isScrolled ? 'w-9 h-9 sm:w-11 sm:h-11' : 'w-9 h-9 sm:w-12 sm:h-12'
            }`}>
              <img 
                src="/images/brand_logo.png" 
                alt="Sri Telangana Ruchulu" 
                className="w-full h-full object-contain rounded-full shadow-md border border-white/20 transition-all duration-300 group-hover:shadow-[0_0_15px_rgba(209,161,85,0.4)]"
              />
            </div>
            <div className="flex flex-col min-w-0 justify-center">
              <span className={`font-heading font-extrabold text-xs sm:text-base lg:text-lg tracking-tight text-white group-hover:text-brand-primary transition-colors leading-tight drop-shadow-md truncate ${isTelugu ? 'font-telugu' : ''}`}>
                {isTelugu ? 'శ్రీ తెలంగాణ రుచులు' : 'Sri Telangana Ruchulu'}
              </span>
              <span className="hidden xs:block text-[8px] sm:text-[9px] tracking-wider text-brand-accent uppercase font-semibold leading-none mt-0.5 truncate opacity-90">
                {isTelugu ? 'అచ్చమైన సంప్రదాయ రుచులు' : 'Pure Traditional Flavors'}
              </span>
            </div>
          </Link>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-6 xl:gap-8">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.name}
                to={link.path}
                className={`relative text-xs xl:text-sm font-semibold tracking-wide transition-colors py-1 ${
                  isActive ? 'text-brand-primary font-bold' : 'text-gray-200 hover:text-brand-primary'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeNav"
                    className="absolute -bottom-1 left-0 right-0 h-0.5 bg-brand-primary rounded-full shadow-[0_0_8px_rgba(209,161,85,0.8)]"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ type: "spring", stiffness: 350, damping: 30 }}
                  />
                )}
                {link.name}
              </Link>
            );
          })}
        </nav>

        {/* Right Side Action Buttons */}
        <div className="flex items-center gap-1 sm:gap-2.5 flex-shrink-0">
          {/* Language Switcher Pill (Compact 1-tap on mobile, full segmented on desktop) */}
          <LanguageToggle variant="header" />

          {/* Desktop Search Pill Button */}
          <button 
            onClick={() => setIsSearchOpen(true)} 
            className="hidden sm:flex items-center gap-2 rounded-full border border-white/20 bg-white/10 hover:bg-white/20 hover:border-brand-accent/50 text-white transition-all duration-300 backdrop-blur-sm shadow-sm px-3.5 py-1.5 group text-xs font-semibold cursor-pointer"
          >
            <Search size={14} className="text-brand-accent group-hover:scale-110 transition-transform" />
            <span className="hidden md:inline font-semibold">{t('nav.search')}</span>
          </button>

          {/* Mobile Search Icon Button */}
          <button 
            onClick={() => setIsSearchOpen(true)} 
            className="sm:hidden w-9 h-9 flex items-center justify-center rounded-xl bg-white/5 hover:bg-white/10 active:bg-white/20 text-white hover:text-brand-accent transition-all cursor-pointer border border-white/10"
            aria-label="Search delicacies"
          >
            <Search size={17} />
          </button>

          {/* User Profile Button & Dropdown (Mobile & Desktop) */}
          <div ref={profileDropdownRef} className="relative">
            <button
              type="button"
              onClick={() => setIsProfileMenuOpen((prev) => !prev)}
              className="w-9 h-9 sm:w-auto sm:h-9 sm:px-2.5 flex items-center justify-center gap-1.5 rounded-xl bg-white/5 hover:bg-white/10 active:bg-white/20 text-white hover:text-brand-primary transition-all cursor-pointer border border-white/10"
              aria-label="Account & Orders menu"
              aria-expanded={isProfileMenuOpen}
            >
              {isLoggedIn ? (
                <div
                  className={`rounded-full ${
                    user?.role === 'ADMIN'
                      ? 'bg-amber-400 text-brand-dark font-black ring-2 ring-amber-300'
                      : 'bg-brand-primary text-brand-dark font-bold ring-2 ring-brand-primary/50'
                  } w-6 h-6 text-[11px] flex items-center justify-center`}
                >
                  {user?.role === 'ADMIN' ? '🛡️' : (user?.name?.charAt(0).toUpperCase() || 'U')}
                </div>
              ) : (
                <User size={18} />
              )}
              <ChevronDown
                size={13}
                className={`hidden sm:block text-white/70 transition-transform duration-200 ${
                  isProfileMenuOpen ? 'rotate-180 text-brand-primary' : ''
                }`}
              />
            </button>

            <AnimatePresence>
              {isProfileMenuOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.96 }}
                  transition={{ duration: 0.16, ease: 'easeOut' }}
                  className="absolute right-0 mt-2.5 w-64 rounded-2xl bg-[#1C0500] border border-amber-400/30 shadow-2xl overflow-hidden z-50 text-white"
                >
                  {/* Profile Header */}
                  <div className="px-4 py-3.5 bg-gradient-to-r from-[#2A0800] to-[#3A0E02] border-b border-white/10">
                    {isLoggedIn ? (
                      <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-full bg-amber-400 text-brand-dark font-black text-sm flex items-center justify-center flex-shrink-0">
                          {user?.name?.charAt(0).toUpperCase() || 'U'}
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-extrabold text-white truncate">{user?.name}</p>
                          <p className="text-[10px] text-amber-200/80 truncate">{user?.email}</p>
                        </div>
                      </div>
                    ) : (
                      <div>
                        <p className="text-xs font-extrabold text-white">
                          {isTelugu ? 'ఖాతా & ఆర్డర్లు' : 'Account & Orders'}
                        </p>
                        <p className="text-[10px] text-amber-200/80 mt-0.5">
                          {isTelugu
                            ? 'మీ ప్రొఫైల్ మరియు ఆర్డర్లను నిర్వహించండి'
                            : 'Manage your profile & track orders'}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Dropdown Links */}
                  <div className="p-2 space-y-1">
                    {isLoggedIn ? (
                      <>
                        {user?.role === 'ADMIN' && (
                          <Link
                            to="/admin"
                            onClick={() => setIsProfileMenuOpen(false)}
                            className="flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold text-amber-300 hover:bg-amber-400/15 transition"
                          >
                            <span className="flex items-center gap-2.5">
                              <ShieldCheck size={16} className="text-amber-400" />
                              {t('nav.admin') || 'Admin Dashboard'}
                            </span>
                            <ChevronRight size={14} className="text-white/40" />
                          </Link>
                        )}
                        <Link
                          to="/profile"
                          onClick={() => setIsProfileMenuOpen(false)}
                          className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition ${
                            location.pathname === '/profile'
                              ? 'bg-amber-400/20 text-amber-300'
                              : 'text-gray-200 hover:bg-white/10 hover:text-white'
                          }`}
                        >
                          <span className="flex items-center gap-2.5">
                            <User size={16} className="text-brand-primary" />
                            {isTelugu ? 'నా ప్రొఫైల్' : 'My Profile'}
                          </span>
                          <ChevronRight size={14} className="text-white/40" />
                        </Link>
                      </>
                    ) : (
                      <Link
                        to="/login"
                        onClick={() => setIsProfileMenuOpen(false)}
                        className="flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold text-gray-200 hover:bg-white/10 hover:text-white transition"
                      >
                        <span className="flex items-center gap-2.5">
                          <LogIn size={16} className="text-brand-primary" />
                          {t('nav.login') || 'Login / Sign Up'}
                        </span>
                        <ChevronRight size={14} className="text-white/40" />
                      </Link>
                    )}

                    {/* Orders Item inside Profile Dropdown */}
                    <Link
                      to="/orders"
                      onClick={() => setIsProfileMenuOpen(false)}
                      className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition ${
                        location.pathname === '/orders'
                          ? 'bg-amber-400/20 text-amber-300 border border-amber-400/30'
                          : 'text-gray-200 hover:bg-white/10 hover:text-white'
                      }`}
                    >
                      <span className="flex items-center gap-2.5">
                        <Package size={16} className="text-amber-400" />
                        <span>{isTelugu ? 'నా ఆర్డర్లు (Orders)' : 'Orders'}</span>
                      </span>
                      <ChevronRight size={14} className="text-white/40" />
                    </Link>

                    {isLoggedIn && (
                      <Link
                        to="/profile?tab=addresses"
                        onClick={() => setIsProfileMenuOpen(false)}
                        className="flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold text-gray-200 hover:bg-white/10 hover:text-white transition"
                      >
                        <span className="flex items-center gap-2.5">
                          <MapPin size={16} className="text-brand-primary" />
                          <span>{isTelugu ? 'డెలివరీ చిరునామాలు' : 'Saved Addresses'}</span>
                        </span>
                        <ChevronRight size={14} className="text-white/40" />
                      </Link>
                    )}
                  </div>

                  {isLoggedIn && (
                    <div className="p-2 border-t border-white/10 bg-black/20">
                      <button
                        type="button"
                        onClick={() => {
                          setIsProfileMenuOpen(false);
                          logout();
                          navigate('/');
                        }}
                        className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-rose-300 hover:bg-rose-500/20 hover:text-rose-200 transition cursor-pointer"
                      >
                        <LogOut size={15} />
                        <span>{isTelugu ? 'లాగ్ అవుట్' : 'Logout'}</span>
                      </button>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Cart Icon Button */}
          <Link 
            to="/cart" 
            className="w-9 h-9 flex items-center justify-center rounded-xl bg-white/5 hover:bg-white/10 active:bg-white/20 text-white hover:text-brand-primary transition-all relative cursor-pointer border border-white/10"
            aria-label="Shopping Cart"
          >
            <ShoppingCart size={18} />
            {totalItems > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-amber-400 text-[#2A0800] text-[10px] font-black min-w-[17px] h-[17px] rounded-full px-1 flex items-center justify-center shadow-md animate-pulse">
                {totalItems}
              </span>
            )}
          </Link>
        </div>

      </div>

      {/* Search Modal */}
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />

      {/* Mobile Drawer Menu with AnimatePresence */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/75 backdrop-blur-sm"
            />

            {/* Slide-out Menu Panel */}
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 300 }}
              className="fixed top-0 left-0 bottom-0 w-[82%] max-w-sm bg-gradient-to-b from-[#1C0500] via-[#2A0800] to-[#1C0500] border-r border-white/15 p-5 flex flex-col justify-between overflow-y-auto shadow-2xl z-10"
            >
              <div>
                {/* Menu Header with Brand & Close */}
                <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-5">
                  <div className="flex items-center gap-2.5">
                    <img 
                      src="/images/brand_logo.png" 
                      alt="Sri Telangana Ruchulu" 
                      className="w-10 h-10 object-contain rounded-full border border-amber-400/40"
                    />
                    <div>
                      <span className={`font-heading font-black text-sm text-white block ${isTelugu ? 'font-telugu' : ''}`}>
                        {isTelugu ? 'శ్రీ తెలంగాణ రుచులు' : 'Sri Telangana Ruchulu'}
                      </span>
                      <span className="text-[10px] text-amber-300/80 font-medium block">
                        Warangal Traditional Flavors
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition cursor-pointer"
                    aria-label="Close menu"
                  >
                    <X size={18} />
                  </button>
                </div>

                {/* Navigation Links */}
                <div className="flex flex-col gap-1 mb-6">
                  {navLinks.map((link) => {
                    const isActive = location.pathname === link.path;
                    const isOrdersLink = link.path === '/orders';
                    return (
                      <Link
                        key={link.path}
                        to={link.path}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-bold transition-all ${
                          isActive 
                            ? 'bg-amber-400/20 text-amber-300 border border-amber-400/30' 
                            : 'text-gray-200 hover:text-white hover:bg-white/5'
                        }`}
                      >
                        <span className="flex items-center gap-2">
                          {isOrdersLink && <Package size={16} className="text-amber-400" />}
                          {link.name}
                        </span>
                        <ChevronRight size={16} className="text-white/40" />
                      </Link>
                    );
                  })}
                </div>

                {/* High-visibility Language Switcher in Mobile Drawer */}
                <div className="mb-6">
                  <span className="text-[11px] font-bold text-amber-300 uppercase tracking-wider block mb-2 px-1">
                    Language Selection
                  </span>
                  <LanguageToggle variant="mobile" />
                </div>
              </div>

              {/* Bottom Footer Section in Drawer: Profile Dropdown with Orders */}
              <div className="pt-4 border-t border-white/10 flex flex-col gap-3">
                <div className="rounded-2xl bg-white/5 border border-white/10 overflow-hidden">
                  <button
                    type="button"
                    onClick={() => setIsDrawerProfileOpen((prev) => !prev)}
                    className="w-full flex items-center justify-between p-3 text-white font-bold text-xs transition hover:bg-white/5 cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-full bg-amber-400 text-brand-dark flex items-center justify-center font-black text-xs">
                        {isLoggedIn ? (user?.name?.charAt(0).toUpperCase() || 'U') : <User size={14} />}
                      </div>
                      <span className="truncate max-w-[170px]">
                        {isLoggedIn ? user?.name || 'My Profile' : (isTelugu ? 'ప్రొఫైల్ & ఆర్డర్లు' : 'Profile & Orders')}
                      </span>
                    </div>
                    <ChevronDown
                      size={15}
                      className={`text-amber-300 transition-transform duration-200 ${
                        isDrawerProfileOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </button>

                  <AnimatePresence initial={false}>
                    {isDrawerProfileOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="border-t border-white/10 bg-black/25 px-2 py-2 space-y-1 overflow-hidden"
                      >
                        <Link
                          to={isLoggedIn ? (user?.role === 'ADMIN' ? '/admin' : '/profile') : '/login'}
                          onClick={() => setIsMobileMenuOpen(false)}
                          className="flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold text-gray-200 hover:text-white hover:bg-white/10 transition"
                        >
                          <span className="flex items-center gap-2">
                            <User size={14} className="text-brand-primary" />
                            {isLoggedIn
                              ? user?.role === 'ADMIN'
                                ? 'Admin Dashboard'
                                : isTelugu
                                ? 'నా ప్రొఫైల్'
                                : 'My Profile'
                              : isTelugu
                              ? 'లాగిన్ / రిజిస్టర్'
                              : 'Login / Register'}
                          </span>
                          <ChevronRight size={13} className="text-white/40" />
                        </Link>

                        <Link
                          to="/orders"
                          onClick={() => setIsMobileMenuOpen(false)}
                          className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition ${
                            location.pathname === '/orders'
                              ? 'bg-amber-400/20 text-amber-300 border border-amber-400/30'
                              : 'text-gray-200 hover:text-white hover:bg-white/10'
                          }`}
                        >
                          <span className="flex items-center gap-2">
                            <Package size={14} className="text-amber-400" />
                            <span>{isTelugu ? 'నా ఆర్డర్లు (Orders)' : 'Orders'}</span>
                          </span>
                          <ChevronRight size={13} className="text-white/40" />
                        </Link>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Direct WhatsApp Call Pill */}
                <a
                  href="https://wa.me/918121345585"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs shadow-md transition"
                >
                  <Phone size={14} />
                  <span>WhatsApp: +91 81213 45585</span>
                </a>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </header>
  );
};
