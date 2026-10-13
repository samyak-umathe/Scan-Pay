# 🛒 Scan & Pay – Smart Retail Self-Checkout System

Full-stack production web application for **Scan & Pay – Smart Retail Self-Checkout System**.

## 🚀 Running the Project

1. Run root dev command:
   ```bash
   npm run dev
   ```
2. Seed sample retail database:
   ```bash
   npm --prefix scan-and-pay run data:import
   ```

* **Customer Web App**: [http://localhost:5173](http://localhost:5173)
* **Admin Dashboard**: [http://localhost:5173/admin](http://localhost:5173/admin)
* **Backend API**: [http://localhost:5000](http://localhost:5000)

### Demo Accounts
- **Admin**: `admin@scanpay.com` / `password123`
- **Customer**: `john@example.com` / `password123`

Please see [`scan-and-pay/README.md`](file:///d:/final%20antigravity/scan-and-pay/README.md) for full architecture and technical documentation.


<!-- 
const express = require('express');
const app = express();
const PORT = 3000;

// Basic route
app.get('/', (req, res) => {
  res.send('Hello, World!');
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
}); -->
