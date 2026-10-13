import { useNavigate, useLocation } from 'react-router-dom';
import { Home, ScanBarcode, ShoppingCart, Clock, User } from 'lucide-react';
import { useCart } from '../../context/CartContext';

const BottomNav = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { cart } = useCart();

  const totalItems = cart?.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;
  const currentPath = location.pathname;

  const isActive = (path) => {
    if (path === '/' && currentPath === '/') return true;
    if (path !== '/' && currentPath.startsWith(path)) return true;
    return false;
  };

  return (
    <nav style={{
      height: '64px',
      backgroundColor: '#ffffff',
      borderTop: '1px solid #e2e8f0',
      display: 'flex',
      justifyContent: 'space-around',
      alignItems: 'center',
      padding: '0 8px',
      position: 'relative',
      zIndex: 40,
      flexShrink: 0,
      boxShadow: '0 -4px 12px rgba(0,0,0,0.03)'
    }}>
      {/* Home */}
      <button
        onClick={() => navigate('/')}
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '3px',
          color: isActive('/') ? 'var(--primary)' : 'var(--text-muted)',
          fontSize: '11px',
          fontWeight: isActive('/') ? '700' : '500',
          transition: 'all 0.2s',
          padding: '6px'
        }}
      >
        <Home size={20} strokeWidth={isActive('/') ? 2.5 : 1.8} />
        <span>Home</span>
      </button>

      {/* Center Scan Button */}
      <button
        onClick={() => navigate('/scan')}
        className={isActive('/scan') ? 'pulse-glow' : ''}
        style={{
          width: '48px',
          height: '48px',
          borderRadius: '50%',
          backgroundColor: 'var(--primary)',
          color: '#ffffff',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          marginTop: '-20px',
          boxShadow: '0 6px 16px rgba(37, 99, 235, 0.4)',
          border: '3px solid #ffffff',
          transition: 'transform 0.2s'
        }}
        title="Scan Barcode"
      >
        <ScanBarcode size={24} />
      </button>

      {/* Cart with Badge */}
      <button
        onClick={() => navigate('/cart')}
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '3px',
          color: isActive('/cart') ? 'var(--primary)' : 'var(--text-muted)',
          fontSize: '11px',
          fontWeight: isActive('/cart') ? '700' : '500',
          position: 'relative',
          padding: '6px'
        }}
      >
        <div style={{ position: 'relative' }}>
          <ShoppingCart size={20} strokeWidth={isActive('/cart') ? 2.5 : 1.8} />
          {totalItems > 0 && (
            <span style={{
              position: 'absolute',
              top: '-6px',
              right: '-8px',
              backgroundColor: 'var(--danger)',
              color: '#ffffff',
              fontSize: '10px',
              fontWeight: '800',
              borderRadius: '999px',
              minWidth: '16px',
              height: '16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '0 3px',
              boxShadow: '0 2px 4px rgba(239, 68, 68, 0.4)'
            }}>
              {totalItems}
            </span>
          )}
        </div>
        <span>Cart</span>
      </button>

      {/* Orders */}
      <button
        onClick={() => navigate('/orders')}
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '3px',
          color: isActive('/orders') ? 'var(--primary)' : 'var(--text-muted)',
          fontSize: '11px',
          fontWeight: isActive('/orders') ? '700' : '500',
          padding: '6px'
        }}
      >
        <Clock size={20} strokeWidth={isActive('/orders') ? 2.5 : 1.8} />
        <span>Orders</span>
      </button>
    </nav>
  );
};

export default BottomNav;
