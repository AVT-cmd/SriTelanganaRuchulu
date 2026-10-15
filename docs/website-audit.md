# Website Audit

## Overview
This document serves as an audit of the existing Sri Telangana Ruchulu website (`https://sritelanganaruchulu.com/`) to ensure a smooth transition to the new architecture.

## Existing Website Analysis
- **Framework/Platform:** WordPress, WooCommerce
- **Theme:** Kadence
- **SEO Plugin:** Rank Math SEO
- **Brand Name:** Sri Telangana Ruchulu
- **Tagline:** Authentic Telangana Pindi Vantalu
- **Description:** Enjoy authentic Telangana Pindi Vantalu made fresh at Sri Telangana Ruchulu. Delicious homemade snacks delivered across the globe with trusted quality.

## Data Points Extracted
- **Products:** 63 active products (Snacks, Sweets, Pickles, Podis).
- **Categories:** Extracted from WooCommerce (e.g. Non Veg Pickles, Sweets, Podis, etc.).
- **Product Details:** Preserved titles, prices, images, and descriptions. See `product-inventory.md`.
- **Images:** Image URLs are preserved. The logo URL is `https://sritelanganaruchulu.com/wp-content/uploads/2026/01/Sri_Telangana_Ruchulu_Logo_-_2__White_bg_-1_2-removebg-preview-150x150.png`.

## Content & Structure
- **Pages to migrate:** Home, Shop (All Products), About Us, Contact Us, individual product and category pages.
- **Header:** Logo, primary navigation, search, cart.
- **Footer:** Links, policies, social media, contact info.

## Identified Issues & Areas for Improvement
- **Performance:** Current WordPress site relies on many plugins (Click-to-chat, WooCommerce, Kadence blocks). A custom React frontend will be much faster.
- **SEO:** Current URLs follow standard WordPress permalinks (`/product/{slug}/`). We need 301 redirects to maintain SEO equity if these URLs change, though keeping the same slug structure (`/product/{slug}`) is recommended.
- **Accessibility:** Needs proper contrast checks, ARIA labels, and keyboard navigation support.

## References Audit
- `manadelites.vercel.app/`: Provides modern React/Next.js e-commerce aesthetic. Clean layouts, quick cart actions.
- `tulasipickles.com/`: Good reference for category navigation, trust elements (traditional prep focus), and product grids. We will adapt these UX patterns while maintaining the Sri Telangana Ruchulu identity.
