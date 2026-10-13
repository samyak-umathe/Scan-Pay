import { useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  PlusCircle,
  ShoppingBag,
  Users,
  Archive,
  BarChart3,
  Sparkles,
  Bell,
  ScanBarcode,
  LogOut,
  Smartphone,
  ChevronRight
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Logo from '../common/Logo';

const AdminSidebar = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();
  const currentPath = location.pathname;

  const menuItems = [
    { label: 'Dashboard', icon: LayoutDashboard, path: '/admin' },
    { label: 'Products Catalog', icon: Package, path: '/admin/products' },
    { label: 'Add Product', icon: PlusCircle, path: '/admin/products/add' },
    { label: 'Orders & Receipts', icon: ShoppingBag, path: '/admin/orders' },
    { label: 'Customers', icon: Users, path: '/admin/customers' },
    { label: 'Smart Inventory', icon: Archive, path: '/admin/inventory' },
    { label: 'Business Analytics', icon: BarChart3, path: '/admin/analytics' },
    { label: 'Recommendations', icon: Sparkles, path: '/admin/recommendations' },
    { label: 'Notifications', icon: Bell, path: '/admin/notifications' },
  ];

  const handleNav = (path) => {
    navigate(path);
    if (onClose) onClose();
  };

  const isActive = (path) => {
    if (path === '/admin' && currentPath === '/admin') return true;
    if (path !== '/admin' && currentPath === path) return true;
    return false;
  };

  return (
    <aside className="admin-sidebar" style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      position: 'sticky',
      top: 0,
      borderRight: '1px solid #1e293b'
    }}>
      {/* Brand Header */}
      <div style={{
        padding: '20px',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        borderBottom: '1px solid #1e293b'
      }}>
        <Logo size={28} />
        <div>
          <h2 style={{ fontSize: '18px', fontWeight: '800', color: '#ffffff', letterSpacing: '-0.3px', lineHeight: 1.1, margin: 0 }}>
            MART
          </h2>
          <span style={{ fontSize: '11px', color: '#94a3b8', fontWeight: '500' }}>Admin Console</span>
        </div>
      </div>

      {/* Navigation Links */}
      <nav style={{
        flex: 1,
        padding: '16px 12px',
        display: 'flex',
        flexDirection: 'column',
        gap: '4px',
        overflowY: 'auto'
      }}>
        <div style={{ fontSize: '10px', color: '#64748b', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.06em', padding: '0 12px 6px 12px' }}>
          Store Management
        </div>

        {menuItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);
          return (
            <button
              key={item.path}
              onClick={() => handleNav(item.path)}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '10px 12px',
                borderRadius: '10px',
                backgroundColor: active ? '#1e293b' : 'transparent',
                color: active ? '#ffffff' : '#94a3b8',
                fontWeight: active ? '700' : '500',
                fontSize: '13px',
                transition: 'all 0.15s',
                textAlign: 'left',
                borderLeft: active ? '3px solid var(--primary)' : '3px solid transparent'
              }}
              onMouseEnter={(e) => {
                if (!active) {
                  e.currentTarget.style.backgroundColor = '#1e293b80';
                  e.currentTarget.style.color = '#f8fafc';
                }
              }}
              onMouseLeave={(e) => {
                if (!active) {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.color = '#94a3b8';
                }
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Icon size={18} color={active ? 'var(--primary)' : '#94a3b8'} />
                <span>{item.label}</span>
              </div>
              {active && <ChevronRight size={14} color="var(--primary)" />}
            </button>
          );
        })}

        {/* Customer Simulator Shortcut */}
        <div style={{ marginTop: '16px', paddingTop: '12px', borderTop: '1px solid #1e293b' }}>
          <div style={{ fontSize: '10px', color: '#64748b', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.06em', padding: '0 12px 6px 12px' }}>
            Customer Experience
          </div>
          <button
            onClick={() => navigate('/')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              width: '100%',
              padding: '10px 12px',
              borderRadius: '10px',
              backgroundColor: '#1e3a8a30',
              color: '#60a5fa',
              fontWeight: '600',
              fontSize: '13px',
              border: '1px solid #1e3a8a60',
              textAlign: 'left'
            }}
          >
            <Smartphone size={18} />
            <span>Open Mobile App</span>
          </button>
        </div>
      </nav>

      {/* Logout Footer */}
      <div style={{
        padding: '16px',
        borderTop: '1px solid #1e293b'
      }}>
        <button
          onClick={() => { logout(); navigate('/login'); }}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            width: '100%',
            padding: '10px 12px',
            borderRadius: '10px',
            color: '#ef4444',
            fontSize: '13px',
            fontWeight: '600',
            backgroundColor: '#ef444415'
          }}
        >
          <LogOut size={18} />
          <span>Log Out</span>
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;
