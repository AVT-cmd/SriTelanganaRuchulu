# Implementation Plan

## Phase 1: Audit & Documentation (Completed)
- Crawled the existing website.
- Extracted 63 products with their details (inventory mapped).
- Extracted brand colors and typography.
- Drafted SEO migration plan.

## Phase 2: Project Setup (Next Steps)
- Initialize Git repository.
- Setup `frontend` with React + Vite + TypeScript + Tailwind CSS.
- Setup `backend` with Java 21, Spring Boot 3.x, MySQL 8, Flyway.
- Create initial folder structure.

## Phase 3: Database & API Foundation
- Design normalized MySQL schema (Categories, Products, Users, Orders).
- Create Flyway migration scripts.
- Implement Spring Boot REST APIs for Products (GET /api/products, GET /api/products/{slug}).
- Import the extracted `products.json` data into the database via a seed script or Flyway.

## Phase 4: Frontend Core & UI Components
- Setup Tailwind config with extracted brand colors (`#D1A155`, `#4a2e1f`, etc.).
- Build reusable UI components (Buttons, Cards, Header, Footer).
- Implement React Router for navigation.

## Phase 5: Shop Features
- **Homepage:** Hero section, Featured Products, Categories, Brand Story.
- **PLP (Product Listing Page):** Grid layout, filtering by category, search.
- **PDP (Product Detail Page):** Image gallery, description, price, quantity selector, add to cart.
- **Cart:** State management (Zustand or Context API), local storage persistence.

## Phase 6: Checkout & Orders
- Customer address form.
- Order summary calculation.
- Backend order creation endpoint (POST /api/orders).
- Payment gateway integration stubs.

## Phase 7: Admin Dashboard
- Spring Security + JWT setup.
- Admin login.
- Protected routes for Product and Order management.
- Image upload handling.

## Phase 8: SEO & Performance
- Implement React Helmet (or similar) for meta tags.
- Generate dynamic `sitemap.xml` on backend.
- Optimize images.
- Lighthouse audits.

## Phase 9: Testing & QA
- Frontend unit tests and E2E flows.
- Backend integration tests for critical APIs.
- Validate data accuracy against `product-inventory.md`.

## Phase 10: Deployment
- Prepare Dockerfiles.
- Setup reverse proxy configuration (Nginx) for routing `/api` to Spring Boot and `/` to React.
- Implement 301 redirects mapping.
