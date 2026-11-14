import { Outlet, Link } from 'react-router-dom';
import { Camera } from 'lucide-react';

const AuthLayout = () => {
  return (
    <div className="auth-layout">
      {/* Left branding panel */}
      <div className="auth-brand-panel d-none d-md-flex">
        <div className="text-center">
          {/* Logo */}
          <div className="d-flex align-items-center justify-content-center gap-2 mb-4">
            <div
              style={{
                background: 'rgba(255,255,255,0.15)',
                borderRadius: '16px',
                padding: '12px',
                backdropFilter: 'blur(8px)',
              }}
            >
              <Camera size={32} color="#ffffff" />
            </div>
            <div className="text-start">
              <div style={{ fontSize: '1.8rem', fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 1 }}>
                LENS
              </div>
              <div style={{ fontSize: '0.7rem', letterSpacing: '0.12em', textTransform: 'uppercase', opacity: 0.7 }}>
                Visual Search
              </div>
            </div>
          </div>

          {/* Tagline */}
          <h2 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '1rem', lineHeight: 1.3 }}>
            Find products by
            <br />
            <span style={{ color: '#93c5fd' }}>what you see</span>
          </h2>
          <p style={{ opacity: 0.75, fontSize: '1rem', maxWidth: '340px', lineHeight: 1.7 }}>
            Our AI-powered visual search lets you snap a photo and instantly discover
            visually similar products from thousands of items.
          </p>

          {/* Feature bullets */}
          <div className="mt-4" style={{ textAlign: 'left', maxWidth: '320px' }}>
            {[
              '📸 Upload any image to search',
              '🎯 AI-powered similarity matching',
              '🛍️ Discover visually similar products',
              '⚡ Results in under 2 seconds',
            ].map((feature, i) => (
              <div
                key={i}
                className="d-flex align-items-center gap-2 mb-2"
                style={{ opacity: 0.85, fontSize: '0.9rem' }}
              >
                <span>{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right form panel */}
      <div className="auth-form-panel">
        <div style={{ width: '100%', maxWidth: '440px' }}>
          {/* Mobile logo */}
          <div className="d-flex d-md-none align-items-center justify-content-center gap-2 mb-4">
            <div
              style={{
                background: 'var(--primary)',
                borderRadius: '12px',
                padding: '8px',
              }}
            >
              <Camera size={24} color="#ffffff" />
            </div>
            <div>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--primary)', lineHeight: 1 }}>
                LENS
              </div>
              <div style={{ fontSize: '0.6rem', letterSpacing: '0.1em', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>
                Visual Search
              </div>
            </div>
          </div>

          {/* Auth Card */}
          <div className="auth-card">
            <Outlet />
          </div>

          {/* Back to home */}
          <div className="text-center mt-3">
            <Link
              to="/"
              style={{
                fontSize: '0.85rem',
                color: 'var(--text-secondary)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
              }}
            >
              ← Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
