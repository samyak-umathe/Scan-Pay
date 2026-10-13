import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { productService } from '../../services/productService';
import { recommendationService } from '../../services/recommendationService';
import MobileLayout from '../../components/common/MobileLayout';
import CustomerHeader from '../../components/navbar/CustomerHeader';
import ProductCard from '../../components/product/ProductCard';
import { ScanBarcode, Search, Sparkles, Zap, ChevronRight } from 'lucide-react';

const CATEGORIES = ['All', 'Dairy', 'Bakery', 'Beverages', 'Snacks', 'Grains', 'Grocery', 'Personal Care', 'Household'];

const Home = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [prodData, recData] = await Promise.all([
        productService.getAll(),
        recommendationService.getRecommendations().catch(() => [])
      ]);
      setProducts(prodData || []);
      setRecommendations(recData || []);
    } catch (err) {
      console.error('Error fetching home data', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = products.filter(p => {
    const matchesCat = selectedCategory === 'All' || p.category === selectedCategory;
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <MobileLayout>
      <CustomerHeader />

      <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {/* Welcome Text */}
        <div>
          <h2 style={{ fontSize: '18px', fontWeight: '800', color: 'var(--text-main)' }}>
            Welcome, {user?.name?.split(' ')[0] || 'Shopper'} 👋
          </h2>
          <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
            Scan barcodes in-store and skip checkout lines.
          </p>
        </div>

        {/* Hero Scan Banner */}
        <div style={{
          background: 'linear-gradient(135deg, #7c0606ff 0%, #fe5623ff 60%, #f1881fff 100%)',
          borderRadius: '20px',
          padding: '18px',
          color: '#ffffff',
          boxShadow: '0 8px 24px rgba(37, 99, 235, 0.25)',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{ position: 'relative', zIndex: 2 }}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              backdropFilter: 'blur(4px)',
              padding: '3px 8px',
              borderRadius: '999px',
              fontSize: '10px',
              fontWeight: '700',
              marginBottom: '8px'
            }}>
              <Zap size={12} color="#fef08a" /> 0-SECOND QUEUE
            </div>
            <h3 style={{ fontSize: '16px', fontWeight: '800', lineHeight: 1.2, marginBottom: '6px' }}>
              Scan Barcode on Item
            </h3>
            <p style={{ fontSize: '11px', opacity: 0.9, marginBottom: '14px', maxWidth: '200px' }}>
              Aim your camera at any product barcode to add to virtual cart.
            </p>
            <button
              onClick={() => navigate('/scan')}
              style={{
                backgroundColor: '#ffffff',
                color: 'var(--primary)',
                padding: '8px 16px',
                borderRadius: '10px',
                fontSize: '12px',
                fontWeight: '700',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                boxShadow: '0 2px 6px rgba(0,0,0,0.1)'
              }}
            >
              <ScanBarcode size={16} /> Open Scanner
            </button>
          </div>

          <div style={{
            position: 'absolute',
            right: '-10px',
            bottom: '-10px',
            opacity: 0.15,
            fontSize: '90px',
            lineHeight: 1,
            userSelect: 'none'
          }}>
            ▦
          </div>
        </div>

        {/* Search Bar */}
        <div style={{
          position: 'relative',
          display: 'flex',
          alignItems: 'center'
        }}>
          <Search size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '12px' }} />
          <input
            type="text"
            className="input-field"
            placeholder="Search milk, bread, snacks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ paddingLeft: '36px', fontSize: '13px', borderRadius: '12px' }}
          />
        </div>

        {/* Category Pills */}
        <div style={{
          display: 'flex',
          gap: '6px',
          overflowX: 'auto',
          paddingBottom: '4px',
          margin: '0 -16px',
          paddingLeft: '16px',
          paddingRight: '16px'
        }}>
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              style={{
                padding: '6px 12px',
                borderRadius: '999px',
                fontSize: '11px',
                fontWeight: selectedCategory === cat ? '700' : '500',
                backgroundColor: selectedCategory === cat ? 'var(--primary)' : '#ffffff',
                color: selectedCategory === cat ? '#ffffff' : 'var(--text-main)',
                border: '1px solid',
                borderColor: selectedCategory === cat ? 'var(--primary)' : '#e2e8f0',
                whiteSpace: 'nowrap',
                transition: 'all 0.15s'
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Smart Personalized Recommendations Section */}
        {recommendations.length > 0 && selectedCategory === 'All' && !searchQuery && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Sparkles size={16} color="var(--primary)" />
                <h3 style={{ fontSize: '14px', fontWeight: '700', color: 'var(--text-main)' }}>
                  Recommended For You
                </h3>
              </div>
              <span style={{ fontSize: '10px', color: 'var(--text-muted)', fontWeight: '600' }}>Smart Engine</span>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '10px'
            }}>
              {recommendations.slice(0, 4).map(({ product, reason }) => (
                <ProductCard key={product._id} product={product} reason={reason} />
              ))}
            </div>
          </div>
        )}

        {/* All Products Section */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <h3 style={{ fontSize: '14px', fontWeight: '700', color: 'var(--text-main)' }}>
              {selectedCategory === 'All' ? 'Store Products' : `${selectedCategory} Items`}
            </h3>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{filteredProducts.length} items</span>
          </div>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '32px', color: 'var(--text-muted)', fontSize: '13px' }}>
              Loading grocery items...
            </div>
          ) : filteredProducts.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '32px 16px', backgroundColor: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
              <p style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-main)' }}>No products found</p>
              <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>Try searching for something else or clear filters.</p>
            </div>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '10px'
            }}>
              {filteredProducts.map(product => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </MobileLayout>
  );
};

export default Home;
