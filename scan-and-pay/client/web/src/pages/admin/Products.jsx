import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Package,
  PackagePlus,
  Plus,
  Search,
  Pencil,
  Trash2,
  Barcode,
  Tag,
  AlertCircle,
  Check,
  X
} from 'lucide-react';
import { productService } from '../../services/productService';
import AdminLayout from './AdminLayout';

const CATEGORIES = ['All', 'Dairy', 'Bakery', 'Beverages', 'Snacks', 'Grains', 'Grocery', 'Personal Care', 'Household', 'Breakfast', 'Spreads'];

const Products = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  
  // Edit modal state
  const [editingProduct, setEditingProduct] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const data = await productService.getAll();
      setProducts(data || []);
    } catch (err) {
      console.error('Failed to load products', err);
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = (p) => {
    setEditingProduct(p);
    setEditForm({
      name: p.name,
      barcode: p.barcode,
      category: p.category,
      brand: p.brand,
      description: p.description,
      price: p.price,
      image: p.image,
      stock: p.stock,
      minimumStock: p.minimumStock,
      unit: p.unit
    });
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const updated = await productService.update(editingProduct._id, editForm);
      setProducts(prev => prev.map(p => p._id === editingProduct._id ? updated : p));
      setEditingProduct(null);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update product');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    setDeletingId(id);
    try {
      await productService.delete(id);
      setProducts(prev => prev.filter(p => p._id !== id));
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete product');
    } finally {
      setDeletingId(null);
    }
  };

  const filtered = products.filter(p => {
    const matchesCat = categoryFilter === 'All' || p.category === categoryFilter;
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.barcode.includes(searchQuery) ||
                          p.brand.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <AdminLayout title="Product Catalog Management">
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {/* Top Control Bar */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '12px'
        }}>
          {/* Search & Category Filter */}
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap', flex: 1 }}>
            <div style={{ position: 'relative', width: '280px' }}>
              <Search size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '12px' }} />
              <input
                type="text"
                className="input-field"
                placeholder="Search by name, barcode, brand..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ paddingLeft: '36px', fontSize: '13px' }}
              />
            </div>

            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="input-field"
              style={{ width: '160px', fontSize: '13px' }}
            >
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={() => navigate('/admin/products/bulk')}
              className="btn btn-secondary"
              style={{ fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <PackagePlus size={15} /> Bulk Import
            </button>
            <button
              onClick={() => navigate('/admin/products/add')}
              className="btn btn-primary"
              style={{ fontSize: '13px' }}
            >
              <Plus size={16} /> Add Product
            </button>
          </div>
        </div>

        {/* Products Table */}
        <div className="card" style={{ padding: '0', overflow: 'hidden' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
              <thead>
                <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid var(--border)' }}>
                  <th style={{ padding: '14px 16px', fontWeight: '700', color: 'var(--text-muted)', fontSize: '11px', textTransform: 'uppercase' }}>Product</th>
                  <th style={{ padding: '14px 16px', fontWeight: '700', color: 'var(--text-muted)', fontSize: '11px', textTransform: 'uppercase' }}>Barcode</th>
                  <th style={{ padding: '14px 16px', fontWeight: '700', color: 'var(--text-muted)', fontSize: '11px', textTransform: 'uppercase' }}>Category</th>
                  <th style={{ padding: '14px 16px', fontWeight: '700', color: 'var(--text-muted)', fontSize: '11px', textTransform: 'uppercase' }}>Price</th>
                  <th style={{ padding: '14px 16px', fontWeight: '700', color: 'var(--text-muted)', fontSize: '11px', textTransform: 'uppercase' }}>Stock</th>
                  <th style={{ padding: '14px 16px', fontWeight: '700', color: 'var(--text-muted)', fontSize: '11px', textTransform: 'uppercase', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={6} style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                      Loading store catalog...
                    </td>
                  </tr>
                ) : filtered.length === 0 ? (
                  <tr>
                    <td colSpan={6} style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                      No matching products found.
                    </td>
                  </tr>
                ) : (
                  filtered.map((p) => {
                    const isLow = p.stock <= p.minimumStock;
                    const isCritical = p.stock <= 0;
                    return (
                      <tr
                        key={p._id}
                        style={{ borderBottom: '1px solid var(--border)', transition: 'background-color 0.15s' }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f8fafc'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                      >
                        {/* Product Image & Name */}
                        <td style={{ padding: '12px 16px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <img
                              src={p.image}
                              alt={p.name}
                              style={{ width: '40px', height: '40px', borderRadius: '8px', objectFit: 'cover', border: '1px solid var(--border)' }}
                            />
                            <div>
                              <div style={{ fontWeight: '700', color: 'var(--text-main)' }}>{p.name}</div>
                              <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{p.brand} &bull; {p.unit}</div>
                            </div>
                          </div>
                        </td>

                        {/* Barcode */}
                        <td style={{ padding: '12px 16px', fontFamily: 'monospace', fontWeight: '600' }}>
                          {p.barcode}
                        </td>

                        {/* Category */}
                        <td style={{ padding: '12px 16px' }}>
                          <span style={{ backgroundColor: '#f1f5f9', padding: '4px 8px', borderRadius: '6px', fontSize: '11px', fontWeight: '600' }}>
                            {p.category}
                          </span>
                        </td>

                        {/* Price */}
                        <td style={{ padding: '12px 16px', fontWeight: '700' }}>
                          ₹{p.price}
                        </td>

                        {/* Stock */}
                        <td style={{ padding: '12px 16px' }}>
                          <span className={`badge ${isCritical ? 'badge-danger' : isLow ? 'badge-warning' : 'badge-success'}`}>
                            {p.stock} units
                          </span>
                        </td>

                        {/* Actions */}
                        <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                          <div style={{ display: 'inline-flex', gap: '6px' }}>
                            <button
                              onClick={() => handleEditClick(p)}
                              style={{
                                padding: '6px',
                                borderRadius: '6px',
                                backgroundColor: '#eff6ff',
                                color: 'var(--primary)'
                              }}
                              title="Edit product"
                            >
                              <Pencil size={15} />
                            </button>
                            <button
                              onClick={() => handleDelete(p._id)}
                              disabled={deletingId === p._id}
                              style={{
                                padding: '6px',
                                borderRadius: '6px',
                                backgroundColor: '#fef2f2',
                                color: 'var(--danger)'
                              }}
                              title="Delete product"
                            >
                              <Trash2 size={15} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Edit Modal */}
        {editingProduct && (
          <div style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.6)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 100,
            padding: '20px'
          }}>
            <div className="card" style={{
              width: '100%',
              maxWidth: '540px',
              maxHeight: '90vh',
              overflowY: 'auto',
              backgroundColor: '#ffffff'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h3 style={{ fontSize: '16px', fontWeight: '800', color: 'var(--text-main)' }}>
                  Edit Product Details
                </h3>
                <button onClick={() => setEditingProduct(null)} style={{ color: 'var(--text-muted)' }}>
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSaveEdit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '11px', fontWeight: '600', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Product Name</label>
                  <input
                    type="text"
                    className="input-field"
                    value={editForm.name}
                    onChange={e => setEditForm({ ...editForm, name: e.target.value })}
                    required
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div>
                    <label style={{ fontSize: '11px', fontWeight: '600', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Barcode</label>
                    <input
                      type="text"
                      className="input-field"
                      value={editForm.barcode}
                      onChange={e => setEditForm({ ...editForm, barcode: e.target.value })}
                      required
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: '11px', fontWeight: '600', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Category</label>
                    <select
                      className="input-field"
                      value={editForm.category}
                      onChange={e => setEditForm({ ...editForm, category: e.target.value })}
                    >
                      {CATEGORIES.filter(c => c !== 'All').map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
                  <div>
                    <label style={{ fontSize: '11px', fontWeight: '600', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Price (₹)</label>
                    <input
                      type="number"
                      className="input-field"
                      value={editForm.price}
                      onChange={e => setEditForm({ ...editForm, price: parseFloat(e.target.value) || 0 })}
                      required
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: '11px', fontWeight: '600', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Stock</label>
                    <input
                      type="number"
                      className="input-field"
                      value={editForm.stock}
                      onChange={e => setEditForm({ ...editForm, stock: parseInt(e.target.value) || 0 })}
                      required
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: '11px', fontWeight: '600', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Min Stock</label>
                    <input
                      type="number"
                      className="input-field"
                      value={editForm.minimumStock}
                      onChange={e => setEditForm({ ...editForm, minimumStock: parseInt(e.target.value) || 0 })}
                      required
                    />
                  </div>
                </div>

                <div>
                  <label style={{ fontSize: '11px', fontWeight: '600', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Image URL</label>
                  <input
                    type="url"
                    className="input-field"
                    value={editForm.image}
                    onChange={e => setEditForm({ ...editForm, image: e.target.value })}
                    required
                  />
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '12px' }}>
                  <button type="button" className="btn btn-secondary" onClick={() => setEditingProduct(null)}>
                    Cancel
                  </button>
                  <button type="submit" disabled={saving} className="btn btn-primary">
                    {saving ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default Products;
