import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle2, QrCode, Home, Printer, Sparkles, ShieldCheck } from 'lucide-react';
import { orderService } from '../../services/orderService';
import MobileLayout from '../../components/common/MobileLayout';

const Receipt = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchOrder();
  }, [id]);

  const fetchOrder = async () => {
    try {
      setLoading(true);
      const data = await orderService.getOrderById(id);
      setOrder(data);
    } catch (err) {
      setError('Receipt not found');
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <MobileLayout hideNav={true}>
        <div style={{ textAlign: 'center', padding: '60px 16px', color: 'var(--text-muted)' }}>
          Generating digital receipt...
        </div>
      </MobileLayout>
    );
  }

  if (error || !order) {
    return (
      <MobileLayout hideNav={true}>
        <div style={{ padding: '24px', textAlign: 'center' }}>
          <p style={{ color: 'var(--danger)', fontWeight: '600', marginBottom: '16px' }}>{error}</p>
          <button className="btn btn-primary" onClick={() => navigate('/')}>
            Return to Store
          </button>
        </div>
      </MobileLayout>
    );
  }

  const receiptId = order.receiptId || `SP-2026-${order._id.toString().substring(0, 5).toUpperCase()}`;

  return (
    <MobileLayout hideNav={true}>
      {/* Top Bar */}
      <div style={{
        padding: '14px 16px',
        backgroundColor: '#ffffff',
        borderBottom: '1px solid #e2e8f0',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        position: 'sticky',
        top: 0,
        zIndex: 20
      }}>
        <button
          onClick={() => navigate('/')}
          style={{
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            backgroundColor: '#f8fafc',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--text-main)'
          }}
        >
          <ArrowLeft size={18} />
        </button>
        <h2 style={{ fontSize: '15px', fontWeight: '700', color: 'var(--text-main)' }}>
          Digital Tax Invoice
        </h2>
        <button onClick={handlePrint} style={{ color: 'var(--text-muted)', padding: '4px' }} title="Print Receipt">
          <Printer size={18} />
        </button>
      </div>

      <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {/* Success Splash */}
        <div style={{
          backgroundColor: '#f0fdf4',
          border: '1px solid #bbf7d0',
          borderRadius: '20px',
          padding: '16px',
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '6px'
        }}>
          <CheckCircle2 size={36} color="var(--secondary)" />
          <h3 style={{ fontSize: '16px', fontWeight: '800', color: 'var(--secondary-hover)' }}>
            Checkout Completed!
          </h3>
          <p style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
            Show this digital pass at the store exit terminal.
          </p>
        </div>

        {/* Thermal Digital Receipt Paper */}
        <div style={{
          backgroundColor: '#ffffff',
          borderRadius: '20px',
          border: '1px solid #e2e8f0',
          padding: '20px',
          fontFamily: "'JetBrains Mono', monospace",
          boxShadow: 'var(--shadow-sm)',
          fontSize: '12px',
          color: '#1e293b',
          position: 'relative'
        }}>
          {/* Receipt Store Header */}
          <div style={{ textAlign: 'center', marginBottom: '14px' }}>
            <div style={{ fontSize: '15px', fontWeight: '800', letterSpacing: '1px', fontFamily: 'Inter, sans-serif' }}>
              B MART RETAIL
            </div>
            <div style={{ fontSize: '10px', color: '#64748b' }}>Store #042 &bull; Express Checkout</div>
            <div style={{ fontSize: '10px', color: '#64748b', marginTop: '2px' }}>
              {new Date(order.createdAt).toLocaleString('en-IN', {
                dateStyle: 'medium',
                timeStyle: 'short'
              })}
            </div>
          </div>

          <div style={{ borderBottom: '1px dashed #cbd5e1', marginBottom: '10px' }} />

          {/* Receipt ID */}
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', fontWeight: '600' }}>
            <span>RECEIPT NO:</span>
            <span>{receiptId}</span>
          </div>

          <div style={{ borderBottom: '1px dashed #cbd5e1', marginBottom: '10px' }} />

          {/* Itemized list */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '12px' }}>
            {order.items.map((item, idx) => (
              <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ maxWidth: '180px' }}>
                  <div>{item.name}</div>
                  <div style={{ fontSize: '10px', color: '#64748b' }}>
                    {item.quantity} &times; ₹{item.price}
                  </div>
                </div>
                <div style={{ fontWeight: '600' }}>₹{item.subtotal}</div>
              </div>
            ))}
          </div>

          <div style={{ borderBottom: '1px dashed #cbd5e1', marginBottom: '10px' }} />

          {/* Subtotal & Taxes */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginBottom: '10px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#64748b' }}>Subtotal:</span>
              <span>₹{order.subtotal}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#64748b' }}>Tax / GST (5%):</span>
              <span>₹{order.tax}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#64748b' }}>Discount:</span>
              <span>-₹{order.discount || 0}</span>
            </div>
          </div>

          <div style={{ borderBottom: '2px solid #0f172a', marginBottom: '10px' }} />

          {/* Total */}
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '15px', fontWeight: '800' }}>
            <span>TOTAL PAID:</span>
            <span>₹{order.total}</span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#64748b', marginTop: '6px' }}>
            <span>PAYMENT STATUS:</span>
            <span style={{ fontWeight: '700', color: 'var(--secondary)' }}>PAID &bull; {order.paymentStatus?.toUpperCase()}</span>
          </div>

          <div style={{ borderBottom: '1px dashed #cbd5e1', margin: '14px 0 10px 0' }} />

          {/* Exit Verification QR Code */}
          <div style={{ textAlign: 'center', marginTop: '8px' }}>
            <div style={{ fontSize: '10px', color: '#64748b', marginBottom: '6px' }}>
              SCAN AT STORE EXIT GATE
            </div>
            <div style={{
              display: 'inline-flex',
              padding: '10px',
              backgroundColor: '#f8fafc',
              borderRadius: '12px',
              border: '1px solid #e2e8f0'
            }}>
              <QrCode size={90} color="#0f172a" />
            </div>
            <div style={{ fontSize: '9px', color: '#94a3b8', marginTop: '4px', letterSpacing: '1px' }}>
              AUTH: {receiptId}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <button
            onClick={() => navigate('/')}
            className="btn btn-primary"
            style={{ width: '100%', padding: '12px', borderRadius: '12px', fontSize: '14px' }}
          >
            <Home size={16} /> Return to Store Home
          </button>
        </div>
      </div>
    </MobileLayout>
  );
};

export default Receipt;
