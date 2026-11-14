import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ShoppingCart, Share2, Link as LinkIcon, ChevronLeft } from 'lucide-react';
import type { Product, ProductImage } from '../types';
import * as productService from '../services/productService';
import { useCart } from '../context/CartContext';
import StarRating from '../components/common/StarRating';
import Badge from '../components/common/Badge';
import ProductGrid from '../components/products/ProductGrid';

const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { addItem } = useCart();

  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string>('');
  const [quantity, setQuantity] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    setNotFound(false);

    productService.getProduct(parseInt(id))
      .then((p: Product) => {
        setProduct(p);
        const primary = p.images.find((img: ProductImage) => img.isPrimary) || p.images[0];
        setSelectedImage(primary?.url || '');
        return productService.getRelatedProducts(p.id, p.category.id);
      })
      .then((related: Product[]) => {
        setRelatedProducts(related.slice(0, 4));
      })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [id]);

  const handleAddToCart = () => {
    if (!product || !product.inStock) return;
    addItem(product, quantity);
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({ title: product?.name, url: window.location.href });
    } else {
      navigator.clipboard.writeText(window.location.href);
    }
  };

  const hasDiscount = product?.originalPrice && product.originalPrice > product.price;
  const discountPercent = hasDiscount
    ? Math.round(((product!.originalPrice! - product!.price) / product!.originalPrice!) * 100)
    : 0;

  // ── Loading Skeleton ──────────────────────────────────────────────
  if (loading) {
    return (
      <div className="container-xl py-5">
        <div className="row g-4">
          <div className="col-12 col-md-6">
            <div className="placeholder-glow" style={{ borderRadius: 16, overflow: 'hidden' }}>
              <div className="placeholder" style={{ width: '100%', paddingTop: '100%', display: 'block', borderRadius: 12 }} />
            </div>
            <div className="d-flex gap-2 mt-3">
              {[0, 1, 2].map(i => (
                <div key={i} className="placeholder-glow" style={{ flex: '0 0 80px' }}>
                  <div className="placeholder" style={{ width: 80, height: 80, borderRadius: 8 }} />
                </div>
              ))}
            </div>
          </div>
          <div className="col-12 col-md-6">
            {[80, 50, 40, 60, 100, 70, 90].map((w, i) => (
              <div key={i} className="placeholder-glow mb-3">
                <span className="placeholder" style={{ width: `${w}%`, height: 18, display: 'block', borderRadius: 6 }} />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ── 404 ──────────────────────────────────────────────────────────
  if (notFound || !product) {
    return (
      <div className="container-xl py-5 text-center">
        <div style={{ fontSize: '5rem' }}>🛍️</div>
        <h2 className="fw-bold text-dark mt-3">Product Not Found</h2>
        <p className="text-muted">The product you're looking for doesn't exist or has been removed.</p>
        <Link to="/products" className="btn btn-primary mt-2" style={{ borderRadius: 10 }}>
          <ChevronLeft size={16} className="me-1" />
          Back to Products
        </Link>
      </div>
    );
  }

  return (
    <div className="container-xl py-4">
      {/* Breadcrumb */}
      <nav aria-label="breadcrumb" className="mb-4">
        <ol className="breadcrumb mb-0" style={{ fontSize: '0.88rem' }}>
          <li className="breadcrumb-item">
            <Link to="/" className="text-decoration-none text-muted">Home</Link>
          </li>
          <li className="breadcrumb-item">
            <Link to="/products" className="text-decoration-none text-muted">Products</Link>
          </li>
          <li className="breadcrumb-item">
            <Link
              to={`/products?category=${product.category.slug}`}
              className="text-decoration-none text-muted"
            >
              {product.category.name}
            </Link>
          </li>
          <li className="breadcrumb-item active text-dark fw-semibold" aria-current="page"
            style={{ maxWidth: 220, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {product.name}
          </li>
        </ol>
      </nav>

      {/* Main Detail Row */}
      <div className="row g-4 g-lg-5 mb-5">
        {/* Left: Image Gallery */}
        <div className="col-12 col-md-6">
          {/* Main Image */}
          <div
            style={{
              borderRadius: 16,
              overflow: 'hidden',
              background: '#f8f9fa',
              aspectRatio: '1 / 1',
              position: 'relative',
            }}
          >
            <img
              src={selectedImage || 'https://via.placeholder.com/600?text=No+Image'}
              alt={product.name}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                display: 'block',
              }}
            />
            {hasDiscount && (
              <div style={{ position: 'absolute', top: 14, left: 14 }}>
                <Badge variant="danger">-{discountPercent}% OFF</Badge>
              </div>
            )}
          </div>

          {/* Thumbnails */}
          {product.images.length > 1 && (
            <div className="d-flex gap-2 mt-3 flex-wrap">
              {product.images.map(img => (
                <button
                  key={img.id}
                  onClick={() => setSelectedImage(img.url)}
                  style={{
                    width: 76,
                    height: 76,
                    borderRadius: 10,
                    overflow: 'hidden',
                    border: selectedImage === img.url ? '2px solid #0d6efd' : '2px solid #e9ecef',
                    padding: 0,
                    background: '#f8f9fa',
                    cursor: 'pointer',
                    transition: 'border-color 0.2s',
                    flexShrink: 0,
                  }}
                >
                  <img
                    src={img.url}
                    alt={img.alt}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Product Info */}
        <div className="col-12 col-md-6">
          {/* Brand + Stock Badges */}
          <div className="d-flex gap-2 mb-2 flex-wrap">
            <Badge variant="secondary">{product.brand}</Badge>
            {product.inStock ? (
              <Badge variant="success">In Stock</Badge>
            ) : (
              <Badge variant="danger">Out of Stock</Badge>
            )}
            {product.isTrending && <Badge variant="warning">Trending</Badge>}
          </div>

          {/* Product Name */}
          <h1 className="fw-bold text-dark mb-2" style={{ fontSize: '1.6rem', lineHeight: 1.3 }}>
            {product.name}
          </h1>

          {/* Rating */}
          <div className="d-flex align-items-center gap-2 mb-3">
            <StarRating rating={product.rating} size="md" />
            <span className="text-muted" style={{ fontSize: '0.88rem' }}>
              {product.rating.toFixed(1)} ({product.reviewCount} reviews)
            </span>
          </div>

          {/* Price */}
          <div className="d-flex align-items-baseline gap-3 mb-3">
            <span className="fw-bold text-primary" style={{ fontSize: '2rem' }}>
              ${product.price.toFixed(2)}
            </span>
            {hasDiscount && (
              <>
                <span className="text-muted text-decoration-line-through" style={{ fontSize: '1.1rem' }}>
                  ${product.originalPrice!.toFixed(2)}
                </span>
                <Badge variant="danger">Save {discountPercent}%</Badge>
              </>
            )}
          </div>

          {/* Description */}
          <p className="text-secondary mb-4" style={{ lineHeight: 1.7, fontSize: '0.95rem' }}>
            {product.description}
          </p>

          {/* Quantity Selector */}
          <div className="mb-3">
            <label className="form-label fw-semibold text-dark mb-2" style={{ fontSize: '0.9rem' }}>
              Quantity
            </label>
            <div className="d-flex align-items-center gap-0" style={{ width: 'fit-content' }}>
              <button
                className="btn btn-outline-secondary"
                onClick={() => setQuantity(q => Math.max(1, q - 1))}
                disabled={quantity <= 1}
                style={{ borderRadius: '8px 0 0 8px', width: 40, height: 40, padding: 0 }}
              >
                −
              </button>
              <input
                type="number"
                className="form-control text-center"
                value={quantity}
                min={1}
                max={product.stockCount}
                onChange={e => {
                  const val = Math.max(1, Math.min(product.stockCount, parseInt(e.target.value) || 1));
                  setQuantity(val);
                }}
                style={{ width: 60, height: 40, borderRadius: 0, textAlign: 'center', fontWeight: 600 }}
              />
              <button
                className="btn btn-outline-secondary"
                onClick={() => setQuantity(q => Math.min(product.stockCount, q + 1))}
                disabled={quantity >= product.stockCount}
                style={{ borderRadius: '0 8px 8px 0', width: 40, height: 40, padding: 0 }}
              >
                +
              </button>
            </div>
            {product.stockCount < 10 && product.inStock && (
              <small className="text-warning mt-1 d-block">
                Only {product.stockCount} left in stock!
              </small>
            )}
          </div>

          {/* Add to Cart */}
          <button
            className={`btn btn-lg w-100 d-flex align-items-center justify-content-center gap-2 mb-3 ${
              product.inStock ? 'btn-primary' : 'btn-secondary'
            }`}
            onClick={handleAddToCart}
            disabled={!product.inStock}
            style={{ borderRadius: 12, fontWeight: 600, fontSize: '1rem', height: 52 }}
          >
            <ShoppingCart size={20} />
            {addedToCart ? '✓ Added to Cart!' : product.inStock ? 'Add to Cart' : 'Out of Stock'}
          </button>

          {/* Product Details */}
          <div
            className="p-3 mb-3"
            style={{ background: '#f8f9fa', borderRadius: 12 }}
          >
            <h6 className="fw-bold text-dark mb-3" style={{ fontSize: '0.88rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Product Details
            </h6>
            <div className="row g-2">
              <div className="col-5 text-muted" style={{ fontSize: '0.88rem' }}>Category</div>
              <div className="col-7 fw-semibold" style={{ fontSize: '0.88rem' }}>{product.category.name}</div>
              <div className="col-5 text-muted" style={{ fontSize: '0.88rem' }}>Brand</div>
              <div className="col-7 fw-semibold" style={{ fontSize: '0.88rem' }}>{product.brand}</div>
              <div className="col-5 text-muted" style={{ fontSize: '0.88rem' }}>Stock</div>
              <div className="col-7 fw-semibold" style={{ fontSize: '0.88rem' }}>{product.stockCount} units</div>
            </div>

            {/* Tags */}
            {product.tags.length > 0 && (
              <div className="mt-3">
                <div className="text-muted mb-2" style={{ fontSize: '0.88rem' }}>Tags</div>
                <div className="d-flex flex-wrap gap-1">
                  {product.tags.map(tag => (
                    <span
                      key={tag}
                      className="badge"
                      style={{
                        background: '#e8f0fe',
                        color: '#1a73e8',
                        fontWeight: 500,
                        fontSize: '0.78rem',
                        borderRadius: 20,
                        padding: '4px 10px',
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Share */}
          <div className="d-flex align-items-center gap-2">
            <span className="text-muted" style={{ fontSize: '0.88rem' }}>Share:</span>
            <button
              className="btn btn-sm btn-outline-secondary d-flex align-items-center gap-1"
              onClick={handleShare}
              style={{ borderRadius: 8 }}
              title="Share or Copy link"
            >
              <Share2 size={15} />
              <span>Share</span>
            </button>
            <button
              className="btn btn-sm btn-outline-secondary d-flex align-items-center gap-1"
              onClick={handleShare}
              style={{ borderRadius: 8 }}
              title="Copy link"
            >
              <LinkIcon size={15} />
              <span>Copy Link</span>
            </button>
          </div>
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section>
          <div className="d-flex align-items-center justify-content-between mb-4">
            <h2 className="fw-bold text-dark mb-0" style={{ fontSize: '1.4rem' }}>Related Products</h2>
            <Link
              to={`/products?category=${product.category.slug}`}
              className="btn btn-outline-primary btn-sm"
              style={{ borderRadius: 8 }}
            >
              View All
            </Link>
          </div>
          <ProductGrid
            products={relatedProducts}
            loading={false}
            showCategory={false}
          />
        </section>
      )}
    </div>
  );
};

export default ProductDetailPage;

