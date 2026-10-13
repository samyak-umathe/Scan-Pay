import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Trash2, Minus, Plus, ShoppingBag, ArrowRight, ShieldCheck } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import MobileLayout from '../../components/common/MobileLayout';

const Cart = () => {
  const navigate = useNavigate();
  const { cart, loading, updateQuantity, removeFromCart, clearCart } = useCart();

  const handleUpdate = async (productId, currentQty, delta) => {
    const newQty = currentQty + delta;
    if (newQty <= 0) {
      await removeFromCart(productId);
    } else {
      await updateQuantity(productId, newQty);
    }
  };

  const subtotal = cart?.total || 0;
  const tax = parseFloat((subtotal * 0.05).toFixed(2));
  const finalTotal = parseFloat((subtotal + tax).toFixed(2));

  return (
    <MobileLayout hideNav={false}>
      {/* Header */}
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
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
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
            Self-Checkout Cart
          </h2>
        </div>

        {cart?.items?.length > 0 && (
          <button
            onClick={clearCart}
            style={{ fontSize: '11px', color: 'var(--danger)', fontWeight: '600' }}
          >
            Clear All
          </button>
        )}
      </div>

      <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px 16px', color: 'var(--text-muted)' }}>
            Updating cart...
          </div>
        ) : !cart || cart.items.length === 0 ? (
          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: '24px',
            border: '1px solid #e2e8f0',
            padding: '40px 20px',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '12px'
          }}>
            <div style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              backgroundColor: '#eff6ff',
              color: 'var(--primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '8px'
            }}>
              <ShoppingBag size={28} />
            </div>
            <h3 style={{ fontSize: '16px', fontWeight: '700', color: 'var(--text-main)' }}>
              Your virtual cart is empty
            </h3>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)', maxWidth: '240px' }}>
              Scan product barcodes in the aisle to add items directly to your cart.
            </p>
            <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
              <button className="btn btn-primary" onClick={() => navigate('/scan')} style={{ fontSize: '13px' }}>
                Scan Barcode
              </button>
              <button className="btn btn-secondary" onClick={() => navigate('/')} style={{ fontSize: '13px' }}>
                Browse Store
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Cart Items List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {cart.items.map((item) => (
                <div
                  key={item.productId}
                  style={{
                    backgroundColor: '#ffffff',
                    borderRadius: '16px',
                    border: '1px solid #e2e8f0',
                    padding: '12px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    boxShadow: 'var(--shadow-sm)'
                  }}
                >
                  <div style={{ flex: 1, paddingRight: '10px' }}>
                    <h4 style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-main)', marginBottom: '2px', lineHeight: 1.3 }}>
                      {item.name}
                    </h4>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                      ₹{item.price} each
                    </div>
                    <div style={{ fontSize: '13px', fontWeight: '800', color: 'var(--primary)', marginTop: '4px' }}>
                      ₹{item.subtotal}
                    </div>
                  </div>

                  {/* Quantity Stepper */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <button
                      onClick={() => handleUpdate(item.productId, item.quantity, -1)}
                      style={{
                        width: '28px',
                        height: '28px',
                        borderRadius: '6px',
                        backgroundColor: '#f1f5f9',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'var(--text-main)'
                      }}
                    >
                      {item.quantity === 1 ? <Trash2 size={13} color="var(--danger)" /> : <Minus size={13} />}
                    </button>

                    <span style={{ fontSize: '13px', fontWeight: '800', minWidth: '18px', textAlign: 'center' }}>
                      {item.quantity}
                    </span>

                    <button
                      onClick={() => handleUpdate(item.productId, item.quantity, 1)}
                      style={{
                        width: '28px',
                        height: '28px',
                        borderRadius: '6px',
                        backgroundColor: '#f1f5f9',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'var(--text-main)'
                      }}
                    >
                      <Plus size={13} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Bill Summary Card */}
            <div style={{
              backgroundColor: '#ffffff',
              borderRadius: '20px',
              border: '1px solid #e2e8f0',
              padding: '16px',
              boxShadow: 'var(--shadow-sm)'
            }}>
              <h4 style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-main)', marginBottom: '12px' }}>
                Order Summary
              </h4>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
                  <span>Items Subtotal ({cart.items.reduce((s, i) => s + i.quantity, 0)} items)</span>
                  <span style={{ fontWeight: '600', color: 'var(--text-main)' }}>₹{subtotal}</span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
                  <span>Estimated GST (5%)</span>
                  <span style={{ fontWeight: '600', color: 'var(--text-main)' }}>₹{tax}</span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--secondary-hover)' }}>
                  <span>Self-Checkout Discount</span>
                  <span style={{ fontWeight: '700' }}>FREE</span>
                </div>

                <div style={{
                  borderTop: '1px solid #f1f5f9',
                  paddingTop: '10px',
                  marginTop: '4px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <span style={{ fontSize: '14px', fontWeight: '800', color: 'var(--text-main)' }}>Total Payable</span>
                  <span style={{ fontSize: '17px', fontWeight: '800', color: 'var(--primary)' }}>₹{finalTotal}</span>
                </div>
              </div>

              <button
                onClick={() => navigate('/checkout')}
                className="btn btn-primary"
                style={{ width: '100%', marginTop: '16px', padding: '12px', borderRadius: '12px', fontSize: '14px' }}
              >
                Proceed to Checkout <ArrowRight size={16} />
              </button>
            </div>
          </>
        )}
      </div>
    </MobileLayout>
  );
};

export default Cart;
