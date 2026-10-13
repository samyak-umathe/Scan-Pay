import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Upload,
  Download,
  Plus,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  FileSpreadsheet,
  PackagePlus,
  X
} from 'lucide-react';
import { productService } from '../../services/productService';
import AdminLayout from './AdminLayout';

const CATEGORIES = ['Dairy', 'Bakery', 'Beverages', 'Snacks', 'Grains', 'Grocery', 'Personal Care', 'Household', 'Breakfast', 'Spreads'];

const DEFAULT_IMAGE = 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=400&q=80';

const EMPTY_ROW = () => ({
  _key: Math.random().toString(36).substring(2),
  name: '',
  barcode: '',
  brand: '',
  category: 'Dairy',
  price: '',
  stock: '',
  minimumStock: '10',
  unit: '1 Pack',
  description: '',
  image: DEFAULT_IMAGE
});

// Simple in-browser CSV parser (no external deps)
const parseCSV = (text) => {
  const lines = text.trim().split('\n').filter(l => l.trim());
  if (lines.length < 2) return [];
  const headers = lines[0].split(',').map(h => h.trim().replace(/^"|"$/g, ''));
  return lines.slice(1).map(line => {
    const values = line.split(',').map(v => v.trim().replace(/^"|"$/g, ''));
    const row = {};
    headers.forEach((h, i) => { row[h] = values[i] || ''; });
    row._key = Math.random().toString(36).substring(2);
    return row;
  });
};

// Generate downloadable CSV template
const downloadTemplate = () => {
  const headers = 'name,barcode,brand,category,price,stock,minimumStock,unit,description,image';
  const example1 = '"Amul Gold Milk","8901030000099","Amul","Dairy","60","100","10","1 Litre","Full cream homogenised milk","https://images.unsplash.com/photo-1563636619-e9143da7973b?auto=format&fit=crop&w=400&q=80"';
  const example2 = '"Britannia 50-50 Biscuits","8901030000088","Britannia","Snacks","30","80","15","75g","Crispy sweet and salty biscuits","https://images.unsplash.com/photo-1558961363-fa8fdf82db35?auto=format&fit=crop&w=400&q=80"';
  const csv = `${headers}\n${example1}\n${example2}`;
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'scanpay_bulk_import_template.csv';
  a.click();
  URL.revokeObjectURL(url);
};

