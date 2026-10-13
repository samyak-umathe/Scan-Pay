import { Barcode, ChevronRight } from 'lucide-react';

const TEST_BARCODES = [
  { name: 'Milk (1L)', barcode: '8901030000011', brand: 'Amul', price: '₹60' },
  { name: 'Wheat Bread', barcode: '8901030000012', brand: 'Britannia', price: '₹45' },
  { name: 'Parle-G Gold', barcode: '8901030000015', brand: 'Parle', price: '₹30' },
  { name: 'Basmati Rice', barcode: '8901030000016', brand: 'India Gate', price: '₹185' },
  { name: 'Instant Coffee', barcode: '8901030000020', brand: 'Nescafe', price: '₹295' },
  { name: 'Potato Chips', barcode: '8901030000029', brand: 'Lays', price: '₹20' },
  { name: 'Dairy Milk Silk', barcode: '8901030000030', brand: 'Cadbury', price: '₹85' },
];

const BarcodeHelper = ({ onSelectBarcode }) => {
  return (
    <div style={{
      backgroundColor: '#ffffff',
      borderRadius: '16px',
      border: '1px solid #e2e8f0',
      padding: '14px',
      marginTop: '16px'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px', color: 'var(--primary)', fontWeight: '700', fontSize: '13px' }}>
        <Barcode size={16} /> Quick Test Barcodes (1-Click Scan)
      </div>
      <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '12px' }}>
        Click any sample product below to simulate scanning its barcode immediately:
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        {TEST_BARCODES.map(item => (
          <button
            key={item.barcode}
            type="button"
            onClick={() => onSelectBarcode(item.barcode)}
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '8px 12px',
              backgroundColor: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: '8px',
              textAlign: 'left',
              transition: 'background-color 0.15s'
            }}
            onMouseEnter={e => e.currentTarget.style.backgroundColor = '#eff6ff'}
            onMouseLeave={e => e.currentTarget.style.backgroundColor = '#f8fafc'}
          >
            <div>
              <div style={{ fontWeight: '600', fontSize: '12px', color: 'var(--text-main)' }}>
                {item.name}
              </div>
              <div style={{ fontSize: '10px', color: 'var(--text-muted)', fontFamily: 'monospace' }}>
                Code: {item.barcode}
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ fontWeight: '700', fontSize: '12px', color: 'var(--primary)' }}>{item.price}</span>
              <ChevronRight size={14} color="var(--text-muted)" />
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default BarcodeHelper;
