import { Link } from 'react-router-dom';
import { Trash2, Plus, Minus, ShoppingBag, ArrowLeft, Shield } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { formatPrice } from '../utils/helpers';

export default function CartPage() {
  const { cart, removeItem, updateQuantity } = useCart();

  const shipping = cart.subtotal >= 50 ? 0 : 9.99;
  const grandTotal = cart.total + shipping;

  if (cart.items.length === 0) {
    return (
      <div className="container py-5 text-center" style={{ minHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <ShoppingBag size={80} style={{ color: '#e2e8f0', marginBottom: '1.5rem' }} />
        <h2 className="fw-bold mb-2">Your cart is empty</h2>
        <p className="text-muted mb-4">Looks like you haven't added anything yet.</p>
        <Link to="/products" className="btn btn-primary btn-lg d-flex align-items-center gap-2" style={{ borderRadius: 12 }}>
          <ShoppingBag size={18} /> Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <div className="d-flex align-items-center gap-3 mb-4 flex-wrap">
        <Link to="/products" className="btn btn-outline-secondary btn-sm d-flex align-items-center gap-1">
          <ArrowLeft size={16} /> Continue Shopping
        </Link>
        <h1 className="fw-bold mb-0 fs-3">Shopping Cart</h1>
        <span className="text-muted">({cart.items.length} {cart.items.length === 1 ? 'item' : 'items'})</span>
      </div>

      <div className="row g-4">
        <div className="col-lg-8">
          <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #e2e8f0', overflow: 'hidden' }}>
            {cart.items.map((item, idx) => {
              const primaryImage = item.product.images.find((img) => img.isPrimary) ?? item.product.images[0];
              return (
                <div
                  key={item.id}
                  style={{
                    padding: '1.25rem 1.5rem',
                    borderBottom: idx < cart.items.length - 1 ? '1px solid #f1f5f9' : 'none',
                    display: 'flex',
                    gap: '1rem',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                  }}
                >
                  <Link to={`/products/${item.product.id}`}>
                    <img
                      src={primaryImage?.url ?? 'https://placehold.co/80x80?text=Product'}
                      alt={item.product.name}
                      style={{ width: 90, height: 90, objectFit: 'cover', borderRadius: 10, border: '1px solid #e2e8f0' }}
                    />
                  </Link>
                  <div style={{ flex: 1, minWidth: 160 }}>
                    <Link to={`/products/${item.product.id}`} className="text-decoration-none">
                      <div className="fw-semibold text-dark" style={{ fontSize: '0.95rem', marginBottom: 2 }}>{item.product.name}</div>
                    </Link>
                    <div className="text-muted small">{item.product.brand} · {item.product.category.name}</div>
                    <div className="fw-bold mt-1" style={{ color: '#2563eb' }}>{formatPrice(item.product.price)}</div>
                  </div>
                  <div className="d-flex align-items-center gap-2">
                    <button
                      className="btn btn-outline-secondary btn-sm"
                      style={{ width: 32, height: 32, padding: 0, borderRadius: 8 }}
                      onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                      disabled={item.quantity <= 1}
                    >
                      <Minus size={14} />
                    </button>
                    <span style={{ width: 32, textAlign: 'center', fontWeight: 600 }}>{item.quantity}</span>
                    <button
                      className="btn btn-outline-secondary btn-sm"
                      style={{ width: 32, height: 32, padding: 0, borderRadius: 8 }}
                      onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                      disabled={item.quantity >= item.product.stockCount}
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                  <div style={{ minWidth: 80, textAlign: 'right', fontWeight: 700 }}>
                    {formatPrice(item.product.price * item.quantity)}
                  </div>
                  <button className="btn btn-link text-danger p-1" onClick={() => removeItem(item.product.id)}>
                    <Trash2 size={18} />
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        <div className="col-lg-4">
          <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #e2e8f0', padding: '1.5rem', position: 'sticky', top: 100 }}>
            <h5 className="fw-bold mb-4">Order Summary</h5>
            <div className="d-flex justify-content-between mb-2">
              <span className="text-muted">Subtotal</span>
              <span>{formatPrice(cart.subtotal)}</span>
            </div>
            <div className="d-flex justify-content-between mb-2">
              <span className="text-muted">Tax (10%)</span>
              <span>{formatPrice(cart.tax)}</span>
            </div>
            <div className="d-flex justify-content-between mb-3">
              <span className="text-muted">Shipping</span>
              <span>{shipping === 0 ? <span className="text-success fw-semibold">Free</span> : formatPrice(shipping)}</span>
            </div>
            {cart.subtotal < 50 && (
              <div className="alert alert-info py-2 small mb-3" style={{ borderRadius: 8 }}>
                Add {formatPrice(50 - cart.subtotal)} more for free shipping!
              </div>
            )}
            <hr />
            <div className="d-flex justify-content-between mb-4">
              <span className="fw-bold fs-5">Total</span>
              <span className="fw-bold fs-5" style={{ color: '#2563eb' }}>{formatPrice(grandTotal)}</span>
            </div>
            <button
              className="btn btn-primary w-100 py-3 fw-bold mb-3"
              style={{ borderRadius: 12, fontSize: '1.05rem' }}
              onClick={() => alert('Checkout coming soon! Connect the Django backend to enable this feature.')}
            >
              Proceed to Checkout
            </button>
            <div className="d-flex align-items-center justify-content-center gap-2 text-muted small">
              <Shield size={14} />
              <span>Secure checkout · SSL encrypted</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
