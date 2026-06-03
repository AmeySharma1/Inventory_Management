# ChemStock Inventory & Order Management

ChemStock is a full-stack Next.js application built to manage chemical inventory, seller product catalogues, buyer ordering, and admin monitoring.

## What the app does

- **Admin** can monitor products, orders, users, and stock.
- **Seller** can add products, view their own catalog, and manage inventory.
- **Buyer** can browse products, add them to a cart, place orders, and track their own order history.

## Key application flow

1. User chooses a role: `admin`, `seller`, or `buyer`.
2. Registration and login are handled through role-specific auth pages.
3. Sellers create products that are stored with a `seller_id` and become visible to buyers and admins.
4. Buyers search and filter active products, add them to a cart, and place orders.
5. Orders are stored in the database and displayed in buyer order history and admin order monitoring.
6. Admin dashboard displays real metrics instead of dummy data, including product counts, order counts, and revenue.

## Project structure

- `src/app/`
  - `admin/` — admin dashboard, products, orders, users, settings
  - `seller/` — seller dashboard, product management, catalog, orders
  - `buyer/` — buyer dashboard, product browsing, order history
  - `auth/[role]/` — role-based sign-in and sign-up pages
  - `api/` — server-side API routes for auth, products, orders, and database migration
- `src/lib/` — helper files for auth, database schema, and connection logic
- `src/components/Sidebar.js` — shared role-specific navigation component

## Database and schema

The app uses PostgreSQL via Neon serverless.

Important tables:

- `users` — stores accounts with roles: `admin`, `seller`, `buyer`
- `categories` — product categories seeded during migration
- `products` — includes `seller_id`, product details, stock, and pricing
- `orders` — stores buyer orders with status and total amount
- `order_items` — stores each ordered product line for orders

The database migration endpoint is:

- `GET /api/db/migrate`

This endpoint creates the tables and seeds categories.

## How the website works

### Authentication

- Role-specific pages are available under `/auth/admin`, `/auth/seller`, and `/auth/buyer`.
- Admin registration requires the admin secret `chemstock-admin-2026`.
- After login, users are redirected to their role dashboard.
- The app uses JWT-based session handling to protect routes.

### Seller flow

- Sellers add products through `/seller/products`.
- New products are saved with the seller's own `seller_id`.
- Admin and buyers can view products created by sellers.

### Buyer flow

- Buyers browse products using `/buyer/products`.
- Search and category filters let buyers find products.
- Buyers add products to cart and place orders.
- Orders appear in `/buyer/orders` with status and totals.

### Admin flow

- Admin dashboard shows live system metrics from the database.
- `/admin/products` lists all products across all sellers.
- `/admin/orders` shows all buyer orders and their current status.
- `/admin/users` shows user roles correctly, including admin, sellers, and buyers.

## Fixes included

- Buyer users now display as `Buyer` instead of `Seller` in the admin users list.
- Admin users page now correctly filters buyers and tracks buyer order counts.
- Real data is displayed throughout the admin dashboard instead of placeholder data.

## Running locally

Install dependencies:

```bash
npm install
```

Start the dev server:

```bash
npm run dev
```

Open the app at:

```bash
http://localhost:3000
```

## Environment

The app expects the following environment variables:

- `DATABASE_URL` — PostgreSQL connection string
- `JWT_SECRET` — secret for auth tokens
- `ADMIN_SECRET` — secret passphrase for admin signup (`chemstock-admin-2026` by default)
- `NEXT_PUBLIC_APP_URL` — e.g. `http://localhost:3000`

## Notes

- The app is designed for demonstration and inventory workflows. It is ready for further extension with admin order approvals, product editing, and quotations.
- The current admin dashboard uses real product and order data from the database.
- The buyer order cycle has been verified end-to-end for seller product discovery, cart checkout, and admin monitoring.
