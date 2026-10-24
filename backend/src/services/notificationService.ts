import 'dotenv/config';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { NotificationLog, Order } from '../types/index.js';
import nodemailer, { type Transporter } from 'nodemailer';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class NotificationService {
  private logs: NotificationLog[] = [];
  private transporter: Transporter | null = null;
  private initPromise: Promise<void>;
  private latestOtps = new Map<string, { otp: string; timestamp: number }>();

  constructor() {
    this.initPromise = this.initializeTransporter();
  }

  // Resolve brand logo image file for inline CID attachment
  private getBrandLogoPath(): string | null {
    const candidates = [
      path.resolve(__dirname, '../../assets/brand_logo.png'),
      path.resolve(__dirname, '../assets/brand_logo.png'),
      path.resolve(__dirname, '../../dist/assets/brand_logo.png'),
      path.resolve(process.cwd(), 'assets/brand_logo.png'),
      path.resolve(process.cwd(), 'backend/assets/brand_logo.png'),
      path.resolve(process.cwd(), '../backend/assets/brand_logo.png'),
      path.resolve(process.cwd(), 'frontend/public/images/brand_logo.png'),
      path.resolve(process.cwd(), '../frontend/public/images/brand_logo.png'),
      path.resolve(__dirname, '../../../frontend/public/images/brand_logo.png')
    ];
    for (const p of candidates) {
      if (fs.existsSync(p)) return p;
    }
    return null;
  }

  public getBrandHeaderHtml(badgeText?: string): string {
    return `
      <!-- ROYAL BRAND HEADER WITH AUTHENTIC LOGO (WEBSITE THEME: #4a2e1f & #D1A155) -->
      <div style="background: linear-gradient(135deg, #4a2e1f 0%, #362014 100%); padding: 34px 24px 26px; text-align: center; border-bottom: 3px solid #D1A155;">
        <table role="presentation" border="0" cellpadding="0" cellspacing="0" style="margin: 0 auto 14px;">
          <tr>
            <td style="background: #4a2e1f; width: 92px; height: 92px; border-radius: 50%; text-align: center; vertical-align: middle; border: 3px solid #D1A155; box-shadow: 0 8px 24px rgba(0,0,0,0.4); overflow: hidden; padding: 2px;">
              <img src="cid:brandlogo@sritelanganaruchulu" onerror="this.onerror=null; this.src='/images/brand_logo.png';" alt="Sri Telangana Ruchulu Logo" width="88" height="88" style="display: block; width: 88px; height: 88px; border-radius: 50%; object-fit: cover; margin: 0 auto; border: 0;" />
            </td>
          </tr>
        </table>
        <h1 style="margin: 0; font-family: 'Montserrat', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 26px; font-weight: 800; color: #D1A155; letter-spacing: 1.5px; text-transform: uppercase;">
          Sri Telangana Ruchulu
        </h1>
        <p style="margin: 6px 0 0; font-family: 'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 13px; color: #F6E7BC; letter-spacing: 2px; text-transform: uppercase; font-weight: 500;">
          Pure Traditional Flavors • Warangal Heritage
        </p>
        ${badgeText ? `
        <div style="margin-top: 14px;">
          <span style="display: inline-block; background-color: rgba(209, 161, 85, 0.22); border: 1px solid #D1A155; color: #F6E7BC; font-size: 11px; font-weight: 700; padding: 4px 14px; border-radius: 20px; letter-spacing: 0.5px;">
            ${badgeText}
          </span>
        </div>` : ''}
      </div>
    `;
  }

  public getBrandFooterHtml(): string {
    return `
      <!-- LUXURY BRAND FOOTER WITH KITCHEN DETAILS (WEBSITE THEME: #4a2e1f & #D1A155) -->
      <div style="background-color: #4a2e1f; color: #d6c7b9; padding: 26px 20px; text-align: center; font-size: 11px; line-height: 1.6; border-top: 2px solid #D1A155;">
        <p style="margin: 0 0 6px; font-family: 'Montserrat', sans-serif; font-weight: 700; color: #D1A155; font-size: 12px; letter-spacing: 1.5px; text-transform: uppercase;">
          Sri Telangana Ruchulu • Authentic Kitchens
        </p>
        <p style="margin: 0 0 10px; color: #F6E7BC;">
          Central Kitchens: Hanamkonda, Warangal, Telangana - 506001<br />
          Direct Helpline & WhatsApp: +91 94401 23456 • Support: support@sritelanganaruchulu.com
        </p>
        <p style="margin: 0; color: #ab9585; font-size: 10px;">
          © 2026 Sri Telangana Ruchulu. All rights reserved. Traditional Telugu Foods & Heritage Sweets.
        </p>
      </div>
    `;
  }

  private async initializeTransporter() {
    // 1. Check if custom SMTP is configured in .env
    const host = process.env.SMTP_HOST || 'smtp.gmail.com';
    const port = Number(process.env.SMTP_PORT) || 587;
    const user = process.env.SMTP_USER?.trim();
    const rawPass = process.env.SMTP_PASS?.trim();
    const pass = rawPass ? rawPass.replace(/\s+/g, '') : undefined;

    if (user && pass) {
      try {
        const isGmail = host.includes('gmail') || user.endsWith('@gmail.com');
        const transportConfig: any = isGmail
          ? {
              service: 'gmail',
              auth: { user, pass },
              connectionTimeout: 8000,
              tls: { rejectUnauthorized: false }
            }
          : {
              host,
              port,
              secure: port === 465,
              auth: { user, pass },
              connectionTimeout: 8000,
              tls: { rejectUnauthorized: false }
            };

        const testTransporter = nodemailer.createTransport(transportConfig);
        const verifySuccess = await new Promise<boolean>((resolve) => {
          testTransporter.verify((err) => {
            if (err) {
              console.warn('\n================================================================================');
              console.warn(`[NotificationService] ⚠️ SMTP AUTHENTICATION FAILED FOR ${user}`);
              console.warn(`Error: ${err.message}`);
              console.warn('👉 To send live emails to customers, please update SMTP_PASS in backend/.env:');
              console.warn('   1. Go to https://myaccount.google.com/apppasswords');
              console.warn('   2. Verify 2-Step Verification is turned ON');
              console.warn("   3. Generate a new App Password for 'TLR Website'");
              console.warn('   4. Paste the 16-character code into backend/.env (SMTP_PASS=xxxx xxxx xxxx xxxx)');
              console.warn('================================================================================\n');
              resolve(false);
            } else {
              resolve(true);
            }
          });
        });

        if (verifySuccess) {
          this.transporter = testTransporter;
          console.log(`[NotificationService] ✅ SMTP Transporter verified successfully for ${user}. Live email dispatch enabled.`);
          return;
        }
      } catch (err) {
        console.warn('[NotificationService] Custom SMTP initialization failed. Falling back to test dispatch:', err);
      }
    }

    // Direct Test Dispatch Mode
    this.transporter = null;
    console.log('[NotificationService] ℹ️ Running in Test Notification mode (OTP logged to console/API response).');
  }

  public isLiveSmtp(): boolean {
    return this.transporter !== null;
  }

  private addLog(log: NotificationLog) {
    this.logs.unshift(log);
    if (this.logs.length > 100) {
      this.logs.pop();
    }
  }

  public getLogs(): NotificationLog[] {
    return [...this.logs];
  }

  public getLatestOtp(identifier: string) {
    return this.latestOtps.get(identifier.toLowerCase().trim());
  }

  // --- CORE DISPATCH EMAIL METHOD ---
  public async dispatchEmail(options: {
    to: string;
    subject: string;
    html: string;
    text?: string;
  }): Promise<{ success: boolean; previewUrl?: string; messageId?: string; error?: string }> {
    try {
      await this.initPromise;

      const from = process.env.EMAIL_FROM || '"Sri Telangana Ruchulu" <no-reply@sritelanganaruchulu.com>';
      const logoPath = this.getBrandLogoPath();

      const mailOptions: any = {
        from,
        to: options.to,
        subject: options.subject,
        html: options.html,
        text: options.text || options.subject
      };

      if (logoPath) {
        mailOptions.attachments = [
          {
            filename: 'brand_logo.png',
            path: logoPath,
            cid: 'brandlogo@sritelanganaruchulu'
          }
        ];
      }

      if (!this.transporter) {
        console.log(`[NotificationService] (No SMTP Transporter) Notification simulation for ${options.to}`);
        return { success: false, error: 'SMTP transporter not configured or authentication failed.' };
      }

      const info = await this.transporter.sendMail(mailOptions);
      console.log(`[NotificationService] Live SMTP email delivered to ${options.to}. Message ID: ${info.messageId}`);

      return {
        success: true,
        messageId: info.messageId
      };
    } catch (err: any) {
      console.error(`[NotificationService] Error sending email to ${options.to}:`, err.message || err);
      return {
        success: false,
        error: err.message || 'Email delivery failed'
      };
    }
  }

  // --- 1. WELCOME NOTIFICATION (EMAIL & SMS) ---
  public async sendWelcomeNotification(params: { name: string; email: string; phone?: string }) {
    const { name, email, phone } = params;
    const now = new Date().toISOString();
    const effectivePhone = phone || '+91 98765 43210';

    const emailSubject = `Welcome to Sri Telangana Ruchulu! 🎉 Authentic Heritage Delights Await`;
    const emailBody = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 620px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; border: 1px solid #e2e8f0; box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.05);">
        ${this.getBrandHeaderHtml('100% HOMEMADE • ZERO PRESERVATIVES • PURE COW GHEE')}

        <!-- MAIN EMAIL CONTENT -->
        <div style="padding: 32px 28px 24px; color: #1e293b; line-height: 1.6;">
          <h2 style="margin: 0 0 12px; font-family: 'Montserrat', sans-serif; font-size: 22px; font-weight: 700; color: #4a2e1f;">
            Namaskaram, ${name}! 🙏
          </h2>
          <p style="margin: 0 0 16px; font-size: 15px; color: #334155;">
            We are overjoyed to welcome you into the <strong>Sri Telangana Ruchulu</strong> family! Your customer account has been successfully activated.
          </p>

          <!-- ABOUT OUR BRAND & CRAFTSMANSHIP -->
          <div style="background-color: #fcfbf7; border: 1px solid #f3ebd8; border-radius: 12px; padding: 22px; margin: 24px 0;">
            <h3 style="margin: 0 0 10px; font-family: 'Montserrat', sans-serif; font-size: 14px; font-weight: 700; color: #4a2e1f; text-transform: uppercase; letter-spacing: 1px;">
              Our Heritage & Quality Promise
            </h3>
            <p style="margin: 0 0 14px; font-size: 13px; color: #57534e; line-height: 1.6;">
              Every jar of pickle, podi, and sweet is prepared in our certified Warangal kitchen following generational family recipes:
            </p>
            <table role="presentation" border="0" cellpadding="0" cellspacing="0" style="width: 100%; font-size: 12px; color: #44403c;">
              <tr>
                <td style="padding: 6px 0; vertical-align: top; width: 24px;">🏺</td>
                <td style="padding: 6px 0;"><strong>Wood-Fired & Hand-Pounded:</strong> Sun-cured Avakaya, Gongura, and heirloom podis ground the traditional way.</td>
              </tr>
              <tr>
                <td style="padding: 6px 0; vertical-align: top; width: 24px;">🌿</td>
                <td style="padding: 6px 0;"><strong>Pure Ingredients Only:</strong> Pure cow ghee, cold-pressed oils, fresh red chilies, and absolutely no artificial chemicals.</td>
              </tr>
              <tr>
                <td style="padding: 6px 0; vertical-align: top; width: 24px;">🚚</td>
                <td style="padding: 6px 0;"><strong>Aroma-Seal Fresh Shipping:</strong> Dispatched within 24 hours of small-batch preparation for unmatched crispness.</td>
              </tr>
            </table>
          </div>

          <!-- CTA BUTTON -->
          <div style="text-align: center; margin: 28px 0 10px;">
            <a href="http://localhost:5173/shop" style="background-color: #4a2e1f; color: #ffffff; padding: 14px 34px; border-radius: 8px; text-decoration: none; font-size: 14px; font-weight: 700; display: inline-block; border: 1.5px solid #D1A155; box-shadow: 0 4px 14px rgba(74,46,31,0.25);">
              Explore Authentic Ruchulu Collection →
            </a>
          </div>
        </div>

        ${this.getBrandFooterHtml()}
      </div>
    `;

    // Send Live Email
    const dispatchResult = await this.dispatchEmail({
      to: email,
      subject: emailSubject,
      html: emailBody
    });

    this.addLog({
      id: `NOTIF-EM-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      type: 'EMAIL',
      category: 'WELCOME',
      recipient: email,
      recipientName: name,
      subject: emailSubject,
      content: emailBody,
      previewText: `Namaskaram ${name}! Welcome to the Sri Telangana Ruchulu culinary family.`,
      previewUrl: dispatchResult.previewUrl,
      status: dispatchResult.success ? 'DELIVERED' : 'FAILED',
      timestamp: now
    });

    // Welcome SMS
    const smsMessage = `Namaskaram ${name}! Welcome to Sri Telangana Ruchulu. Your customer account is active. Explore our authentic pachallu, podis & sweets at: https://sritelanganaruchulu.com`;
    
    this.addLog({
      id: `NOTIF-SMS-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      type: 'SMS',
      category: 'WELCOME',
      recipient: effectivePhone,
      recipientName: name,
      content: smsMessage,
      previewText: `Namaskaram ${name}! Welcome to the Sri Telangana Ruchulu culinary family.`,
      status: 'DELIVERED',
      timestamp: now
    });

    console.log(`[NotificationService] Sent WELCOME Email to ${email} and SMS to ${effectivePhone}`);
    return dispatchResult;
  }

  // --- 2. OTP NOTIFICATION (REGISTRATION, LOGIN & FORGOT PASSWORD) ---
  public async sendOtpNotification(params: {
    email: string;
    phone?: string;
    otp: string;
    purpose: 'REGISTRATION' | 'LOGIN' | 'FORGOT_PASSWORD';
    name?: string;
  }): Promise<{ success: boolean; previewUrl?: string; otp: string }> {
    const { email, phone, otp, purpose, name } = params;
    const now = new Date().toISOString();
    const effectivePhone = phone || '+91 98765 43210';
    const recipientName = name || email.split('@')[0];

    const purposeTitle = purpose === 'REGISTRATION' 
      ? 'Account Verification' 
      : purpose === 'FORGOT_PASSWORD' 
        ? 'Password Reset' 
        : 'Login Verification';

    const emailSubject = `${otp} is your Sri Telangana Ruchulu ${purposeTitle} Security Code`;
    const emailBody = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 620px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; border: 1px solid #e2e8f0; box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.05);">
        
        ${this.getBrandHeaderHtml('100% HOMEMADE • ZERO PRESERVATIVES • PURE COW GHEE')}

        <!-- MAIN EMAIL CONTENT -->
        <div style="padding: 32px 28px 24px; color: #1e293b; line-height: 1.6;">
          <h2 style="margin: 0 0 12px; font-family: 'Montserrat', sans-serif; font-size: 20px; font-weight: 700; color: #4a2e1f;">
            Namaskaram, ${recipientName}! 🙏
          </h2>
          <p style="margin: 0 0 20px; font-size: 14px; color: #475569;">
            We received a request to verify your account for <strong>Sri Telangana Ruchulu</strong>. Please enter the secure One-Time Password (OTP) below to authenticate your session:
          </p>

          <!-- HERO LUXURY OTP BOX (WEBSITE THEME ACCENT) -->
          <div style="background: linear-gradient(180deg, #fffdf8 0%, #fbf6ec 100%); border: 2px solid #D1A155; border-radius: 14px; padding: 24px 16px; text-align: center; margin: 24px 0; box-shadow: 0 6px 18px rgba(74, 46, 31, 0.08);">
            <p style="margin: 0 0 8px; font-size: 11px; font-weight: 800; color: #855320; letter-spacing: 2px; text-transform: uppercase;">
              Your 6-Digit Verification Code
            </p>
            <div style="font-family: 'Courier New', Courier, monospace; font-size: 40px; font-weight: 900; letter-spacing: 10px; color: #4a2e1f; margin: 10px 0; text-shadow: 0 1px 2px rgba(74,46,31,0.15);">
              ${otp}
            </div>
            <div style="margin-top: 10px; display: inline-block; background: #ffffff; border: 1px solid #D1A155; padding: 5px 16px; border-radius: 20px;">
              <span style="font-size: 12px; font-weight: 600; color: #4a2e1f;">
                ⏱️ Valid for 10 minutes • Single-use confidential code
              </span>
            </div>
          </div>

          <!-- SECURITY ALERT -->
          <div style="background-color: #faf7f2; border-left: 4px solid #4a2e1f; padding: 12px 16px; border-radius: 0 8px 8px 0; margin-bottom: 24px;">
            <p style="margin: 0; font-size: 12px; color: #64748b; line-height: 1.5;">
              <strong>Security Notice:</strong> Sri Telangana Ruchulu kitchen staff or support executives will never call or message to ask for your OTP. If you did not initiate this sign-in request, please ignore this email.
            </p>
          </div>

          <!-- ABOUT THE BRAND SECTION -->
          <div style="background-color: #fcfbf7; border: 1px solid #f3ebd8; border-radius: 12px; padding: 20px; margin-top: 24px;">
            <h3 style="margin: 0 0 10px; font-family: 'Montserrat', sans-serif; font-size: 14px; font-weight: 700; color: #4a2e1f; text-transform: uppercase; letter-spacing: 1px;">
              About Sri Telangana Ruchulu
            </h3>
            <p style="margin: 0 0 12px; font-size: 12px; color: #57534e; line-height: 1.6;">
              Born in the historic culinary heartland of <strong>Warangal & Hanamkonda</strong>, Sri Telangana Ruchulu brings authentic ancestral Telugu flavors straight from traditional kitchens to your dining table:
            </p>
            <table role="presentation" border="0" cellpadding="0" cellspacing="0" style="width: 100%; font-size: 12px; color: #44403c;">
              <tr>
                <td style="padding: 5px 0; vertical-align: top; width: 24px;">🏺</td>
                <td style="padding: 5px 0;"><strong>Wood-Fired & Stone-Ground:</strong> Sun-ripened pickles and stone-ground podis prepared using heritage Warangal techniques.</td>
              </tr>
              <tr>
                <td style="padding: 5px 0; vertical-align: top; width: 24px;">🌿</td>
                <td style="padding: 5px 0;"><strong>Zero Chemical Preservatives:</strong> Cold-pressed sesame oil, pure cow ghee, and handpicked Guntur red chilies.</td>
              </tr>
              <tr>
                <td style="padding: 5px 0; vertical-align: top; width: 24px;">📦</td>
                <td style="padding: 5px 0;"><strong>Fresh Kitchen Dispatches:</strong> Every batch is freshly packed in food-grade aroma-lock jars with express delivery.</td>
              </tr>
            </table>
          </div>

          <!-- QUICK CTA LINK -->
          <div style="text-align: center; margin: 28px 0 10px;">
            <a href="http://localhost:5173/shop" style="background-color: #4a2e1f; color: #ffffff; padding: 12px 30px; border-radius: 8px; text-decoration: none; font-size: 13px; font-weight: 700; display: inline-block; border: 1.5px solid #D1A155; box-shadow: 0 4px 14px rgba(74,46,31,0.25);">
              Explore Authentic Ruchulu Collection →
            </a>
          </div>
        </div>

        ${this.getBrandFooterHtml()}
      </div>
    `;

    // Send Live Email
    const dispatchResult = await this.dispatchEmail({
      to: email,
      subject: emailSubject,
      html: emailBody
    });

    this.latestOtps.set(email.toLowerCase().trim(), {
      otp,
      timestamp: Date.now()
    });

    this.addLog({
      id: `NOTIF-EM-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      type: 'EMAIL',
      category: purpose === 'FORGOT_PASSWORD' ? 'FORGOT_PASSWORD' : 'OTP',
      recipient: email,
      recipientName,
      subject: emailSubject,
      content: emailBody,
      previewText: `Your OTP for ${purposeTitle} is ${otp}. Valid for 10 minutes.`,
      previewUrl: dispatchResult.previewUrl,
      metadata: { otp, purpose },
      status: dispatchResult.success ? 'DELIVERED' : 'FAILED',
      timestamp: now
    });

    // SMS Log
    const smsMessage = `Your Sri Telangana Ruchulu OTP for ${purposeTitle} is ${otp}. Valid for 10 minutes. Do not share with anyone. - Sri Telangana Ruchulu`;
    this.addLog({
      id: `NOTIF-SMS-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      type: 'SMS',
      category: purpose === 'FORGOT_PASSWORD' ? 'FORGOT_PASSWORD' : 'OTP',
      recipient: effectivePhone,
      recipientName,
      content: smsMessage,
      previewText: `Your OTP for ${purposeTitle} is ${otp}. Valid for 10 minutes.`,
      metadata: { otp, purpose },
      status: 'DELIVERED',
      timestamp: now
    });

    console.log(`
=============================================================
  SRI TELANGANA RUCHULU - AUTHENTICATION NOTIFICATION
  To:        ${email}
  Mobile:    ${effectivePhone}
  Type:      ${purposeTitle}
  OTP Code:  >>> ${otp} <<<
  Validity:  10 Minutes
=============================================================
    `);

    return {
      success: dispatchResult.success,
      previewUrl: dispatchResult.previewUrl,
      otp
    };
  }

  // --- 3. ORDER CONFIRMATION NOTIFICATION (EMAIL & SMS) ---
  public async sendOrderConfirmationNotification(order: Order) {
    const now = new Date().toISOString();
    const trackingId = order.trackingId || `STR-TRK-${Math.floor(100000 + Math.random() * 900000)}`;
    const courier = order.courierPartner || 'Sri Telangana Tri-City Express';
    const estDelivery = order.estimatedDelivery || 'Within 2-3 business days';

    const frontendUrl = (process.env.FRONTEND_URL || 'http://localhost:5173').replace(/\/+$/, '');
    const trackingQuery = encodeURIComponent(order.orderNumber || trackingId);
    const trackingUrl = `${frontendUrl}/track-order?q=${trackingQuery}`;

    const itemsHtml = (order.items || []).map(item => `
      <tr style="border-bottom: 1px solid #f1f5f9;">
        <td style="padding: 10px 0; color: #1e293b;">
          <strong>${item.quantity}x</strong> ${item.productName}
          <span style="display: block; font-size: 11px; color: #64748b;">Pack size: ${item.weight || '500g'}</span>
        </td>
        <td style="padding: 10px 0; text-align: right; font-weight: bold; color: #4a2e1f;">
          ₹${(item.price * item.quantity).toFixed(2)}
        </td>
      </tr>
    `).join('');

    const emailSubject = `Order #${order.orderNumber} Confirmed! Your Sri Telangana Ruchulu Package is Preparing 🎉`;
    const emailBody = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 620px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 16px; overflow: hidden; background: #ffffff; box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.05);">
        ${this.getBrandHeaderHtml(`ORDER CONFIRMED • #${order.orderNumber}`)}

        <div style="padding: 24px;">
          <p style="font-size: 14px; color: #334155;">Namaskaram <strong>${order.customerName}</strong>,</p>
          <p style="font-size: 14px; color: #334155; line-height: 1.5;">
            Thank you for ordering with Sri Telangana Ruchulu! Your package is being freshly packaged by our master chefs in Warangal.
          </p>

          <div style="background-color: #faf7f2; border: 1px solid #eadecb; border-radius: 8px; padding: 16px; margin: 18px 0;">
            <table style="width: 100%; font-size: 13px; border-collapse: collapse;">
              <tr>
                <td style="color: #64748b; padding-bottom: 6px;">Tracking ID:</td>
                <td style="text-align: right; font-weight: bold; color: #4a2e1f; font-family: monospace; padding-bottom: 6px;">${trackingId}</td>
              </tr>
              <tr>
                <td style="color: #64748b; padding-bottom: 6px;">Courier Partner:</td>
                <td style="text-align: right; font-weight: bold; color: #4a2e1f; padding-bottom: 6px;">${courier}</td>
              </tr>
              <tr>
                <td style="color: #64748b; padding-bottom: 6px;">Estimated Delivery:</td>
                <td style="text-align: right; font-weight: bold; color: #15803d; padding-bottom: 6px;">${estDelivery}</td>
              </tr>
              <tr>
                <td style="color: #64748b;">Payment Method:</td>
                <td style="text-align: right; font-weight: bold; color: #1e293b;">${order.paymentMethod === 'RAZORPAY' ? 'Razorpay Online' : order.paymentMethod}</td>
              </tr>
            </table>
          </div>

          <h3 style="font-family: 'Montserrat', sans-serif; font-size: 14px; text-transform: uppercase; color: #4a2e1f; letter-spacing: 0.5px; margin-bottom: 8px;">Items Ordered</h3>
          <table style="width: 100%; border-collapse: collapse; font-size: 13px; margin-bottom: 16px;">
            ${itemsHtml}
          </table>

          <div style="border-top: 2px solid #e2e8f0; padding-top: 12px; font-size: 13px;">
            <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
              <span style="color: #64748b;">Shipping Fee:</span>
              <span style="font-weight: bold; color: #15803d;">${order.shippingFee === 0 ? 'FREE' : `₹${order.shippingFee}`}</span>
            </div>
            ${order.discount ? `
            <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
              <span style="color: #15803d;">First Order Discount:</span>
              <span style="font-weight: bold; color: #15803d;">-₹${order.discount}</span>
            </div>` : ''}
            <div style="display: flex; justify-content: space-between; font-size: 16px; font-weight: bold; color: #4a2e1f; margin-top: 8px; border-top: 1px dashed #cbd5e1; padding-top: 8px;">
              <span>Total Amount:</span>
              <span>₹${order.totalAmount.toFixed(2)}</span>
            </div>
          </div>

          <div style="margin-top: 26px; text-align: center;">
            <a href="${trackingUrl}" target="_blank" rel="noopener noreferrer" style="background-color: #4a2e1f; color: #ffffff; padding: 14px 36px; border-radius: 8px; text-decoration: none; font-weight: 800; font-size: 14px; display: inline-block; border: 1.5px solid #D1A155; box-shadow: 0 4px 14px rgba(74,46,31,0.25); text-transform: uppercase; letter-spacing: 0.5px;">
              Track Shipment Status →
            </a>
          </div>

          <div style="margin-top: 20px; font-size: 12px; color: #64748b; background-color: #f8fafc; padding: 12px; border-radius: 8px;">
            <strong>Delivery Destination:</strong><br/>
            ${order.customerName}<br/>
            ${order.shippingAddress}<br/>
            Phone: ${order.phone}
          </div>
        </div>

        ${this.getBrandFooterHtml()}
      </div>
    `;

    const dispatchResult = await this.dispatchEmail({
      to: order.email || 'customer@sritelanganaruchulu.com',
      subject: emailSubject,
      html: emailBody
    });

    this.addLog({
      id: `NOTIF-EM-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      type: 'EMAIL',
      category: 'ORDER_CONFIRMATION',
      recipient: order.email || 'customer@sritelanganaruchulu.com',
      recipientName: order.customerName,
      subject: emailSubject,
      content: emailBody,
      previewText: `Order #${order.orderNumber} confirmed! Tracking ID: ${trackingId}. Estimated Delivery: ${estDelivery}.`,
      previewUrl: dispatchResult.previewUrl,
      metadata: { orderNumber: order.orderNumber, trackingId, totalAmount: order.totalAmount },
      status: dispatchResult.success ? 'DELIVERED' : 'FAILED',
      timestamp: now
    });

    const itemsSummary = (order.items || []).map(i => `${i.quantity}x ${i.productName}`).slice(0, 2).join(', ');
    const smsMessage = `Order Confirmed! Your Sri Telangana Ruchulu order #${order.orderNumber} (${itemsSummary}...) is booked. Tracking ID: ${trackingId}. Delivery: ${estDelivery}. Total: Rs.${order.totalAmount}. Track live at: ${trackingUrl}`;

    this.addLog({
      id: `NOTIF-SMS-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      type: 'SMS',
      category: 'ORDER_CONFIRMATION',
      recipient: order.phone || '+91 98765 43210',
      recipientName: order.customerName,
      content: smsMessage,
      previewText: `Order #${order.orderNumber} confirmed! Tracking ID: ${trackingId}. Delivery: ${estDelivery}.`,
      metadata: { orderNumber: order.orderNumber, trackingId, totalAmount: order.totalAmount },
      status: 'DELIVERED',
      timestamp: now
    });

    console.log(`[NotificationService] Sent ORDER CONFIRMATION Email to ${order.email} and SMS to ${order.phone} for Order ${order.orderNumber}`);
    return dispatchResult;
  }

  // --- 4. TRACKING UPDATE NOTIFICATION (EMAIL & SMS) ---
  public async sendTrackingUpdateNotification(order: Order) {
    if (!order.email) {
      console.warn(`[NotificationService] Cannot send tracking update email: Order #${order.orderNumber} has no email address`);
      return { success: false, error: 'No email address found for order' };
    }

    const now = new Date().toISOString();
    const trackingId = order.trackingId || order.orderNumber;
    const courier = order.courierPartner || 'Sri Telangana Tri-City Express';
    const estDelivery = order.estimatedDelivery || 'In Progress';
    const trackingNotes = order.trackingNotes || 'Package status updated by logistics team';

    const frontendUrl = (process.env.FRONTEND_URL || 'http://localhost:5173').replace(/\/+$/, '');
    const trackingQuery = encodeURIComponent(order.orderNumber || trackingId);
    const trackingUrl = `${frontendUrl}/track-order?q=${trackingQuery}`;

    const statusMap: Record<string, { label: string; icon: string }> = {
      PENDING: { label: 'Pending Approval', icon: '⏳' },
      CONFIRMED: { label: 'Order Confirmed', icon: '✅' },
      PREPARING: { label: 'Preparing in Kitchen', icon: '🍳' },
      SHIPPED: { label: 'Dispatched / In Transit', icon: '🚚' },
      OUT_FOR_DELIVERY: { label: 'Out for Delivery', icon: '🛵' },
      DELIVERED: { label: 'Delivered to Customer', icon: '🎉' },
      CANCELLED: { label: 'Order Cancelled', icon: '❌' }
    };

    const currentStatus = statusMap[order.status] || {
      label: order.status,
      icon: '📦'
    };

    const itemsSummary = (order.items || []).map(i => `${i.quantity}x ${i.productName}`).join(', ');

    const emailSubject = `Shipment Update: Order #${order.orderNumber} is now ${currentStatus.label} ${currentStatus.icon}`;
    const emailBody = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 620px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 16px; overflow: hidden; background: #ffffff; box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.05);">
        ${this.getBrandHeaderHtml(`SHIPMENT UPDATE • #${order.orderNumber}`)}

        <div style="padding: 28px 24px;">
          <p style="font-size: 15px; color: #1e293b; margin: 0 0 10px;">
            Namaskaram <strong>${order.customerName}</strong>, 🙏
          </p>
          <p style="font-size: 14px; color: #475569; line-height: 1.6; margin: 0 0 20px;">
            Your order tracking details have been updated. Here is the latest shipment information for your handcrafted package from Warangal:
          </p>

          <!-- STATUS BADGE HERO BOX -->
          <div style="background: linear-gradient(135deg, #fffcf6 0%, #fef8ee 100%); border: 2px solid #D1A155; border-radius: 14px; padding: 20px; text-align: center; margin-bottom: 22px; box-shadow: 0 4px 12px rgba(74, 46, 31, 0.06);">
            <p style="margin: 0 0 6px; font-size: 11px; font-weight: 800; color: #855320; letter-spacing: 2px; text-transform: uppercase;">
              Current Shipment Status
            </p>
            <div style="display: inline-block; background-color: #4a2e1f; color: #F6E7BC; padding: 8px 22px; border-radius: 24px; font-size: 15px; font-weight: 800; border: 1px solid #D1A155; letter-spacing: 0.5px;">
              ${currentStatus.icon} ${currentStatus.label}
            </div>
            ${trackingNotes ? `
              <p style="margin: 12px 0 0; font-size: 13px; color: #57534e; font-style: italic;">
                "${trackingNotes}"
              </p>
            ` : ''}
          </div>

          <!-- TRACKING DETAILS TABLE -->
          <div style="background-color: #faf7f2; border: 1px solid #eadecb; border-radius: 10px; padding: 18px; margin: 18px 0;">
            <table style="width: 100%; font-size: 13px; border-collapse: collapse;">
              <tr>
                <td style="color: #64748b; padding-bottom: 8px;">Order Number:</td>
                <td style="text-align: right; font-weight: bold; color: #4a2e1f; font-family: monospace; padding-bottom: 8px;">${order.orderNumber}</td>
              </tr>
              <tr>
                <td style="color: #64748b; padding-bottom: 8px;">Tracking ID:</td>
                <td style="text-align: right; font-weight: bold; color: #4a2e1f; font-family: monospace; padding-bottom: 8px;">${trackingId}</td>
              </tr>
              <tr>
                <td style="color: #64748b; padding-bottom: 8px;">Courier Partner:</td>
                <td style="text-align: right; font-weight: bold; color: #1e293b; padding-bottom: 8px;">${courier}</td>
              </tr>
              <tr>
                <td style="color: #64748b; padding-bottom: 8px;">Estimated Delivery:</td>
                <td style="text-align: right; font-weight: bold; color: #15803d; padding-bottom: 8px;">${estDelivery}</td>
              </tr>
              ${itemsSummary ? `
              <tr>
                <td style="color: #64748b;">Ordered Items:</td>
                <td style="text-align: right; font-weight: 600; color: #334155;">${itemsSummary}</td>
              </tr>` : ''}
            </table>
          </div>

          <!-- TRACK SHIPMENT STATUS BUTTON -->
          <div style="margin: 28px 0 20px; text-align: center;">
            <a href="${trackingUrl}" target="_blank" rel="noopener noreferrer" style="background-color: #4a2e1f; color: #ffffff; padding: 14px 38px; border-radius: 8px; text-decoration: none; font-weight: 800; font-size: 14px; display: inline-block; border: 1.5px solid #D1A155; box-shadow: 0 4px 14px rgba(74,46,31,0.25); text-transform: uppercase; letter-spacing: 0.5px;">
              Track Shipment Status →
            </a>
          </div>

          <!-- DELIVERY DESTINATION -->
          <div style="margin-top: 20px; font-size: 12px; color: #64748b; background-color: #f8fafc; padding: 14px; border-radius: 8px; line-height: 1.5;">
            <strong>Shipping Destination:</strong><br/>
            ${order.customerName}<br/>
            ${order.shippingAddress || 'Destination on file'}<br/>
            Phone: ${order.phone || 'On file'}
          </div>
        </div>

        ${this.getBrandFooterHtml()}
      </div>
    `;

    const dispatchResult = await this.dispatchEmail({
      to: order.email,
      subject: emailSubject,
      html: emailBody
    });

    this.addLog({
      id: `NOTIF-EM-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      type: 'EMAIL',
      category: 'TRACKING_UPDATE',
      recipient: order.email,
      recipientName: order.customerName,
      subject: emailSubject,
      content: emailBody,
      previewText: `Order #${order.orderNumber} update: Status is ${currentStatus.label}. Tracking ID: ${trackingId}.`,
      previewUrl: dispatchResult.previewUrl,
      metadata: { orderNumber: order.orderNumber, trackingId, status: order.status, trackingNotes },
      status: dispatchResult.success ? 'DELIVERED' : 'FAILED',
      timestamp: now
    });

    const smsMessage = `Shipment Update: Your order #${order.orderNumber} is now ${currentStatus.label}. Tracking ID: ${trackingId}. Notes: ${trackingNotes}. Track live at: ${trackingUrl}`;
    this.addLog({
      id: `NOTIF-SMS-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      type: 'SMS',
      category: 'TRACKING_UPDATE',
      recipient: order.phone || '+91 98765 43210',
      recipientName: order.customerName,
      content: smsMessage,
      previewText: `Order #${order.orderNumber} is now ${currentStatus.label}.`,
      metadata: { orderNumber: order.orderNumber, trackingId, status: order.status },
      status: 'DELIVERED',
      timestamp: now
    });

    console.log(`[NotificationService] Sent TRACKING UPDATE Email to ${order.email} and SMS to ${order.phone} for Order #${order.orderNumber} (${currentStatus.label})`);
    return dispatchResult;
  }

  public getSmtpStatus() {
    const user = process.env.SMTP_USER?.trim();
    const host = process.env.SMTP_HOST || 'smtp.gmail.com';
    const isConfigured = Boolean(user && process.env.SMTP_PASS?.trim());
    return {
      isConfigured,
      host,
      senderEmail: user ? user : null,
      transporterActive: this.transporter !== null
    };
  }

  // --- 4. PROMOTIONAL OFFER EMAIL ---
  public async sendPromotionalOfferEmail(params: {
    recipientEmail: string;
    recipientName?: string;
    offerTitle: string;
    offerCode: string;
    discountPercentage?: number;
    description: string;
    validUntil?: string;
  }) {
    const { recipientEmail, recipientName, offerTitle, offerCode, discountPercentage, description, validUntil } = params;
    const name = recipientName || recipientEmail.split('@')[0];
    const emailSubject = `Special Offer: ${offerTitle} | Sri Telangana Ruchulu`;
    const emailBody = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 620px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 16px; overflow: hidden; background: #ffffff; box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.05);">
        ${this.getBrandHeaderHtml('SPECIAL SEASONAL OFFER')}
        <div style="padding: 24px; background-color: #ffffff; color: #1e293b; line-height: 1.6;">
          <h2 style="color: #4a2e1f; font-family: 'Montserrat', sans-serif; margin-top: 0;">Namaskaram ${name}! 🌶️✨</h2>
          <p style="font-size: 15px;">${description}</p>
          <div style="background-color: #fef3c7; border: 2px dashed #d97706; padding: 18px; border-radius: 10px; margin: 20px 0; text-align: center;">
            <p style="margin: 0; font-size: 13px; color: #92400e; font-weight: bold; text-transform: uppercase;">Use Coupon Code at Checkout:</p>
            <p style="margin: 8px 0; font-size: 26px; font-weight: 900; color: #78350f; letter-spacing: 3px; font-family: monospace;">${offerCode}</p>
            ${discountPercentage ? `<p style="margin: 4px 0 0; font-size: 14px; font-weight: bold; color: #b45309;">Enjoy ${discountPercentage}% OFF on your entire order!</p>` : ''}
            ${validUntil ? `<p style="margin: 6px 0 0; font-size: 11px; color: #94a3b8;">Offer valid until ${validUntil}</p>` : ''}
          </div>
          <p>Treat your family to our wood-fire roasted Avakaya pickle, Bellam Gavvalu, Gongura pachadi, and pure cow ghee sweets!</p>
          <div style="text-align: center; margin: 28px 0;">
            <a href="http://localhost:5173/shop" style="background-color: #4a2e1f; color: #ffffff; padding: 14px 34px; border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 14px; display: inline-block; border: 1.5px solid #D1A155; box-shadow: 0 4px 14px rgba(74,46,31,0.25);">Shop Now & Claim Offer →</a>
          </div>
        </div>
        ${this.getBrandFooterHtml()}
      </div>
    `;

    return this.dispatchEmail({
      to: recipientEmail,
      subject: emailSubject,
      html: emailBody
    });
  }

  // --- 5. PRODUCT ORDER REVIEW & FEEDBACK EMAIL ---
  public async sendReviewFeedbackNotification(order: Order) {
    const customerName = order.customerName || 'Valued Customer';
    const email = order.email;
    if (!email) {
      console.warn('[NotificationService] Cannot send review email: Order has no email');
      return { success: false, error: 'No email found' };
    }

    const itemsSummary = (order.items || [])
      .map(item => `<li style="padding: 6px 0; border-bottom: 1px dashed #e2e8f0; font-size: 13px; color: #334155;"><strong>${item.quantity}x ${item.productName}</strong> ${item.weight ? `(${item.weight})` : ''}</li>`)
      .join('');

    const emailSubject = `How was your taste of Telangana? Share your Review & Feedback for Order #${order.orderNumber}`;
    const emailBody = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 620px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; border: 1px solid #e2e8f0; box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.05);">
        
        ${this.getBrandHeaderHtml('ORDER DELIVERED • REVIEW & FEEDBACK')}

        <!-- MAIN CONTENT -->
        <div style="padding: 32px 28px 24px; color: #1e293b; line-height: 1.6;">
          <h2 style="margin: 0 0 12px; font-family: 'Montserrat', sans-serif; font-size: 22px; font-weight: 700; color: #4a2e1f;">
            Namaskaram, ${customerName}! 🙏
          </h2>
          <p style="margin: 0 0 16px; font-size: 15px; color: #334155;">
            We hope you are thoroughly relishing your traditional homemade dishes from Order <strong>#${order.orderNumber}</strong>!
          </p>
          <p style="margin: 0 0 20px; font-size: 14px; color: #475569;">
            Every single batch is lovingly prepared in our Warangal kitchen using generational recipes, hand-pounded spices, cold-pressed oils, and zero artificial preservatives.
          </p>

          <!-- ORDERED ITEMS -->
          <div style="background-color: #fcfbf7; border: 1px solid #f3ebd8; border-radius: 12px; padding: 20px; margin: 20px 0;">
            <h3 style="margin: 0 0 10px; font-family: 'Montserrat', sans-serif; font-size: 14px; font-weight: 700; color: #4a2e1f; text-transform: uppercase; letter-spacing: 0.5px;">
              Your Handcrafted Order Items:
            </h3>
            <ul style="margin: 0; padding-left: 18px; list-style-type: square;">
              ${itemsSummary}
            </ul>
          </div>

          <!-- 5-STAR RATING PROMPT -->
          <div style="text-align: center; margin: 28px 0; padding: 24px 16px; background: linear-gradient(to right, #fffbeb, #fef3c7); border-radius: 14px; border: 1px solid #fde68a;">
            <p style="margin: 0 0 12px; font-size: 16px; font-weight: 800; color: #92400e;">
              How would you rate your culinary experience?
            </p>
            <div style="font-size: 32px; letter-spacing: 8px; margin-bottom: 16px;">
              ⭐⭐⭐⭐⭐
            </div>
            <a href="http://localhost:5173/contact?order=${order.orderNumber}&type=feedback" style="background-color: #4a2e1f; color: #ffffff; padding: 14px 34px; border-radius: 8px; text-decoration: none; font-size: 14px; font-weight: 700; display: inline-block; border: 1.5px solid #D1A155; box-shadow: 0 4px 14px rgba(74,46,31,0.25);">
              Share Your Review & Feedback →
            </a>
          </div>

          <p style="margin: 20px 0 0; font-size: 13px; color: #64748b; text-align: center;">
            Your feedback directly empowers our heritage kitchen artisans to keep our authentic Telangana flavors alive.
          </p>
        </div>

        ${this.getBrandFooterHtml()}
      </div>
    `;

    const dispatchResult = await this.dispatchEmail({
      to: email,
      subject: emailSubject,
      html: emailBody
    });

    this.addLog({
      id: `NOTIF-EM-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      type: 'EMAIL',
      category: 'REVIEW_FEEDBACK',
      recipient: email,
      recipientName: customerName,
      subject: emailSubject,
      content: emailBody,
      previewText: `How was your taste of Telangana? Share your review for Order #${order.orderNumber}`,
      previewUrl: dispatchResult.previewUrl,
      status: dispatchResult.success ? 'DELIVERED' : 'FAILED',
      timestamp: new Date().toISOString()
    });

    console.log(`[NotificationService] Sent REVIEW & FEEDBACK Email to ${email} for Order #${order.orderNumber}`);
    return dispatchResult;
  }
}

export const notificationService = new NotificationService();
