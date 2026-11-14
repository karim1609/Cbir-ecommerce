import type { Product, Category, ProductFilters, PaginatedResponse } from '../types';
import {
  mockProducts,
  mockCategories,
  mockFeaturedProducts,
  mockTrendingProducts,
} from '../utils/mockData';

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function filterProducts(products: Product[], filters: ProductFilters): Product[] {
  let result = [...products];

  if (filters.search) {
    const q = filters.search.toLowerCase();
    result = result.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.tags.some((t) => t.toLowerCase().includes(q)),
    );
  }

  if (filters.category) {
    result = result.filter((p) => p.category.slug === filters.category);
  }

  if (filters.minPrice !== undefined) {
    result = result.filter((p) => p.price >= (filters.minPrice ?? 0));
  }

  if (filters.maxPrice !== undefined) {
    result = result.filter((p) => p.price <= (filters.maxPrice ?? Infinity));
  }

  if (filters.rating !== undefined) {
    result = result.filter((p) => p.rating >= (filters.rating ?? 0));
  }

  if (filters.inStock) {
    result = result.filter((p) => p.inStock);
  }

  switch (filters.sortBy) {
    case 'price_asc':
      result.sort((a, b) => a.price - b.price);
      break;
    case 'price_desc':
      result.sort((a, b) => b.price - a.price);
      break;
    case 'rating':
      result.sort((a, b) => b.rating - a.rating);
      break;
    case 'newest':
      result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      break;
    default:
      result.sort((a, b) => a.name.localeCompare(b.name));
  }

  return result;
}

export async function getProducts(filters: ProductFilters = {}): Promise<PaginatedResponse<Product>> {
  // TODO: Replace with real API call: GET /api/products/
  await delay(400);
  const pageSize = filters.pageSize ?? 12;
  const page = filters.page ?? 1;
  const filtered = filterProducts(mockProducts, filters);
  const totalPages = Math.ceil(filtered.length / pageSize);
  const start = (page - 1) * pageSize;
  const results = filtered.slice(start, start + pageSize);

  return {
    results,
    count: filtered.length,
    next: page < totalPages ? `?page=${page + 1}` : null,
    previous: page > 1 ? `?page=${page - 1}` : null,
    totalPages,
    currentPage: page,
  };
}

export async function getProduct(id: number): Promise<Product> {
  // TODO: Replace with real API call: GET /api/products/:id/
  await delay(300);
  const product = mockProducts.find((p) => p.id === id);
  if (!product) throw new Error('Product not found');
  return product;
}

export async function getFeaturedProducts(): Promise<Product[]> {
  // TODO: Replace with real API call: GET /api/products/?featured=true
  await delay(300);
  return mockFeaturedProducts;
}

export async function getTrendingProducts(): Promise<Product[]> {
  // TODO: Replace with real API call: GET /api/products/?trending=true
  await delay(300);
  return mockTrendingProducts;
}

export async function getCategories(): Promise<Category[]> {
  // TODO: Replace with real API call: GET /api/categories/
  await delay(200);
  return mockCategories;
}

export async function getRelatedProducts(productId: number, categoryId: number): Promise<Product[]> {
  // TODO: Replace with real API call: GET /api/products/:id/related/
  await delay(300);
  return mockProducts
    .filter((p) => p.category.id === categoryId && p.id !== productId)
    .slice(0, 4);
}
