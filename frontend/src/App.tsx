import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { HelmetProvider } from 'react-helmet-async';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { Home } from './pages/Home';
import { Shop } from './pages/Shop';
import { ProductDetail } from './pages/ProductDetail';
import { Cart } from './pages/Cart';
import { Checkout } from './pages/Checkout';
import { AdminDashboard } from './pages/AdminDashboard';
import { Categories } from './pages/Categories';
import { About } from './pages/About';
import { Login } from './pages/Login';
import { Profile } from './pages/Profile';
import { FAQ, ShippingPolicy, ReturnPolicy, ContactUs, PrivacyPolicy, TermsOfService, TrackOrder } from './pages/InfoPages';
import { WhatsAppButton } from './components/WhatsAppButton';
import { ScrollToTop } from './components/ScrollToTop';
import { SplashScreen } from './components/SplashScreen';
import { useAuthStore } from './store/authStore';

const queryClient = new QueryClient();

function AdminRoute({ children }: { children: React.ReactNode }) {
  const { isLoggedIn, user } = useAuthStore();
  
  if (!isLoggedIn || user?.role !== 'ADMIN') {
    return <Navigate to="/login?redirect=/admin" replace />;
  }
  
  return <>{children}</>;
}

function AnimatedRoutes() {
  const location = useLocation();

  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
  }, []);
  
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Home />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/search" element={<Shop />} />
        <Route path="/products" element={<Shop />} />
        <Route path="/category/:categoryId" element={<Shop />} />
        <Route path="/categories" element={<Categories />} />
        <Route path="/product/:slug" element={<ProductDetail />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Navigate to="/login" replace />} />
        <Route path="/profile" element={<Profile />} />
        <Route 
          path="/admin" 
          element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          } 
        />
        <Route path="/about" element={<About />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/shipping-policy" element={<ShippingPolicy />} />
        <Route path="/return-policy" element={<ReturnPolicy />} />
        <Route path="/contact" element={<ContactUs />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/terms" element={<TermsOfService />} />
        <Route path="/track-order" element={<TrackOrder />} />
        <Route path="/track" element={<TrackOrder />} />
        <Route path="/tracking" element={<TrackOrder />} />
        <Route path="/order-tracking" element={<TrackOrder />} />
        <Route path="*" element={<div className="text-center py-20 text-2xl">Page Not Found</div>} />
      </Routes>
    </AnimatePresence>
  );
}

function AppLayout() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');
  const isHomePage = location.pathname === '/';

  return (
    <div className={`flex flex-col min-h-screen relative bg-[#FDFBF7] ${isAdminRoute ? 'bg-gray-50 text-gray-900' : 'bg-muggu'}`}>
      {!isAdminRoute && (
        <>
          {/* Subtle dark gradient overlay only on the hero section so transparent navbar text remains crisp */}
          {isHomePage && (
            <div className="absolute top-0 left-0 right-0 h-36 bg-gradient-to-b from-black/60 to-transparent z-30 pointer-events-none"></div>
          )}
          <Header />
        </>
      )}
      
      <main className="flex-grow">
        <AnimatedRoutes />
      </main>

      {!isAdminRoute && (
        <>
          <Footer />
          <WhatsAppButton />
        </>
      )}
    </div>
  );
}

function App() {
  const [splashFinished, setSplashFinished] = useState(false);
  const isDirectAdmin = typeof window !== 'undefined' && window.location.pathname.startsWith('/admin');

  return (
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        {!splashFinished && !isDirectAdmin && (
          <SplashScreen onComplete={() => setSplashFinished(true)} />
        )}
        <Router>
          <ScrollToTop />
          <AppLayout />
        </Router>
      </QueryClientProvider>
    </HelmetProvider>
  );
}

export default App;
