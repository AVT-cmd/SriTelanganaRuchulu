import { Router } from 'express';
import { 
  login, 
  register, 
  sendOtp, 
  verifyOtp, 
  forgotPassword, 
  resetPassword,
  loginWithOtp
} from '../controllers/authController.js';

const router = Router();

router.post('/login', login);
router.post('/login-with-otp', loginWithOtp);
router.post('/register', register);
router.post('/send-otp', sendOtp);
router.post('/verify-otp', verifyOtp);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

export default router;
