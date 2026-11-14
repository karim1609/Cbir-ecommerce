import React from 'react';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  const getPageNumbers = (): (number | '...')[] => {
    const delta = 2;
    const range: number[] = [];
    for (
      let i = Math.max(1, currentPage - delta);
      i <= Math.min(totalPages, currentPage + delta);
      i++
    ) {
      range.push(i);
    }

    const pages: (number | '...')[] = [];
    if (range[0] > 1) {
      if (range[0] > 2) pages.push('...');
    }
    pages.push(...range);
    if (range[range.length - 1] < totalPages) {
      if (range[range.length - 1] < totalPages - 1) pages.push('...');
    }
    return pages;
  };

  const pages = getPageNumbers();
  const isFirst = currentPage === 1;
  const isLast = currentPage === totalPages;

  const btnBase: React.CSSProperties = {
    borderRadius: 8,
    minWidth: 36,
    height: 36,
    padding: '0 8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '0.88rem',
    fontWeight: 500,
    border: '1px solid #dee2e6',
    background: 'white',
    cursor: 'pointer',
    transition: 'all 0.15s ease',
  };

  return (
    <nav className="d-flex justify-content-center align-items-center gap-1 mt-4" aria-label="Product pagination">
      {/* First */}
      <button
        style={{ ...btnBase, opacity: isFirst ? 0.4 : 1, cursor: isFirst ? 'default' : 'pointer' }}
        onClick={() => !isFirst && onPageChange(1)}
        disabled={isFirst}
        title="First page"
        className="btn btn-outline-secondary p-0"
      >
        <ChevronsLeft size={16} />
      </button>

      {/* Prev */}
      <button
        style={{ ...btnBase, opacity: isFirst ? 0.4 : 1, cursor: isFirst ? 'default' : 'pointer' }}
        onClick={() => !isFirst && onPageChange(currentPage - 1)}
        disabled={isFirst}
        title="Previous page"
        className="btn btn-outline-secondary p-0"
      >
        <ChevronLeft size={16} />
      </button>

      {/* Page numbers */}
      {pages.map((page, idx) =>
        page === '...' ? (
          <span
            key={`ellipsis-${idx}`}
            className="text-muted px-1"
            style={{ userSelect: 'none', fontSize: '0.88rem' }}
          >
            …
          </span>
        ) : (
          <button
            key={page}
            onClick={() => onPageChange(page as number)}
            className={`btn ${currentPage === page ? 'btn-primary' : 'btn-outline-secondary'}`}
            style={{
              ...btnBase,
              background: currentPage === page ? '#0d6efd' : 'white',
              color: currentPage === page ? 'white' : '#495057',
              border: currentPage === page ? '1px solid #0d6efd' : '1px solid #dee2e6',
            }}
            aria-current={currentPage === page ? 'page' : undefined}
          >
            {page}
          </button>
        )
      )}

      {/* Next */}
      <button
        style={{ ...btnBase, opacity: isLast ? 0.4 : 1, cursor: isLast ? 'default' : 'pointer' }}
        onClick={() => !isLast && onPageChange(currentPage + 1)}
        disabled={isLast}
        title="Next page"
        className="btn btn-outline-secondary p-0"
      >
        <ChevronRight size={16} />
      </button>

      {/* Last */}
      <button
        style={{ ...btnBase, opacity: isLast ? 0.4 : 1, cursor: isLast ? 'default' : 'pointer' }}
        onClick={() => !isLast && onPageChange(totalPages)}
        disabled={isLast}
        title="Last page"
        className="btn btn-outline-secondary p-0"
      >
        <ChevronsRight size={16} />
      </button>
    </nav>
  );
};

export default Pagination;

