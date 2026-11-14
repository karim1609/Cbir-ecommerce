import React from 'react';
import { ArrowUpDown } from 'lucide-react';

interface SortBarProps {
  totalCount: number;
  currentPage: number;
  pageSize: number;
  sortBy: string;
  onSortChange: (sort: string) => void;
}

const SORT_OPTIONS = [
  { value: 'name', label: 'Name A–Z' },
  { value: 'name_desc', label: 'Name Z–A' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'rating', label: 'Highest Rated' },
  { value: 'newest', label: 'Newest' },
];

const SortBar: React.FC<SortBarProps> = ({
  totalCount,
  currentPage,
  pageSize,
  sortBy,
  onSortChange,
}) => {
  const start = Math.min((currentPage - 1) * pageSize + 1, totalCount);
  const end = Math.min(currentPage * pageSize, totalCount);

  return (
    <div
      className="d-flex align-items-center justify-content-between flex-wrap gap-2 py-2 px-3 mb-4"
      style={{
        background: 'white',
        borderRadius: 10,
        boxShadow: '0 1px 6px rgba(0,0,0,0.07)',
        border: '1px solid #e9ecef',
      }}
    >
      {/* Result Count */}
      <div className="text-muted" style={{ fontSize: '0.88rem' }}>
        {totalCount === 0 ? (
          <span>No products found</span>
        ) : (
          <span>
            Showing <strong className="text-dark">{start}–{end}</strong> of{' '}
            <strong className="text-dark">{totalCount}</strong> products
          </span>
        )}
      </div>

      {/* Sort Dropdown */}
      <div className="d-flex align-items-center gap-2">
        <ArrowUpDown size={16} className="text-muted" />
        <label className="text-muted mb-0" style={{ fontSize: '0.88rem', whiteSpace: 'nowrap' }}>
          Sort by:
        </label>
        <select
          className="form-select form-select-sm"
          value={sortBy}
          onChange={e => onSortChange(e.target.value)}
          style={{
            borderRadius: 8,
            fontSize: '0.88rem',
            minWidth: 160,
            border: '1px solid #dee2e6',
            cursor: 'pointer',
          }}
        >
          {SORT_OPTIONS.map(opt => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default SortBar;

