import React, { useEffect, useState, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SlidersHorizontal } from 'lucide-react';
import type { Product, ProductFilters as ProductFiltersType, Category } from '../types';
import * as productService from '../services/productService';
import ProductGrid from '../components/products/ProductGrid';
import ProductFilters from '../components/products/ProductFilters';
import SortBar from '../components/products/SortBar';
import Pagination from '../components/products/Pagination';

const DEFAULT_PAGE_SIZE = 12;

const ProductsPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const filtersFromURL = (): ProductFiltersType => ({
    page: parseInt(searchParams.get('page') || '1'),
    pageSize: DEFAULT_PAGE_SIZE,
    search: searchParams.get('search') || undefined,
    category: searchParams.get('category') || undefined,
    minPrice: searchParams.get('minPrice') ? parseFloat(searchParams.get('minPrice')!) : undefined,
    maxPrice: searchParams.get('maxPrice') ? parseFloat(searchParams.get('maxPrice')!) : undefined,
    rating: searchParams.get('rating') ? parseInt(searchParams.get('rating')!) : undefined,
    inStock: searchParams.get('inStock') === 'true' ? true : undefined,
    sortBy: (searchParams.get('sortBy') as ProductFiltersType['sortBy']) || 'newest',
  });

  const [filters, setFilters] = useState<ProductFiltersType>(filtersFromURL);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [categories, setCategories] = useState<Category[]>([]);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // Sync filters → URL
  const syncURL = useCallback((f: ProductFiltersType) => {
    const params: Record<string, string> = {};
    if (f.page && f.page > 1) params.page = String(f.page);
    if (f.search) params.search = f.search;
    if (f.category) params.category = f.category;
    if (f.minPrice != null) params.minPrice = String(f.minPrice);
    if (f.maxPrice != null) params.maxPrice = String(f.maxPrice);
    if (f.rating != null) params.rating = String(f.rating);
    if (f.inStock) params.inStock = 'true';
    if (f.sortBy && f.sortBy !== 'newest') params.sortBy = f.sortBy;
    setSearchParams(params);
  }, [setSearchParams]);

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await productService.getProducts(filters);
        setProducts(response.results);
        setTotalCount(response.count);
        setTotalPages(response.totalPages);
      } catch (err: any) {
        setError(err?.message || 'Failed to load products. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [filters]);

  // Fetch categories once
  useEffect(() => {
    productService.getCategories().then(setCategories).catch(console.error);
  }, []);

  const handleFilterChange = (newFilters: ProductFiltersType) => {
    const updated = { ...newFilters, page: 1, pageSize: DEFAULT_PAGE_SIZE };
    setFilters(updated);
    syncURL(updated);
  };

  const handleSortChange = (sortBy: string) => {
    const updated = { ...filters, sortBy: sortBy as ProductFiltersType['sortBy'], page: 1 };
    setFilters(updated);
    syncURL(updated);
  };

  const handlePageChange = (page: number) => {
    const updated = { ...filters, page };
    setFilters(updated);
    syncURL(updated);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="container-xl py-4">
      {/* Page Header */}
      <div className="mb-4">
        <h1 className="fw-bold text-dark mb-1" style={{ fontSize: '1.9rem' }}>Shop All Products</h1>
        <p className="text-muted mb-0">Discover our full collection</p>
      </div>

      <div className="row g-4">
        {/* Sidebar — desktop */}
        <div className="col-12 col-md-3 d-none d-md-block">
          <ProductFilters
            filters={filters}
            onFilterChange={handleFilterChange}
            categories={categories}
          />
        </div>

        {/* Main Content */}
        <div className="col-12 col-md-9">
          {/* Mobile filter toggle */}
          <div className="d-md-none mb-3">
            <button
              className="btn btn-outline-primary w-100 d-flex align-items-center justify-content-center gap-2"
              onClick={() => setMobileFiltersOpen(prev => !prev)}
              style={{ borderRadius: 10 }}
            >
              <SlidersHorizontal size={18} />
              <span>Filters & Sort</span>
            </button>

            {mobileFiltersOpen && (
              <div className="mt-2">
                <ProductFilters
                  filters={filters}
                  onFilterChange={f => { handleFilterChange(f); setMobileFiltersOpen(false); }}
                  categories={categories}
                />
              </div>
            )}
          </div>

          {/* Sort Bar */}
          <SortBar
            totalCount={totalCount}
            currentPage={filters.page || 1}
            pageSize={filters.pageSize || DEFAULT_PAGE_SIZE}
            sortBy={filters.sortBy || 'newest'}
            onSortChange={handleSortChange}
          />

          {/* Product Grid */}
          <ProductGrid
            products={products}
            loading={loading}
            error={error}
            showCategory
          />

          {/* Pagination */}
          {!loading && !error && (
            <Pagination
              currentPage={filters.page || 1}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductsPage;

