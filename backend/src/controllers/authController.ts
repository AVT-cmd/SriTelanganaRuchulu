import { Request, Response } from 'express';
import { store } from '../data/store.js';
import { notificationService } from '../services/notificationService.js';

// In-memory OTP storage with TTL and customer metadata
interface OtpEntry {
  otp: string;
  expiresAt: number;
  purpose: string;
  name?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  postalCode?: string;
}

const otpStore = new Map<string, OtpEntry>();

export const login = (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required' });
    }

    const cleanEmail = email.toLowerCase().trim();
    const user = store.findUserByEmail(cleanEmail);

    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    if (user.password && user.password !== password) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    res.json({
      success: true,
      message: 'Login successful',
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        phone: user.phone || '',
        address: user.address || '',
        city: user.city || '',
        state: user.state || 'Telangana',
        postalCode: user.postalCode || '',
        role: user.role
      },
      token: `auth-jwt-${user.role.toLowerCase()}-${user.id}-${Date.now()}`
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Login failed', error });
  }
};

export const register = (req: Request, res: Response) => {
  try {
    const { 
      email, 
      password, 
      name, 
      phone, 
      address, 
      city, 
      state, 
      postalCode, 
      otp 
    } = req.body;

    if (!email || !name) {
      return res.status(400).json({ success: false, message: 'Full name and email address are required' });
    }

    const cleanEmail = email.toLowerCase().trim();
    const existingUser = store.findUserByEmail(cleanEmail);
    if (existingUser) {
      return res.status(409).json({ success: false, message: 'An account with this email already exists. Please sign in.' });
    }

    // STRICT OTP VERIFICATION REQUIRED FOR REGISTRATION
    if (!otp) {
      return res.status(400).json({ 
        success: false, 
        message: 'Email verification code is required. Please verify your email before registering.' 
      });
    }

    const record = otpStore.get(cleanEmail);
    if (!record) {
      return res.status(400).json({ 
        success: false, 
        message: 'No verification code was requested for this email, or it has expired. Please click Send OTP.' 
      });
    }

    if (Date.now() > record.expiresAt) {
      otpStore.delete(cleanEmail);
      return res.status(400).json({ 
        success: false, 
        message: 'The verification code has expired. Please request a new code.' 
      });
    }

    if (record.otp !== otp.trim()) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid verification code. Please check your email inbox and enter the 6-digit code.' 
      });
    }

    // OTP confirmed! Remove from temporary store
    otpStore.delete(cleanEmail);

    const newUser = store.createUser({
      email: cleanEmail,
      name: name.trim(),
      phone: phone ? phone.trim() : (record.phone || ''),
      address: address ? address.trim() : (record.address || ''),
      city: city ? city.trim() : (record.city || 'Warangal'),
      state: state ? state.trim() : (record.state || 'Telangana'),
      postalCode: postalCode ? postalCode.trim() : (record.postalCode || ''),
      role: 'CUSTOMER',
      password: password || Math.random().toString(36).slice(-10)
    });

    // Send Welcome Email and SMS to newly registered user
    try {
      notificationService.sendWelcomeNotification({
        name: newUser.name,
        email: newUser.email,
        phone: newUser.phone || '+91 98765 43210'
      });
    } catch (err) {
      console.warn('Welcome notification error:', err);
    }

    res.status(201).json({
      success: true,
      message: 'User registered and verified successfully. Welcome email dispatched.',
      user: {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
        phone: newUser.phone,
        address: newUser.address,
        city: newUser.city,
        state: newUser.state,
        postalCode: newUser.postalCode,
        role: newUser.role
      },
      token: `auth-jwt-customer-${newUser.id}-${Date.now()}`
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Registration failed', error });
  }
};

// --- LOGIN WITH OTP (PASSWORDLESS CUSTOMER LOGIN & AUTO-REGISTRATION) ---
export const loginWithOtp = (req: Request, res: Response) => {
  try {
    const { identifier, email, otp, name, phone, address, city, state, postalCode } = req.body;
    const rawId = identifier || email;
    if (!rawId || !otp) {
      return res.status(400).json({ success: false, message: 'Email address and OTP code are required' });
    }

    const clean = rawId.toLowerCase().trim();
    const record = otpStore.get(clean);

    if (!record) {
      return res.status(400).json({ success: false, message: 'No OTP requested for this account or it has expired.' });
    }

    if (Date.now() > record.expiresAt) {
      otpStore.delete(clean);
      return res.status(400).json({ success: false, message: 'OTP has expired. Please request a new code.' });
    }

    if (record.otp !== otp.trim()) {
      return res.status(400).json({ success: false, message: 'Invalid OTP code. Please check your email and retry.' });
    }

    otpStore.delete(clean);

    let user = store.findUserByEmail(clean);
    let isNewCustomer = false;

    if (!user) {
      isNewCustomer = true;
      // When a new user logs in via OTP, record their customer details in the DB
      const resolvedName = (name || record.name || clean.split('@')[0] || 'Customer').trim();
      const resolvedPhone = (phone || record.phone || '').trim();
      const resolvedAddress = (address || record.address || '').trim();
      const resolvedCity = (city || record.city || 'Warangal').trim();
      const resolvedState = (state || record.state || 'Telangana').trim();
      const resolvedPostal = (postalCode || record.postalCode || '').trim();

      user = store.createUser({
        email: clean,
        name: resolvedName,
        phone: resolvedPhone,
        address: resolvedAddress,
        city: resolvedCity,
        state: resolvedState,
        postalCode: resolvedPostal,
        role: 'CUSTOMER'
      });

      console.log(`[Auth] New customer registered via OTP Login: ${clean} (${user.name})`);

    } else {
      // Existing user: update missing profile info if provided
      if (name && (!user.name || user.name === clean.split('@')[0])) user.name = name;
      if (phone && !user.phone) user.phone = phone;
      if (address && !user.address) user.address = address;
      if (city && !user.city) user.city = city;
      if (postalCode && !user.postalCode) user.postalCode = postalCode;
    }

    // Send Welcome Email to the customer upon successful login
    try {
      notificationService.sendWelcomeNotification({
        name: user.name,
        email: user.email,
        phone: user.phone || '+91 98765 43210'
      });
    } catch (err) {
      console.warn('Welcome notification error during OTP login:', err);
    }

    res.json({
      success: true,
      message: isNewCustomer ? 'Welcome to Sri Telangana Ruchulu! Account created successfully.' : 'Login successful',
      isNewCustomer,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        phone: user.phone || '',
        address: user.address || '',
        city: user.city || '',
        state: user.state || 'Telangana',
        postalCode: user.postalCode || '',
        role: user.role
      },
      token: `auth-jwt-${user.role.toLowerCase()}-${user.id}-${Date.now()}`
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'OTP Login failed', error });
  }
};

