import { useState, useEffect } from 'react';
import { Users, Search, ShoppingBag, DollarSign, Award, ArrowUpRight } from 'lucide-react';
import { analyticsService } from '../../services/analyticsService';
import AdminLayout from './AdminLayout';
import StatCard from '../../components/dashboard/StatCard';

const Customers = () => {
  const [customersData, setCustomersData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadCustomers();
  }, []);

  const loadCustomers = async () => {
    try {
      setLoading(true);
      const data = await analyticsService.getCustomers();
      setCustomersData(data);
    } catch (err) {
      console.error('Failed to load customers', err);
    } finally {
      setLoading(false);
    }
  };

  const customersList = customersData?.topCustomers || [];
  const filtered = customersList.filter(c => 
    (c.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (c.email || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (c.phone || '').includes(searchQuery)
  );

  return (
    <AdminLayout title="Customer Base & Spending Analytics">
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        {/* KPI Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '16px'
        }}>
          <StatCard
            title="Total Registered Shoppers"
            value={customersData?.totalCustomers || 0}
            subtitle="Customer accounts created"
            icon={Users}
            color="#2563eb"
          />

          <StatCard
            title="Active Buyers"
            value={customersData?.activeCustomers || 0}
            subtitle="Shoppers with completed checkouts"
            icon={ShoppingBag}
            color="#10b981"
          />

          <StatCard
            title="Repeat Checkout Rate"
            value={`${customersData?.repeatRate || 0}%`}
            subtitle="Shoppers with >1 checkout"
            icon={Award}
            color="#8b5cf6"
          />
        </div>

        {/* Search Bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
          <div style={{ position: 'relative', width: '300px' }}>
            <Search size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '12px' }} />
            <input
              type="text"
              className="input-field"
              placeholder="Search customer by name, email, phone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ paddingLeft: '36px', fontSize: '13px' }}
            />
          </div>

          <div style={{ fontSize: '13px', color: 'var(--text-muted)', fontWeight: '600' }}>
            Showing {filtered.length} customers
          </div>
        </div>

        {/* Customer Table */}
        <div className="card" style={{ padding: '0', overflow: 'hidden' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
              <thead>
                <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid var(--border)' }}>
                  <th style={{ padding: '14px 16px', fontWeight: '700', color: 'var(--text-muted)', fontSize: '11px', textTransform: 'uppercase' }}>Customer Name</th>
                  <th style={{ padding: '14px 16px', fontWeight: '700', color: 'var(--text-muted)', fontSize: '11px', textTransform: 'uppercase' }}>Email Address</th>
                  <th style={{ padding: '14px 16px', fontWeight: '700', color: 'var(--text-muted)', fontSize: '11px', textTransform: 'uppercase' }}>Phone</th>
                  <th style={{ padding: '14px 16px', fontWeight: '700', color: 'var(--text-muted)', fontSize: '11px', textTransform: 'uppercase' }}>Orders Placed</th>
                  <th style={{ padding: '14px 16px', fontWeight: '700', color: 'var(--text-muted)', fontSize: '11px', textTransform: 'uppercase' }}>Total Spent</th>
                  <th style={{ padding: '14px 16px', fontWeight: '700', color: 'var(--text-muted)', fontSize: '11px', textTransform: 'uppercase', textAlign: 'right' }}>Last Purchase</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={6} style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                      Loading customer metrics...
                    </td>
                  </tr>
                ) : filtered.length === 0 ? (
                  <tr>
                    <td colSpan={6} style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                      No customers found.
                    </td>
                  </tr>
                ) : (
                  filtered.map((c) => (
                    <tr
                      key={c._id}
                      style={{ borderBottom: '1px solid var(--border)', transition: 'background-color 0.15s' }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f8fafc'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                    >
                      <td style={{ padding: '14px 16px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <div style={{
                            width: '32px',
                            height: '32px',
                            borderRadius: '50%',
                            backgroundColor: '#eff6ff',
                            color: 'var(--primary)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: '700'
                          }}>
                            {c.name ? c.name[0].toUpperCase() : 'C'}
                          </div>
                          <span style={{ fontWeight: '700', color: 'var(--text-main)' }}>{c.name}</span>
                        </div>
                      </td>

                      <td style={{ padding: '14px 16px', color: 'var(--text-muted)' }}>
                        {c.email}
                      </td>

                      <td style={{ padding: '14px 16px', color: 'var(--text-muted)' }}>
                        {c.phone || 'N/A'}
                      </td>

                      <td style={{ padding: '14px 16px', fontWeight: '600' }}>
                        {c.orderCount} checkout{c.orderCount > 1 ? 's' : ''}
                      </td>

                      <td style={{ padding: '14px 16px', fontWeight: '800', color: 'var(--primary)' }}>
                        ₹{c.totalSpent}
                      </td>

                      <td style={{ padding: '14px 16px', textAlign: 'right', color: 'var(--text-muted)' }}>
                        {c.lastPurchase ? new Date(c.lastPurchase).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric'
                        }) : 'N/A'}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Customers;
