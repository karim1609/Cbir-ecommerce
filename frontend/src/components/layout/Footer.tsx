import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Camera, Mail, ArrowRight } from 'lucide-react';

const CURRENT_YEAR = new Date().getFullYear();

const Footer = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail('');
    }
  };

  const footerColumns = [
    {
      title: 'Shop',
      links: [
        { label: 'All Products', to: '/products' },
        { label: 'Electronics', to: '/products?category=electronics' },
        { label: 'Clothing', to: '/products?category=clothing' },
        { label: 'Shoes', to: '/products?category=shoes' },
        { label: 'Accessories', to: '/products?category=accessories' },
        { label: 'Featured', to: '/products?featured=true' },
      ],
    },
    {
      title: 'Account',
      links: [
        { label: 'Sign In', to: '/login' },
        { label: 'Register', to: '/register' },
        { label: 'My Profile', to: '/profile' },
        { label: 'My Orders', to: '/orders' },
        { label: 'Shopping Cart', to: '/cart' },
        { label: 'Wishlist', to: '/wishlist' },
      ],
    },
    {
      title: 'Help',
      links: [
        { label: 'FAQ', to: '/faq' },
        { label: 'Shipping Info', to: '/shipping' },
        { label: 'Returns & Refunds', to: '/returns' },
        { label: 'Track Order', to: '/track' },
        { label: 'Contact Us', to: '/contact' },
        { label: 'Privacy Policy', to: '/privacy' },
      ],
    },
  ];

  return (
    <footer className="footer-custom">
      <div className="container">
        <div className="row g-4">

          {/* ── Brand Column ── */}
          <div className="col-12 col-md-6 col-lg-3">
            {/* Logo */}
            <div className="d-flex align-items-center gap-2 mb-3">
              <div
                style={{
                  background: 'rgba(255,255,255,0.1)',
                  borderRadius: '10px',
                  padding: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Camera size={20} color="#ffffff" />
              </div>
              <div>
                <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#ffffff', letterSpacing: '-0.02em', lineHeight: 1 }}>
                  LENS
                </div>
                <div style={{ fontSize: '0.6rem', letterSpacing: '0.1em', color: '#64748b', textTransform: 'uppercase' }}>
                  Visual Search
                </div>
              </div>
            </div>

            <p style={{ color: '#94a3b8', fontSize: '0.875rem', lineHeight: 1.7, marginBottom: '1.25rem' }}>
              Shop smarter with AI-powered visual search. Upload any image to instantly discover
              visually similar products from our curated catalog.
            </p>

            {/* Tech badges */}
            <div className="d-flex flex-wrap gap-2">
              {['CBIR', 'AI-Powered', 'Deep Learning'].map(tag => (
                <span
                  key={tag}
                  style={{
                    fontSize: '0.7rem',
                    fontWeight: 600,
                    padding: '3px 10px',
                    borderRadius: '50px',
                    background: 'rgba(37, 99, 235, 0.2)',
                    color: '#93c5fd',
                    letterSpacing: '0.03em',
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* ── Link Columns ── */}
          {footerColumns.map(col => (
            <div key={col.title} className="col-6 col-md-4 col-lg-2">
              <h6 className="footer-heading">{col.title}</h6>
              <ul className="list-unstyled mb-0">
                {col.links.map(link => (
                  <li key={link.label}>
                    <Link to={link.to} className="footer-link">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* ── Technology Column ── */}
          <div className="col-12 col-md-6 col-lg-3">
            <h6 className="footer-heading">Technology</h6>
            <div
              style={{
                background: 'rgba(255,255,255,0.05)',
                borderRadius: '12px',
                padding: '1rem',
                marginBottom: '1.25rem',
                border: '1px solid rgba(255,255,255,0.08)',
              }}
            >
              <div style={{ fontSize: '0.8rem', color: '#94a3b8', lineHeight: 1.7 }}>
                <div style={{ color: '#93c5fd', fontWeight: 600, marginBottom: '0.5rem' }}>
                  🔍 Content-Based Image Retrieval
                </div>
                Our CBIR system uses deep convolutional neural networks to extract visual
                feature vectors, enabling semantic similarity search across the product catalog
                with millisecond response times.
              </div>
            </div>

            {/* Newsletter */}
            <h6 className="footer-heading">Stay Updated</h6>
            {subscribed ? (
              <div
                style={{
                  background: 'rgba(22, 163, 74, 0.15)',
                  border: '1px solid rgba(22, 163, 74, 0.3)',
                  borderRadius: '10px',
                  padding: '0.75rem 1rem',
                  color: '#86efac',
                  fontSize: '0.875rem',
                  fontWeight: 500,
                }}
              >
                ✓ You're subscribed! Thanks for joining.
              </div>
            ) : (
              <form onSubmit={handleSubscribe}>
                <div
                  style={{
                    display: 'flex',
                    background: 'rgba(255,255,255,0.07)',
                    borderRadius: '10px',
                    overflow: 'hidden',
                    border: '1px solid rgba(255,255,255,0.1)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', paddingLeft: '12px' }}>
                    <Mail size={16} color="#64748b" />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="Your email"
                    required
                    style={{
                      flex: 1,
                      background: 'transparent',
                      border: 'none',
                      outline: 'none',
                      padding: '0.6rem 0.75rem',
                      color: '#ffffff',
                      fontSize: '0.85rem',
                    }}
                  />
                  <button
                    type="submit"
                    style={{
                      background: 'var(--primary)',
                      border: 'none',
                      padding: '0.6rem 0.9rem',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: 'var(--transition)',
                    }}
                    onMouseEnter={e => ((e.currentTarget as HTMLElement).style.background = 'var(--primary-dark)')}
                    onMouseLeave={e => ((e.currentTarget as HTMLElement).style.background = 'var(--primary)')}
                  >
                    <ArrowRight size={16} color="#ffffff" />
                  </button>
                </div>
                <p style={{ color: '#64748b', fontSize: '0.75rem', marginTop: '0.4rem', marginBottom: 0 }}>
                  No spam, unsubscribe anytime.
                </p>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* ── Bottom Bar ── */}
      <div className="footer-bottom">
        <div className="container">
          <div className="d-flex flex-column flex-md-row align-items-center justify-content-between gap-2">
            <p style={{ margin: 0, fontSize: '0.85rem', color: '#64748b' }}>
              © {CURRENT_YEAR} LENS Visual Search. All rights reserved.
            </p>
            <div className="d-flex align-items-center gap-3">
              {[
                { label: 'Privacy', to: '/privacy' },
                { label: 'Terms', to: '/terms' },
                { label: 'Cookies', to: '/cookies' },
              ].map(link => (
                <Link
                  key={link.label}
                  to={link.to}
                  style={{ color: '#64748b', fontSize: '0.85rem', transition: 'var(--transition)' }}
                  onMouseEnter={e => ((e.currentTarget as HTMLElement).style.color = '#ffffff')}
                  onMouseLeave={e => ((e.currentTarget as HTMLElement).style.color = '#64748b')}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
