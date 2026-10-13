import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, Bell, AlertTriangle, User, ShieldCheck } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { inventoryService } from '../../services/inventoryService';

const AdminNavbar = ({ onToggleSidebar, title }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [alertCount, setAlertCount] = useState(0);

  useEffect(() => {
    loadAlerts();
  }, []);

  const loadAlerts = async () => {
    try {
      const alerts = await inventoryService.getAlerts();
      setAlertCount(alerts?.length || 0);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <header className="admin-navbar">
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <button
          onClick={onToggleSidebar}
          style={{
            display: 'none',
            padding: '8px',
            color: 'var(--text-main)'
          }}
          className="mobile-sidebar-toggle"
        >
          <Menu size={20} />
        </button>
        <div>
          <h1 style={{ fontSize: '18px', fontWeight: '800', color: 'var(--text-main)', letterSpacing: '-0.3px' }}>
            {title || 'Dashboard'}
          </h1>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
        {/* Inventory alert indicator */}
        {alertCount > 0 && (
          <button
            onClick={() => navigate('/admin/inventory')}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              backgroundColor: '#fffbeb',
              border: '1px solid #fef3c7',
              color: '#d97706',
              padding: '6px 12px',
              borderRadius: '999px',
              fontSize: '12px',
              fontWeight: '700'
            }}
          >
            <AlertTriangle size={14} />
            <span>{alertCount} Stock Alert{alertCount > 1 ? 's' : ''}</span>
          </button>
        )}

        {/* Admin Profile */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          paddingLeft: '12px',
          borderLeft: '1px solid var(--border)'
        }}>
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            backgroundColor: '#0f172a',
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: '700',
            fontSize: '13px'
          }}>
            {user?.name ? user.name[0].toUpperCase() : 'A'}
          </div>
          <div style={{ display: 'none' }} className="admin-user-details">
            <div style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-main)' }}>
              {user?.name || 'Administrator'}
            </div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
              Store Operations
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminNavbar;
