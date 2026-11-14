import { useState, useCallback } from 'react';
import type { SearchResult, Product } from '../types';
import { searchByImage, searchByText } from '../services/searchService';

interface UseSearchResult {
  results: SearchResult[];
  textResults: Product[];
  loading: boolean;
  error: string | null;
  hasSearched: boolean;
  searchTime: number;
  searchByImageFile: (file: File) => Promise<void>;
  searchByTextQuery: (query: string) => Promise<void>;
  clearResults: () => void;
}

export function useSearch(): UseSearchResult {
  const [results, setResults] = useState<SearchResult[]>([]);
  const [textResults, setTextResults] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [searchTime, setSearchTime] = useState(0);

  const searchByImageFile = useCallback(async (file: File) => {
    setLoading(true);
    setError(null);
    setHasSearched(false);
    try {
      const response = await searchByImage(file);
      setResults(response.results);
      setSearchTime(response.searchTime);
      setHasSearched(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Search failed');
    } finally {
      setLoading(false);
    }
  }, []);

  const searchByTextQuery = useCallback(async (query: string) => {
    setLoading(true);
    setError(null);
    try {
      const products = await searchByText(query);
      setTextResults(products);
      setHasSearched(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Search failed');
    } finally {
      setLoading(false);
    }
  }, []);

  const clearResults = useCallback(() => {
    setResults([]);
    setTextResults([]);
    setHasSearched(false);
    setError(null);
    setSearchTime(0);
  }, []);

  return {
    results,
    textResults,
    loading,
    error,
    hasSearched,
    searchTime,
    searchByImageFile,
    searchByTextQuery,
    clearResults,
  };
}
