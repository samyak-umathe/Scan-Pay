import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ShieldCheck, ShoppingBag, CreditCard, Sparkles, CheckCircle2 } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { orderService } from '../../services/orderService';
import MobileLayout from '../../components/common/MobileLayout';

const Checkout = () => {
  const { cart } = useCart();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!cart || !cart.items || cart.items.length === 0) {
    navigate('/cart');
    return null;
  }

  const subtotal = cart.total;
  const tax = parseFloat((subtotal * 0.05).toFixed(2));
  const discount = 0;
  const total = parseFloat((subtotal + tax - discount).toFixed(2));

  const handleProceedToPayment = async () => {
    setLoading(true);
    setError('');
    try {
      // 1. Create pending order on backend securely
      const order = await orderService.createOrder({
        items: cart.items.map(item => ({
          productId: item.productId,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          subtotal: item.subtotal
        })),
        subtotal,
        tax,
        discount,
        total
      });

      // 2. Navigate to Payment page with generated order ID
      navigate(`/payment/${order._id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to initialize order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <MobileLayout hideNav={false}>
      {/* Header */}
      <div style={{
        padding: '14px 16px',
        backgroundColor: '#ffffff',
        borderBottom: '1px solid #e2e8f0',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        position: 'sticky',
        top: 0,
        zIndex: 20
      }}>
        <button
          onClick={() => navigate('/cart')}
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
          Review & Checkout
        </h2>
      </div>

      <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {/* Store Self-Checkout Banner */}
        <div style={{
          backgroundColor: '#eff6ff',
          borderRadius: '16px',
          border: '1px solid #dbeafe',
          padding: '12px 14px',
          display: 'flex',
          alignItems: 'center',
          gap: '10px'
        }}>
          <ShieldCheck size={20} color="var(--primary)" flexShrink={0} />
          <div>
            <div style={{ fontSize: '12px', fontWeight: '700', color: 'var(--primary)' }}>
              B Mart Express Checkout
            </div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
              Verify your scanned basket before completing digital payment.
            </div>
          </div>
        </div>

        {error && (
          <div style={{
            padding: '12px',
            backgroundColor: '#fef2f2',
            color: 'var(--danger)',
            borderRadius: '12px',
            fontSize: '12px'
          }}>
            {error}
          </div>
        )}

        {/* Itemized Review List */}
        <div style={{
          backgroundColor: '#ffffff',
          borderRadius: '20px',
          border: '1px solid #e2e8f0',
          padding: '16px',
          boxShadow: 'var(--shadow-sm)'
        }}>
          <h3 style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-main)', marginBottom: '12px' }}>
            Scanned Items ({cart.items.length})
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {cart.items.map(item => (
              <div
                key={item.productId}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  fontSize: '12px',
                  paddingBottom: '8px',
                  borderBottom: '1px solid #f1f5f9'
                }}
              >
                <div>
                  <span style={{ fontWeight: '600', color: 'var(--text-main)' }}>{item.name}</span>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                    Qty: {item.quantity} &times; ₹{item.price}
                  </div>
                </div>
                <span style={{ fontWeight: '700', color: 'var(--text-main)' }}>
                  ₹{item.subtotal}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Final Price Breakdown */}
        <div style={{
          backgroundColor: '#ffffff',
          borderRadius: '20px',
          border: '1px solid #e2e8f0',
          padding: '16px',
          boxShadow: 'var(--shadow-sm)'
        }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
              <span>Subtotal</span>
              <span style={{ fontWeight: '600', color: 'var(--text-main)' }}>₹{subtotal}</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
              <span>GST & Surcharges (5%)</span>
              <span style={{ fontWeight: '600', color: 'var(--text-main)' }}>₹{tax}</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--secondary-hover)' }}>
              <span>Instant Self-Checkout Savings</span>
              <span style={{ fontWeight: '700' }}>-₹0.00</span>
            </div>

            <div style={{
              borderTop: '1px solid #f1f5f9',
              paddingTop: '10px',
              marginTop: '4px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <span style={{ fontSize: '14px', fontWeight: '800', color: 'var(--text-main)' }}>Total Amount</span>
              <span style={{ fontSize: '18px', fontWeight: '800', color: 'var(--primary)' }}>₹{total}</span>
            </div>
          </div>

          <button
            onClick={handleProceedToPayment}
            disabled={loading}
            className="btn btn-primary"
            style={{ width: '100%', marginTop: '16px', padding: '12px', borderRadius: '12px', fontSize: '14px' }}
          >
            {loading ? 'Creating Order...' : (
              <>
                <CreditCard size={18} /> Select Payment Method &bull; ₹{total}
              </>
            )}
          </button>
        </div>
      </div>
    </MobileLayout>
  );
};

export default Checkout;
