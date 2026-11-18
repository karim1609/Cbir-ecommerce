import apiClient from './api';
import type { Product, Category, ProductFilters, PaginatedResponse } from '../types';
import {
  mockProducts,
  mockCategories,
  mockFeaturedProducts,
  mockTrendingProducts,
} from '../utils/mockData';

export async function getProducts(filters: ProductFilters = {}): Promise<PaginatedResponse<Product>> {
  try {
    const params: Record<string, string | number | boolean> = {};

    if (filters.page) params.page = filters.page;
    if (filters.pageSize) params.pageSize = filters.pageSize;
    if (filters.category) params.category = filters.category;
    if (filters.search) params.search = filters.search;
    if (filters.minPrice !== undefined) params.minPrice = filters.minPrice;
    if (filters.maxPrice !== undefined) params.maxPrice = filters.maxPrice;
    if (filters.inStock) params.inStock = true;
    if (filters.sortBy) params.sortBy = filters.sortBy;

    const response = await apiClient.get<PaginatedResponse<Product>>('/products/', { params });
    return response.data;
  } catch (error) {
    console.warn('Backend API unavailable, falling back to local data:', error);
    // Graceful fallback to mock data if backend container is offline
    const pageSize = filters.pageSize ?? 12;
    const page = filters.page ?? 1;
    let filtered = [...mockProducts];

    if (filters.category) {
      filtered = filtered.filter((p) => p.category.slug === filters.category);
    }
    if (filters.search) {
      const q = filters.search.toLowerCase();
      filtered = filtered.filter((p) => p.name.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q));
    }
    const totalPages = Math.ceil(filtered.length / pageSize) || 1;
    const start = (page - 1) * pageSize;
    return {
      results: filtered.slice(start, start + pageSize),
      count: filtered.length,
      next: page < totalPages ? `?page=${page + 1}` : null,
      previous: page > 1 ? `?page=${page - 1}` : null,
      totalPages,
      currentPage: page,
    };
  }
}

export async function getProduct(id: number): Promise<Product> {
  try {
    const response = await apiClient.get<Product>(`/products/${id}/`);
    return response.data;
  } catch (error) {
    console.warn(`Product ${id} not found in backend, checking fallback:`, error);
    const product = mockProducts.find((p) => p.id === id);
    if (!product) throw new Error('Product not found');
    return product;
  }
}

export async function getFeaturedProducts(): Promise<Product[]> {
  try {
    const response = await apiClient.get<PaginatedResponse<Product> | Product[]>('/products/', {
      params: { featured: true, pageSize: 8 },
    });
    const data = response.data;
    if (Array.isArray(data)) return data;
    if (data && Array.isArray(data.results)) return data.results;
    return mockFeaturedProducts;
  } catch (error) {
    console.warn('Failed to load featured products from API:', error);
    return mockFeaturedProducts;
  }
}

export async function getTrendingProducts(): Promise<Product[]> {
  try {
    const response = await apiClient.get<PaginatedResponse<Product> | Product[]>('/products/', {
      params: { trending: true, pageSize: 8 },
    });
    const data = response.data;
    if (Array.isArray(data)) return data;
    if (data && Array.isArray(data.results)) return data.results;
    return mockTrendingProducts;
  } catch (error) {
    console.warn('Failed to load trending products from API:', error);
    return mockTrendingProducts;
  }
}

export async function getCategories(): Promise<Category[]> {
  try {
    const response = await apiClient.get<Category[] | { results: Category[] }>('/categories/');
    const data = response.data;
    if (Array.isArray(data)) return data;
    if (data && Array.isArray((data as any).results)) return (data as any).results;
    return mockCategories;
  } catch (error) {
    console.warn('Failed to load categories from API:', error);
    return mockCategories;
  }
}

export async function getRelatedProducts(productId: number, categoryId: number): Promise<Product[]> {
  try {
    const response = await apiClient.get<Product[]>(`/products/${productId}/related/`);
    return response.data;
  } catch {
    return mockProducts
      .filter((p) => p.category.id === categoryId && p.id !== productId)
      .slice(0, 4);
  }
}
