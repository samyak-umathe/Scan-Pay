import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, ShoppingCart, Minus, Plus, Check, ShieldCheck, Tag, Barcode } from 'lucide-react';
import { productService } from '../../services/productService';
import { useCart } from '../../context/CartContext';
import MobileLayout from '../../components/common/MobileLayout';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [error, setError] = useState('');
  const [adding, setAdding] = useState(false);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const data = await productService.getById(id);
      setProduct(data);
    } catch (err) {
      setError('Product not found or unavailable');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async () => {
    if (!product || product.stock <= 0) return;
    setAdding(true);
    try {
      await addToCart(product._id, quantity);
      setAdded(true);
      setTimeout(() => {
        navigate('/cart');
      }, 700);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to add item to cart');
    } finally {
      setAdding(false);
    }
  };

  if (loading) {
    return (
      <MobileLayout hideNav={false}>
        <div style={{ textAlign: 'center', padding: '60px 16px', color: 'var(--text-muted)' }}>
          Loading item details...
        </div>
      </MobileLayout>
    );
  }

  if (error || !product) {
    return (
      <MobileLayout hideNav={false}>
        <div style={{ padding: '24px', textAlign: 'center' }}>
          <p style={{ color: 'var(--danger)', fontWeight: '600', marginBottom: '16px' }}>{error}</p>
          <button className="btn btn-primary" onClick={() => navigate('/')}>
            Back to Store
          </button>
        </div>
      </MobileLayout>
    );
  }

  const isAvailable = product.stock > 0;
  const isLowStock = product.stock > 0 && product.stock <= product.minimumStock;

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
        <h2 style={{ fontSize: '15px', fontWeight: '700', color: 'var(--text-main)' }}>
          Item Details
        </h2>
      </div>

      <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {/* Product Image Stage */}
        <div style={{
          backgroundColor: '#ffffff',
          borderRadius: '24px',
          border: '1px solid #e2e8f0',
          padding: '20px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '220px',
          boxShadow: 'var(--shadow-sm)',
          position: 'relative'
        }}>
          <img
            src={product.image}
            alt={product.name}
            style={{
              maxHeight: '180px',
              maxWidth: '100%',
              objectFit: 'contain'
            }}
          />

          {/* Availability Badge */}
          <div style={{
            position: 'absolute',
            bottom: '12px',
            right: '12px'
          }}>
            <span className={`badge ${!isAvailable ? 'badge-danger' : isLowStock ? 'badge-warning' : 'badge-success'}`}>
              {!isAvailable ? 'Out of Stock' : isLowStock ? `Low Stock (${product.stock} left)` : `In Stock (${product.stock})`}
            </span>
          </div>
        </div>

        {/* Pricing & Title Card */}
        <div style={{
          backgroundColor: '#ffffff',
          borderRadius: '20px',
          border: '1px solid #e2e8f0',
          padding: '18px',
          boxShadow: 'var(--shadow-sm)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
            <div>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: '700', letterSpacing: '0.04em' }}>
                {product.brand} &bull; {product.category}
              </span>
              <h3 style={{ fontSize: '16px', fontWeight: '800', color: 'var(--text-main)', marginTop: '2px', lineHeight: '1.3' }}>
                {product.name}
              </h3>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '20px', fontWeight: '800', color: 'var(--primary)' }}>
                ₹{product.price}
              </div>
              <span style={{ fontSize: '11px', color: 'var(--text-subtle)' }}>
                /{product.unit}
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: 'var(--text-muted)', marginTop: '8px', paddingTop: '8px', borderTop: '1px solid #f1f5f9' }}>
            <Barcode size={14} /> Barcode: <span style={{ fontFamily: 'monospace', fontWeight: '600' }}>{product.barcode}</span>
          </div>
        </div>

        {/* Description Card */}
        <div style={{
          backgroundColor: '#ffffff',
          borderRadius: '16px',
          border: '1px solid #e2e8f0',
          padding: '16px'
        }}>
          <h4 style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-main)', marginBottom: '6px' }}>
            Product Description
          </h4>
          <p style={{ fontSize: '12px', color: 'var(--text-muted)', lineHeight: '1.5' }}>
            {product.description}
          </p>
        </div>

        {/* Quantity and Add to Cart action */}
        {isAvailable ? (
          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: '16px',
            border: '1px solid #e2e8f0',
            padding: '14px',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-main)' }}>Select Quantity</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '8px',
                    backgroundColor: '#f1f5f9',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--text-main)'
                  }}
                >
                  <Minus size={14} />
                </button>
                <span style={{ fontSize: '15px', fontWeight: '800', minWidth: '20px', textAlign: 'center' }}>
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '8px',
                    backgroundColor: '#f1f5f9',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--text-main)'
                  }}
                >
                  <Plus size={14} />
                </button>
              </div>
            </div>

            <button
              onClick={handleAddToCart}
              disabled={adding}
              className="btn btn-primary"
              style={{ width: '100%', padding: '12px', borderRadius: '12px', fontSize: '14px' }}
            >
              {added ? (
                <>
                  <Check size={18} /> Added to Cart!
                </>
              ) : (
                <>
                  <ShoppingCart size={18} /> Add to Cart &bull; ₹{product.price * quantity}
                </>
              )}
            </button>
          </div>
        ) : (
          <div style={{
            padding: '14px',
            backgroundColor: '#fef2f2',
            color: 'var(--danger)',
            borderRadius: '14px',
            textAlign: 'center',
            fontSize: '13px',
            fontWeight: '600'
          }}>
            Currently Out of Stock
          </div>
        )}
      </div>
    </MobileLayout>
  );
};

export default ProductDetails;
