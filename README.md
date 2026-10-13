# 🛒 Scan & Pay – Smart Retail Self-Checkout System

> **"Smart Retail Self-Checkout System Using Mobile Barcode Scanning, Personalized Recommendations, Business Analytics, and Automated Customer Engagement."**

A production-grade, full-stack web application that transforms the in-store supermarket shopping experience. Customers scan product barcodes in supermarket aisles using their smartphone cameras, manage a virtual cart, complete secure digital payments, receive digital receipts with verifiable QR codes, and view smart recommendations. 

Store owners and retail administrators get an enterprise-grade analytics dashboard for real-time inventory velocity forecasting, sales analytics, product management, and promotional customer engagement.

---

## 📱 Architecture & User Experience

* **Customer Web App (Mobile Viewport Layout)**: Optimized with a mobile viewport framing on desktop and responsive full-bleed on mobile devices. Features status bars, category filters, camera scanner, 1-click test barcode helper, cart quantity stepper, digital payment options (UPI, Card, 1-click Cashless Demo), and digital receipt with QR pass.
* **Admin Management Console (Full Desktop Suite)**: Comprehensive multi-tab operations suite with real-time KPI stat cards, Recharts visualizations (Sales timeline, Category share, Top products), smart inventory velocity assistant ($Stock / S_{avg}$), and notification broadcasts.

---

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 19, Vite, React Router DOM 7, Axios, Context API, Lucide Icons, Recharts 3, html5-qrcode |
| **Backend** | Node.js, Express.js (Modular REST Architecture) |
| **Database** | MongoDB with Mongoose ODM (8 Normalized Collections) |
| **Security** | JWT Authentication, bcryptjs password hashing, CORS, Centralized Error Middleware |
| **Styling** | Vanilla CSS with modern custom design tokens, smartphone framing, and glassmorphism |

---

## 📂 Project Folder Structure

```text
scan-and-pay/
├── client/
│   └── web/
│       ├── src/
│       │   ├── components/
│       │   │   ├── common/         # MobileLayout wrapper & viewport simulator
│       │   │   ├── navbar/         # CustomerHeader & BottomNav
│       │   │   ├── sidebar/        # AdminSidebar with collapsible menu
│       │   │   ├── product/        # ProductCard & BarcodeHelper
│       │   │   ├── dashboard/      # StatCard KPI metrics
│       │   │   └── charts/         # SalesChart, CategoryPieChart, TopProductsChart
│       │   ├── pages/
│       │   │   ├── auth/           # Login.jsx, Register.jsx (with 1-click demo accounts)
│       │   │   ├── customer/       # Home, ScanProduct, ProductDetails, Cart, Checkout, Payment, Receipt, OrderHistory
│       │   │   └── admin/          # Dashboard, Products, AddProduct, Orders, Customers, Inventory, Analytics, Recommendations, Notifications
│       │   ├── services/           # Typed API modules (product, cart, order, payment, inventory, analytics, notification)
│       │   ├── context/            # AuthContext, CartContext
│       │   └── routes/             # AppRoutes (Protected Customer & Admin Routes)
│       └── package.json
│
└── server/
    ├── src/
    │   ├── config/                 # MongoDB connection
    │   ├── models/                 # User, Product, Cart, Order, Payment, Inventory, Recommendation, Notification
    │   ├── services/               # analytics.service, inventory.service, recommendation.service, notification.service
    │   ├── controllers/            # auth, product, cart, order, payment, inventory, analytics, recommendation, notification
    │   ├── routes/                 # Express route definitions
    │   ├── middleware/             # auth.middleware, admin.middleware, error.middleware
    │   └── utils/                  # generateToken.js, generateReceipt.js
    ├── seeder.js                   # Database seed script with 21 realistic products & sample analytics orders
    └── server.js                   # Express server entry point
```

---

## ⚡ Quick Start & Setup

### Prerequisites
* **Node.js**: v18.x or higher
* **MongoDB**: Local MongoDB instance running on `mongodb://localhost:27017` or a MongoDB Atlas URI.

### 1. Installation
From the root workspace directory:
```bash
cd scan-and-pay
npm install
npm run install-all
```
*(Or install inside `server` and `client/web` separately using `npm install`)*

