import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ScanBarcode, Bell, LogOut, ShieldCheck, Check } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { notificationService } from '../../services/notificationService';
import Logo from '../common/Logo';

const CustomerHeader = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    if (user) {
      loadNotifications();
    }
  }, [user]);

  const loadNotifications = async () => {
    try {
      const data = await notificationService.getUserNotifications();
      setNotifications(data || []);
    } catch (err) {
      console.error('Failed to load notifications', err);
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleMarkRead = async (id) => {
    try {
      await notificationService.markAsRead(id);
      setNotifications(prev => prev.map(n => n._id === id ? { ...n, read: true } : n));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <header style={{
      padding: '12px 16px',
      backgroundColor: '#ffffff',
      borderBottom: '1px solid #e2e8f0',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      position: 'sticky',
      top: 0,
      zIndex: 30,
      flexShrink: 0
    }}>
      {/* Brand */}
      <div 
        onClick={() => navigate('/')} 
        style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}
      >
        <Logo size={24} />
        <div>
          <h1 style={{ fontSize: '18px', fontWeight: '800', color: 'var(--text-main)', letterSpacing: '-0.3px', lineHeight: 1.1, margin: 0 }}>
            MART
          </h1>
          <span style={{ fontSize: '10px', color: 'var(--text-muted)', fontWeight: '500' }}>Smart Self-Checkout</span>
        </div>
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        {/* Admin Portal shortcut if user is admin */}
        {user?.role === 'admin' && (
          <button
            onClick={() => navigate('/admin')}
            style={{
              padding: '4px 8px',
              borderRadius: '6px',
              backgroundColor: '#f1f5f9',
              color: 'var(--primary)',
              fontSize: '11px',
              fontWeight: '700',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}
            title="Switch to Admin Dashboard"
          >
            <ShieldCheck size={14} /> Admin
          </button>
        )}

        {/* Notification Bell */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            style={{
              width: '34px',
              height: '34px',
              borderRadius: '50%',
              backgroundColor: '#f8fafc',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--text-main)',
              position: 'relative'
            }}
          >
            <Bell size={18} />
            {unreadCount > 0 && (
              <span style={{
                position: 'absolute',
                top: '4px',
                right: '4px',
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                backgroundColor: 'var(--danger)',
                boxShadow: '0 0 0 2px #ffffff'
              }} />
            )}
          </button>

          {/* Notifications Dropdown */}
          {showNotifications && (
            <div style={{
              position: 'absolute',
              top: '42px',
              right: '-10px',
              width: '280px',
              maxHeight: '320px',
              overflowY: 'auto',
              backgroundColor: '#ffffff',
              borderRadius: '12px',
              border: '1px solid #e2e8f0',
              boxShadow: 'var(--shadow-lg)',
              padding: '12px',
              zIndex: 100
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px', paddingBottom: '6px', borderBottom: '1px solid #f1f5f9' }}>
                <span style={{ fontWeight: '700', fontSize: '13px' }}>Notifications</span>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{unreadCount} unread</span>
              </div>
              {notifications.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '16px 0', fontSize: '12px', color: 'var(--text-muted)' }}>
                  No notifications yet.
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {notifications.map(n => (
                    <div 
                      key={n._id}
                      onClick={() => handleMarkRead(n._id)}
                      style={{
                        padding: '8px',
                        borderRadius: '8px',
                        backgroundColor: n.read ? '#ffffff' : '#eff6ff',
                        border: '1px solid',
                        borderColor: n.read ? '#f1f5f9' : '#dbeafe',
                        cursor: 'pointer',
                        fontSize: '12px'
                      }}
                    >
                      <div style={{ fontWeight: '600', color: 'var(--text-main)', marginBottom: '2px' }}>{n.title}</div>
                      <div style={{ color: 'var(--text-muted)', fontSize: '11px' }}>{n.message}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* User initials */}
        <div style={{
          width: '32px',
          height: '32px',
          borderRadius: '50%',
          backgroundColor: '#eb2525',
          color: '#ffffff',
          fontWeight: '700',
          fontSize: '13px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }} title={user?.name}>
          {user?.name ? user.name[0].toUpperCase() : 'U'}
        </div>

        {/* Logout */}
        <button
          onClick={() => { logout(); navigate('/login'); }}
          style={{ color: 'var(--text-muted)', padding: '6px' }}
          title="Log Out"
        >
          <LogOut size={18} />
        </button>
      </div>
    </header>
  );
};

export default CustomerHeader;
