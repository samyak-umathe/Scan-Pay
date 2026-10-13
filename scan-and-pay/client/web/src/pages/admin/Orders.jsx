import { useState, useEffect } from 'react';
import {
  ShoppingBag,
  Search,
  CheckCircle2,
  Clock,
  ExternalLink,
  Filter,
  X,
  Printer
} from 'lucide-react';
import { orderService } from '../../services/orderService';
import AdminLayout from './AdminLayout';

const STATUSES = ['All', 'pending', 'paid', 'processing', 'completed', 'cancelled'];

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const data = await orderService.getAllOrders();
      setOrders(data || []);
    } catch (err) {
      console.error('Failed to load orders', err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    setUpdatingId(orderId);
    try {
      const updated = await orderService.updateStatus(orderId, newStatus);
      setOrders(prev => prev.map(o => o._id === orderId ? { ...o, orderStatus: newStatus } : o));
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update order status');
    } finally {
      setUpdatingId(null);
    }
  };

  const filtered = orders.filter(order => {
    const matchesStatus = statusFilter === 'All' || order.orderStatus === statusFilter || order.paymentStatus === statusFilter;
    const matchesSearch = (order.receiptId || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (order._id || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (order.userId?.name || '').toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <AdminLayout title="Order & Digital Receipt Management">
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {/* Top Filter Bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap', flex: 1 }}>
            <div style={{ position: 'relative', width: '280px' }}>
              <Search size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '12px' }} />
              <input
                type="text"
                className="input-field"
                placeholder="Search receipt ID, customer name..."
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
              {STATUSES.map(s => <option key={s} value={s}>{s.toUpperCase()}</option>)}
            </select>
          </div>

          <div style={{ fontSize: '13px', color: 'var(--text-muted)', fontWeight: '600' }}>
            Showing {filtered.length} of {orders.length} orders
          </div>
        </div>

        {/* Orders Table */}
        <div className="card" style={{ padding: '0', overflow: 'hidden' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
              <thead>
                <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid var(--border)' }}>
                  <th style={{ padding: '14px 16px', fontWeight: '700', color: 'var(--text-muted)', fontSize: '11px', textTransform: 'uppercase' }}>Receipt / Order ID</th>
                  <th style={{ padding: '14px 16px', fontWeight: '700', color: 'var(--text-muted)', fontSize: '11px', textTransform: 'uppercase' }}>Customer</th>
                  <th style={{ padding: '14px 16px', fontWeight: '700', color: 'var(--text-muted)', fontSize: '11px', textTransform: 'uppercase' }}>Items & Date</th>
                  <th style={{ padding: '14px 16px', fontWeight: '700', color: 'var(--text-muted)', fontSize: '11px', textTransform: 'uppercase' }}>Total Amount</th>
                  <th style={{ padding: '14px 16px', fontWeight: '700', color: 'var(--text-muted)', fontSize: '11px', textTransform: 'uppercase' }}>Payment Status</th>
                  <th style={{ padding: '14px 16px', fontWeight: '700', color: 'var(--text-muted)', fontSize: '11px', textTransform: 'uppercase' }}>Order Status</th>
                  <th style={{ padding: '14px 16px', fontWeight: '700', color: 'var(--text-muted)', fontSize: '11px', textTransform: 'uppercase', textAlign: 'right' }}>Receipt</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={7} style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                      Loading orders history...
                    </td>
                  </tr>
                ) : filtered.length === 0 ? (
                  <tr>
                    <td colSpan={7} style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                      No matching orders found.
                    </td>
                  </tr>
                ) : (
                  filtered.map((order) => {
                    const receiptNum = order.receiptId || `SP-2026-${order._id.toString().substring(0, 5).toUpperCase()}`;
                    return (
                      <tr
                        key={order._id}
                        style={{ borderBottom: '1px solid var(--border)', transition: 'background-color 0.15s' }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f8fafc'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                      >
                        {/* Receipt ID */}
                        <td style={{ padding: '14px 16px' }}>
                          <div style={{ fontWeight: '700', color: 'var(--text-main)' }}>{receiptNum}</div>
                          <div style={{ fontSize: '10px', color: 'var(--text-subtle)', fontFamily: 'monospace' }}>
                            ID: {order._id.toString().substring(0, 10)}
                          </div>
                        </td>

                        {/* Customer */}
                        <td style={{ padding: '14px 16px' }}>
                          <div style={{ fontWeight: '600', color: 'var(--text-main)' }}>
                            {order.userId?.name || 'Walk-in Shopper'}
                          </div>
                        </td>

                        {/* Items & Date */}
                        <td style={{ padding: '14px 16px' }}>
                          <div>{order.items.length} item(s)</div>
                          <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                            {new Date(order.createdAt).toLocaleString('en-IN', {
                              dateStyle: 'medium',
                              timeStyle: 'short'
                            })}
                          </div>
                        </td>

                        {/* Total Amount */}
                        <td style={{ padding: '14px 16px', fontWeight: '800', fontSize: '14px', color: 'var(--text-main)' }}>
                          ₹{order.total}
                        </td>

                        {/* Payment Status */}
                        <td style={{ padding: '14px 16px' }}>
                          <span className={`badge ${order.paymentStatus === 'paid' ? 'badge-success' : 'badge-warning'}`}>
                            {order.paymentStatus?.toUpperCase()}
                          </span>
                        </td>

                        {/* Order Status Select */}
                        <td style={{ padding: '14px 16px' }}>
                          <select
                            value={order.orderStatus || 'pending'}
                            onChange={(e) => handleStatusChange(order._id, e.target.value)}
                            disabled={updatingId === order._id}
                            style={{
                              padding: '4px 8px',
                              borderRadius: '6px',
                              border: '1px solid var(--border)',
                              fontSize: '12px',
                              fontWeight: '600',
                              backgroundColor: '#ffffff',
                              color: 'var(--text-main)'
                            }}
                          >
                            <option value="pending">Pending</option>
                            <option value="processing">Processing</option>
                            <option value="completed">Completed</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                        </td>

                        {/* View Receipt */}
                        <td style={{ padding: '14px 16px', textAlign: 'right' }}>
                          <button
                            onClick={() => setSelectedOrder(order)}
                            className="btn btn-secondary"
                            style={{ padding: '6px 10px', fontSize: '11px' }}
                          >
                            <ExternalLink size={13} /> View
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

        {/* Order Details Receipt Modal */}
        {selectedOrder && (
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
            <div className="card" style={{
              width: '100%',
              maxWidth: '480px',
              backgroundColor: '#ffffff',
              padding: '24px'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h3 style={{ fontSize: '16px', fontWeight: '800', color: 'var(--text-main)' }}>
                  Receipt Details: {selectedOrder.receiptId || selectedOrder._id.toString().substring(0, 8)}
                </h3>
                <button onClick={() => setSelectedOrder(null)} style={{ color: 'var(--text-muted)' }}>
                  <X size={20} />
                </button>
              </div>

              <div style={{
                backgroundColor: '#f8fafc',
                borderRadius: '12px',
                border: '1px solid var(--border)',
                padding: '16px',
                fontFamily: 'monospace',
                fontSize: '12px',
                marginBottom: '16px'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span>Customer:</span>
                  <span style={{ fontWeight: '700' }}>{selectedOrder.userId?.name || 'Customer'}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span>Date & Time:</span>
                  <span>{new Date(selectedOrder.createdAt).toLocaleString()}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span>Payment:</span>
                  <span style={{ fontWeight: '700', color: 'var(--secondary)' }}>{selectedOrder.paymentStatus?.toUpperCase()}</span>
                </div>

                <div style={{ borderBottom: '1px dashed #cbd5e1', margin: '12px 0' }} />

                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {selectedOrder.items.map((it, idx) => (
                    <div key={idx} style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span>{it.name} (x{it.quantity})</span>
                      <span>₹{it.subtotal}</span>
                    </div>
                  ))}
                </div>

                <div style={{ borderBottom: '1px dashed #cbd5e1', margin: '12px 0' }} />

                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <span>Subtotal:</span>
                  <span>₹{selectedOrder.subtotal}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <span>Tax (5%):</span>
                  <span>₹{selectedOrder.tax}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: '800', fontSize: '14px', marginTop: '6px' }}>
                  <span>TOTAL:</span>
                  <span>₹{selectedOrder.total}</span>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                <button className="btn btn-secondary" onClick={() => setSelectedOrder(null)}>
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default Orders;
