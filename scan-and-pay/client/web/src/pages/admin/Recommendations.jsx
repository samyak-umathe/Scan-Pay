import { useState, useEffect } from 'react';
import { Sparkles, Layers, ArrowRight, CheckCircle2, TrendingUp } from 'lucide-react';
import { recommendationService } from '../../services/recommendationService';
import AdminLayout from './AdminLayout';

const CATEGORY_RULES = [
  { trigger: 'Dairy (Milk, Butter, Cheese)', recommends: 'Bakery (Bread), Breakfast (Corn Flakes), Beverages', affinity: '94%' },
  { trigger: 'Bakery (Whole Wheat Bread)', recommends: 'Dairy (Butter, Cheese), Spreads (Ketchup, Jam)', affinity: '91%' },
  { trigger: 'Beverages (Tea, Coffee)', recommends: 'Snacks (Biscuits), Grocery (Sugar), Dairy (Milk)', affinity: '88%' },
  { trigger: 'Grains (Rice, Atta)', recommends: 'Grocery (Cooking Oil, Salt), Household (Detergent)', affinity: '85%' },
  { trigger: 'Personal Care (Soap, Shampoo)', recommends: 'Personal Care (Toothpaste), Household (Detergent)', affinity: '82%' },
];

const Recommendations = () => {
  const [pairs, setPairs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMatrix();
  }, []);

  const loadMatrix = async () => {
    try {
      setLoading(true);
      const data = await recommendationService.getAdminMatrix();
      setPairs(data || []);
    } catch (err) {
      console.error('Failed to load recommendation pairs', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout title="Smart Recommendation Engine & Co-Purchase Affinity">
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        {/* Banner */}
        <div className="card" style={{
          background: 'linear-gradient(135deg, #1e3a8a 0%, #2563eb 100%)',
          color: '#ffffff',
          border: 'none',
          padding: '24px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
            <Sparkles size={24} color="#fef08a" />
            <h3 style={{ fontSize: '18px', fontWeight: '800' }}>
              Self-Checkout Product Affinity Model
            </h3>
          </div>
          <p style={{ fontSize: '13px', color: '#e0f2fe', maxWidth: '700px', lineHeight: '1.5' }}>
            The Smart Recommendation Engine continuously scans customer basket transactions. When items are scanned or added to cart, real-time cross-sell suggestions are computed using rule-based affinity heuristics and co-purchase frequency.
          </p>
        </div>

        {/* Co-Purchase Frequency Discovered from DB */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <div>
              <h3 style={{ fontSize: '15px', fontWeight: '700', color: 'var(--text-main)' }}>
                Discovered Basket Co-Occurrences
              </h3>
              <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                Products frequently bought together in historical checkout orders
              </p>
            </div>
            <span style={{ fontSize: '12px', color: 'var(--primary)', fontWeight: '700' }}>
              Live Order Analysis
            </span>
          </div>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
              Computing basket affinity matrix...
            </div>
          ) : pairs.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '30px', color: 'var(--text-muted)', fontSize: '13px' }}>
              Place more orders with 2+ items to discover new co-occurrence pairs.
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '12px' }}>
              {pairs.map((p, idx) => (
                <div
                  key={idx}
                  style={{
                    backgroundColor: '#f8fafc',
                    borderRadius: '12px',
                    border: '1px solid var(--border)',
                    padding: '14px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}
                >
                  <div>
                    <div style={{ fontWeight: '700', fontSize: '13px', color: 'var(--text-main)' }}>
                      {p.pair}
                    </div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>
                      Basket Co-occurrence: {p.frequency} order{p.frequency > 1 ? 's' : ''}
                    </div>
                  </div>
                  <div style={{
                    backgroundColor: '#eff6ff',
                    color: 'var(--primary)',
                    padding: '4px 8px',
                    borderRadius: '999px',
                    fontSize: '11px',
                    fontWeight: '800'
                  }}>
                    {Math.round(p.confidence * 100)}% Confidence
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Category Cross-Sell Rule Matrix */}
        <div className="card" style={{ padding: '0', overflow: 'hidden' }}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)' }}>
            <h3 style={{ fontSize: '15px', fontWeight: '700', color: 'var(--text-main)' }}>
              Active Category Cross-Sell Rules
            </h3>
          </div>

          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
            <thead>
              <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid var(--border)' }}>
                <th style={{ padding: '12px 16px', fontWeight: '700', color: 'var(--text-muted)', fontSize: '11px', textTransform: 'uppercase' }}>Trigger Category</th>
                <th style={{ padding: '12px 16px', fontWeight: '700', color: 'var(--text-muted)', fontSize: '11px', textTransform: 'uppercase' }}>Recommended Categories</th>
                <th style={{ padding: '12px 16px', fontWeight: '700', color: 'var(--text-muted)', fontSize: '11px', textTransform: 'uppercase', textAlign: 'right' }}>Engine Affinity</th>
              </tr>
            </thead>
            <tbody>
              {CATEGORY_RULES.map((rule, idx) => (
                <tr key={idx} style={{ borderBottom: '1px solid var(--border)' }}>
                  <td style={{ padding: '12px 16px', fontWeight: '700', color: 'var(--text-main)' }}>
                    {rule.trigger}
                  </td>
                  <td style={{ padding: '12px 16px', color: 'var(--text-muted)' }}>
                    {rule.recommends}
                  </td>
                  <td style={{ padding: '12px 16px', textAlign: 'right', fontWeight: '800', color: 'var(--secondary)' }}>
                    {rule.affinity}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Recommendations;
