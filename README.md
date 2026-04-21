# Mumtaz Store — eCommerce Store for Cosmetics & Baby Products
## Ecommmerce store
A full-stack eCommerce web application built with React, Node.js, Express, and MongoDB.

## 🚀 Features

### User Side
- **Homepage** — Hero section, featured products, category highlights, newsletter signup
- **Product Listing** — Search, category filters (Cosmetics / Baby Care), responsive grid
- **Product Detail** — Full product info, quantity selector, add to cart
- **Shopping Cart** — Slide-out drawer + full cart page with quantity controls
- **Responsive Design** — Mobile-first, works on all screen sizes

### Admin Panel
- **Secure JWT Login** — Email + password authentication
- **Dashboard** — Store metrics (total products, inventory value, stock alerts)
- **Product CRUD** — Add, edit, delete products with modal form
- **Image Upload** — Via URL (Cloudinary-ready)
- **Stock Management** — Low stock and out-of-stock alerts

## 📁 Project Structure

```
root/
├── client/                 # Frontend (React + TypeScript + Tailwind)
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Page components (routes)
│   │   ├── context/        # Global state (AppContext)
│   │   ├── services/       # API service layer
│   │   ├── types/          # TypeScript interfaces
│   │   └── main.tsx        # Entry point
│   └── public/
│
├── server/                 # Backend (Node.js + Express + MongoDB)
│   ├── config/             # Database configuration
│   ├── controllers/        # Route controllers
│   ├── models/             # Mongoose schemas
│   ├── routes/             # API routes
│   ├── middleware/         # Auth & error middleware
│   └── server.js           # Express app entry
│
├── .env                    # Environment variables
└── README.md
```

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, TypeScript, Vite, Tailwind CSS |
| Backend | Node.js, Express.js |
| Database | MongoDB, Mongoose |
| Auth | JWT (jsonwebtoken), bcryptjs |
| Icons | Lucide React |
| Routing | React Router v6 |

## 📋 API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/api/health` | Public | Health check |
| `POST` | `/api/auth/login` | Public | Admin login |
| `GET` | `/api/products` | Public | Get all products (with filters) |
| `GET` | `/api/products/:id` | Public | Get single product |
| `POST` | `/api/products` | Admin | Create product |
| `PUT` | `/api/products/:id` | Admin | Update product |
| `DELETE` | `/api/products/:id` | Admin | Delete product |

### Query Parameters for GET /api/products
- `category` — Filter by category (`cosmetics`, `baby-products`)
- `search` — Search by name or description
- `featured` — Filter featured products (`true`)

## 🔧 Setup & Installation

### Option A — Frontend-Only Static Deployment (Recommended)
This mode requires **no backend** and is the safest choice for static hosting. The store, cart, admin demo login, and product management all work using localStorage persistence in the browser.

**Run locally:**
```bash
npm install
npm run dev
```

**Build for deployment:**
```bash
npm run build
```

**Admin demo credentials:**
- Email: `admin@mumtazstore.com`
- Password: `admin123`

> The app now uses hash-based routing and automatically falls back to standalone mode if a backend API is unavailable.

### Option B — Full Backend Setup

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)

### 1. Clone & Install

```bash
# Install frontend dependencies
npm install

# Install backend dependencies
cd server && npm install && cd ..
```

### 2. Configure Environment

Edit the `.env` file:

```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://localhost:27017/mumtaz-store
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
```

### 3. Seed Admin User

Run this once to create the default admin account:

```bash
cd server
node -e "
const mongoose = require('mongoose');
const Admin = require('./models/Admin');
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/mumtaz-store')
  .then(async () => {
    const exists = await Admin.findOne({ email: 'admin@mumtazstore.com' });
    if (!exists) {
      await Admin.create({ email: 'admin@mumtazstore.com', password: 'admin123' });
      console.log('✅ Admin created: admin@mumtazstore.com / admin123');
    } else {
      console.log('ℹ️  Admin already exists');
    }
    process.exit(0);
  })
  .catch(err => { console.error(err); process.exit(1); });
"
```

### 4. Run the Application

**Backend:**
```bash
cd server
npm start
# Server runs on http://localhost:5000
```

**Frontend (in a new terminal):**
```bash
npm run dev
# App runs on http://localhost:5173
```

### 5. Connect Frontend to Backend

By default, the frontend works standalone with localStorage. To connect to the real backend:

```javascript
// Open browser console and run:
localStorage.setItem('USE_API', 'true');
// Then refresh the page
```

Or set in `.env`:
```env
VITE_API_URL=http://localhost:5000/api
```

## 🔐 Admin Credentials

| Field | Value |
|-------|-------|
| Email | `admin@mumtazstore.com` |
| Password | `admin123` |

## 🌐 Deployment

### Frontend (Vercel / Netlify)
```bash
npm run build
# Upload the dist/ folder
```

### Backend (Render / Railway / Heroku)
1. Set environment variables in your hosting platform
2. Use `server/server.js` as the entry point
3. Connect to MongoDB Atlas

### Environment Variables for Production
```env
NODE_ENV=production
MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/mumtaz-store
JWT_SECRET=<strong-random-string>
```

## 📝 Notes

- The frontend works **standalone** without a backend — all data persists in localStorage
- Switch to real API mode by setting `USE_API=true` in localStorage
- Image uploads use URL input by default (Cloudinary integration ready)
- All admin routes are protected with JWT middleware on the backend
