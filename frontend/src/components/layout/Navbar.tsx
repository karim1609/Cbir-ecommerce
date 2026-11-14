import { useState, useEffect, useRef } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import {
  Camera,
  ShoppingCart,
  User,
  Menu,
  X,
  LogOut,
  Package,
  Settings,
} from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { cart } = useCart();
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const cartItemCount = cart?.items?.reduce((acc, item) => acc + item.quantity, 0) ?? 0;

  // Scroll shadow
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await logout();
    setIsDropdownOpen(false);
    navigate('/');
  };

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `nav-link-custom${isActive ? ' active' : ''}`;

  return (
    <nav
      className={`navbar-custom sticky-top w-100${isScrolled ? ' scrolled' : ''}`}
      style={{ zIndex: 1030 }}
    >
      <div className="container">
        <div className="d-flex align-items-center justify-content-between w-100" style={{ gap: '1rem' }}>

          {/* ── Logo ── */}
          <Link to="/" className="navbar-brand-logo text-decoration-none">
            <div
              style={{
                background: 'var(--primary)',
                borderRadius: '10px',
                padding: '7px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Camera size={20} color="#ffffff" />
            </div>
            <div>
              <span style={{ display: 'block', lineHeight: 1 }}>LENS</span>
              <span className="brand-subtitle">Visual Search</span>
            </div>
          </Link>

          {/* ── Desktop Nav Links ── */}
          <div className="d-none d-lg-flex align-items-center" style={{ gap: '4px' }}>
            <NavLink to="/" end className={navLinkClass} style={{ padding: '0.4rem 0.75rem' }}>
              Home
            </NavLink>
            <NavLink to="/products" className={navLinkClass} style={{ padding: '0.4rem 0.75rem' }}>
              Products
            </NavLink>
            <NavLink
              to="/search"
              className={({ isActive }) =>
                `nav-link-custom nav-link-visual-search${isActive ? ' active' : ''}`
              }
              style={{ padding: '0.4rem 0.75rem' }}
            >
              <Camera size={15} style={{ marginRight: '5px', verticalAlign: 'middle' }} />
              Visual Search
            </NavLink>
          </div>

          {/* ── Right Side ── */}
          <div className="d-flex align-items-center" style={{ gap: '8px' }}>

            {/* Cart */}
            <Link
              to="/cart"
              style={{ position: 'relative', display: 'inline-flex' }}
              className="nav-link-custom d-flex align-items-center justify-content-center"
              title="Cart"
            >
              <ShoppingCart size={20} />
              {cartItemCount > 0 && (
                <span className="cart-badge">{cartItemCount > 99 ? '99+' : cartItemCount}</span>
              )}
            </Link>

            {/* Auth */}
            {isAuthenticated && user ? (
              <div ref={dropdownRef} style={{ position: 'relative' }}>
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="d-flex align-items-center gap-2"
                  style={{
                    background: 'var(--primary-light)',
                    border: '1px solid #bfdbfe',
                    borderRadius: '50px',
                    padding: '6px 12px 6px 6px',
                    cursor: 'pointer',
                    transition: 'var(--transition)',
                  }}
                >
                  <div
                    style={{
                      width: '28px',
                      height: '28px',
                      borderRadius: '50%',
                      background: 'var(--primary)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <User size={14} color="#ffffff" />
                  </div>
                  <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                    {user.firstName || user.email}
                  </span>
                </button>

                {/* Dropdown menu */}
                {isDropdownOpen && (
                  <div
                    style={{
                      position: 'absolute',
                      top: 'calc(100% + 8px)',
                      right: 0,
                      background: '#ffffff',
                      borderRadius: 'var(--border-radius)',
                      boxShadow: 'var(--shadow-xl)',
                      border: '1px solid var(--border-color)',
                      minWidth: '180px',
                      zIndex: 1050,
                      overflow: 'hidden',
                    }}
                  >
                    <div style={{ padding: '0.75rem 1rem', borderBottom: '1px solid var(--border-color)' }}>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 500 }}>
                        Signed in as
                      </div>
                      <div style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                        {user.email}
                      </div>
                    </div>
                    {[
                      { icon: <User size={15} />, label: 'Profile', to: '/account' },
                      { icon: <Package size={15} />, label: 'My Orders', to: '/account' },
                      { icon: <Settings size={15} />, label: 'Settings', to: '/account' },
                    ].map(({ icon, label, to }) => (
                      <Link
                        key={label}
                        to={to}
                        onClick={() => setIsDropdownOpen(false)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.6rem',
                          padding: '0.6rem 1rem',
                          color: 'var(--text-secondary)',
                          fontSize: '0.875rem',
                          fontWeight: 500,
                          transition: 'var(--transition)',
                        }}
                        onMouseEnter={e => {
                          (e.currentTarget as HTMLElement).style.background = 'var(--bg-secondary)';
                          (e.currentTarget as HTMLElement).style.color = 'var(--text-primary)';
                        }}
                        onMouseLeave={e => {
                          (e.currentTarget as HTMLElement).style.background = 'transparent';
                          (e.currentTarget as HTMLElement).style.color = 'var(--text-secondary)';
                        }}
                      >
                        {icon} {label}
                      </Link>
                    ))}
                    <div style={{ borderTop: '1px solid var(--border-color)' }}>
                      <button
                        onClick={handleLogout}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.6rem',
                          padding: '0.6rem 1rem',
                          color: '#dc2626',
                          fontSize: '0.875rem',
                          fontWeight: 500,
                          background: 'transparent',
                          border: 'none',
                          width: '100%',
                          cursor: 'pointer',
                          transition: 'var(--transition)',
                        }}
                        onMouseEnter={e => {
                          (e.currentTarget as HTMLElement).style.background = '#fee2e2';
                        }}
                        onMouseLeave={e => {
                          (e.currentTarget as HTMLElement).style.background = 'transparent';
                        }}
                      >
                        <LogOut size={15} /> Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="d-none d-md-flex align-items-center" style={{ gap: '8px' }}>
                <Link to="/login" className="btn btn-sm" style={{ color: 'var(--text-primary)', fontWeight: 500 }}>
                  Login
                </Link>
                <Link to="/register" className="btn btn-sm btn-primary">
                  Register
                </Link>
              </div>
            )}

            {/* Hamburger */}
            <button
              className="d-lg-none nav-link-custom d-flex align-items-center justify-content-center"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              style={{ padding: '6px', background: 'transparent', border: 'none' }}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* ── Mobile Menu ── */}
        {isMenuOpen && (
          <div
            className="d-lg-none"
            style={{
              borderTop: '1px solid var(--border-color)',
              marginTop: '0.5rem',
              paddingTop: '0.75rem',
              paddingBottom: '0.75rem',
            }}
          >
            <div className="d-flex flex-column" style={{ gap: '4px' }}>
              {[
                { to: '/', label: 'Home', end: true },
                { to: '/products', label: 'Products', end: false },
                { to: '/search', label: '📸 Visual Search', end: false },
                { to: '/cart', label: `🛒 Cart (${cartItemCount})`, end: false },
              ].map(({ to, label, end }) => (
                <NavLink
                  key={to}
                  to={to}
                  end={end}
                  className={navLinkClass}
                  onClick={() => setIsMenuOpen(false)}
                  style={{ padding: '0.5rem 0.75rem', borderRadius: 'var(--border-radius-sm)' }}
                >
                  {label}
                </NavLink>
              ))}
              {!isAuthenticated && (
                <div className="d-flex gap-2 mt-2 pt-2" style={{ borderTop: '1px solid var(--border-color)' }}>
                  <Link
                    to="/login"
                    className="btn btn-sm flex-fill"
                    style={{ border: '1px solid var(--border-color)', fontWeight: 500 }}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="btn btn-sm btn-primary flex-fill"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Register
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
