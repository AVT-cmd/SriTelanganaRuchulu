import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingCart, Menu, Search, User, X } from 'lucide-react';
import { motion } from 'framer-motion';
import { useCartStore } from '../store/cartStore';
import { useAuthStore } from '../store/authStore';
import { SearchModal } from './SearchModal';

export const Header = () => {
  const totalItems = useCartStore((state) => state.getTotalItems());
  const { isLoggedIn, user } = useAuthStore();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Categories', path: '/categories' },
    { name: 'About Us', path: '/about' }
  ];

  const isHomePage = location.pathname === '/';

  return (
    <header className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 ease-in-out ${
      isScrolled 
        ? 'bg-brand-dark/95 backdrop-blur-md shadow-[0_4px_20px_rgba(0,0,0,0.25)] py-2.5 border-b border-white/10' 
        : isHomePage
          ? 'bg-transparent border-transparent py-4 sm:py-5'
          : 'bg-brand-dark py-4 sm:py-5 border-b border-white/10'
    }`}>
      {/* Admin Mode Top Banner for Admin browsing customer storefront */}
      {isLoggedIn && user?.role === 'ADMIN' && (
        <div className="bg-gradient-to-r from-amber-600 to-amber-700 text-white px-4 py-1.5 text-xs font-semibold flex items-center justify-between border-b border-white/20 shadow-sm">
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
              Return to Admin Dashboard →
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

      <div className="container mx-auto px-4 flex items-center justify-between">
        
        {/* Mobile menu trigger */}
        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="lg:hidden text-white hover:text-brand-primary transition-colors p-1"
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
        </button>

        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-2.5 sm:gap-3 group">
          <div className={`transition-all duration-300 flex items-center justify-center group-hover:scale-105 ${
            isScrolled ? 'w-10 h-10 sm:w-11 sm:h-11' : 'w-12 h-12 sm:w-14 sm:h-14'
          }`}>
            <img 
              src="/images/brand_logo.png" 
              alt="Sri Telangana Ruchulu" 
              className="w-full h-full object-contain rounded-full shadow-lg border-2 border-white/10 transition-all duration-300 group-hover:shadow-[0_0_15px_rgba(209,161,85,0.4)]"
            />
          </div>
          <div className="flex flex-col">
            <span className="font-heading font-extrabold text-base sm:text-xl tracking-tight text-white group-hover:text-brand-primary transition-colors leading-tight drop-shadow-md">
              Sri Telangana Ruchulu
            </span>
            <span className="text-[9px] sm:text-[10px] tracking-widest text-brand-accent uppercase font-medium">
              Pure Traditional Flavors
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-7">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.name}
                to={link.path}
                className={`relative text-xs font-semibold tracking-wide transition-colors py-1 ${
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

        {/* Actions */}
        <div className={`flex items-center transition-all duration-300 ${isScrolled ? 'gap-3 sm:gap-4' : 'gap-4 sm:gap-6'}`}>
          {/* Desktop Search Pill Button */}
          <button 
            onClick={() => setIsSearchOpen(true)} 
            className="hidden sm:flex items-center gap-2 rounded-full border border-white/20 bg-white/10 hover:bg-white/20 hover:border-brand-accent/50 text-white transition-all duration-300 backdrop-blur-sm shadow-sm px-4 py-2 group text-sm font-semibold"
          >
            <Search size={16} className="text-brand-accent group-hover:scale-110 transition-transform" />
            <span className="hidden md:inline font-semibold">Search products...</span>
          </button>

          {/* Mobile Search Icon */}
          <button 
            onClick={() => setIsSearchOpen(true)} 
            className="sm:hidden text-white hover:text-brand-accent transition-colors p-1"
            aria-label="Search"
          >
            <Search size={isScrolled ? 20 : 22} />
          </button>

          {/* User Profile / Login Link */}
          <Link 
            to={isLoggedIn ? (user?.role === 'ADMIN' ? '/admin' : '/profile') : '/login'} 
            className="hidden sm:flex items-center gap-2 text-white hover:text-brand-primary transition-all duration-300 transform hover:scale-105"
            title={isLoggedIn ? `${user?.role === 'ADMIN' ? 'Admin Dashboard' : 'Profile'}: ${user?.name}` : 'Login / Sign Up'}
          >
            {isLoggedIn ? (
              <div className={`rounded-full ${
                user?.role === 'ADMIN' 
                  ? 'bg-amber-400 text-brand-dark font-black ring-2 ring-amber-300' 
                  : 'bg-brand-primary text-brand-dark font-bold ring-2 ring-brand-primary/50'
              } flex items-center justify-center transition-all duration-300 ${
                isScrolled ? 'w-7 h-7 text-[10px]' : 'w-8 h-8 text-xs'
              }`}>
                {user?.role === 'ADMIN' ? '🛡️' : (user?.name?.charAt(0).toUpperCase() || 'U')}
              </div>
            ) : (
              <User size={isScrolled ? 19 : 22} />
            )}
          </Link>

          {/* Cart Icon */}
          <Link to="/cart" className="relative text-white hover:text-brand-primary transition-all duration-300 transform hover:scale-110 flex items-center">
            <ShoppingCart size={isScrolled ? 20 : 24} />
            {totalItems > 0 && (
              <span className={`absolute bg-brand-primary text-brand-dark font-black rounded-full transition-all duration-300 ${
                isScrolled ? '-top-1.5 -right-1.5 text-[10px] px-1 py-0.2' : '-top-2 -right-2 text-xs px-1.5 py-0.5'
              }`}>
                {totalItems}
              </span>
            )}
          </Link>
        </div>

      </div>

      {/* Search Modal */}
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-30 bg-black/60 backdrop-blur-sm lg:hidden pt-20">
          <div className="bg-brand-dark border-b border-white/10 p-6 flex flex-col gap-4">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-white hover:text-brand-primary font-bold text-base py-2 border-b border-white/5"
              >
                {link.name}
              </Link>
            ))}
            <div className="pt-2 border-t border-white/10 flex items-center gap-3">
              <Link 
                to={isLoggedIn ? (user?.role === 'ADMIN' ? '/admin' : '/profile') : '/login'} 
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-brand-primary font-bold flex items-center gap-2 text-sm"
              >
                <User size={18} />
                {isLoggedIn ? (user?.role === 'ADMIN' ? 'Admin Dashboard' : `Logged in: ${user?.name}`) : 'Login / Register'}
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
