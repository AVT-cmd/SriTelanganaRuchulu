import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import {
  User, Lock, Mail, ArrowRight,
  CheckCircle2, X, RefreshCw, KeyRound, ArrowLeft, Shield
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { loginUser, loginWithOtp, sendOtp } from '../api';

export const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const login = useAuthStore((state) => state.login);

  // OTP Login state
  const [email, setEmail] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [otpStep, setOtpStep] = useState<'INPUT' | 'VERIFY'>('INPUT');
  const [otpCode, setOtpCode] = useState('');
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [resendTimer, setResendTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);

  // Admin login modal state
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [adminEmail, setAdminEmail] = useState('admin@sritelanganaruchulu.com');
  const [adminPassword, setAdminPassword] = useState('');
  const [isAdminLoading, setIsAdminLoading] = useState(false);
  const [adminError, setAdminError] = useState('');

  // Redirect target
  const queryParams = new URLSearchParams(location.search);
  const redirectTo = queryParams.get('redirect') || '/profile';

  // Resend OTP Countdown
  useEffect(() => {
    let timer: any;
    if (otpStep === 'VERIFY' && resendTimer > 0) {
      timer = setInterval(() => {
        setResendTimer((prev) => {
          if (prev <= 1) {
            setCanResend(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [otpStep, resendTimer]);

  // Step 1: Send Login OTP to Email
  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    const cleanEmail = email.trim();
    if (!cleanEmail || !cleanEmail.includes('@')) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }

    setIsSendingOtp(true);
    try {
      const res = await sendOtp({
        email: cleanEmail,
        name: customerName.trim() || undefined,
        purpose: 'LOGIN'
      });

      if (res && res.success) {
        setOtpStep('VERIFY');
        setResendTimer(60);
        setCanResend(false);
        setSuccessMessage(`One-Time Password (OTP) has been sent to ${cleanEmail}. Please check your email inbox.`);
      } else {
        setErrorMessage(res?.message || 'Failed to dispatch verification code. Please try again.');
      }
    } catch (err: any) {
      setErrorMessage(err?.message || 'Failed to connect to authentication server.');
    } finally {
      setIsSendingOtp(false);
    }
  };

  // Step 2: Verify OTP and Sign In (or Auto-Register New Customer)
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!otpCode || otpCode.trim().length !== 6) {
      setErrorMessage('Please enter the 6-digit verification code.');
      return;
    }

    setIsVerifying(true);
    try {
      const res = await loginWithOtp({
        identifier: email.trim(),
        otp: otpCode.trim(),
        name: customerName.trim() || undefined
      });

      if (res && res.success && res.user) {
        login(res.user, res.token);
        // Direct to requested page or profile
        if (res.user.role === 'ADMIN') {
          navigate('/admin');
        } else {
          navigate(redirectTo);
        }
      } else {
        setErrorMessage(res?.message || 'Invalid or expired OTP code. Please check your email.');
      }
    } catch (err: any) {
      setErrorMessage(err?.message || 'OTP verification failed. Please check your connection.');
    } finally {
      setIsVerifying(false);
    }
  };

  // Administrator Login Handler
  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsAdminLoading(true);
    setAdminError('');

    try {
      const res = await loginUser(adminEmail.trim(), adminPassword);
      if (res && res.success && res.user) {
        login(res.user, res.token);
        setShowAdminModal(false);
        navigate(res.user.role === 'ADMIN' ? '/admin' : '/profile');
      } else {
        setAdminError(res?.message || 'Invalid admin credentials.');
      }
    } catch (err: any) {
      setAdminError(err?.message || 'Server connection error.');
    } finally {
      setIsAdminLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="bg-brand-light min-h-screen pt-32 pb-16 flex items-center justify-center relative overflow-hidden px-4"
    >
      <Helmet>
        <title>Customer Login | Sri Telangana Ruchulu</title>
      </Helmet>

      {/* Ambient background glows */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-brand-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-brand-primary/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/3 pointer-events-none" />

      <div className="container mx-auto max-w-md relative z-10 flex flex-col items-center">
        <motion.div
          initial={{ y: 25, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="bg-white p-7 sm:p-10 rounded-3xl shadow-xl border border-gray-100 w-full"
        >
          {/* Brand Logo & Title */}
          <div className="flex justify-center mb-4">
            <div className="w-20 h-20 rounded-full border-2 border-brand-primary/40 shadow-md p-1 bg-white flex items-center justify-center">
              <img
                src="/images/brand_logo.png"
                alt="Sri Telangana Ruchulu"
                className="w-full h-full object-contain rounded-full"
              />
            </div>
          </div>

          <h1 className="text-2xl sm:text-3xl font-heading font-extrabold text-brand-dark text-center mb-1">
            Sign In
          </h1>
          <p className="text-gray-500 text-center text-xs sm:text-sm mb-6">

          </p>

          {errorMessage && (
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-5 p-3.5 bg-red-50 border border-red-200 text-red-600 rounded-xl text-xs sm:text-sm font-medium leading-relaxed text-center"
            >
              {errorMessage}
            </motion.div>
          )}

          {successMessage && otpStep === 'INPUT' && (
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-5 p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-xl text-xs font-medium text-center"
            >
              {successMessage}
            </motion.div>
          )}

          {/* STEP 1: ENTER EMAIL TO RECEIVE OTP */}
          {otpStep === 'INPUT' ? (
            <form className="space-y-4" onSubmit={handleSendOtp}>
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1.5">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3.5 pl-11 pr-4 focus:outline-none focus:border-brand-primary focus:bg-white text-sm transition-all"
                    placeholder="name@example.com"
                  />
                  <Mail className="absolute left-3.5 top-3.5 text-gray-400" size={18} />
                </div>
                <span className="text-[11px] text-gray-400 mt-1 block">
                  We'll send a 6-digit security code to this email to sign you in.
                </span>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1.5">
                  Full Name <span className="text-gray-400 font-normal lowercase">(Optional for new customers)</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 pl-11 pr-4 focus:outline-none focus:border-brand-primary focus:bg-white text-sm transition-all"
                    placeholder="Name"
                  />
                  <User className="absolute left-3.5 top-3.5 text-gray-400" size={18} />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSendingOtp || !email.trim()}
                className="w-full bg-brand-dark text-white font-bold py-3.5 rounded-xl hover:bg-brand-primary hover:text-brand-dark transition-all duration-300 shadow-md flex justify-center items-center gap-2 group mt-5 disabled:opacity-50 text-sm"
              >
                {isSendingOtp ? (
                  <>
                    <RefreshCw size={16} className="animate-spin text-brand-primary" />
                    <span>Dispatching OTP Code...</span>
                  </>
                ) : (
                  <>
                    <span>Send Login OTP</span>
                    <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </form>
          ) : (
            /* STEP 2: ENTER 6-DIGIT OTP CODE */
            <form className="space-y-4" onSubmit={handleVerifyOtp}>
              <div className="bg-amber-50/90 border border-amber-200 rounded-2xl p-4 text-center space-y-1">
                <p className="text-xs text-gray-600">
                  Enter the 6-digit verification code sent to:<br />
                  <strong className="font-mono text-brand-dark text-sm">{email}</strong>
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setOtpStep('INPUT');
                    setErrorMessage('');
                  }}
                  className="text-xs text-brand-primary font-bold hover:underline inline-flex items-center gap-1 mt-1"
                >
                  <ArrowLeft size={12} /> Edit Email Address
                </button>
              </div>

              {/* Notification info */}
              {successMessage && (
                <div className="bg-green-50 border border-green-200 rounded-xl p-3 text-xs text-green-800 flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-green-600 flex-shrink-0" />
                  <span>{successMessage}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1.5 text-center">
                  6-Digit OTP Code
                </label>
                <input
                  type="text"
                  required
                  autoFocus
                  maxLength={6}
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value.replace(/[^0-9]/g, ''))}
                  className="w-full bg-gray-50 border-2 border-brand-primary/40 focus:border-brand-primary rounded-xl py-3 px-4 text-center font-mono font-black text-2xl tracking-[0.3em] text-brand-dark focus:outline-none focus:bg-white shadow-inner"
                  placeholder="------"
                />
              </div>

              <div className="flex justify-between items-center text-xs text-gray-500 pt-1">
                <span>Didn't receive the email?</span>
                {canResend ? (
                  <button
                    type="button"
                    onClick={handleSendOtp}
                    className="text-brand-primary font-bold hover:underline"
                  >
                    Resend OTP
                  </button>
                ) : (
                  <span className="text-gray-400">Resend in {resendTimer}s</span>
                )}
              </div>

              <button
                type="submit"
                disabled={isVerifying || otpCode.length !== 6}
                className="w-full bg-brand-dark text-white font-bold py-3.5 rounded-xl hover:bg-brand-primary hover:text-brand-dark transition-all duration-300 shadow-md flex justify-center items-center gap-2 group disabled:opacity-50 text-sm mt-3"
              >
                {isVerifying ? (
                  <>
                    <RefreshCw size={16} className="animate-spin text-brand-primary" />
                    <span>Verifying Code...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 size={16} />
                    <span>Verify & Sign In</span>
                  </>
                )}
              </button>
            </form>
          )}

          {/* Links at Bottom */}
          <div className="mt-8 text-center text-gray-600 text-xs sm:text-sm pt-4 border-t border-gray-100 space-y-3">
            <div className="bg-amber-50/70 rounded-2xl p-3 border border-amber-200/70 text-xs text-amber-900 leading-relaxed">
              <span className="font-bold">First time here?</span> No need to register! Simply enter your email above. Your customer account will be automatically activated upon OTP verification.
            </div>

            <div>
              <button
                type="button"
                onClick={() => {
                  setShowAdminModal(true);
                  setAdminError('');
                }}
                className="text-[11px] text-gray-400 hover:text-brand-primary transition-colors inline-flex items-center gap-1"
              >
                <Shield size={12} /> Administrator Portal Login
              </button>
            </div>
          </div>
        </motion.div>
      </div>

      {/* ADMINISTRATOR LOGIN MODAL */}
      <AnimatePresence>
        {showAdminModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-gray-100 relative"
            >
              <button
                onClick={() => setShowAdminModal(false)}
                className="absolute top-5 right-5 text-gray-400 hover:text-gray-600 transition p-1"
                aria-label="Close"
              >
                <X size={20} />
              </button>

              <div className="w-12 h-12 bg-amber-100 text-amber-800 rounded-2xl flex items-center justify-center mb-4">
                <Shield size={24} />
              </div>

              <h2 className="text-xl font-bold text-brand-dark mb-1 font-heading">Administrator Portal</h2>
              <p className="text-xs text-gray-500 mb-5">
                Authorized staff sign-in for store operations, inventory & order management.
              </p>

              {adminError && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded-xl text-xs mb-4">
                  {adminError}
                </div>
              )}

              <form onSubmit={handleAdminLogin} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Admin Email</label>
                  <div className="relative">
                    <input
                      type="email"
                      required
                      value={adminEmail}
                      onChange={(e) => setAdminEmail(e.target.value)}
                      placeholder="admin@sritelanganaruchulu.com"
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 pl-10 pr-3 text-xs focus:outline-none focus:border-brand-primary"
                    />
                    <Mail className="absolute left-3 top-3.5 text-gray-400" size={15} />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Admin Password</label>
                  <div className="relative">
                    <input
                      type="password"
                      required
                      value={adminPassword}
                      onChange={(e) => setAdminPassword(e.target.value)}
                      placeholder="Enter administrator password"
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 pl-10 pr-3 text-xs focus:outline-none focus:border-brand-primary"
                    />
                    <Lock className="absolute left-3 top-3.5 text-gray-400" size={15} />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isAdminLoading}
                  className="w-full bg-brand-dark text-white font-bold py-3.5 rounded-xl hover:bg-brand-primary hover:text-brand-dark transition text-xs shadow-md disabled:opacity-50 flex items-center justify-center gap-1.5 mt-2"
                >
                  {isAdminLoading ? (
                    <>
                      <RefreshCw size={14} className="animate-spin" /> Verifying Credentials...
                    </>
                  ) : (
                    <>
                      <KeyRound size={14} /> Access Admin Dashboard
                    </>
                  )}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
