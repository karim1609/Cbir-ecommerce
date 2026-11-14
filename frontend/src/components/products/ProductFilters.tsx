import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp, Search, X } from 'lucide-react';
import type { ProductFilters as ProductFiltersType, Category } from '../../types';

interface ProductFiltersProps {
  filters: ProductFiltersType;
  onFilterChange: (filters: ProductFiltersType) => void;
  categories: Category[];
}

const ProductFilters: React.FC<ProductFiltersProps> = ({ filters, onFilterChange, categories }) => {
  const [localFilters, setLocalFilters] = useState<ProductFiltersType>(filters);
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalFilters(prev => ({ ...prev, search: e.target.value }));
  };

  const handleCategoryClick = (slug: string) => {
    setLocalFilters(prev => ({
      ...prev,
      category: prev.category === slug ? undefined : slug,
    }));
  };

  const handleMinPrice = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value ? parseFloat(e.target.value) : undefined;
    setLocalFilters(prev => ({ ...prev, minPrice: val }));
  };

  const handleMaxPrice = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value ? parseFloat(e.target.value) : undefined;
    setLocalFilters(prev => ({ ...prev, maxPrice: val }));
  };

  const handleRating = (rating: number) => {
    setLocalFilters(prev => ({ ...prev, rating: prev.rating === rating ? undefined : rating }));
  };

  const handleInStock = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalFilters(prev => ({ ...prev, inStock: e.target.checked ? true : undefined }));
  };

  const handleApply = () => {
    onFilterChange({ ...localFilters, page: 1 });
    setMobileOpen(false);
  };

  const handleReset = () => {
    const reset: ProductFiltersType = { page: 1, pageSize: filters.pageSize };
    setLocalFilters(reset);
    onFilterChange(reset);
    setMobileOpen(false);
  };

  const activeFilterCount = [
    localFilters.search,
    localFilters.category,
    localFilters.minPrice != null,
    localFilters.maxPrice != null,
    localFilters.rating,
    localFilters.inStock,
  ].filter(Boolean).length;

  const renderFilterPanel = () => (
    <div>
      {/* Search */}
      <div className="mb-4">
        <h6 className="fw-bold text-dark mb-2" style={{ fontSize: '0.88rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          Search
        </h6>
        <div className="position-relative">
          <Search size={15} className="position-absolute text-muted" style={{ top: '50%', left: 10, transform: 'translateY(-50%)' }} />
          <input
            type="text"
            className="form-control form-control-sm ps-5"
            placeholder="Search products..."
            value={localFilters.search || ''}
            onChange={handleSearchChange}
            style={{ borderRadius: 8 }}
          />
          {localFilters.search && (
            <button
              className="btn btn-link p-0 position-absolute text-muted"
              style={{ top: '50%', right: 8, transform: 'translateY(-50%)' }}
              onClick={() => setLocalFilters(prev => ({ ...prev, search: '' }))}
            >
              <X size={14} />
            </button>
          )}
        </div>
      </div>

      {/* Categories */}
      <div className="mb-4">
        <h6 className="fw-bold text-dark mb-2" style={{ fontSize: '0.88rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          Categories
        </h6>
        <ul className="list-unstyled mb-0">
          {categories.map(cat => (
            <li key={cat.id}>
              <button
                className={`btn btn-link text-start p-0 py-1 w-100 d-flex justify-content-between align-items-center ${
                  localFilters.category === cat.slug ? 'text-primary fw-semibold' : 'text-secondary'
                }`}
                style={{ fontSize: '0.88rem', textDecoration: 'none' }}
                onClick={() => handleCategoryClick(cat.slug)}
              >
                <span>{cat.name}</span>
                <span className="badge bg-light text-muted" style={{ fontSize: '0.72rem' }}>
                  {cat.productCount}
                </span>
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Price Range */}
      <div className="mb-4">
        <h6 className="fw-bold text-dark mb-2" style={{ fontSize: '0.88rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          Price Range
        </h6>
        <div className="d-flex gap-2 align-items-center">
          <div className="flex-1" style={{ flex: 1 }}>
            <label className="form-label text-muted mb-1" style={{ fontSize: '0.78rem' }}>Min ($)</label>
            <input
              type="number"
              className="form-control form-control-sm"
              placeholder="0"
              min={0}
              value={localFilters.minPrice ?? ''}
              onChange={handleMinPrice}
              style={{ borderRadius: 8 }}
            />
          </div>
          <div className="text-muted pt-3">–</div>
          <div className="flex-1" style={{ flex: 1 }}>
            <label className="form-label text-muted mb-1" style={{ fontSize: '0.78rem' }}>Max ($)</label>
            <input
              type="number"
              className="form-control form-control-sm"
              placeholder="1000"
              min={0}
              value={localFilters.maxPrice ?? ''}
              onChange={handleMaxPrice}
              style={{ borderRadius: 8 }}
            />
          </div>
        </div>
      </div>

      {/* Rating */}
      <div className="mb-4">
        <h6 className="fw-bold text-dark mb-2" style={{ fontSize: '0.88rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          Rating
        </h6>
        <div className="d-flex flex-column gap-1">
          {[4, 3, 2].map(r => (
            <button
              key={r}
              className={`btn btn-sm text-start d-flex align-items-center gap-1 ${
                localFilters.rating === r ? 'btn-warning' : 'btn-outline-secondary'
              }`}
              style={{ borderRadius: 8, fontSize: '0.84rem' }}
              onClick={() => handleRating(r)}
            >
              {'★'.repeat(r)}{'☆'.repeat(5 - r)}
              <span className="ms-1 text-muted" style={{ fontSize: '0.78rem' }}>{r}+ stars</span>
            </button>
          ))}
        </div>
      </div>

      {/* In Stock */}
      <div className="mb-4">
        <h6 className="fw-bold text-dark mb-2" style={{ fontSize: '0.88rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          Availability
        </h6>
        <div className="form-check">
          <input
            type="checkbox"
            className="form-check-input"
            id="inStockFilter"
            checked={!!localFilters.inStock}
            onChange={handleInStock}
          />
          <label className="form-check-label text-secondary" htmlFor="inStockFilter" style={{ fontSize: '0.88rem' }}>
            In Stock Only
          </label>
        </div>
      </div>

      {/* Buttons */}
      <div className="d-flex gap-2">
        <button
          className="btn btn-primary btn-sm flex-fill"
          onClick={handleApply}
          style={{ borderRadius: 8, fontWeight: 600 }}
        >
          Apply Filters
        </button>
        <button
          className="btn btn-outline-secondary btn-sm"
          onClick={handleReset}
          style={{ borderRadius: 8 }}
        >
          Reset
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Toggle Button */}
      <div className="d-md-none mb-3">
        <button
          className="btn btn-outline-primary w-100 d-flex align-items-center justify-content-between"
          onClick={() => setMobileOpen(prev => !prev)}
          style={{ borderRadius: 10 }}
        >
          <span className="fw-semibold">
            Filters {activeFilterCount > 0 && <span className="badge bg-primary ms-1">{activeFilterCount}</span>}
          </span>
          {mobileOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </button>

        {mobileOpen && (
          <div
            className="card border-0 shadow mt-2 p-3"
            style={{ borderRadius: 12, background: 'white' }}
          >
            {renderFilterPanel()}
          </div>
        )}
      </div>

      {/* Desktop Sidebar */}
      <div className="d-none d-md-block">
        <div
          className="card border-0 shadow-sm p-3"
          style={{ borderRadius: 12, background: 'white', position: 'sticky', top: 20 }}
        >
          <div className="d-flex align-items-center justify-content-between mb-3">
            <h5 className="fw-bold mb-0 text-dark">Filters</h5>
            {activeFilterCount > 0 && (
              <span className="badge bg-primary">{activeFilterCount} active</span>
            )}
            <button
              className="btn btn-link p-0 text-muted"
              onClick={() => setCollapsed(prev => !prev)}
            >
              {collapsed ? <ChevronDown size={18} /> : <ChevronUp size={18} />}
            </button>
          </div>
          {!collapsed && renderFilterPanel()}
        </div>
      </div>
    </>
  );
};

export default ProductFilters;

