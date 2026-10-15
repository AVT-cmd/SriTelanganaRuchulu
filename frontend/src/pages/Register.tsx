import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { 
  UserPlus, Mail, User, Phone, ArrowRight, Sparkles, 
  RefreshCw, CheckCircle2, ArrowLeft, MapPin, Home 
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { registerUser, sendOtp } from '../api';

const POPULAR_CITIES = [
  'Warangal', 'Hanamkonda', 'Kazipet', 'Hyderabad', 'Secunderabad', 
  'Karimnagar', 'Nizamabad', 'Khammam', 'Nalgonda', 'Mahabubnagar',
  'Vijayawada', 'Visakhapatnam', 'Guntur', 'Tirupati'
];

export const Register = () => {
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);

  // Stepper state: 'PROFILE_DETAILS' -> 'EMAIL_OTP_VERIFY'
  const [step, setStep] = useState<'PROFILE_DETAILS' | 'EMAIL_OTP_VERIFY'>('PROFILE_DETAILS');

  // Complete customer registration details (Passwordless OTP Verification)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: 'Warangal',
    customCity: '',
    state: 'Telangana',
    postalCode: ''
  });

  const [enteredOtp, setEnteredOtp] = useState('');
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [resendTimer, setResendTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);

  const [welcomeNotif, setWelcomeNotif] = useState<{
    name: string;
    email: string;
    phone: string;
    city: string;
    coupon: string;
  } | null>(null);

  // Resend Countdown Timer
  useEffect(() => {
    let timer: any;
    if (step === 'EMAIL_OTP_VERIFY' && resendTimer > 0) {
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
  }, [step, resendTimer]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errorMsg) setErrorMsg('');
  };

  const effectiveCity = formData.city === 'OTHER' ? formData.customCity : formData.city;

  // Step 1: Validate Customer Details & Dispatch Email OTP (No password needed)
  const handleProceedToEmailOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    // Validations
    if (!formData.name.trim()) {
      setErrorMsg('Please enter your full name.');
      return;
    }
    if (!formData.email.trim() || !formData.email.includes('@')) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }
    if (!formData.phone.trim() || formData.phone.replace(/[^0-9]/g, '').length < 10) {
      setErrorMsg('Please enter a valid 10-digit mobile number.');
      return;
    }
    if (!formData.address.trim()) {
      setErrorMsg('Please enter your complete delivery/street address.');
      return;
    }
    if (!effectiveCity.trim()) {
      setErrorMsg('Please enter or select your city.');
      return;
    }
    if (!formData.postalCode.trim() || formData.postalCode.replace(/[^0-9]/g, '').length !== 6) {
      setErrorMsg('Please enter a valid 6-digit postal PIN code.');
      return;
    }

    setIsSendingOtp(true);
    try {
      // Dispatch OTP strictly to customer's email address with customer profile metadata
      const res = await sendOtp({
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        purpose: 'REGISTRATION',
        name: formData.name.trim(),
        address: formData.address.trim(),
        city: effectiveCity.trim(),
        state: formData.state.trim(),
        postalCode: formData.postalCode.trim()
      });

      if (res && res.success) {
        setStep('EMAIL_OTP_VERIFY');
        setResendTimer(60);
        setCanResend(false);
      } else {
        setErrorMsg(res?.message || 'Unable to send verification OTP to this email address.');
      }
    } catch (err: any) {
      setErrorMsg(err?.message || 'Error connecting to email verification service.');
    } finally {
      setIsSendingOtp(false);
    }
  };

  // Resend Email OTP
  const handleResendOtp = async () => {
    if (!canResend) return;
    setIsSendingOtp(true);
    setErrorMsg('');

    try {
      const res = await sendOtp({
        email: formData.email.trim(),
        purpose: 'REGISTRATION',
        name: formData.name.trim()
      });

      if (res && res.success) {
        setResendTimer(60);
        setCanResend(false);
      } else {
        setErrorMsg(res?.message || 'Failed to resend email verification code.');
      }
    } catch (err: any) {
      setErrorMsg(err?.message || 'Failed to dispatch email code.');
    } finally {
      setIsSendingOtp(false);
    }
  };

  // Step 2: Verify Email OTP and Create User with Complete Details
  const handleVerifyAndRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!enteredOtp || enteredOtp.trim().length !== 6) {
      setErrorMsg('Please enter the 6-digit OTP code sent to your email.');
      return;
    }

    setIsLoading(true);
    try {
      const response = await registerUser({
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        address: formData.address.trim(),
        city: effectiveCity.trim(),
        state: formData.state.trim(),
        postalCode: formData.postalCode.trim(),
        otp: enteredOtp.trim()
      });

      if (response && response.success && response.user) {
        // Automatically log in the verified user
        login(
          {
            ...response.user,
            phone: formData.phone.trim(),
            address: formData.address.trim(),
            city: effectiveCity.trim(),
            state: formData.state.trim(),
            postalCode: formData.postalCode.trim()
          },
          response.token
        );

        // Show welcome confirmation modal
        setWelcomeNotif({
          name: formData.name.trim(),
          email: formData.email.trim(),
          phone: formData.phone.trim(),
          city: effectiveCity.trim(),
          coupon: 'WELCOME100'
        });
      } else {
        setErrorMsg(response?.message || 'Invalid or expired OTP code. Please check your email.');
      }
    } catch (err: any) {
      setErrorMsg(err?.message || 'Registration failed. Please check your connection.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="bg-brand-light min-h-screen pt-28 pb-16 flex items-center justify-center relative overflow-hidden px-4"
    >
      <Helmet>
        <title>Create New Customer Account | Sri Telangana Ruchulu</title>
      </Helmet>

      {/* Decorative ambient background glows */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-brand-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-brand-primary/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/3 pointer-events-none" />

      <div className="container mx-auto max-w-2xl relative z-10 flex flex-col items-center">
        <motion.div 
          initial={{ y: 25, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="bg-white p-6 sm:p-10 rounded-3xl shadow-xl border border-gray-100 w-full"
        >
          {/* Header Icon & Brand Title */}
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-brand-primary/10 rounded-2xl flex items-center justify-center shadow-inner">
              <UserPlus size={32} className="text-brand-primary" />
            </div>
          </div>
          
          <h1 className="text-2xl sm:text-3xl font-heading font-extrabold text-brand-dark text-center mb-1">
            New Customer Registration
          </h1>
          <p className="text-gray-500 text-center text-xs sm:text-sm mb-6">
            Please provide your complete customer profile for seamless delivery and account security.
          </p>

          {/* Stepper Progress Indicator */}
          <div className="flex items-center justify-center gap-3 mb-8 pb-4 border-b border-gray-100">
            <div className={`flex items-center gap-1.5 text-xs font-bold transition-colors ${
              step === 'PROFILE_DETAILS' ? 'text-brand-dark' : 'text-green-700'
            }`}>
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] ${
                step === 'PROFILE_DETAILS' ? 'bg-brand-dark text-white font-bold' : 'bg-green-100 text-green-700 font-bold'
              }`}>
                {step === 'EMAIL_OTP_VERIFY' ? '✓' : '1'}
              </div>
              <span>Customer Details</span>
            </div>

            <div className={`w-10 h-0.5 rounded-full ${step === 'EMAIL_OTP_VERIFY' ? 'bg-brand-primary' : 'bg-gray-200'}`} />

            <div className={`flex items-center gap-1.5 text-xs font-bold transition-colors ${
              step === 'EMAIL_OTP_VERIFY' ? 'text-brand-dark' : 'text-gray-400'
            }`}>
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] ${
                step === 'EMAIL_OTP_VERIFY' ? 'bg-brand-primary text-brand-dark font-black' : 'bg-gray-200 text-gray-500'
              }`}>
                2
              </div>
              <span>Email Verification</span>
            </div>
          </div>

          {errorMsg && (
            <motion.div 
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 rounded-2xl text-xs sm:text-sm font-medium leading-relaxed flex items-start gap-2"
            >
              <div className="w-2 h-2 rounded-full bg-red-500 mt-1.5 flex-shrink-0" />
              <span>{errorMsg}</span>
            </motion.div>
          )}

          {/* STEP 1: COMPLETE DETAILS FORM */}
          {step === 'PROFILE_DETAILS' ? (
            <form className="space-y-6" onSubmit={handleProceedToEmailOtp}>
              
              {/* SECTION A: PERSONAL & CONTACT */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
                  <User size={16} className="text-brand-primary" />
                  <span className="text-xs font-bold uppercase tracking-wider text-gray-700">1. Personal Information</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1.5">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input 
                        type="text" 
                        name="name"
                        required
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 pl-10 pr-3 focus:outline-none focus:border-brand-primary focus:bg-white text-xs sm:text-sm transition-all"
                        placeholder="e.g. Suresh Kumar"
                      />
                      <User className="absolute left-3 top-3.5 text-gray-400" size={16} />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1.5">
                      Mobile Number <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input 
                        type="tel" 
                        name="phone"
                        required
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 pl-10 pr-3 focus:outline-none focus:border-brand-primary focus:bg-white text-xs sm:text-sm transition-all"
                        placeholder="+91 98765 43210"
                      />
                      <Phone className="absolute left-3 top-3.5 text-gray-400" size={16} />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1.5">
                    Email Address (For Verification & Sign In) <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input 
                      type="email" 
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 pl-10 pr-3 focus:outline-none focus:border-brand-primary focus:bg-white text-xs sm:text-sm transition-all"
                      placeholder="customer@example.com"
                    />
                    <Mail className="absolute left-3 top-3.5 text-gray-400" size={16} />
                  </div>
                  <span className="text-[11px] text-gray-400 mt-1 block">A 6-digit verification code will be dispatched to this email.</span>
                </div>
              </div>

              {/* SECTION B: COMPLETE DELIVERY ADDRESS */}
              <div className="space-y-4 pt-2">
                <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
                  <MapPin size={16} className="text-brand-primary" />
                  <span className="text-xs font-bold uppercase tracking-wider text-gray-700">2. Delivery & Shipping Address</span>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1.5">
                    Street Address / House No / Flat / Landmark <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      name="address"
                      required
                      value={formData.address}
                      onChange={handleChange}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 pl-10 pr-3 focus:outline-none focus:border-brand-primary focus:bg-white text-xs sm:text-sm transition-all"
                      placeholder="e.g. Flat 302, Sri Nilayam, Collectorate Road, Subedari"
                    />
                    <Home className="absolute left-3 top-3.5 text-gray-400" size={16} />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1.5">
                      City <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 px-3 focus:outline-none focus:border-brand-primary focus:bg-white text-xs sm:text-sm transition-all"
                    >
                      {POPULAR_CITIES.map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                      <option value="OTHER">Other City / Town</option>
                    </select>
                  </div>

                  {formData.city === 'OTHER' ? (
                    <div>
                      <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1.5">
                        Specify City <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="customCity"
                        required
                        value={formData.customCity}
                        onChange={handleChange}
                        placeholder="Enter City"
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 px-3 focus:outline-none focus:border-brand-primary focus:bg-white text-xs sm:text-sm transition-all"
                      />
                    </div>
                  ) : (
                    <div>
                      <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1.5">
                        State
                      </label>
                      <select
                        name="state"
                        value={formData.state}
                        onChange={handleChange}
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 px-3 focus:outline-none focus:border-brand-primary focus:bg-white text-xs sm:text-sm transition-all"
                      >
                        <option value="Telangana">Telangana</option>
                        <option value="Andhra Pradesh">Andhra Pradesh</option>
                        <option value="Karnataka">Karnataka</option>
                        <option value="Maharashtra">Maharashtra</option>
                        <option value="Tamil Nadu">Tamil Nadu</option>
                        <option value="Other">Other State</option>
                      </select>
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1.5">
                      PIN Code <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="postalCode"
                      required
                      maxLength={6}
                      value={formData.postalCode}
                      onChange={(e) => setFormData({ ...formData, postalCode: e.target.value.replace(/[^0-9]/g, '') })}
                      placeholder="e.g. 506001"
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 px-3 focus:outline-none focus:border-brand-primary focus:bg-white text-xs sm:text-sm font-mono transition-all"
                    />
                  </div>
                </div>
              </div>



              <button 
                type="submit" 
                disabled={isSendingOtp}
                className="w-full bg-brand-dark text-white font-bold py-4 rounded-xl hover:bg-brand-primary hover:text-brand-dark transition-all duration-300 shadow-md flex justify-center items-center gap-2 group disabled:opacity-50 text-sm mt-4"
              >
                {isSendingOtp ? (
                  <>
                    <RefreshCw size={16} className="animate-spin text-brand-primary" />
                    <span>Dispatching Email Verification OTP...</span>
                  </>
                ) : (
                  <>
                    <span>Proceed to Email Verification</span>
                    <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </form>
          ) : (
            /* STEP 2: MANDATORY EMAIL OTP VERIFICATION */
            <form className="space-y-6" onSubmit={handleVerifyAndRegister}>
              <div className="bg-amber-50/90 border border-amber-200 rounded-2xl p-5 text-center space-y-2">
                <div className="w-12 h-12 bg-amber-100 text-amber-800 rounded-2xl flex items-center justify-center mx-auto mb-1">
                  <Mail size={24} />
                </div>
                <h3 className="text-base font-bold text-brand-dark">Verify Your Email Address</h3>
                <p className="text-xs text-gray-600 leading-relaxed">
                  We have dispatched a secure 6-digit verification code to:<br />
                  <strong className="text-brand-dark font-mono text-sm">{formData.email}</strong>
                </p>
                <div className="text-[11px] text-gray-500 pt-1">
                  Customer: <strong>{formData.name}</strong> • City: <strong>{effectiveCity}</strong>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setStep('PROFILE_DETAILS');
                    setErrorMsg('');
                  }}
                  className="text-xs text-brand-primary font-bold hover:underline inline-flex items-center gap-1 mt-2"
                >
                  <ArrowLeft size={12} /> Edit Details / Change Email
                </button>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-2 text-center">
                  Enter 6-Digit Email OTP Code
                </label>
                <input 
                  type="text" 
                  required
                  autoFocus
                  maxLength={6}
                  value={enteredOtp}
                  onChange={(e) => setEnteredOtp(e.target.value.replace(/[^0-9]/g, ''))}
                  className="w-full bg-gray-50 border-2 border-brand-primary/40 focus:border-brand-primary rounded-2xl py-4 px-4 text-center font-mono font-black text-2xl sm:text-3xl tracking-[0.4em] text-brand-dark focus:outline-none focus:bg-white shadow-inner transition-all"
                  placeholder="------"
                />
              </div>

              {/* Resend Action with Countdown */}
              <div className="flex items-center justify-between text-xs text-gray-500 pt-1">
                <span>Didn't receive the email code?</span>
                {canResend ? (
                  <button
                    type="button"
                    onClick={handleResendOtp}
                    disabled={isSendingOtp}
                    className="font-bold text-brand-primary hover:underline flex items-center gap-1"
                  >
                    {isSendingOtp ? 'Resending...' : 'Resend Email OTP'}
                  </button>
                ) : (
                  <span className="font-mono text-gray-400">
                    Resend in <strong>{resendTimer}s</strong>
                  </span>
                )}
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setStep('PROFILE_DETAILS')}
                  className="w-1/3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-3.5 rounded-xl transition text-xs sm:text-sm"
                >
                  Back
                </button>
                <button 
                  type="submit" 
                  disabled={isLoading || enteredOtp.length !== 6}
                  className="flex-1 bg-brand-dark text-white font-bold py-3.5 rounded-xl hover:bg-brand-primary hover:text-brand-dark transition-all duration-300 shadow-md flex justify-center items-center gap-2 group disabled:opacity-50 text-xs sm:text-sm"
                >
                  {isLoading ? (
                    <>
                      <RefreshCw size={16} className="animate-spin" />
                      <span>Verifying & Activating Account...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 size={16} />
                      <span>Verify & Complete Registration</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}

          {/* Footer Link to Login */}
          <div className="mt-8 text-center text-gray-600 text-xs sm:text-sm pt-4 border-t border-gray-100">
            Already have an account?{' '}
            <Link to="/login" className="text-brand-primary font-bold hover:underline">
              Sign In Here
            </Link>
          </div>
        </motion.div>
      </div>

      {/* REGISTRATION SUCCESS WELCOME MODAL */}
      <AnimatePresence>
        {welcomeNotif && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-gray-100 text-center relative overflow-hidden"
            >
              <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl font-bold">
                ✓
              </div>

              <h2 className="text-2xl font-black text-brand-dark mb-1 font-heading">
                Welcome to Sri Telangana Ruchulu!
              </h2>
              <p className="text-xs text-gray-500 mb-5">
                Namaskaram <strong>{welcomeNotif.name}</strong>! Your account and delivery details for <strong>{welcomeNotif.city}</strong> are verified.
              </p>

              <div className="space-y-2.5 mb-6 text-left">
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 text-xs flex items-start gap-2.5">
                  <Mail className="text-blue-600 flex-shrink-0 mt-0.5" size={16} />
                  <div>
                    <strong className="text-blue-900 block">Welcome Email Dispatched</strong>
                    <span className="text-blue-700 text-[11px]">Sent to {welcomeNotif.email} with order guide & recipe catalog.</span>
                  </div>
                </div>

              </div>

              <div className="space-y-2">
                <button
                  type="button"
                  onClick={() => navigate('/categories')}
                  className="w-full bg-brand-dark text-white font-bold py-3.5 rounded-xl hover:bg-brand-primary hover:text-brand-dark transition shadow-md text-sm flex items-center justify-center gap-2"
                >
                  <Sparkles size={16} /> Explore Products & Order
                </button>
                <button
                  type="button"
                  onClick={() => navigate('/profile')}
                  className="w-full bg-gray-100 text-gray-700 font-bold py-3 rounded-xl hover:bg-gray-200 transition text-sm"
                >
                  Go to My Profile
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
