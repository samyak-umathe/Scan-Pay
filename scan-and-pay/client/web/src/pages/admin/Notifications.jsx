import { useState } from 'react';
import { Bell, Send, Sparkles, CheckCircle2, AlertCircle } from 'lucide-react';
import { notificationService } from '../../services/notificationService';
import AdminLayout from './AdminLayout';

const TEMPLATES = [
  {
    title: '🎉 Weekend Supermarket Deals!',
    message: 'Get 15% instant cashback when you scan and self-checkout grocery items this weekend.',
    type: 'promotional'
  },
  {
    title: '🥛 Fresh Milk & Bakery Restocked',
    message: 'Fresh stock of Amul Milk, Whole Wheat Bread, and Butter is now available in aisles 1 & 2.',
    type: 'alert'
  },
  {
    title: '🔔 Reorder Reminder',
    message: 'Time to restock your daily essentials like Tea, Coffee, and Atta!',
    type: 'promotional'
  }
];

const Notifications = () => {
  const [formData, setFormData] = useState({
    title: '',
    message: '',
    type: 'promotional'
  });
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [error, setError] = useState('');
  const [broadcastLog, setBroadcastLog] = useState([
    {
      title: '🎉 Weekend Supermarket Deals!',
      message: 'Get 15% instant cashback when you scan and self-checkout grocery items this weekend.',
      type: 'promotional',
      date: new Date().toLocaleDateString('en-IN')
    }
  ]);

  const handleApplyTemplate = (t) => {
    setFormData({
      title: t.title,
      message: t.message,
      type: t.type
    });
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.message) {
      setError('Please provide both title and message.');
      return;
    }

    setLoading(true);
    setError('');
    setSuccessMsg('');

    try {
      const res = await notificationService.createNotification(formData);
      setSuccessMsg(res.message || 'Notification broadcasted successfully to all customers!');
      setBroadcastLog(prev => [{ ...formData, date: new Date().toLocaleDateString('en-IN') }, ...prev]);
      setFormData({ title: '', message: '', type: 'promotional' });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send notification');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout title="Customer Engagement & Broadcast Notifications">
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '800px', margin: '0 auto' }}>
        {/* Banner */}
        <div className="card" style={{
          background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
          color: '#ffffff',
          border: 'none',
          padding: '24px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
            <Bell size={24} color="#60a5fa" />
            <h3 style={{ fontSize: '16px', fontWeight: '800' }}>
              In-App Automated Customer Notifications
            </h3>
          </div>
          <p style={{ fontSize: '13px', color: '#cbd5e1', lineHeight: '1.5' }}>
            Broadcast promotional deals, reorder reminders, or stock notifications directly to all registered shoppers' mobile notifications feed.
          </p>
        </div>

        {/* Success/Error Alerts */}
        {successMsg && (
          <div style={{
            padding: '14px',
            backgroundColor: '#f0fdf4',
            border: '1px solid #bbf7d0',
            color: 'var(--secondary-hover)',
            borderRadius: '12px',
            fontSize: '13px',
            fontWeight: '600',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <CheckCircle2 size={18} />
            <span>{successMsg}</span>
          </div>
        )}

        {error && (
          <div style={{
            padding: '14px',
            backgroundColor: '#fef2f2',
            border: '1px solid #fecaca',
            color: 'var(--danger)',
            borderRadius: '12px',
            fontSize: '13px'
          }}>
            {error}
          </div>
        )}

        {/* Quick Templates */}
        <div>
          <span style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em', display: 'block', marginBottom: '8px' }}>
            Quick Broadcast Templates
          </span>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '10px' }}>
            {TEMPLATES.map((t, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleApplyTemplate(t)}
                style={{
                  padding: '12px',
                  backgroundColor: '#ffffff',
                  border: '1px solid var(--border)',
                  borderRadius: '12px',
                  textAlign: 'left',
                  transition: 'all 0.15s'
                }}
                onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--primary)'}
                onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}
              >
                <div style={{ fontWeight: '700', fontSize: '12px', color: 'var(--text-main)', marginBottom: '4px' }}>
                  {t.title}
                </div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)', lineHeight: '1.3' }}>
                  {t.message.substring(0, 50)}...
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Compose Form */}
        <div className="card" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '15px', fontWeight: '800', color: 'var(--text-main)', marginBottom: '16px' }}>
            Compose Customer Broadcast
          </h3>

          <form onSubmit={handleSend} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div>
              <label style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>
                Notification Title *
              </label>
              <input
                type="text"
                className="input-field"
                placeholder="e.g. 🎉 Weekend 15% Off on Bakery Items"
                value={formData.title}
                onChange={e => setFormData({ ...formData, title: e.target.value })}
                required
              />
            </div>

            <div>
              <label style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>
                Notification Type
              </label>
              <select
                className="input-field"
                value={formData.type}
                onChange={e => setFormData({ ...formData, type: e.target.value })}
              >
                <option value="promotional">Promotional Offer</option>
                <option value="alert">Inventory / Store Alert</option>
                <option value="system">System Announcement</option>
              </select>
            </div>

            <div>
              <label style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>
                Message Body *
              </label>
              <textarea
                className="input-field"
                rows={4}
                placeholder="Write the message that shoppers will see on their mobile notification drawer..."
                value={formData.message}
                onChange={e => setFormData({ ...formData, message: e.target.value })}
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary"
              style={{ width: '100%', padding: '12px', borderRadius: '12px', fontSize: '14px' }}
            >
              {loading ? 'Broadcasting...' : (
                <>
                  <Send size={16} /> Broadcast to All Shoppers
                </>
              )}
            </button>
          </form>
        </div>

        {/* Broadcast History */}
        <div className="card" style={{ padding: '0', overflow: 'hidden' }}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)' }}>
            <h3 style={{ fontSize: '15px', fontWeight: '700', color: 'var(--text-main)' }}>
              Broadcast History
            </h3>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {broadcastLog.map((b, idx) => (
              <div
                key={idx}
                style={{
                  padding: '14px 20px',
                  borderBottom: '1px solid var(--border)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start'
                }}
              >
                <div>
                  <div style={{ fontWeight: '700', fontSize: '13px', color: 'var(--text-main)' }}>
                    {b.title}
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>
                    {b.message}
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span className="badge badge-primary" style={{ textTransform: 'capitalize' }}>
                    {b.type}
                  </span>
                  <div style={{ fontSize: '11px', color: 'var(--text-subtle)', marginTop: '4px' }}>
                    {b.date}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Notifications;
