import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import productRoutes from './routes/productRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import authRoutes from './routes/authRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';

dotenv.config();

// Live server initialization - Active SMTP Connected

const app = express();
const PORT = process.env.PORT || 5000;

// Enable Cross-Origin Resource Sharing (CORS) for local development and Vercel domains
app.use(cors({
  origin: true, // Allow incoming origin (Vercel previews, custom domains, localhost)
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Request logger for development
app.use((req: Request, _res: Response, next: NextFunction) => {
  if (process.env.NODE_ENV !== 'production') {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  }
  next();
});

// Root Welcome & Documentation Route
app.get('/', (_req: Request, res: Response) => {
  res.json({
    status: 'online',
    service: 'Sri Telangana Ruchulu - Backend API',
    version: '1.0.0',
    platform: process.env.VERCEL ? 'Vercel Serverless' : 'Node.js Express Server',
    endpoints: {
      health: '/api/health',
      products: '/api/products',
      categories: '/api/categories',
      orders: '/api/orders',
      notifications: '/api/notifications',
      adminStats: '/api/admin/stats',
      auth: {
        login: '/api/auth/login',
        register: '/api/auth/register',
        sendOtp: '/api/auth/send-otp',
        verifyOtp: '/api/auth/verify-otp',
        forgotPassword: '/api/auth/forgot-password',
        resetPassword: '/api/auth/reset-password'
      }
    }
  });
});

// Health check endpoints
const healthCheckHandler = (_req: Request, res: Response) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development'
  });
};
app.get('/api/health', healthCheckHandler);
app.get('/health', healthCheckHandler);

// Path normalization for Vercel Serverless Functions and local development
app.use((req: Request, _res: Response, next: NextFunction) => {
  const matchedPath = req.headers['x-matched-path'] as string | undefined;
  if (matchedPath && matchedPath.startsWith('/api')) {
    req.url = matchedPath;
  }
  if (req.url.startsWith('/api/api/')) {
    req.url = req.url.replace('/api/api/', '/api/');
  }
  next();
});

// Register API Routes (Both /api prefix and root for full Vercel compatibility)
const registerRoutes = (prefix: string) => {
  app.use(`${prefix}/products`, productRoutes);
  app.use(`${prefix}/categories`, categoryRoutes);
  app.use(`${prefix}/orders`, orderRoutes);
  app.use(`${prefix}/admin`, adminRoutes);
  app.use(`${prefix}/auth`, authRoutes);
  app.use(`${prefix}/notifications`, notificationRoutes);
};

registerRoutes('/api');
registerRoutes('');

// Catch-all 404 for unmatched routes
app.use((_req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: 'Endpoint not found'
  });
});

// Global Error Handler
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error('Unhandled server error:', err);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'production' ? undefined : err.message
  });
});

// Start server if not running inside Vercel serverless environment
if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`🚀 Sri Telangana Ruchulu Backend running at http://localhost:${PORT}`);
    console.log(`📡 Health check: http://localhost:${PORT}/api/health`);
    console.log(`📦 Products: http://localhost:${PORT}/api/products`);
  });
}

// Export express application for Vercel Serverless Function wrapper
export default app;
