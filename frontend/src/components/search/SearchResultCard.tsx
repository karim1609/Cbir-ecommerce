import { Link } from 'react-router-dom';
import type { SearchResult } from '../../types';
import StarRating from '../common/StarRating';
import { formatPrice } from '../../utils/helpers';

interface SearchResultCardProps {
  result: SearchResult;
  rank: number;
}

function getSimilarityColor(score: number): string {
  if (score >= 0.9) return '#16a34a';
  if (score >= 0.7) return '#2563eb';
  if (score >= 0.5) return '#d97706';
  return '#dc2626';
}

export default function SearchResultCard({ result, rank }: SearchResultCardProps) {
  const { product, similarityScore } = result;
  const primaryImage = product.images.find((img) => img.isPrimary) ?? product.images[0];
  const percentage = Math.round(similarityScore * 100);
  const color = getSimilarityColor(similarityScore);

  return (
    <div className="search-result-card card-hover" style={{ border: '1px solid #e2e8f0', borderRadius: 16, overflow: 'hidden', background: '#fff', display: 'flex', flexDirection: 'column' }}>
      {/* Rank badge + Image */}
      <div style={{ position: 'relative' }}>
        <div style={{
          position: 'absolute', top: 10, left: 10, zIndex: 2,
          background: '#0f172a', color: '#fff', borderRadius: 8,
          width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontWeight: 700, fontSize: '0.85rem',
        }}>
          #{rank}
        </div>
        <img
          src={primaryImage?.url ?? 'https://placehold.co/400x300?text=Product'}
          alt={primaryImage?.alt ?? product.name}
          style={{ width: '100%', height: 200, objectFit: 'cover', display: 'block' }}
          loading="lazy"
        />
      </div>

      {/* Similarity bar */}
      <div style={{ padding: '0.75rem 1rem 0' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
          <span style={{ fontSize: '0.78rem', fontWeight: 600, color }}>
            {percentage}% match
          </span>
          <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Similarity</span>
        </div>
        <div style={{ background: '#e2e8f0', borderRadius: 999, height: 6, overflow: 'hidden' }}>
          <div style={{ width: `${percentage}%`, height: '100%', background: color, borderRadius: 999, transition: 'width 0.6s ease' }} />
        </div>
      </div>

      {/* Info */}
      <div style={{ padding: '0.75rem 1rem', flex: 1 }}>
        <div style={{ fontSize: '0.75rem', color: '#64748b', marginBottom: 4 }}>
          {product.brand} · {product.category.name}
        </div>
        <h6 style={{ margin: '0 0 0.5rem', fontWeight: 600, fontSize: '0.9rem', lineHeight: 1.4,
          display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
          {product.name}
        </h6>
        <StarRating rating={product.rating} size="sm" showCount count={product.reviewCount} />
        <div style={{ marginTop: 8, fontWeight: 700, color: '#2563eb', fontSize: '1rem' }}>
          {formatPrice(product.price)}
          {product.originalPrice && (
            <span style={{ marginLeft: 8, fontSize: '0.8rem', color: '#94a3b8', textDecoration: 'line-through' }}>
              {formatPrice(product.originalPrice)}
            </span>
          )}
        </div>
      </div>

      {/* Action */}
      <div style={{ padding: '0 1rem 1rem' }}>
        <Link
          to={`/products/${product.id}`}
          className="btn btn-primary btn-sm w-100"
          style={{ borderRadius: 8 }}
        >
          View Product
        </Link>
      </div>
    </div>
  );
}
