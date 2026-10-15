# Sri Telangana Ruchulu (శ్రీ తెలంగాణ రుచులు) 🌶️🏺

> Authentic traditional Telangana Pindi Vantalu, Heritage Pickles (*Pachadlu*), Podis & Sweets handcrafted from the historic culinary heartland of Warangal & Hanamkonda.

---

## 🌟 Overview

Sri Telangana Ruchulu is a full-stack modern e-commerce web application featuring authentic Telugu culinary delicacies, seamless customer ordering, live tracking, and email automation.

### Key Features
* **Heritage Storefront**: Modern React frontend with Tailwind CSS, category browsing, full-text product search, dynamic filtering, and aroma-lock packaging information.
* **Smart Pincode Shipping**:
  * Local Delivery (Warangal / Hanamkonda / Kazipet pincodes `506xxx`): ₹80 delivery fee, **FREE** for orders > 1kg.
  * Express Regional Delivery (All other pincodes across Telangana & India): ₹350 flat rate express delivery.
* **Passwordless OTP Login**: Seamless customer onboarding and authentication via 6-digit email verification codes.
* **Branded Email Automation (Nodemailer + Gmail SMTP)**:
  * Customer Login OTP verification with security alerts.
  * Welcome notification upon registration.
  * Order confirmation receipt with tracking ID and item breakdown.
  * Post-delivery feedback and review request emails.
  * Inline brand logo (CID attachment) that renders natively in Gmail, Outlook, and Apple Mail without privacy blocking.
* **Order Tracking & Management**: Real-time order progress timeline (*Placed* ➔ *Confirmed* ➔ *Preparing* ➔ *Shipped* ➔ *Out for Delivery* ➔ *Delivered*).
* **Admin Dashboard**: Manage inventory, products, orders, live tracking notes, courier partners, and email dispatch logs.
* **Payment Integration**: Razorpay payment gateway integration + Cash on Delivery (COD).

---

## 🏗️ Project Architecture

```
SriTelanganaRuchulu/
├── frontend/                     # React + Vite + TypeScript Storefront
│   ├── src/
│   │   ├── api/                 # API client services
│   │   ├── components/          # Reusable UI components (Header, Footer, ProductCard, etc.)
│   │   ├── pages/               # Application views (Home, Shop, Cart, Checkout, Tracking, etc.)
│   │   ├── store/               # Zustand state management (Cart, Auth)
│   │   └── types/               # TypeScript models
│   └── public/                  # Static assets & brand imagery
├── backend/                      # Node.js + Express + TypeScript REST API
│   ├── src/
│   │   ├── controllers/         # Request handlers (auth, products, orders, notifications)
│   │   ├── routes/              # Express API routing
│   │   ├── services/            # NotificationService (Nodemailer live SMTP)
│   │   ├── data/                # DataStore engine with JSON persistence
│   │   └── types/               # Server-side TypeScript interfaces
│   └── assets/                  # Brand assets (brand_logo.png)
└── docs/                         # Architecture, SEO, and Design System docs
```

---

## 🚀 Quick Start Guide

### Prerequisites
* [Node.js](https://nodejs.org/) (v18 or higher)
* [npm](https://www.npmjs.com/)

### 1. Installation
Install dependencies for both frontend and backend:
```bash
npm --prefix frontend install
npm --prefix backend install
```

### 2. Environment Setup
Configure your environment files:

#### Frontend (`frontend/.env`):
```env
VITE_API_URL=http://localhost:5000
VITE_RAZORPAY_KEY_ID=your_razorpay_key_id
```

#### Backend (`backend/.env`):
```env
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173

# Razorpay Configuration
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret

# SMTP Email Configuration (Gmail App Password)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_16_digit_app_password
EMAIL_FROM="Sri Telangana Ruchulu" <your_email@gmail.com>
```

### 3. Run Locally
Start the backend API server:
```bash
npm run dev:backend
```

In a second terminal, start the frontend client:
```bash
npm run dev:frontend
```

* Frontend: `http://localhost:5173`
* Backend API: `http://localhost:5000`

---

## 📜 License
© 2026 Sri Telangana Ruchulu. Handcrafted with traditional Telugu culinary heritage.
