import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  DollarSign,
  ShoppingBag,
  Users,
  Archive,
  TrendingUp,
  Sparkles,
  AlertTriangle,
  ArrowRight,
  PlusCircle,
  Bell,
  CheckCircle2
} from 'lucide-react';
import { analyticsService } from '../../services/analyticsService';
import { orderService } from '../../services/orderService';
import { inventoryService } from '../../services/inventoryService';
import AdminLayout from './AdminLayout';
import StatCard from '../../components/dashboard/StatCard';
import SalesChart from '../../components/charts/SalesChart';
import CategoryPieChart from '../../components/charts/CategoryPieChart';
import TopProductsChart from '../../components/charts/TopProductsChart';

const Dashboard = () => {
  const navigate = useNavigate();
  const [salesData, setSalesData] = useState(null);
  const [categories, setCategories] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [customersData, setCustomersData] = useState(null);
  const [insights, setInsights] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);
  const [inventoryAlerts, setInventoryAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [sales, cats, tops, custs, ins, orders, alerts] = await Promise.all([
        analyticsService.getSales().catch(() => ({ totalRevenue: 0, totalOrders: 0, dailyTrend: [] })),
        analyticsService.getCategories().catch(() => []),
        analyticsService.getTopProducts().catch(() => []),
        analyticsService.getCustomers().catch(() => ({ totalCustomers: 0, repeatRate: 0 })),
        analyticsService.getInsights().catch(() => []),
        orderService.getAllOrders().catch(() => []),
        inventoryService.getAlerts().catch(() => [])
      ]);

      setSalesData(sales);
      setCategories(cats);
      setTopProducts(tops);
      setCustomersData(custs);
      setInsights(ins);
      setRecentOrders(orders.slice(0, 5));
      setInventoryAlerts(alerts);
    } catch (err) {
      console.error('Failed to load dashboard metrics', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout title="Operations & Analytics Overview">
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        {/* KPI Stat Cards Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '16px'
        }}>
          <StatCard
            title="Total Revenue"
            value={`₹${salesData?.totalRevenue?.toLocaleString('en-IN') || 0}`}
            subtitle="from digital self-checkouts"
            icon={DollarSign}
            color="#2563eb"
          />

          <StatCard
            title="Total Orders"
            value={salesData?.totalOrders || 0}
            subtitle={`AOV: ₹${salesData?.averageOrderValue || 0}`}
            icon={ShoppingBag}
            color="#10b981"
          />

          <StatCard
            title="Registered Customers"
            value={customersData?.totalCustomers || 0}
            subtitle={`${customersData?.repeatRate || 0}% repeat checkout rate`}
            icon={Users}
            color="#8b5cf6"
          />

          <StatCard
            title="Inventory Alerts"
            value={inventoryAlerts?.length || 0}
            subtitle={inventoryAlerts?.length > 0 ? "Items require restocking" : "All stock levels healthy"}
            icon={Archive}
            color={inventoryAlerts?.length > 0 ? "#f59e0b" : "#10b981"}
          />
        </div>

        {/* AI Business Insights Section */}
        {insights.length > 0 && (
          <div className="card" style={{
            background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
            color: '#ffffff',
            border: 'none',
            boxShadow: '0 8px 24px rgba(15, 23, 42, 0.15)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
              <Sparkles size={20} color="#60a5fa" />
              <h3 style={{ fontSize: '15px', fontWeight: '800', letterSpacing: '-0.2px' }}>
                Smart Retail Business Insights
              </h3>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '12px'
            }}>
              {insights.slice(0, 3).map((item, idx) => (
                <div
                  key={idx}
                  style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.07)',
                    borderRadius: '12px',
                    padding: '14px',
                    border: '1px solid rgba(255, 255, 255, 0.1)'
                  }}
                >
                  <div style={{ fontWeight: '700', fontSize: '13px', color: '#93c5fd', marginBottom: '4px' }}>
                    {item.title}
                  </div>
                  <div style={{ fontSize: '12px', color: '#cbd5e1', lineHeight: '1.4' }}>
                    {item.message}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Charts Row */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
          gap: '20px'
        }}>
          {/* Revenue Daily Timeline Chart */}
          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div>
                <h3 style={{ fontSize: '15px', fontWeight: '700', color: 'var(--text-main)' }}>
                  Sales & Revenue Timeline
                </h3>
                <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Daily self-checkout volume</span>
              </div>
              <button
                onClick={() => navigate('/admin/analytics')}
                style={{ fontSize: '12px', color: 'var(--primary)', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '4px' }}
              >
                Deep Analytics <ArrowRight size={14} />
              </button>
            </div>
            <SalesChart data={salesData?.dailyTrend || []} />
          </div>

          {/* Category Sales Distribution */}
          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div>
                <h3 style={{ fontSize: '15px', fontWeight: '700', color: 'var(--text-main)' }}>
                  Sales by Category
                </h3>
                <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Product category contribution</span>
              </div>
            </div>
            <CategoryPieChart data={categories} />
          </div>
        </div>

        {/* Bottom Section: Top Products & Recent Orders */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
          gap: '20px'
        }}>
          {/* Top Selling Products */}
          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '15px', fontWeight: '700', color: 'var(--text-main)' }}>
                Best-Selling Products
              </h3>
              <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Units Sold</span>
            </div>
            <TopProductsChart data={topProducts} />
          </div>

          {/* Recent Orders Table */}
          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '15px', fontWeight: '700', color: 'var(--text-main)' }}>
                Recent Checkout Orders
              </h3>
              <button
                onClick={() => navigate('/admin/orders')}
                style={{ fontSize: '12px', color: 'var(--primary)', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '4px' }}
              >
                View All <ArrowRight size={14} />
              </button>
            </div>

            {recentOrders.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)', fontSize: '13px' }}>
                No recent orders found.
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {recentOrders.map(order => (
                  <div
                    key={order._id}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '10px 12px',
                      backgroundColor: '#f8fafc',
                      borderRadius: '10px',
                      border: '1px solid #e2e8f0'
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: '700', fontSize: '13px', color: 'var(--text-main)' }}>
                        {order.receiptId || order._id.toString().substring(0, 8)}
                      </div>
                      <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                        {order.userId?.name || 'Customer'} &bull; {order.items.length} items
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontWeight: '800', fontSize: '14px', color: 'var(--text-main)' }}>
                        ₹{order.total}
                      </div>
                      <span className={`badge ${order.paymentStatus === 'paid' ? 'badge-success' : 'badge-warning'}`} style={{ marginTop: '2px' }}>
                        {order.paymentStatus}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Dashboard;
