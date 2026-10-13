import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { ArrowLeft, Search, ScanBarcode, AlertCircle, Sparkles } from 'lucide-react';
import { productService } from '../../services/productService';
import MobileLayout from '../../components/common/MobileLayout';
import BarcodeHelper from '../../components/product/BarcodeHelper';

const ScanProduct = () => {
  const navigate = useNavigate();
  const [manualBarcode, setManualBarcode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const scannerRef = useRef(null);

  useEffect(() => {
    let scanner;
    try {
      scanner = new Html5QrcodeScanner('reader', {
        qrbox: { width: 220, height: 140 },
        fps: 10,
        aspectRatio: 1.0,
      });

      scanner.render(
        (decodedText) => {
          scanner.clear().catch(console.error);
          handleBarcodeDetected(decodedText);
        },
        (err) => {
          // Ignore routine scan frame failures
        }
      );
      scannerRef.current = scanner;
    } catch (e) {
      console.warn('Scanner init failed, manual entry available', e);
    }

    return () => {
      if (scannerRef.current) {
        scannerRef.current.clear().catch(() => {});
      }
    };
  }, []);

  const handleBarcodeDetected = async (barcodeStr) => {
    if (!barcodeStr) return;
    setLoading(true);
    setError('');
    try {
      const product = await productService.getByBarcode(barcodeStr.trim());
      if (product && product._id) {
        navigate(`/product/${product._id}`);
      } else {
        setError(`Product with barcode ${barcodeStr} not found.`);
      }
    } catch (err) {
      setError(err.response?.data?.message || `No product registered with barcode: ${barcodeStr}`);
    } finally {
      setLoading(false);
    }
  };

  const handleManualSubmit = (e) => {
    e.preventDefault();
    if (manualBarcode.trim()) {
      handleBarcodeDetected(manualBarcode.trim());
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
          onClick={() => navigate(-1)}
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
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <ScanBarcode size={18} color="var(--primary)" />
          <h2 style={{ fontSize: '15px', fontWeight: '700', color: 'var(--text-main)' }}>
            Barcode Scanner
          </h2>
        </div>
      </div>

      <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {/* Scanner Viewfinder Box */}
        <div style={{
          backgroundColor: '#ffffff',
          borderRadius: '20px',
          border: '1px solid #e2e8f0',
          overflow: 'hidden',
          padding: '12px',
          boxShadow: 'var(--shadow-sm)',
          textAlign: 'center'
        }}>
          <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '8px' }}>
            Point your camera at product barcode
          </p>

          <div
            id="reader"
            style={{
              width: '100%',
              borderRadius: '12px',
              overflow: 'hidden',
              border: 'none',
              minHeight: '180px',
              backgroundColor: '#0f172a'
            }}
          ></div>

          {loading && (
            <div style={{
              marginTop: '10px',
              padding: '8px',
              backgroundColor: '#eff6ff',
              color: 'var(--primary)',
              borderRadius: '8px',
              fontSize: '12px',
              fontWeight: '600'
            }}>
              Looking up product in database...
            </div>
          )}
        </div>

        {/* Error Alert */}
        {error && (
          <div style={{
            padding: '12px',
            backgroundColor: '#fef2f2',
            border: '1px solid #fecaca',
            color: 'var(--danger)',
            borderRadius: '12px',
            fontSize: '12px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <AlertCircle size={16} flexShrink={0} />
            <span>{error}</span>
          </div>
        )}

        {/* Manual Barcode Search */}
        <div style={{
          backgroundColor: '#ffffff',
          borderRadius: '16px',
          border: '1px solid #e2e8f0',
          padding: '14px'
        }}>
          <div style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-main)', marginBottom: '4px' }}>
            Enter Barcode Manually
          </div>
          <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '10px' }}>
            Type barcode digits if camera is not available.
          </p>

          <form onSubmit={handleManualSubmit} style={{ display: 'flex', gap: '8px' }}>
            <input
              type="text"
              className="input-field"
              placeholder="e.g. 8901030000011"
              value={manualBarcode}
              onChange={(e) => setManualBarcode(e.target.value)}
              style={{ fontSize: '13px', padding: '8px 12px' }}
            />
            <button
              type="submit"
              className="btn btn-primary"
              style={{ padding: '8px 14px', flexShrink: 0 }}
              disabled={loading || !manualBarcode.trim()}
            >
              <Search size={16} />
            </button>
          </form>
        </div>

        {/* Quick Test Barcodes for local testing */}
        <BarcodeHelper onSelectBarcode={(code) => handleBarcodeDetected(code)} />
      </div>
    </MobileLayout>
  );
};

export default ScanProduct;