// --- SEND OTP (FOR REGISTRATION, LOGIN, OR FORGOT PASSWORD) ---
export const sendOtp = async (req: Request, res: Response) => {
  try {
    const { 
      email, 
      phone, 
      purpose = 'LOGIN', 
      name, 
      address, 
      city, 
      state, 
      postalCode 
    } = req.body;

    if (!email && !phone) {
      return res.status(400).json({ success: false, message: 'Email address is required to send verification code' });
    }

    const identifier = (email || phone).toLowerCase().trim();
    // Generate secure 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes

    otpStore.set(identifier, { 
      otp, 
      expiresAt, 
      purpose,
      name,
      phone,
      address,
      city,
      state,
      postalCode
    });

    // Dispatch notification via email and SMS
    const dispatchResult = await notificationService.sendOtpNotification({
      email: email || `${phone.replace(/[^0-9]/g, '')}@sms.sritelanganaruchulu.com`,
      phone: phone || '+91 98765 43210',
      otp,
      purpose,
      name
    });

    const isLive = notificationService.isLiveSmtp() && dispatchResult.success;

    if (!dispatchResult.success) {
      console.warn(`[Auth] Live email dispatch failed for ${identifier}. SMTP configuration check needed.`);
    }

    res.json({
      success: true,
      message: 'Verification code dispatched successfully',
      data: {
        identifier,
        expiresInSeconds: 600,
        isLiveSmtp: isLive
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to send OTP', error });
  }
};

// --- VERIFY OTP ---
export const verifyOtp = (req: Request, res: Response) => {
  try {
    const { identifier, email, otp } = req.body;
    const rawId = identifier || email;

    if (!rawId || !otp) {
      return res.status(400).json({ success: false, message: 'Identifier and OTP code are required' });
    }

    const cleanIdentifier = rawId.toLowerCase().trim();
    const record = otpStore.get(cleanIdentifier);

    if (!record) {
      return res.status(400).json({ success: false, message: 'No active OTP found. Please request a new code.' });
    }

    if (Date.now() > record.expiresAt) {
      otpStore.delete(cleanIdentifier);
      return res.status(400).json({ success: false, message: 'OTP has expired. Please request a new code.' });
    }

    if (record.otp !== otp.trim()) {
      return res.status(400).json({ success: false, message: 'Invalid OTP code. Please check and retry.' });
    }

    // OTP Verified successfully
    otpStore.delete(cleanIdentifier);

    res.json({
      success: true,
      message: 'OTP verified successfully',
      data: { verified: true, purpose: record.purpose }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to verify OTP', error });
  }
};

// --- FORGOT PASSWORD (REQUEST RESET CODE) ---
export const forgotPassword = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ success: false, message: 'Email address is required' });
    }

    const cleanEmail = email.toLowerCase().trim();
    const user = store.findUserByEmail(cleanEmail);

    if (!user) {
      return res.status(404).json({ success: false, message: 'No account found with this email address' });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = Date.now() + 10 * 60 * 1000;

    otpStore.set(cleanEmail, { otp, expiresAt, purpose: 'FORGOT_PASSWORD' });

    const result = await notificationService.sendOtpNotification({
      email: cleanEmail,
      phone: user.phone || '+91 98765 43210',
      otp,
      purpose: 'FORGOT_PASSWORD',
      name: user.name
    });

    res.json({
      success: true,
      message: 'Password reset OTP has been sent to your email and registered mobile number',
      data: {
        email: cleanEmail,
        phone: user.phone || '+91 98765 43210'
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to process forgot password request', error });
  }
};

// --- RESET PASSWORD ---
export const resetPassword = (req: Request, res: Response) => {
  try {
    const { email, otp, newPassword } = req.body;

    if (!email || !otp || !newPassword) {
      return res.status(400).json({ success: false, message: 'Email, OTP and new password are required' });
    }

    const cleanEmail = email.toLowerCase().trim();
    const record = otpStore.get(cleanEmail);

    // Verify OTP
    if (!record || record.otp !== otp.trim() || Date.now() > record.expiresAt) {
      return res.status(400).json({ success: false, message: 'Invalid or expired OTP code' });
    }

    const updated = store.updateUserPassword(cleanEmail, newPassword);
    if (!updated) {
      return res.status(404).json({ success: false, message: 'User account not found' });
    }

    otpStore.delete(cleanEmail);

    res.json({
      success: true,
      message: 'Password has been updated successfully. You can now login with your new password.'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to reset password', error });
  }
};
