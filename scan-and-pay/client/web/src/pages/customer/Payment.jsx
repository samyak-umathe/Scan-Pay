import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, QrCode, CreditCard, Zap, CheckCircle2, ShieldCheck, Lock, Loader2 } from 'lucide-react';
import { orderService } from '../../services/orderService';
import { paymentService } from '../../services/paymentService';
import { useCart } from '../../context/CartContext';
import MobileLayout from '../../components/common/MobileLayout';

const Payment = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { fetchCart } = useCart();

  const [order, setOrder] = useState(null);
  const [loadingOrder, setLoadingOrder] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState('UPI');
  const [processing, setProcessing] = useState(false);
  const [processingStep, setProcessingStep] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    loadOrder();
  }, [orderId]);

  const loadOrder = async () => {
    try {
      setLoadingOrder(true);
      const data = await orderService.getOrderById(orderId);
      setOrder(data);
    } catch (err) {
      setError('Order not found or already processed.');
    } finally {
      setLoadingOrder(false);
    }
  };

  const handlePay = async () => {
    setProcessing(true);
    setError('');

    try {
      // Animated simulation steps for production feel
      setProcessingStep('Connecting to secure payment gateway...');
      await new Promise(r => setTimeout(r, 600));

      setProcessingStep('Authorizing transaction token...');
      await new Promise(r => setTimeout(r, 600));

      setProcessingStep('Updating inventory & generating receipt...');
      const res = await paymentService.createPayment({
        orderId,
        amount: order.total,
        paymentMethod
      });

      // Synchronize cart state
      await fetchCart();

      setProcessingStep('Payment Verified Successfully! 🎉');
      await new Promise(r => setTimeout(r, 500));

      navigate(`/receipt/${orderId}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Payment simulation failed. Please try again.');
      setProcessing(false);
    }
  };

  if (loadingOrder) {
    return (
      <MobileLayout hideNav={true}>
        <div style={{ textAlign: 'center', padding: '60px 16px', color: 'var(--text-muted)' }}>
          Preparing checkout gateway...
        </div>
      </MobileLayout>
    );
  }

  return (
    <MobileLayout hideNav={true}>
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
          onClick={() => navigate(-1)}
          disabled={processing}
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
          Digital Payment
        </h2>
      </div>

      <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {/* Payable Amount Top Banner */}
        <div style={{
          backgroundColor: '#ffffff',
          borderRadius: '20px',
          border: '1px solid #e2e8f0',
          padding: '18px',
          textAlign: 'center',
          boxShadow: 'var(--shadow-sm)'
        }}>
          <span style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: '700', letterSpacing: '0.04em' }}>
            Amount to Pay
          </span>
          <div style={{ fontSize: '28px', fontWeight: '900', color: 'var(--primary)', margin: '4px 0' }}>
            ₹{order?.total}
          </div>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
            Order ID: <span style={{ fontFamily: 'monospace', fontWeight: '600' }}>{orderId?.substring(0, 10)}</span>
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

        {/* Payment Method Selector */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <span style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Choose Payment Method
          </span>

          {/* UPI Option */}
          <div
            onClick={() => !processing && setPaymentMethod('UPI')}
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '16px',
              border: `2px solid ${paymentMethod === 'UPI' ? 'var(--primary)' : '#e2e8f0'}`,
              padding: '14px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              transition: 'all 0.15s'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{
                width: '38px',
                height: '38px',
                borderRadius: '10px',
                backgroundColor: '#eff6ff',
                color: 'var(--primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <QrCode size={20} />
              </div>
              <div>
                <div style={{ fontWeight: '700', fontSize: '13px', color: 'var(--text-main)' }}>
                  UPI / QR Code
                </div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                  Google Pay, PhonePe, Paytm, BHIM
                </div>
              </div>
            </div>
            <div style={{
              width: '18px',
              height: '18px',
              borderRadius: '50%',
              border: `2px solid ${paymentMethod === 'UPI' ? 'var(--primary)' : '#cbd5e1'}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              {paymentMethod === 'UPI' && (
                <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: 'var(--primary)' }} />
              )}
            </div>
          </div>

          {/* Card Option */}
          <div
            onClick={() => !processing && setPaymentMethod('Card')}
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '16px',
              border: `2px solid ${paymentMethod === 'Card' ? 'var(--primary)' : '#e2e8f0'}`,
              padding: '14px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              transition: 'all 0.15s'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{
                width: '38px',
                height: '38px',
                borderRadius: '10px',
                backgroundColor: '#f0fdf4',
                color: 'var(--secondary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <CreditCard size={20} />
              </div>
              <div>
                <div style={{ fontWeight: '700', fontSize: '13px', color: 'var(--text-main)' }}>
                  Debit / Credit Card
                </div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                  Visa, MasterCard, RuPay
                </div>
              </div>
            </div>
            <div style={{
              width: '18px',
              height: '18px',
              borderRadius: '50%',
              border: `2px solid ${paymentMethod === 'Card' ? 'var(--primary)' : '#cbd5e1'}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              {paymentMethod === 'Card' && (
                <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: 'var(--primary)' }} />
              )}
            </div>
          </div>

          {/* Cashless Demo Option */}
          <div
            onClick={() => !processing && setPaymentMethod('Cashless Demo')}
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '16px',
              border: `2px solid ${paymentMethod === 'Cashless Demo' ? 'var(--primary)' : '#e2e8f0'}`,
              padding: '14px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              transition: 'all 0.15s'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{
                width: '38px',
                height: '38px',
                borderRadius: '10px',
                backgroundColor: '#fffbeb',
                color: 'var(--warning)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Zap size={20} />
              </div>
              <div>
                <div style={{ fontWeight: '700', fontSize: '13px', color: 'var(--text-main)' }}>
                  1-Click Cashless Demo
                </div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                  Instant zero-friction test payment
                </div>
              </div>
            </div>
            <div style={{
              width: '18px',
              height: '18px',
              borderRadius: '50%',
              border: `2px solid ${paymentMethod === 'Cashless Demo' ? 'var(--primary)' : '#cbd5e1'}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              {paymentMethod === 'Cashless Demo' && (
                <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: 'var(--primary)' }} />
              )}
            </div>
          </div>
        </div>

        {/* Processing State or Pay Button */}
        {processing ? (
          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: '20px',
            border: '1px solid #e2e8f0',
            padding: '24px 16px',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '12px'
          }}>
            <Loader2 size={32} color="var(--primary)" className="spin-animation" style={{ animation: 'spin 1s linear infinite' }} />
            <div style={{ fontWeight: '700', fontSize: '14px', color: 'var(--text-main)' }}>
              Processing Transaction
            </div>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
              {processingStep}
            </div>
          </div>
        ) : (
          <div>
            <button
              onClick={handlePay}
              className="btn btn-primary"
              style={{ width: '100%', padding: '14px', borderRadius: '14px', fontSize: '15px' }}
            >
              <Lock size={16} /> Pay ₹{order?.total} via {paymentMethod}
            </button>

            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '6px', marginTop: '12px', color: 'var(--text-subtle)', fontSize: '11px' }}>
              <ShieldCheck size={14} color="var(--secondary)" /> 256-Bit Encrypted Demo Transaction
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </MobileLayout>
  );
};

export default Payment;
