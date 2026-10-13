import { useState, useEffect } from 'react';
import {
  Archive,
  AlertTriangle,
  RefreshCw,
  Search,
  PlusCircle,
  Clock,
  Sparkles,
  TrendingDown,
  X
} from 'lucide-react';
import { inventoryService } from '../../services/inventoryService';
import AdminLayout from './AdminLayout';

const Inventory = () => {
  const [inventoryList, setInventoryList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  
  // Quick restock modal
  const [selectedItem, setSelectedItem] = useState(null);
  const [addQty, setAddQty] = useState(50);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    loadInventory();
  }, []);

  const loadInventory = async () => {
    try {
      setLoading(true);
      const data = await inventoryService.getAll();
      setInventoryList(data || []);
    } catch (err) {
      console.error('Failed to load inventory', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRestock = async (e) => {
    e.preventDefault();
    if (!selectedItem) return;
    setUpdating(true);
    try {
      const newStock = selectedItem.currentStock + parseInt(addQty || 0);
      await inventoryService.updateStock(selectedItem.productId._id, {
        currentStock: newStock,
        minimumStock: selectedItem.minimumStock
      });
      await loadInventory();
      setSelectedItem(null);
    } catch (err) {
      alert('Failed to restock item');
    } finally {
      setUpdating(false);
    }
  };

  const filtered = inventoryList.filter(item => {
    const pName = item.productId?.name || '';
    const pBrand = item.productId?.brand || '';
    const matchesSearch = pName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          pBrand.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'All' || item.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const alerts = inventoryList.filter(i => i.status === 'low' || i.status === 'critical');

  return (
    <AdminLayout title="Smart Inventory & Automated Restock Assistant">
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {/* Smart Prediction Assistant Overview Card */}
        <div className="card" style={{
          background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
          color: '#ffffff',
          border: 'none',
          padding: '20px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <Sparkles size={18} color="#60a5fa" />
            <h3 style={{ fontSize: '15px', fontWeight: '800' }}>
              Smart Inventory Velocity Assistant
            </h3>
          </div>
          <p style={{ fontSize: '12px', color: '#cbd5e1', maxWidth: '650px', lineHeight: '1.4' }}>
            Forecasts daily burn rate based on past 30-day self-checkout orders:
            <span style={{ fontFamily: 'monospace', color: '#93c5fd', marginLeft: '6px' }}>
              Days Remaining = Current Stock / Average Daily Sales
            </span>
          </p>
        </div>

        {/* Alerts Banner if low stock exists */}
        {alerts.length > 0 && (
          <div style={{
            backgroundColor: '#fffbeb',
            border: '1px solid #fef3c7',
            borderRadius: '16px',
            padding: '14px 18px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}>
            <AlertTriangle size={22} color="#d97706" flexShrink={0} />
            <div>
              <div style={{ fontWeight: '700', fontSize: '13px', color: '#b45309' }}>
                {alerts.length} Product(s) Require Immediate Restocking
              </div>
              <div style={{ fontSize: '12px', color: '#d97706', marginTop: '2px' }}>
                Stock levels are below minimum safety buffer or estimated days remaining is &le; 3 days.
              </div>
            </div>
          </div>
        )}

        {/* Filter Toolbar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap', flex: 1 }}>
            <div style={{ position: 'relative', width: '280px' }}>
              <Search size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '12px' }} />
              <input
                type="text"
                className="input-field"
                placeholder="Search inventory items..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ paddingLeft: '36px', fontSize: '13px' }}
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="input-field"
              style={{ width: '160px', fontSize: '13px' }}
            >
              <option value="All">All Health Statuses</option>
              <option value="healthy">🟢 Healthy</option>
              <option value="low">🟡 Low Stock</option>
              <option value="critical">🔴 Critical / Out</option>
            </select>
          </div>

          <button
            onClick={loadInventory}
            className="btn btn-secondary"
            style={{ fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <RefreshCw size={14} /> Refresh
          </button>
        </div>

        {/* Inventory Table */}
        <div className="card" style={{ padding: '0', overflow: 'hidden' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
              <thead>
                <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid var(--border)' }}>
                  <th style={{ padding: '14px 16px', fontWeight: '700', color: 'var(--text-muted)', fontSize: '11px', textTransform: 'uppercase' }}>Product</th>
                  <th style={{ padding: '14px 16px', fontWeight: '700', color: 'var(--text-muted)', fontSize: '11px', textTransform: 'uppercase' }}>Current Stock</th>
                  <th style={{ padding: '14px 16px', fontWeight: '700', color: 'var(--text-muted)', fontSize: '11px', textTransform: 'uppercase' }}>Min Buffer</th>
                  <th style={{ padding: '14px 16px', fontWeight: '700', color: 'var(--text-muted)', fontSize: '11px', textTransform: 'uppercase' }}>Daily Velocity</th>
                  <th style={{ padding: '14px 16px', fontWeight: '700', color: 'var(--text-muted)', fontSize: '11px', textTransform: 'uppercase' }}>Days Remaining</th>
                  <th style={{ padding: '14px 16px', fontWeight: '700', color: 'var(--text-muted)', fontSize: '11px', textTransform: 'uppercase' }}>Status</th>
                  <th style={{ padding: '14px 16px', fontWeight: '700', color: 'var(--text-muted)', fontSize: '11px', textTransform: 'uppercase', textAlign: 'right' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={7} style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                      Analyzing store inventory velocity...
                    </td>
                  </tr>
                ) : filtered.length === 0 ? (
                  <tr>
                    <td colSpan={7} style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                      No inventory records match your criteria.
                    </td>
                  </tr>
                ) : (
                  filtered.map((item) => {
                    const p = item.productId;
                    if (!p) return null;
                    return (
                      <tr
                        key={item._id}
                        style={{ borderBottom: '1px solid var(--border)', transition: 'background-color 0.15s' }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f8fafc'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                      >
                        {/* Product info */}
                        <td style={{ padding: '14px 16px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <img
                              src={p.image}
                              alt={p.name}
                              style={{ width: '36px', height: '36px', borderRadius: '8px', objectFit: 'cover', border: '1px solid var(--border)' }}
                            />
                            <div>
                              <div style={{ fontWeight: '700', color: 'var(--text-main)' }}>{p.name}</div>
                              <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{p.brand} &bull; {p.category}</div>
                            </div>
                          </div>
                        </td>

                        {/* Current Stock */}
                        <td style={{ padding: '14px 16px', fontWeight: '800', fontSize: '14px' }}>
                          {item.currentStock} units
                        </td>

                        {/* Minimum Stock Buffer */}
                        <td style={{ padding: '14px 16px', color: 'var(--text-muted)' }}>
                          {item.minimumStock} units
                        </td>

                        {/* Daily Velocity */}
                        <td style={{ padding: '14px 16px' }}>
                          <div style={{ fontWeight: '600' }}>{item.averageDailySales} / day</div>
                          <div style={{ fontSize: '11px', color: 'var(--text-subtle)' }}>{item.totalSold30Days} sold in 30d</div>
                        </td>

                        {/* Days Remaining Forecast */}
                        <td style={{ padding: '14px 16px' }}>
                          <span style={{
                            fontWeight: '700',
                            color: item.estimatedDaysRemaining <= 3 ? 'var(--danger)' : item.estimatedDaysRemaining <= 7 ? '#d97706' : 'var(--text-main)'
                          }}>
                            {item.estimatedDaysRemaining} days
                          </span>
                        </td>

                        {/* Health Status */}
                        <td style={{ padding: '14px 16px' }}>
                          <span className={`badge ${item.status === 'critical' ? 'badge-danger' : item.status === 'low' ? 'badge-warning' : 'badge-success'}`}>
                            {item.status === 'critical' ? '🔴 Critical' : item.status === 'low' ? '🟡 Low Stock' : '🟢 Healthy'}
                          </span>
                        </td>

                        {/* Reorder Action */}
                        <td style={{ padding: '14px 16px', textAlign: 'right' }}>
                          <button
                            onClick={() => {
                              setSelectedItem(item);
                              setAddQty(item.recommendedReorderQty || 50);
                            }}
                            className="btn btn-secondary"
                            style={{ padding: '6px 12px', fontSize: '12px', fontWeight: '700' }}
                          >
                            <PlusCircle size={14} color="var(--primary)" /> Restock
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Restock Modal */}
        {selectedItem && (
          <div style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.6)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 100,
            padding: '20px'
          }}>
            <div className="card" style={{ width: '100%', maxWidth: '440px', backgroundColor: '#ffffff', padding: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h3 style={{ fontSize: '16px', fontWeight: '800', color: 'var(--text-main)' }}>
                  Restock: {selectedItem.productId?.name}
                </h3>
                <button onClick={() => setSelectedItem(null)} style={{ color: 'var(--text-muted)' }}>
                  <X size={20} />
                </button>
              </div>

              <div style={{ backgroundColor: '#f8fafc', borderRadius: '10px', padding: '12px', marginBottom: '16px', fontSize: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <span>Current Physical Stock:</span>
                  <span style={{ fontWeight: '700' }}>{selectedItem.currentStock} units</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <span>Daily Sales Velocity:</span>
                  <span>{selectedItem.averageDailySales} units/day</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--primary)', fontWeight: '700' }}>
                  <span>AI Recommended Restock:</span>
                  <span>+{selectedItem.recommendedReorderQty} units</span>
                </div>
              </div>

              <form onSubmit={handleRestock} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>
                    Units to Add to Current Stock
                  </label>
                  <input
                    type="number"
                    className="input-field"
                    value={addQty}
                    onChange={(e) => setAddQty(e.target.value)}
                    min="1"
                    required
                  />
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                  <button type="button" className="btn btn-secondary" onClick={() => setSelectedItem(null)}>
                    Cancel
                  </button>
                  <button type="submit" disabled={updating} className="btn btn-primary">
                    {updating ? 'Updating...' : `Confirm +${addQty} Restock`}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default Inventory;
