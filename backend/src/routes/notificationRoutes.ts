import { Router, Request, Response } from 'express';
import { notificationService } from '../services/notificationService.js';

const router = Router();

router.get('/', (_req: Request, res: Response) => {
  const logs = notificationService.getLogs();
  res.json({
    success: true,
    count: logs.length,
    data: logs
  });
});

router.get('/status', (_req: Request, res: Response) => {
  const status = notificationService.getSmtpStatus();
  res.json({
    success: true,
    data: status
  });
});

router.post('/test-email', async (req: Request, res: Response) => {
  const { to } = req.body;
  if (!to || !to.includes('@')) {
    return res.status(400).json({ success: false, message: 'Please provide a valid recipient email address' });
  }

  const result = await notificationService.dispatchEmail({
    to,
    subject: 'Sri Telangana Ruchulu - Live Email Delivery Test 🌶️',
    html: `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 620px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 16px; overflow: hidden; background: #ffffff; box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.05);">
        ${notificationService.getBrandHeaderHtml('SYSTEM TEST VERIFIED')}
        <div style="padding: 32px 28px; text-align: center; color: #1e293b;">
          <h2 style="color: #4a2e1f; font-family: 'Montserrat', sans-serif; margin-top: 0; font-size: 20px;">Email System & Brand Logo Operational! 🎉</h2>
          <p style="color: #4b5563; font-size: 14px; line-height: 1.6;">
            This is a live test email confirming your email dispatch service is active, connected to Gmail SMTP, and displaying the authentic <strong>Sri Telangana Ruchulu</strong> logo.
          </p>
          <div style="display: inline-block; background-color: #f0fdf4; border: 1px solid #86efac; color: #166534; font-size: 13px; font-weight: 700; padding: 8px 18px; border-radius: 20px; margin-top: 10px;">
            ✓ Inline Brand Logo (CID) Verified
          </div>
        </div>
        ${notificationService.getBrandFooterHtml()}
      </div>
    `
  });

  res.json(result);
});

router.post('/send-offer', async (req: Request, res: Response) => {
  const { recipientEmail, recipientName, offerTitle, offerCode, discountPercentage, description, validUntil } = req.body;
  if (!recipientEmail || !offerTitle || !offerCode) {
    return res.status(400).json({ success: false, message: 'Missing recipientEmail, offerTitle, or offerCode' });
  }

  const result = await notificationService.sendPromotionalOfferEmail({
    recipientEmail,
    recipientName,
    offerTitle,
    offerCode,
    discountPercentage: discountPercentage ? Number(discountPercentage) : undefined,
    description: description || 'Special seasonal savings on authentic homemade delicacies!',
    validUntil
  });

  res.json(result);
});

export default router;

