import React from 'react';
import type { Product } from '../../types';
import ProductCard from './ProductCard';
import ErrorMessage from '../common/ErrorMessage';
import EmptyState from '../common/EmptyState';

interface ProductGridProps {
  products: Product[];
  loading: boolean;
  error?: string | null;
  showCategory?: boolean;
}

const SkeletonCard: React.FC = () => (
  <div className="card border-0 shadow-sm h-100" style={{ borderRadius: '12px', overflow: 'hidden' }}>
    <div
      className="placeholder-glow"
      style={{ paddingTop: '75%', position: 'relative', background: '#e9ecef' }}
    >
      <div
        className="placeholder"
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
      />
    </div>
    <div className="card-body p-3">
      <div className="placeholder-glow mb-2">
        <span className="placeholder col-4" style={{ height: 14, borderRadius: 4 }} />
      </div>
      <div className="placeholder-glow mb-2">
        <span className="placeholder col-10" style={{ height: 16, borderRadius: 4 }} />
        <span className="placeholder col-7 mt-1" style={{ height: 16, borderRadius: 4 }} />
      </div>
      <div className="placeholder-glow mb-2">
        <span className="placeholder col-5" style={{ height: 14, borderRadius: 4 }} />
      </div>
      <div className="placeholder-glow mb-3">
        <span className="placeholder col-4" style={{ height: 20, borderRadius: 4 }} />
      </div>
      <div className="placeholder-glow">
        <span className="placeholder col-12 btn" style={{ height: 34, borderRadius: 8 }} />
      </div>
    </div>
  </div>
);

const ProductGrid: React.FC<ProductGridProps> = ({ products, loading, error, showCategory }) => {
  if (error) {
    return <ErrorMessage message={error} />;
  }

  if (loading) {
    return (
      <div className="row g-3 g-md-4">
        {Array.from({ length: 12 }).map((_, i) => (
          <div
            key={i}
            className="col-12 col-sm-6 col-md-4 col-lg-3"
          >
            <SkeletonCard />
          </div>
        ))}
      </div>
    );
  }

  if (!products || products.length === 0) {
    return (
      <EmptyState
        title="No products found"
        description="Try adjusting your filters or search terms."
        icon="shopping-bag"
      />
    );
  }

  return (
    <div className="row g-3 g-md-4">
      {products.map(product => (
        <div
          key={product.id}
          className="col-12 col-sm-6 col-md-4 col-lg-3"
        >
          <ProductCard product={product} showCategory={showCategory} />
        </div>
      ))}
    </div>
  );
};

export default ProductGrid;

