import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Camera, Cpu, Search, ArrowRight, Zap, Package, Star, Truck } from 'lucide-react';
import type { Product, Category } from '../types';
import { getFeaturedProducts, getTrendingProducts, getCategories } from '../services/productService';
import ProductCard from '../components/products/ProductCard';
import LoadingSpinner from '../components/common/LoadingSpinner';

export default function HomePage() {
  const [featured, setFeatured] = useState<Product[]>([]);
  const [trending, setTrending] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getFeaturedProducts(), getTrendingProducts(), getCategories()])
      .then(([f, t, c]) => { setFeatured(f); setTrending(t); setCategories(c); })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      {/* ── HERO ─────────────────────────────────────────── */}
      <section style={{
        minHeight: '88vh',
        background: 'linear-gradient(135deg, #0f172a 0%, #1e3a5f 40%, #2563eb 70%, #7c3aed 100%)',
        display: 'flex', alignItems: 'center', position: 'relative', overflow: 'hidden',
        padding: '4rem 0',
      }}>
        {/* decorative circles */}
        <div style={{ position: 'absolute', top: -100, right: -100, width: 500, height: 500, borderRadius: '50%', background: 'rgba(124,58,237,0.15)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: -50, left: -50, width: 300, height: 300, borderRadius: '50%', background: 'rgba(37,99,235,0.2)', pointerEvents: 'none' }} />
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6 text-white">
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(255,255,255,0.1)', borderRadius: 999, padding: '6px 16px', marginBottom: '1.5rem', fontSize: '0.85rem', border: '1px solid rgba(255,255,255,0.2)' }}>
                <Zap size={14} /> AI-Powered Visual Search
              </div>
              <h1 style={{ fontSize: 'clamp(2.5rem, 5vw, 3.5rem)', fontWeight: 900, lineHeight: 1.1, marginBottom: '1.5rem' }}>
                Discover Products<br />
                <span style={{ background: 'linear-gradient(90deg, #60a5fa, #c084fc)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>by Image</span>
              </h1>
              <p style={{ fontSize: '1.15rem', opacity: 0.85, marginBottom: '2rem', maxWidth: 480, lineHeight: 1.7 }}>
                Upload any product photo and our ResNet50 AI finds visually similar items instantly from thousands of products.
              </p>
              <div className="d-flex flex-wrap gap-3">
                <Link to="/visual-search" className="btn btn-light btn-lg d-flex align-items-center gap-2 fw-semibold" style={{ borderRadius: 12, padding: '0.75rem 1.5rem' }}>
                  <Camera size={20} /> Search by Image
                </Link>
                <Link to="/products" className="btn btn-outline-light btn-lg d-flex align-items-center gap-2" style={{ borderRadius: 12, padding: '0.75rem 1.5rem' }}>
                  Shop All Products <ArrowRight size={18} />
                </Link>
              </div>
              <div style={{ marginTop: '3rem', display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
                {[{ label: '10,000+', desc: 'Products' }, { label: '50+', desc: 'Brands' }, { label: '99%', desc: 'Satisfaction' }].map((stat) => (
                  <div key={stat.label}>
                    <div style={{ fontSize: '1.5rem', fontWeight: 800 }}>{stat.label}</div>
                    <div style={{ fontSize: '0.85rem', opacity: 0.7 }}>{stat.desc}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="col-lg-6 d-none d-lg-flex justify-content-end">
              <div style={{ position: 'relative', width: 420 }}>
                {[
                  { src: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=200&q=80', label: 'Sony Headphones', price: '$299', top: 0, right: 40, delay: '0s' },
                  { src: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=200&q=80', label: 'Nike Air Max', price: '$160', top: 160, right: 0, delay: '0.3s' },
                  { src: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=200&q=80', label: 'Designer Bag', price: '$320', top: 280, right: 80, delay: '0.6s' },
                ].map((card) => (
                  <div key={card.label} style={{
                    position: 'absolute', top: card.top, right: card.right,
                    background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(12px)',
                    border: '1px solid rgba(255,255,255,0.2)', borderRadius: 16,
                    padding: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.75rem',
                    animation: `float 3s ease-in-out infinite alternate`,
                    animationDelay: card.delay,
                    minWidth: 180,
                  }}>
                    <img src={card.src} alt={card.label} style={{ width: 56, height: 56, borderRadius: 10, objectFit: 'cover' }} />
                    <div style={{ color: '#fff' }}>
                      <div style={{ fontWeight: 600, fontSize: '0.85rem' }}>{card.label}</div>
                      <div style={{ fontSize: '0.75rem', opacity: 0.75 }}>{card.price}</div>
                      <div style={{ display: 'flex', gap: 2, marginTop: 2 }}>
                        {[1,2,3,4,5].map(s => <Star key={s} size={10} fill="#f59e0b" color="#f59e0b" />)}
                      </div>
                    </div>
                  </div>
                ))}
                <div style={{ height: 420 }} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ─────────────────────────────────── */}
      <section className="py-5" style={{ background: '#f8fafc' }}>
        <div className="container">
          <div className="text-center mb-5">
            <h2 className="fw-bold mb-2" style={{ fontSize: '2rem' }}>How Visual Search Works</h2>
            <p className="text-muted">Three simple steps to find your perfect product</p>
          </div>
          <div className="row g-4 justify-content-center">
            {[
              { icon: Camera, num: '01', title: 'Upload Image', desc: 'Take a photo or upload any product image — no keywords needed' },
              { icon: Cpu, num: '02', title: 'AI Analysis', desc: 'ResNet50 extracts a 2048-dimensional feature vector from your image' },
              { icon: Search, num: '03', title: 'Find Similar', desc: 'Cosine similarity ranks and retrieves the most visually similar products' },
            ].map((step) => (
              <div key={step.num} className="col-md-4">
                <div style={{ background: '#fff', borderRadius: 20, padding: '2rem', textAlign: 'center', boxShadow: '0 2px 12px rgba(0,0,0,0.06)', height: '100%' }}>
                  <div style={{ width: 72, height: 72, background: 'linear-gradient(135deg, #2563eb, #7c3aed)', borderRadius: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem' }}>
                    <step.icon size={30} color="#fff" />
                  </div>
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#2563eb', letterSpacing: 2, marginBottom: 8 }}>STEP {step.num}</div>
                  <h5 className="fw-bold mb-2">{step.title}</h5>
                  <p className="text-muted small mb-0">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── VISUAL SEARCH CTA ─────────────────────────────── */}
      <section className="py-5" style={{ background: 'linear-gradient(135deg, #1e3a5f, #2563eb)' }}>
        <div className="container">
          <div style={{ background: 'rgba(255,255,255,0.08)', borderRadius: 24, padding: '3rem 2rem', textAlign: 'center', border: '1px solid rgba(255,255,255,0.15)' }}>
            <div style={{ width: 80, height: 80, background: 'rgba(255,255,255,0.15)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
              <Camera size={40} color="#fff" />
            </div>
            <h2 className="text-white fw-bold mb-3" style={{ fontSize: '2.2rem' }}>Try Visual Search Now</h2>
            <p className="mb-4" style={{ color: 'rgba(255,255,255,0.8)', fontSize: '1.05rem', maxWidth: 500, margin: '0 auto 2rem' }}>
              No more searching by words. Just upload an image and let AI do the work. Powered by ResNet50 deep learning.
            </p>
            <Link to="/visual-search" className="btn btn-light btn-lg d-inline-flex align-items-center gap-2 fw-bold" style={{ borderRadius: 12, padding: '0.85rem 2rem' }}>
              <Camera size={20} /> Start Visual Search
            </Link>
          </div>
        </div>
      </section>

      {/* ── CATEGORIES ───────────────────────────────────── */}
      <section className="py-5">
        <div className="container">
          <div className="d-flex align-items-center justify-content-between mb-4 flex-wrap gap-2">
            <div>
              <h2 className="fw-bold mb-1" style={{ fontSize: '1.75rem' }}>Shop by Category</h2>
              <p className="text-muted mb-0">Browse our curated collections</p>
            </div>
            <Link to="/products" className="btn btn-outline-primary d-flex align-items-center gap-1">View All <ArrowRight size={16} /></Link>
          </div>
          {loading ? (
            <LoadingSpinner />
          ) : (
            <div className="row g-3">
              {categories.map((cat) => (
                <div key={cat.id} className="col-6 col-md-4 col-lg-2">
                  <Link to={`/products?category=${cat.slug}`} className="text-decoration-none">
                    <div className="card-hover" style={{ borderRadius: 16, overflow: 'hidden', position: 'relative', cursor: 'pointer', border: '1px solid #e2e8f0' }}>
                      <img src={cat.image} alt={cat.name} style={{ width: '100%', height: 140, objectFit: 'cover', display: 'block' }} loading="lazy" />
                      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.65), transparent)', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', padding: '0.75rem' }}>
                        <div style={{ color: '#fff', fontWeight: 700, fontSize: '0.9rem' }}>{cat.name}</div>
                        <div style={{ color: 'rgba(255,255,255,0.75)', fontSize: '0.75rem' }}>{cat.productCount} items</div>
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── FEATURED PRODUCTS ────────────────────────────── */}
      <section className="py-5" style={{ background: '#f8fafc' }}>
        <div className="container">
          <div className="d-flex align-items-center justify-content-between mb-4 flex-wrap gap-2">
            <div>
              <h2 className="fw-bold mb-1" style={{ fontSize: '1.75rem' }}>Featured Products</h2>
              <p className="text-muted mb-0">Handpicked by our editors</p>
            </div>
            <Link to="/products" className="btn btn-outline-primary d-flex align-items-center gap-1">View All <ArrowRight size={16} /></Link>
          </div>
          {loading ? (
            <LoadingSpinner />
          ) : (
            <div className="row g-3">
              {featured.map((product) => (
                <div key={product.id} className="col-6 col-md-4 col-lg-3 col-xl-2">
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── TRENDING ─────────────────────────────────────── */}
      <section className="py-5">
        <div className="container">
          <div className="d-flex align-items-center justify-content-between mb-4 flex-wrap gap-2">
            <div>
              <h2 className="fw-bold mb-1" style={{ fontSize: '1.75rem' }}>🔥 Trending Now</h2>
              <p className="text-muted mb-0">What people are loving right now</p>
            </div>
            <Link to="/products" className="btn btn-outline-primary d-flex align-items-center gap-1">See All <ArrowRight size={16} /></Link>
          </div>
          {loading ? (
            <LoadingSpinner />
          ) : (
            <div className="row g-3">
              {trending.map((product) => (
                <div key={product.id} className="col-6 col-md-4 col-lg-3">
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── STATS ────────────────────────────────────────── */}
      <section className="py-4" style={{ background: '#0f172a' }}>
        <div className="container">
          <div className="row g-3 text-center text-white">
            {[
              { icon: Package, label: '10,000+', desc: 'Products' },
              { icon: Star, label: '50+ Brands', desc: 'Top Brands' },
              { icon: Camera, label: 'AI Search', desc: 'Visual Discovery' },
              { icon: Truck, label: 'Free Delivery', desc: 'Orders over $50' },
            ].map((stat) => (
              <div key={stat.label} className="col-6 col-md-3">
                <stat.icon size={28} style={{ opacity: 0.6, marginBottom: 8 }} />
                <div style={{ fontSize: '1.4rem', fontWeight: 800 }}>{stat.label}</div>
                <div style={{ fontSize: '0.85rem', opacity: 0.6 }}>{stat.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <style>{`
        @keyframes float {
          from { transform: translateY(0); }
          to { transform: translateY(-12px); }
        }
      `}</style>
    </div>
  );
}