### 2. Environment Configuration
Create `server/.env` (or copy from `server/.env.example`):
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/scan-and-pay
JWT_SECRET=thisisasecretkeyforscanandpay
CLIENT_URL=http://localhost:5173
PAYMENT_KEY_ID=test_payment_key_id
PAYMENT_KEY_SECRET=test_payment_key_secret
```

### 3. Seed Realistic Retail Database
Run the seed script to populate 21 grocery products with barcodes and images, sample customer accounts, orders, inventory alerts, and notifications:
```bash
npm run data:import
```

### 4. Start the Application
Run both backend API (Port 5000) and frontend client (Port 5173) in parallel:
```bash
npm run dev
```

* **Customer Web App**: [http://localhost:5173](http://localhost:5173)
* **Admin Dashboard**: [http://localhost:5173/admin](http://localhost:5173/admin)
* **Backend API**: [http://localhost:5000](http://localhost:5000)

---

## 🔑 Demo Login Credentials

The login screen includes **1-Click Quick Fill Buttons** for seamless evaluation:

| Role | Email | Password | Access |
|---|---|---|---|
| **Admin** | `admin@scanpay.com` | `password123` | Full Admin Operations Suite & Analytics |
| **Customer** | `john@example.com` | `password123` | Mobile Self-Checkout App |
| **Customer 2** | `sarah@example.com` | `password123` | Mobile Self-Checkout App |

---

## 📦 Key Functional Modules

### 1. Mobile Barcode Scanner & Quick Helper
* Integrates `html5-qrcode` for live webcam / phone camera barcode scanning.
* Includes a **1-Click Test Barcode Drawer** (Milk `8901030000011`, Bread `8901030000012`, Parle-G `8901030000015`, Basmati Rice `8901030000016`, Nescafe Coffee `8901030000020`, etc.) to instantly simulate barcode scans during local demo without physical packaging.
* Fallback manual barcode lookup form.

### 2. End-to-End Self-Checkout Transaction Flow
1. Product scanned $\rightarrow$ Fetched via `GET /api/products/barcode/:barcode`.
2. Added to user's MongoDB cart $\rightarrow$ Backend calculates prices & subtotals securely.
3. Review & Checkout $\rightarrow$ `POST /api/orders` creates pending order.
4. Digital Payment $\rightarrow$ Choose UPI (QR simulation), Card, or Cashless Demo.
5. Payment Transaction $\rightarrow$ Atomic backend logic reduces product stock, updates inventory health status, creates Payment record, generates receipt ID (`SP-2026-XXXXX`), clears user cart, and emits order notification.
6. Digital Receipt $\rightarrow$ Thermal-style digital tax invoice with security QR pass verifiable at store exit.

### 3. Smart Inventory Assistant
Calculates inventory burn rate and automated reorder triggers:
$$\text{Average Daily Sales } (S_{avg}) = \frac{\text{Units Sold in Last 30 Days}}{30}$$
$$\text{Estimated Days Remaining} = \frac{\text{Current Stock}}{S_{avg}}$$
* Automatically classifies items as **🟢 Healthy**, **🟡 Low Stock** ($\le 3\text{ days}$ or below minimum threshold), or **🔴 Critical** ($0\text{ units}$).
* Suggests optimal restock quantities with 1-click admin adjustment.

### 4. Smart Recommendation Engine
* Computes co-purchase affinity between grocery categories (e.g., Dairy $\rightarrow$ Bakery & Breakfast; Beverages $\rightarrow$ Snacks & Sugar).
* Generates contextual recommendation rationale (e.g., *"Pairs well with your frequent grocery basket"* or *"Frequently re-purchased in Dairy"*) along with confidence scores.

### 5. Business Intelligence & Analytics
* Interactive Recharts visualizations for daily revenue timelines, category share donut chart, and top 5 bestsellers.
* Rule-based automated AI business insights evaluating sales velocity, top categories, and restock actions.

---

## 🎯 Technical Interview Discussion Points

### Frontend Architecture
* **Why React 19 & Vite?** Fast HMR, component reusability, and modular state management with Context API for decoupled Auth and Cart states.
* **Why Smartphone Viewport Simulation?** A retail self-checkout product is fundamentally mobile-first. Centering the mobile viewport within a desktop browser simulates a smartphone while allowing developers and evaluators to test all mobile workflows on any device.

### Backend Architecture
* **Modular Monolith**: Clean separation between Routes $\rightarrow$ Controllers $\rightarrow$ Services $\rightarrow$ Mongoose Models. Keeps business logic easily unit-testable and ready for future microservices extraction.
* **Checkout Security**: Product prices, discounts, and taxes are strictly calculated on the server side to prevent client-side price tampering.

### Database Design
* 8 Normalized Collections: `User`, `Product`, `Cart`, `Order`, `Payment`, `Inventory`, `Recommendation`, `Notification`.
* MongoDB Aggregation Pipelines compute sales velocity, category revenue share, and customer lifetime value efficiently in the database layer.

---

## 📄 License
ISC License &copy; 2026 Scan & Pay Team. Built for Smart Retail Self-Checkout Innovations.
