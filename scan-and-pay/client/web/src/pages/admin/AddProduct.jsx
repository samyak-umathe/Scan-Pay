import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, PlusCircle, Barcode, Image as ImageIcon, Sparkles, Check } from 'lucide-react';
import { productService } from '../../services/productService';
import AdminLayout from './AdminLayout';

const CATEGORIES = ['Dairy', 'Bakery', 'Beverages', 'Snacks', 'Grains', 'Grocery', 'Personal Care', 'Household', 'Breakfast', 'Spreads'];

const AddProduct = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    barcode: '',
    brand: '',
    category: 'Dairy',
    description: '',
    price: '',
    stock: '',
    minimumStock: 10,
    unit: '1 Pack',
    image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=400&q=80'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const generateBarcode = () => {
    const code = '890' + Math.floor(1000000000 + Math.random() * 9000000000).toString().substring(0, 10);
    setFormData(prev => ({ ...prev, barcode: code }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.barcode || !formData.price || !formData.stock) {
      setError('Please fill in all mandatory product details.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await productService.create({
        ...formData,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock),
        minimumStock: parseInt(formData.minimumStock)
      });
      navigate('/admin/products');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create product. Barcode might be duplicate.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout title="Add New Product to Store">
      <div style={{ maxWidth: '800px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {/* Back navigation */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button
            onClick={() => navigate('/admin/products')}
            style={{
              padding: '6px 12px',
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
            <ArrowLeft size={16} /> Back to Catalog
          </button>
        </div>

        {/* Card Form */}
        <div className="card" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: '800', color: 'var(--text-main)', marginBottom: '16px' }}>
            Product Information
          </h3>

          {error && (
            <div style={{
              padding: '12px',
              backgroundColor: '#fef2f2',
              border: '1px solid #fecaca',
              color: 'var(--danger)',
              borderRadius: '12px',
              fontSize: '12px',
              marginBottom: '16px'
            }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* Name */}
            <div>
              <label style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>
                Product Name *
              </label>
              <input
                type="text"
                className="input-field"
                placeholder="e.g. Amul Taaza Homogenised Milk"
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>

            {/* Barcode with Auto-Generate helper */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <label style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-muted)' }}>
                  Barcode (EAN-13 / Code-128) *
                </label>
                <button
                  type="button"
                  onClick={generateBarcode}
                  style={{
                    fontSize: '11px',
                    color: 'var(--primary)',
                    fontWeight: '700',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  <Sparkles size={12} /> Auto-Generate Barcode
                </button>
              </div>
              <div style={{ position: 'relative' }}>
                <Barcode size={18} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '12px' }} />
                <input
                  type="text"
                  className="input-field"
                  placeholder="e.g. 8901030000099"
                  value={formData.barcode}
                  onChange={e => setFormData({ ...formData, barcode: e.target.value })}
                  style={{ paddingLeft: '38px', fontFamily: 'monospace', fontSize: '13px' }}
                  required
                />
              </div>
            </div>

            {/* Category & Brand */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <label style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>
                  Category *
                </label>
                <select
                  className="input-field"
                  value={formData.category}
                  onChange={e => setFormData({ ...formData, category: e.target.value })}
                >
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>
                  Brand *
                </label>
                <input
                  type="text"
                  className="input-field"
                  placeholder="e.g. Amul, Britannia, Nestle"
                  value={formData.brand}
                  onChange={e => setFormData({ ...formData, brand: e.target.value })}
                  required
                />
              </div>
            </div>

            {/* Price, Stock, Minimum Stock, Unit */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
              <div>
                <label style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>
                  Price (₹) *
                </label>
                <input
                  type="number"
                  step="0.01"
                  className="input-field"
                  placeholder="60"
                  value={formData.price}
                  onChange={e => setFormData({ ...formData, price: e.target.value })}
                  required
                />
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>
                  Initial Stock *
                </label>
                <input
                  type="number"
                  className="input-field"
                  placeholder="50"
                  value={formData.stock}
                  onChange={e => setFormData({ ...formData, stock: e.target.value })}
                  required
                />
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>
                  Min Safety Stock
                </label>
                <input
                  type="number"
                  className="input-field"
                  placeholder="10"
                  value={formData.minimumStock}
                  onChange={e => setFormData({ ...formData, minimumStock: e.target.value })}
                  required
                />
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>
                  Unit / Pack
                </label>
                <input
                  type="text"
                  className="input-field"
                  placeholder="1 Litre / 500g"
                  value={formData.unit}
                  onChange={e => setFormData({ ...formData, unit: e.target.value })}
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>
                Description
              </label>
              <textarea
                className="input-field"
                rows={3}
                placeholder="Product highlights, ingredients, weight..."
                value={formData.description}
                onChange={e => setFormData({ ...formData, description: e.target.value })}
              />
            </div>

            {/* Image URL & Live Preview */}
            <div>
              <label style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>
                Product Image URL
              </label>
              <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                <input
                  type="url"
                  className="input-field"
                  placeholder="https://images.unsplash.com/..."
                  value={formData.image}
                  onChange={e => setFormData({ ...formData, image: e.target.value })}
                  style={{ flex: 1 }}
                  required
                />
                {formData.image && (
                  <img
                    src={formData.image}
                    alt="Preview"
                    style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: '8px',
                      objectFit: 'cover',
                      border: '1px solid var(--border)'
                    }}
                  />
                )}
              </div>
            </div>

            {/* Action buttons */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '12px' }}>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => navigate('/admin/products')}
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary"
              >
                {loading ? 'Creating...' : (
                  <>
                    <PlusCircle size={16} /> Save & Add to Inventory
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AddProduct;
