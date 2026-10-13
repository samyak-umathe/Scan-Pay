import { useState, useEffect } from 'react';
import {
  BarChart3,
  TrendingUp,
  DollarSign,
  ShoppingBag,
  Sparkles,
  Award,
  Layers,
  ArrowUpRight
} from 'lucide-react';
import { analyticsService } from '../../services/analyticsService';
import AdminLayout from './AdminLayout';
import StatCard from '../../components/dashboard/StatCard';
import SalesChart from '../../components/charts/SalesChart';
import CategoryPieChart from '../../components/charts/CategoryPieChart';
import TopProductsChart from '../../components/charts/TopProductsChart';

const Analytics = () => {
  const [salesData, setSalesData] = useState(null);
  const [categories, setCategories] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [customerMetrics, setCustomerMetrics] = useState(null);
  const [insights, setInsights] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      const [sales, cats, tops, custs, ins] = await Promise.all([
        analyticsService.getSales(),
        analyticsService.getCategories(),
        analyticsService.getTopProducts(),
        analyticsService.getCustomers(),
        analyticsService.getInsights()
      ]);
      setSalesData(sales);
      setCategories(cats);
      setTopProducts(tops);
      setCustomerMetrics(custs);
      setInsights(ins);
    } catch (err) {
      console.error('Failed to load analytics', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout title="Business Intelligence & Self-Checkout Analytics">
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        {/* Top KPIs */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '16px'
        }}>
          <StatCard
            title="Gross Revenue"
            value={`₹${salesData?.totalRevenue?.toLocaleString('en-IN') || 0}`}
            subtitle="Lifetime self-checkout earnings"
            icon={DollarSign}
            color="#2563eb"
          />

          <StatCard
            title="Completed Checkouts"
            value={salesData?.totalOrders || 0}
            subtitle={`Average Basket: ₹${salesData?.averageOrderValue || 0}`}
            icon={ShoppingBag}
            color="#10b981"
          />

          <StatCard
            title="Customer Retention"
            value={`${customerMetrics?.repeatRate || 0}%`}
            subtitle={`${customerMetrics?.repeatCustomers || 0} repeat customers`}
            icon={Award}
            color="#8b5cf6"
          />
        </div>

        {/* AI Business Insights Banner */}
        <div className="card" style={{
          background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
          color: '#ffffff',
          border: 'none',
          padding: '24px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
            <Sparkles size={22} color="#60a5fa" />
            <h3 style={{ fontSize: '16px', fontWeight: '800' }}>
              Automated Business Intelligence & Recommendations
            </h3>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '14px'
          }}>
            {insights.map((item, idx) => (
              <div
                key={idx}
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.07)',
                  borderRadius: '12px',
                  padding: '16px',
                  border: '1px solid rgba(255, 255, 255, 0.1)'
                }}
              >
                <div style={{ fontWeight: '700', fontSize: '13px', color: '#93c5fd', marginBottom: '6px' }}>
                  {item.title}
                </div>
                <div style={{ fontSize: '12px', color: '#cbd5e1', lineHeight: '1.5' }}>
                  {item.message}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Deep Charts Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
          gap: '20px'
        }}>
          {/* Revenue Velocity Chart */}
          <div className="card">
            <h3 style={{ fontSize: '15px', fontWeight: '700', color: 'var(--text-main)', marginBottom: '4px' }}>
              Revenue Timeline
            </h3>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '16px' }}>
              Daily income generated through self-checkout terminals
            </p>
            <SalesChart data={salesData?.dailyTrend || []} />
          </div>

          {/* Category Distribution */}
          <div className="card">
            <h3 style={{ fontSize: '15px', fontWeight: '700', color: 'var(--text-main)', marginBottom: '4px' }}>
              Category Revenue Share
            </h3>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '16px' }}>
              Revenue distribution across retail product categories
            </p>
            <CategoryPieChart data={categories} />
          </div>
        </div>

        {/* Category Revenue Breakdown Table & Top Products */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
          gap: '20px'
        }}>
          {/* Top Products */}
          <div className="card">
            <h3 style={{ fontSize: '15px', fontWeight: '700', color: 'var(--text-main)', marginBottom: '4px' }}>
              Bestseller Performance
            </h3>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '16px' }}>
              Top selling items by sales volume
            </p>
            <TopProductsChart data={topProducts} />
          </div>

          {/* Category Table */}
          <div className="card" style={{ padding: '0', overflow: 'hidden' }}>
            <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)' }}>
              <h3 style={{ fontSize: '15px', fontWeight: '700', color: 'var(--text-main)' }}>
                Category Performance Breakdown
              </h3>
            </div>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
              <thead>
                <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid var(--border)' }}>
                  <th style={{ padding: '12px 16px', fontWeight: '700', color: 'var(--text-muted)', fontSize: '11px', textTransform: 'uppercase' }}>Category</th>
                  <th style={{ padding: '12px 16px', fontWeight: '700', color: 'var(--text-muted)', fontSize: '11px', textTransform: 'uppercase', textAlign: 'right' }}>Revenue Generated</th>
                </tr>
              </thead>
              <tbody>
                {categories.map((cat, idx) => (
                  <tr key={idx} style={{ borderBottom: '1px solid var(--border)' }}>
                    <td style={{ padding: '12px 16px', fontWeight: '600' }}>
                      {cat.category}
                    </td>
                    <td style={{ padding: '12px 16px', fontWeight: '800', textAlign: 'right', color: 'var(--primary)' }}>
                      ₹{cat.revenue}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Analytics;
