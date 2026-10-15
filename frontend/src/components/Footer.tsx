import { Link } from 'react-router-dom';
import { Camera, Mail, MapPin, Phone } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-brand-dark pt-10 sm:pt-20 pb-6 sm:pb-10 border-t border-white/10">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-12 mb-8 sm:mb-16">
          {/* Brand Info */}
          <div className="col-span-2 md:col-span-1">
            <Link to="/" className="inline-block mb-4 sm:mb-6">
              <img 
                src="/images/brand_logo.png" 
                alt="Sri Telangana Ruchulu" 
                className="w-32 sm:w-48 object-contain rounded-xl sm:rounded-2xl shadow-2xl border border-white/10"
              />
            </Link>
            <p className="text-xs sm:text-base text-gray-300 mb-4 sm:mb-6">
              Authentic traditional Telangana Pindi Vantalu and Pachadlu, handcrafted with love and ancient recipes from the heart of Warangal.
            </p>
            <div className="flex space-x-4">
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-brand-primary text-white rounded-full flex items-center justify-center hover:bg-brand-dark transition-colors">
                <Camera size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="col-span-1">
            <h4 className="text-sm sm:text-lg font-bold text-white mb-4 sm:mb-6 uppercase tracking-wider">Quick Links</h4>
            <ul className="space-y-2 sm:space-y-4 text-xs sm:text-base">
              <li><Link to="/about" className="text-gray-400 hover:text-brand-primary transition-colors">Our Story</Link></li>
              <li><Link to="/categories" className="text-gray-400 hover:text-brand-primary transition-colors">Shop All Categories</Link></li>
              <li><Link to="/login" className="text-gray-400 hover:text-brand-primary transition-colors">My Account</Link></li>
              <li><Link to="/track-order" className="text-gray-400 hover:text-brand-primary transition-colors">Track Order</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div className="col-span-1">
            <h4 className="text-sm sm:text-lg font-bold text-white mb-4 sm:mb-6 uppercase tracking-wider">Support</h4>
            <ul className="space-y-2 sm:space-y-4 text-xs sm:text-base">
              <li><Link to="/faq" className="text-gray-400 hover:text-brand-primary transition-colors">FAQ</Link></li>
              <li><Link to="/shipping-policy" className="text-gray-400 hover:text-brand-primary transition-colors">Shipping Policy</Link></li>
              <li><Link to="/return-policy" className="text-gray-400 hover:text-brand-primary transition-colors">Return Policy</Link></li>
              <li><Link to="/contact" className="text-gray-400 hover:text-brand-primary transition-colors">Contact Us</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="col-span-2 md:col-span-1">
            <h4 className="text-sm sm:text-lg font-bold text-white mb-4 sm:mb-6 uppercase tracking-wider">Contact</h4>
            <ul className="space-y-2 sm:space-y-4 text-xs sm:text-base">
              <li className="flex items-start">
                <MapPin className="text-brand-primary mr-3 mt-1 flex-shrink-0" size={20} />
                <span className="text-gray-400">Warangal, Telangana, India</span>
              </li>
              <li className="flex items-center">
                <Phone className="text-brand-primary mr-3 flex-shrink-0" size={20} />
                <span className="text-gray-400">+91 98765 43210</span>
              </li>
              <li className="flex items-center">
                <Mail className="text-brand-primary mr-3 flex-shrink-0" size={20} />
                <span className="text-gray-400">support@sritelanganaruchulu.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 pt-6 flex flex-col md:flex-row justify-between items-center text-xs sm:text-sm">
          <p className="text-gray-400 mb-3 md:mb-0 text-center">
            &copy; {new Date().getFullYear()} Sri Telangana Ruchulu. All rights reserved.
          </p>
          <div className="flex space-x-6 text-gray-400">
            <Link to="/privacy-policy" className="hover:text-brand-primary transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-brand-primary transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
