import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Auth Pages
import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';

// Customer Pages (Mobile Viewport)
import Home from '../pages/customer/Home';
import ScanProduct from '../pages/customer/ScanProduct';
import ProductDetails from '../pages/customer/ProductDetails';
import Cart from '../pages/customer/Cart';
import Checkout from '../pages/customer/Checkout';
import Payment from '../pages/customer/Payment';
import Receipt from '../pages/customer/Receipt';
import OrderHistory from '../pages/customer/OrderHistory';

// Admin Pages (Desktop Suite)
import AdminDashboard from '../pages/admin/Dashboard';
import AdminProducts from '../pages/admin/Products';
import AdminAddProduct from '../pages/admin/AddProduct';
import AdminBulkAddProduct from '../pages/admin/BulkAddProduct';
import AdminOrders from '../pages/admin/Orders';
import AdminCustomers from '../pages/admin/Customers';
import AdminInventory from '../pages/admin/Inventory';
import AdminAnalytics from '../pages/admin/Analytics';
import AdminRecommendations from '../pages/admin/Recommendations';
import AdminNotifications from '../pages/admin/Notifications';

// Protected Route wrappers
const ProtectedCustomerRoute = ({ children }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  return children;
};

const ProtectedAdminRoute = ({ children }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== 'admin') return <Navigate to="/" replace />;
  return children;
};

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        {/* Auth routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* Customer Mobile Web App routes */}
        <Route path="/" element={<ProtectedCustomerRoute><Home /></ProtectedCustomerRoute>} />
        <Route path="/scan" element={<ProtectedCustomerRoute><ScanProduct /></ProtectedCustomerRoute>} />
        <Route path="/product/:id" element={<ProtectedCustomerRoute><ProductDetails /></ProtectedCustomerRoute>} />
        <Route path="/cart" element={<ProtectedCustomerRoute><Cart /></ProtectedCustomerRoute>} />
        <Route path="/checkout" element={<ProtectedCustomerRoute><Checkout /></ProtectedCustomerRoute>} />
        <Route path="/payment/:orderId" element={<ProtectedCustomerRoute><Payment /></ProtectedCustomerRoute>} />
        <Route path="/receipt/:id" element={<ProtectedCustomerRoute><Receipt /></ProtectedCustomerRoute>} />
        <Route path="/orders" element={<ProtectedCustomerRoute><OrderHistory /></ProtectedCustomerRoute>} />
        
        {/* Admin Desktop Management routes */}
        <Route path="/admin" element={<ProtectedAdminRoute><AdminDashboard /></ProtectedAdminRoute>} />
        <Route path="/admin/products" element={<ProtectedAdminRoute><AdminProducts /></ProtectedAdminRoute>} />
        <Route path="/admin/products/add" element={<ProtectedAdminRoute><AdminAddProduct /></ProtectedAdminRoute>} />
        <Route path="/admin/products/bulk" element={<ProtectedAdminRoute><AdminBulkAddProduct /></ProtectedAdminRoute>} />
        <Route path="/admin/orders" element={<ProtectedAdminRoute><AdminOrders /></ProtectedAdminRoute>} />
        <Route path="/admin/customers" element={<ProtectedAdminRoute><AdminCustomers /></ProtectedAdminRoute>} />
        <Route path="/admin/inventory" element={<ProtectedAdminRoute><AdminInventory /></ProtectedAdminRoute>} />
        <Route path="/admin/analytics" element={<ProtectedAdminRoute><AdminAnalytics /></ProtectedAdminRoute>} />
        <Route path="/admin/recommendations" element={<ProtectedAdminRoute><AdminRecommendations /></ProtectedAdminRoute>} />
        <Route path="/admin/notifications" element={<ProtectedAdminRoute><AdminNotifications /></ProtectedAdminRoute>} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