const BulkAddProduct = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [rows, setRows] = useState([EMPTY_ROW(), EMPTY_ROW(), EMPTY_ROW()]);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null); // { success, message, errors }
  const [parseError, setParseError] = useState('');
  const [activeTab, setActiveTab] = useState('manual'); // 'manual' | 'csv'

  // ─── Row Handlers ────────────────────────────────────────────
  const updateRow = (key, field, value) => {
    setRows(prev => prev.map(r => r._key === key ? { ...r, [field]: value } : r));
  };

  const addRow = () => setRows(prev => [...prev, EMPTY_ROW()]);

  const deleteRow = (key) => {
    if (rows.length === 1) return;
    setRows(prev => prev.filter(r => r._key !== key));
  };

  const generateBarcode = (key) => {
    const code = '890' + Math.floor(1000000000 + Math.random() * 9000000000).toString().substring(0, 10);
    updateRow(key, 'barcode', code);
  };

  const clearAll = () => setRows([EMPTY_ROW(), EMPTY_ROW(), EMPTY_ROW()]);

  // ─── CSV Upload Handler ───────────────────────────────────────
  const handleFileUpload = (e) => {
    setParseError('');
    const file = e.target.files[0];
    if (!file) return;
    if (!file.name.endsWith('.csv')) {
      setParseError('Please upload a valid .csv file');
      return;
    }
    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const parsed = parseCSV(evt.target.result);
        if (parsed.length === 0) {
          setParseError('CSV appears empty or has no data rows');
          return;
        }
        if (parsed.length > 100) {
          setParseError('Maximum 100 rows per import');
          return;
        }
        setRows(parsed.map(p => ({
          _key: p._key,
          name: p.name || '',
          barcode: p.barcode || '',
          brand: p.brand || '',
          category: p.category || 'Dairy',
          price: p.price || '',
          stock: p.stock || '',
          minimumStock: p.minimumStock || '10',
          unit: p.unit || '1 Pack',
          description: p.description || '',
          image: p.image || DEFAULT_IMAGE
        })));
        setActiveTab('manual');
        setParseError('');
      } catch (err) {
        setParseError('Failed to parse CSV. Check your file format.');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  // ─── Validate & Submit ────────────────────────────────────────
  const validate = () => {
    const errors = [];
    const barcodes = new Set();
    rows.forEach((r, idx) => {
      if (!r.name.trim()) errors.push(`Row ${idx + 1}: Product name is required`);
      if (!r.barcode.trim()) errors.push(`Row ${idx + 1}: Barcode is required`);
      if (!r.price || isNaN(parseFloat(r.price))) errors.push(`Row ${idx + 1}: Valid price is required`);
      if (r.barcode && barcodes.has(r.barcode)) errors.push(`Row ${idx + 1}: Duplicate barcode "${r.barcode}"`);
      if (r.barcode) barcodes.add(r.barcode);
    });
    return errors;
  };

  const handleSubmit = async () => {
    setResult(null);
    const errors = validate();
    if (errors.length > 0) {
      setResult({ success: false, errors });
      return;
    }

    setLoading(true);
    try {
      const res = await productService.bulkCreate(rows);
      setResult({ success: true, message: res.message, count: rows.length });
      setRows([EMPTY_ROW(), EMPTY_ROW(), EMPTY_ROW()]);
    } catch (err) {
      setResult({
        success: false,
        errors: [err.response?.data?.message || 'Bulk import failed. Please check your data.']
      });
    } finally {
      setLoading(false);
    }
  };

  const filledRows = rows.filter(r => r.name.trim() || r.barcode.trim());

  return (
    <AdminLayout title="Bulk Product Import">
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

        {/* Header + Back */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
          <button
            onClick={() => navigate('/admin/products')}
            style={{
              padding: '6px 14px',
              borderRadius: '8px',
              backgroundColor: '#ffffff',
              border: '1px solid var(--border)',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '13px',
              fontWeight: '600',
              color: 'var(--text-main)'
            }}
          >
            <ArrowLeft size={15} /> Back to Catalog
          </button>

          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
              {filledRows.length} / {rows.length} rows filled
            </span>
            <button onClick={downloadTemplate} className="btn btn-secondary" style={{ fontSize: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Download size={14} /> Download CSV Template
            </button>
          </div>
        </div>

        {/* Info Banner */}
        <div className="card" style={{
          background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
          color: '#ffffff',
          border: 'none',
          padding: '20px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <PackagePlus size={20} color="#60a5fa" />
            <h3 style={{ fontSize: '15px', fontWeight: '800' }}>Bulk Product Import Tool</h3>
          </div>
          <p style={{ fontSize: '12px', color: '#cbd5e1', lineHeight: '1.5' }}>
            Import up to <strong style={{ color: '#93c5fd' }}>100 products</strong> at once. Use the <strong style={{ color: '#93c5fd' }}>CSV Upload</strong> tab to upload a spreadsheet, or use the <strong style={{ color: '#93c5fd' }}>Manual Table</strong> to type rows directly. Each product automatically gets an Inventory record created.
          </p>
        </div>

        {/* Success Banner */}
        {result?.success && (
          <div style={{
            padding: '16px 20px',
            backgroundColor: '#f0fdf4',
            border: '1px solid #bbf7d0',
            borderRadius: '14px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}>
            <CheckCircle2 size={24} color="#10b981" />
            <div>
              <div style={{ fontWeight: '700', fontSize: '14px', color: '#065f46' }}>
                Import Successful!
              </div>
              <div style={{ fontSize: '12px', color: '#059669', marginTop: '2px' }}>
                {result.message} — All inventory records have been created.
              </div>
            </div>
            <button
              onClick={() => navigate('/admin/products')}
              className="btn btn-primary"
              style={{ marginLeft: 'auto', fontSize: '12px' }}
            >
              View Catalog →
            </button>
          </div>
        )}

        {/* Error Banner */}
        {result?.success === false && (
          <div style={{
            padding: '14px 18px',
            backgroundColor: '#fef2f2',
            border: '1px solid #fecaca',
            borderRadius: '14px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <AlertCircle size={18} color="var(--danger)" />
              <span style={{ fontWeight: '700', fontSize: '13px', color: 'var(--danger)' }}>
                {result.errors.length} Validation Error(s)
              </span>
            </div>
            <ul style={{ paddingLeft: '20px', margin: 0 }}>
              {result.errors.map((e, i) => (
                <li key={i} style={{ fontSize: '12px', color: 'var(--danger)', marginBottom: '4px' }}>{e}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Tab Switcher */}
        <div style={{ display: 'flex', gap: '4px', backgroundColor: '#f1f5f9', padding: '4px', borderRadius: '10px', width: 'fit-content' }}>
          {[
            { key: 'manual', label: '📝 Manual Table', icon: Plus },
            { key: 'csv', label: '📁 CSV Upload', icon: Upload }
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              style={{
                padding: '8px 18px',
                borderRadius: '8px',
                fontSize: '13px',
                fontWeight: '700',
                border: 'none',
                cursor: 'pointer',
                backgroundColor: activeTab === tab.key ? '#ffffff' : 'transparent',
                color: activeTab === tab.key ? 'var(--primary)' : 'var(--text-muted)',
                boxShadow: activeTab === tab.key ? '0 1px 4px rgba(0,0,0,0.1)' : 'none',
                transition: 'all 0.15s'
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* CSV Upload Tab */}
        {activeTab === 'csv' && (
          <div className="card" style={{ padding: '32px', textAlign: 'center' }}>
            <FileSpreadsheet size={48} color="var(--primary)" style={{ margin: '0 auto 12px' }} />
            <h3 style={{ fontSize: '16px', fontWeight: '800', marginBottom: '8px' }}>Upload CSV Spreadsheet</h3>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '20px', maxWidth: '440px', margin: '0 auto 20px' }}>
              Download the template first, fill in your product data in Excel or Google Sheets, then upload here.
            </p>

            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', marginBottom: '16px' }}>
              <button onClick={downloadTemplate} className="btn btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Download size={15} /> Download Template
              </button>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="btn btn-primary"
                style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                <Upload size={15} /> Upload CSV File
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv"
                onChange={handleFileUpload}
                style={{ display: 'none' }}
              />
            </div>

            {parseError && (
              <div style={{ color: 'var(--danger)', fontSize: '12px', fontWeight: '600' }}>
                ⚠️ {parseError}
              </div>
            )}

            <div style={{
              marginTop: '24px',
              padding: '16px',
              backgroundColor: '#f8fafc',
              borderRadius: '10px',
              border: '1px solid var(--border)',
              textAlign: 'left',
              fontSize: '12px',
              color: 'var(--text-muted)',
              fontFamily: 'monospace'
            }}>
              <div style={{ fontWeight: '700', color: 'var(--text-main)', marginBottom: '6px', fontFamily: 'inherit' }}>
                Required CSV Columns:
              </div>
              name, barcode, brand, category, price, stock, minimumStock, unit, description, image
            </div>
          </div>
        )}

        {/* Manual Table Editor */}
        {activeTab === 'manual' && (
          <div className="card" style={{ padding: '0', overflow: 'hidden' }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '14px 20px',
              borderBottom: '1px solid var(--border)',
              backgroundColor: '#f8fafc'
            }}>
              <h3 style={{ fontSize: '14px', fontWeight: '800', color: 'var(--text-main)' }}>
                Product Rows ({rows.length})
              </h3>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button onClick={clearAll} className="btn btn-secondary" style={{ fontSize: '12px' }}>
                  <X size={13} /> Clear All
                </button>
                <button
                  onClick={addRow}
                  className="btn btn-secondary"
                  style={{ fontSize: '12px', display: 'flex', alignItems: 'center', gap: '4px' }}
                >
                  <Plus size={13} /> Add Row
                </button>
              </div>
            </div>

            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '1100px' }}>
                <thead>
                  <tr style={{ backgroundColor: '#f1f5f9', borderBottom: '1px solid var(--border)' }}>
                    {['#', 'Product Name *', 'Barcode *', 'Brand', 'Category *', 'Price ₹ *', 'Stock', 'Min Stock', 'Unit', ''].map((h, i) => (
                      <th key={i} style={{
                        padding: '10px 10px',
                        fontSize: '10px',
                        fontWeight: '700',
                        textTransform: 'uppercase',
                        color: 'var(--text-muted)',
                        whiteSpace: 'nowrap',
                        textAlign: i === 0 ? 'center' : 'left'
                      }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row, idx) => (
                    <tr key={row._key} style={{
                      borderBottom: '1px solid var(--border)',
                      backgroundColor: idx % 2 === 0 ? '#ffffff' : '#fafafa'
                    }}>
                      {/* Row Number */}
                      <td style={{ padding: '8px 10px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '12px', fontWeight: '700' }}>
                        {idx + 1}
                      </td>

                      {/* Name */}
                      <td style={{ padding: '6px 8px', minWidth: '160px' }}>
                        <input
                          className="input-field"
                          placeholder="Product name"
                          value={row.name}
                          onChange={e => updateRow(row._key, 'name', e.target.value)}
                          style={{ fontSize: '12px', padding: '6px 8px' }}
                        />
                      </td>

                      {/* Barcode */}
                      <td style={{ padding: '6px 8px', minWidth: '160px' }}>
                        <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
                          <input
                            className="input-field"
                            placeholder="Barcode"
                            value={row.barcode}
                            onChange={e => updateRow(row._key, 'barcode', e.target.value)}
                            style={{ fontSize: '11px', padding: '6px 8px', fontFamily: 'monospace', flex: 1 }}
                          />
                          <button
                            onClick={() => generateBarcode(row._key)}
                            title="Auto-generate barcode"
                            style={{
                              padding: '6px 7px',
                              borderRadius: '6px',
                              border: '1px solid var(--border)',
                              backgroundColor: '#eff6ff',
                              cursor: 'pointer',
                              flexShrink: 0
                            }}
                          >
                            <Sparkles size={11} color="var(--primary)" />
                          </button>
                        </div>
                      </td>

                      {/* Brand */}
                      <td style={{ padding: '6px 8px', minWidth: '120px' }}>
                        <input
                          className="input-field"
                          placeholder="Brand"
                          value={row.brand}
                          onChange={e => updateRow(row._key, 'brand', e.target.value)}
                          style={{ fontSize: '12px', padding: '6px 8px' }}
                        />
                      </td>

                      {/* Category */}
                      <td style={{ padding: '6px 8px', minWidth: '120px' }}>
                        <select
                          className="input-field"
                          value={row.category}
                          onChange={e => updateRow(row._key, 'category', e.target.value)}
                          style={{ fontSize: '12px', padding: '6px 8px' }}
                        >
                          {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                      </td>

                      {/* Price */}
                      <td style={{ padding: '6px 8px', minWidth: '90px' }}>
                        <input
                          type="number"
                          className="input-field"
                          placeholder="₹"
                          value={row.price}
                          onChange={e => updateRow(row._key, 'price', e.target.value)}
                          style={{ fontSize: '12px', padding: '6px 8px' }}
                        />
                      </td>

                      {/* Stock */}
                      <td style={{ padding: '6px 8px', minWidth: '80px' }}>
                        <input
                          type="number"
                          className="input-field"
                          placeholder="Qty"
                          value={row.stock}
                          onChange={e => updateRow(row._key, 'stock', e.target.value)}
                          style={{ fontSize: '12px', padding: '6px 8px' }}
                        />
                      </td>

                      {/* Min Stock */}
                      <td style={{ padding: '6px 8px', minWidth: '80px' }}>
                        <input
                          type="number"
                          className="input-field"
                          placeholder="Min"
                          value={row.minimumStock}
                          onChange={e => updateRow(row._key, 'minimumStock', e.target.value)}
                          style={{ fontSize: '12px', padding: '6px 8px' }}
                        />
                      </td>

                      {/* Unit */}
                      <td style={{ padding: '6px 8px', minWidth: '100px' }}>
                        <input
                          className="input-field"
                          placeholder="e.g. 500g"
                          value={row.unit}
                          onChange={e => updateRow(row._key, 'unit', e.target.value)}
                          style={{ fontSize: '12px', padding: '6px 8px' }}
                        />
                      </td>

                      {/* Delete */}
                      <td style={{ padding: '6px 10px', textAlign: 'center' }}>
                        <button
                          onClick={() => deleteRow(row._key)}
                          disabled={rows.length === 1}
                          style={{
                            padding: '6px',
                            borderRadius: '6px',
                            border: 'none',
                            backgroundColor: rows.length === 1 ? '#f1f5f9' : '#fef2f2',
                            cursor: rows.length === 1 ? 'not-allowed' : 'pointer'
                          }}
                        >
                          <Trash2 size={13} color={rows.length === 1 ? '#94a3b8' : 'var(--danger)'} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Add Row Footer */}
            <div style={{ padding: '12px 20px', borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'center' }}>
              <button
                onClick={addRow}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontSize: '13px',
                  fontWeight: '700',
                  color: 'var(--primary)',
                  border: '1px dashed var(--primary)',
                  backgroundColor: '#eff6ff',
                  padding: '8px 20px',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  width: '100%',
                  justifyContent: 'center'
                }}
              >
                <Plus size={15} /> Add Another Product Row
              </button>
            </div>
          </div>
        )}

        {/* Submit Bar */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          backgroundColor: '#ffffff',
          border: '1px solid var(--border)',
          borderRadius: '16px',
          padding: '16px 20px',
          flexWrap: 'wrap',
          gap: '12px'
        }}>
          <div>
            <div style={{ fontWeight: '700', fontSize: '14px', color: 'var(--text-main)' }}>
              Ready to Import {rows.length} Product{rows.length !== 1 ? 's' : ''}
            </div>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>
              Inventory records will be created automatically for each product
            </div>
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              onClick={() => navigate('/admin/products')}
              className="btn btn-secondary"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="btn btn-primary"
              style={{ padding: '10px 24px' }}
            >
              {loading ? 'Importing...' : (
                <>
                  <PackagePlus size={16} /> Import {filledRows.length > 0 ? filledRows.length : rows.length} Products
                </>
              )}
            </button>
          </div>
        </div>

      </div>
    </AdminLayout>
  );
};

export default BulkAddProduct;
