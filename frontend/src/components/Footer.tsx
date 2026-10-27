import { Link } from 'react-router-dom';
import { Mail, MapPin, Phone } from 'lucide-react';

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
            <div className="flex space-x-3">
              <a
                href="https://www.instagram.com/sri_telangana_ruchulu?cplk=YmN0dWRxdjR5NTB5&utm_source=qr"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="w-10 h-10 bg-brand-primary text-white rounded-full flex items-center justify-center hover:bg-white hover:text-brand-dark hover:scale-110 transition-all duration-300 shadow-md"
              >
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </a>
              <a
                href="https://www.facebook.com/share/14upezoYuLw/?mibextid=wwXIfr"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="w-10 h-10 bg-brand-primary text-white rounded-full flex items-center justify-center hover:bg-white hover:text-brand-dark hover:scale-110 transition-all duration-300 shadow-md"
              >
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </a>
              <a
                href="https://wa.me/918121345585?text=Hello%20Sri%20Telangana%20Ruchulu!%20I%20would%20like%20to%20place%20an%20order."
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp"
                className="w-10 h-10 bg-brand-primary text-white rounded-full flex items-center justify-center hover:bg-white hover:text-brand-dark hover:scale-110 transition-all duration-300 shadow-md"
              >
                <svg className="w-5 h-5 fill-current" viewBox="0 0 16 16">
                  <path d="M13.601 2.326A7.85 7.85 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.9 7.9 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.9 7.9 0 0 0 13.6 2.326zM7.994 14.521a6.6 6.6 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.56 6.56 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592m3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.73.73 0 0 0-.529.247c-.182.198-.691.677-.691 1.654s.71 1.916.81 2.049c.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232" />
                </svg>
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
              <li>
                <a
                  href="https://maps.app.goo.gl/zopqiWgNNhhbxqjE8?g_st=iw"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start text-gray-400 hover:text-brand-primary transition-colors group"
                >
                  <MapPin className="text-brand-primary mr-3 mt-1 flex-shrink-0 group-hover:scale-110 transition-transform" size={20} />
                  <span>Warangal, Telangana, India</span>
                </a>
              </li>
              <li className="flex items-center">
                <Phone className="text-brand-primary mr-3 flex-shrink-0" size={20} />
                <a href="tel:+918121345585" className="text-gray-400 hover:text-brand-primary transition-colors">+91 81213 45585</a>
              </li>
              <li className="flex items-center">
                <Mail className="text-brand-primary mr-3 flex-shrink-0" size={20} />
                <a href="mailto:sritelaganaruchuluu@gmail.com" className="text-gray-400 hover:text-brand-primary transition-colors">sritelaganaruchuluu@gmail.com</a>
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
