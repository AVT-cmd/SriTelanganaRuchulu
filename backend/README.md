# Sri Telangana Ruchulu - Backend API

Production-ready Node.js REST API built with Express and TypeScript, optimized for serverless deployment on **Vercel**.

---

## 🛠 Tech Stack

- **Runtime**: Node.js (ES Modules)
- **Language**: TypeScript
- **Framework**: Express.js
- **Deployment**: Vercel Serverless Functions (`@vercel/node`)
- **State Management**: Seeded In-Memory Store with CRUD & Analytics (Pluggable with Postgres/Neon/Supabase)

---

## 🚀 Local Development

### 1. Install Dependencies
```bash
cd sri-telangana-ruchulu/backend
npm install
```

### 2. Start Dev Server
```bash
npm run dev
```
The server starts at `http://localhost:5000` with hot reloading.

### 3. Build & Production Run
```bash
npm run build
npm start
```

---

## 📡 API Endpoints

### Products
- `GET /api/products` - List all products (supports `?category=slug`, `?search=term`, `?inStock=true`, `?page=1&limit=20`)
- `GET /api/products/:slug` - Fetch single product by slug or numeric ID
- `POST /api/products` - Create new product
- `PUT /api/products/:id` - Update existing product
- `DELETE /api/products/:id` - Delete product

### Categories
- `GET /api/categories` - List all categories
- `GET /api/categories/:slug` - Get category by slug
- `POST /api/categories` - Create new category

### Orders
- `POST /api/orders` - Place a new customer order
- `GET /api/orders` - Fetch all orders (Admin)
- `GET /api/orders/:id` - Fetch single order by ID
- `PATCH /api/orders/:id/status` - Update status (`PENDING`, `CONFIRMED`, `SHIPPED`, `DELIVERED`, `CANCELLED`)

### Admin Dashboard
- `GET /api/admin/stats` - Summary metrics (Total products, in stock, order counts, revenue, recent orders)

### Authentication
- `POST /api/auth/login` - User and admin login
- `POST /api/auth/register` - New customer registration

### Health Check
- `GET /api/health` - Service health status & uptime

---

## ☁️ Deploying to Vercel

### Option 1: Deploy Backend via Vercel CLI
```bash
cd sri-telangana-ruchulu/backend
npx vercel
```

### Option 2: Deploy Backend via Vercel Dashboard (GitHub)
1. Push your repository to GitHub.
2. In Vercel, click **Add New Project**.
3. Select your repository.
4. Set **Root Directory** to `sri-telangana-ruchulu/backend`.
5. Click **Deploy**. Vercel will automatically read `vercel.json` and deploy it as a Serverless API!
