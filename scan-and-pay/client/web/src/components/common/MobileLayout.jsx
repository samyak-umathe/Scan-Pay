import { useState, useEffect } from 'react';
import { Wifi, Battery, Signal, Sparkles, Smartphone } from 'lucide-react';
import BottomNav from '../navbar/BottomNav';

const MobileLayout = ({ children, hideNav = false, title = 'B-Mart' }) => {
  const [time, setTime] = useState('9:41');

  useEffect(() => {
    const updateTime = () => {
      const d = new Date();
      const hours = d.getHours().toString().padStart(2, '0');
      const mins = d.getMinutes().toString().padStart(2, '0');
      setTime(`${hours}:${mins}`);
    };
    updateTime();
    const interval = setInterval(updateTime, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="mobile-app-wrapper">
      {/* Desktop Background Helper Info */}
      <div style={{
        position: 'fixed',
        left: '40px',
        top: '40px',
        maxWidth: '300px',
        display: 'none',
      }} className="desktop-helper-info">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', color: 'var(--primary)', fontWeight: '700' }}>
          <Smartphone size={20} /> Customer Mobile Simulator
        </div>
        <p style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: '1.4' }}>
          This customer interface is constrained to a smartphone viewport ratio. Scan barcodes, browse items, and complete self-checkout.
        </p>
      </div>

      <div className="mobile-app-container">
        {/* Top Status Bar with Live Clock & Icons */}
        <div className="mobile-status-bar">
          <span>{time}</span>
          <div className="mobile-notch">
            <div className="mobile-notch-camera"></div>
            <div className="mobile-notch-speaker"></div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Signal size={12} />
            <Wifi size={12} />
            <Battery size={14} />
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="mobile-content-area animate-fade-in">
          {children}
        </div>

        {/* Bottom Tab Navigation */}
        {!hideNav && <BottomNav />}
      </div>
    </div>
  );
};

export default MobileLayout;
