import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Check, Sparkles } from 'lucide-react';
import { useCart } from '../../context/CartContext';

const ProductCard = ({ product, reason }) => {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [adding, setAdding] = useState(false);
  const [added, setAdded] = useState(false);

  const handleAdd = async (e) => {
    e.stopPropagation();
    if (product.stock <= 0) return;
    setAdding(true);
    try {
      await addToCart(product._id, 1);
      setAdded(true);
      setTimeout(() => setAdded(false), 1200);
    } catch (err) {
      console.error(err);
    } finally {
      setAdding(false);
    }
  };

  const isOutOfStock = product.stock <= 0;

  return (
    <div
      onClick={() => navigate(`/product/${product._id}`)}
      style={{
        backgroundColor: '#ffffff',
        borderRadius: '16px',
        border: '1px solid #e2e8f0',
        padding: '12px',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        cursor: 'pointer',
        transition: 'transform 0.15s, box-shadow 0.15s',
        boxShadow: 'var(--shadow-sm)'
      }}
      onMouseEnter={e => {
        e.currentTarget.style.transform = 'translateY(-2px)';
        e.currentTarget.style.boxShadow = 'var(--shadow-md)';
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
      }}
    >
      {/* Smart recommendation badge if present */}
      {reason && (
        <div style={{
          position: 'absolute',
          top: '8px',
          left: '8px',
          backgroundColor: '#eff6ff',
          color: 'var(--primary)',
          fontSize: '9px',
          fontWeight: '700',
          padding: '2px 6px',
          borderRadius: '999px',
          display: 'flex',
          alignItems: 'center',
          gap: '3px',
          zIndex: 2,
          border: '1px solid #bfdbfe'
        }}>
          <Sparkles size={10} /> {reason.length > 22 ? reason.substring(0, 20) + '...' : reason}
        </div>
      )}

      {/* Product Image Container */}
      <div style={{
        width: '100%',
        height: '110px',
        borderRadius: '12px',
        backgroundColor: '#f8fafc',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: '10px',
        position: 'relative'
      }}>
        <img
          src={product.image}
          alt={product.name}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover'
          }}
          loading="lazy"
        />
        {isOutOfStock && (
          <div style={{
            position: 'absolute',
            inset: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.6)',
            color: '#ffffff',
            fontSize: '11px',
            fontWeight: '700',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backdropFilter: 'blur(2px)'
          }}>
            Out of Stock
          </div>
        )}
      </div>

      {/* Details */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <div style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: '600', letterSpacing: '0.04em' }}>
          {product.brand} &bull; {product.category}
        </div>

        <h4 style={{
          fontSize: '12px',
          fontWeight: '600',
          color: 'var(--text-main)',
          margin: '2px 0 6px 0',
          lineHeight: '1.3',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden'
        }}>
          {product.name}
        </h4>

        <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '4px' }}>
          <div>
            <span style={{ fontSize: '14px', fontWeight: '800', color: 'var(--text-main)' }}>
              ₹{product.price}
            </span>
            <div style={{ fontSize: '10px', color: 'var(--text-subtle)' }}>
              {product.unit}
            </div>
          </div>

          <button
            onClick={handleAdd}
            disabled={isOutOfStock || adding}
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              backgroundColor: added ? 'var(--secondary)' : isOutOfStock ? '#e2e8f0' : 'var(--primary)',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.2s',
              boxShadow: added ? '0 2px 6px rgba(16, 185, 129, 0.4)' : isOutOfStock ? 'none' : '0 2px 6px rgba(37, 99, 235, 0.3)'
            }}
            title={isOutOfStock ? 'Out of stock' : 'Add to cart'}
          >
            {added ? <Check size={16} /> : <Plus size={16} />}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
