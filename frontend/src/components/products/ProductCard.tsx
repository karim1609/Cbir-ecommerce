import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Eye } from 'lucide-react';
import type { Product } from '../../types';
import { useCart } from '../../context/CartContext';
import StarRating from '../common/StarRating';
import Badge from '../common/Badge';

interface ProductCardProps {
  product: Product;
  showCategory?: boolean;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, showCategory = false }) => {
  const { addItem } = useCart();
  const [hovered, setHovered] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);

  const primaryImage = product.images.find(img => img.isPrimary) || product.images[0];
  const secondaryImage = product.images.length > 1 ? product.images.find(img => !img.isPrimary) || product.images[1] : null;

  const displayImage = hovered && secondaryImage ? secondaryImage : primaryImage;

  const hasDiscount = product.originalPrice && product.originalPrice > product.price;
  const discountPercent = hasDiscount
    ? Math.round(((product.originalPrice! - product.price) / product.originalPrice!) * 100)
    : 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!product.inStock) return;
    addItem(product, 1);
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 1500);
  };

  return (
    <Link
      to={`/products/${product.id}`}
      className="text-decoration-none"
      style={{ display: 'block' }}
    >
      <div
        className={`card h-100 border-0 shadow-sm product-card${hovered ? ' card-hover' : ''}`}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          transition: 'transform 0.25s ease, box-shadow 0.25s ease',
          transform: hovered ? 'translateY(-4px)' : 'translateY(0)',
          boxShadow: hovered ? '0 12px 32px rgba(0,0,0,0.15)' : undefined,
          borderRadius: '12px',
          overflow: 'hidden',
          cursor: 'pointer',
        }}
      >
        {/* Image Container */}
        <div
          style={{
            position: 'relative',
            paddingTop: '75%', // 4:3 aspect ratio
            overflow: 'hidden',
            background: '#f8f9fa',
          }}
        >
          <img
            src={displayImage?.url || 'https://via.placeholder.com/400x300?text=No+Image'}
            alt={displayImage?.alt || product.name}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              transition: 'transform 0.4s ease',
              transform: hovered ? 'scale(1.08)' : 'scale(1)',
            }}
          />

          {/* Quick View Overlay */}
          {hovered && (
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background: 'rgba(0,0,0,0.25)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'opacity 0.2s ease',
              }}
            >
              <div
                style={{
                  background: 'white',
                  borderRadius: '50%',
                  width: 44,
                  height: 44,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                }}
              >
                <Eye size={20} color="#333" />
              </div>
            </div>
          )}

          {/* Discount Badge */}
          {hasDiscount && (
            <div style={{ position: 'absolute', top: 10, left: 10 }}>
              <Badge variant="danger" size="sm">-{discountPercent}%</Badge>
            </div>
          )}

          {/* Stock Badge */}
          {!product.inStock && (
            <div style={{ position: 'absolute', top: 10, right: 10 }}>
              <Badge variant="secondary" size="sm">Out of Stock</Badge>
            </div>
          )}
        </div>

        {/* Card Body */}
        <div className="card-body d-flex flex-column p-3">
          {/* Category Badge */}
          {showCategory && (
            <div className="mb-1">
              <Badge variant="primary" size="sm">{product.category.name}</Badge>
            </div>
          )}

          {/* Brand */}
          <small className="text-muted text-uppercase fw-semibold" style={{ fontSize: '0.7rem', letterSpacing: '0.05em' }}>
            {product.brand}
          </small>

          {/* Product Name */}
          <h6
            className="card-title mt-1 mb-2 fw-semibold text-dark"
            style={{
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              lineHeight: '1.4',
              minHeight: '2.8em',
              fontSize: '0.92rem',
            }}
          >
            {product.name}
          </h6>

          {/* Star Rating */}
          <div className="d-flex align-items-center gap-1 mb-2">
            <StarRating rating={product.rating} size="sm" />
            <small className="text-muted">({product.reviewCount})</small>
          </div>

          {/* Price */}
          <div className="d-flex align-items-center gap-2 mb-2">
            <span className="fw-bold text-primary fs-6">${product.price.toFixed(2)}</span>
            {hasDiscount && (
              <span className="text-muted text-decoration-line-through" style={{ fontSize: '0.82rem' }}>
                ${product.originalPrice!.toFixed(2)}
              </span>
            )}
          </div>

          {/* In Stock Indicator */}
          <div className="mb-3">
            {product.inStock ? (
              <small className="text-success fw-semibold">
                <span className="me-1">●</span>In Stock
              </small>
            ) : (
              <small className="text-danger fw-semibold">
                <span className="me-1">●</span>Out of Stock
              </small>
            )}
          </div>

          {/* Add to Cart Button */}
          <div className="mt-auto">
            <button
              className={`btn w-100 btn-sm d-flex align-items-center justify-content-center gap-2 ${
                product.inStock ? 'btn-primary' : 'btn-secondary'
              }`}
              onClick={handleAddToCart}
              disabled={!product.inStock}
              style={{ borderRadius: '8px', fontWeight: 600, fontSize: '0.85rem' }}
            >
              <ShoppingCart size={15} />
              {addedToCart ? 'Added!' : product.inStock ? 'Add to Cart' : 'Out of Stock'}
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;

