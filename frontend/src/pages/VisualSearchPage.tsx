import { useState, useCallback, useEffect } from 'react';
import { Camera, Search, Cpu, Zap, ChevronRight, AlertCircle, RotateCcw } from 'lucide-react';
import type { SearchResult } from '../types';
import ImageUploader from '../components/search/ImageUploader';
import SearchResultCard from '../components/search/SearchResultCard';
import { searchByImage } from '../services/searchService';

export default function VisualSearchPage() {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [searchTime, setSearchTime] = useState(0);

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const handleImageSelect = useCallback((file: File) => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    const url = URL.createObjectURL(file);
    setSelectedImage(file);
    setPreviewUrl(url);
    setHasSearched(false);
    setError(null);
  }, [previewUrl]);

  const handleImageRemove = useCallback(() => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setSelectedImage(null);
    setPreviewUrl(null);
    setResults([]);
    setHasSearched(false);
    setError(null);
  }, [previewUrl]);

  const handleSearch = useCallback(async () => {
    if (!selectedImage) return;
    setLoading(true);
    setError(null);
    setHasSearched(false);
    try {
      const response = await searchByImage(selectedImage);
      setResults(response.results);
      setSearchTime(response.searchTime);
      setHasSearched(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Search failed. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [selectedImage]);

  return (
    <div>
      {/* Hero Header */}
      <div style={{
        background: 'linear-gradient(135deg, #1e3a5f 0%, #2563eb 50%, #7c3aed 100%)',
        padding: '3rem 0 2rem',
        color: '#fff',
        textAlign: 'center',
      }}>
        <div className="container">
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(255,255,255,0.15)', borderRadius: 999, padding: '6px 16px', marginBottom: '1rem', fontSize: '0.85rem' }}>
            <Cpu size={14} /> Powered by ResNet50 Deep Learning
          </div>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '0.75rem' }}>Visual Product Search</h1>
          <p style={{ fontSize: '1.1rem', opacity: 0.85, maxWidth: 540, margin: '0 auto' }}>
            Upload any product image and our AI finds visually similar items in seconds
          </p>
        </div>
      </div>

      <div className="container py-5">
        <div className="row g-4">
          {/* LEFT: Upload */}
          <div className="col-lg-5">
            <div className="card border-0" style={{ borderRadius: 20, boxShadow: '0 4px 24px rgba(0,0,0,0.08)' }}>
              <div className="card-body p-4">
                <h5 className="fw-bold mb-1 d-flex align-items-center gap-2">
                  <Camera size={20} className="text-primary" /> Upload Your Image
                </h5>
                <p className="text-muted small mb-3">Supported: JPG, PNG, WEBP · Max 10 MB</p>

                <ImageUploader
                  onImageSelect={handleImageSelect}
                  onImageRemove={handleImageRemove}
                  selectedImage={selectedImage}
                  previewUrl={previewUrl}
                />

                <button
                  className="btn btn-primary w-100 mt-3 py-2 fw-semibold d-flex align-items-center justify-content-center gap-2"
                  style={{ borderRadius: 12, fontSize: '1rem' }}
                  onClick={handleSearch}
                  disabled={!selectedImage || loading}
                >
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm" role="status" /> Searching...
                    </>
                  ) : (
                    <>
                      <Search size={18} /> Search Similar Products
                    </>
                  )}
                </button>

                {/* Tips */}
                <div style={{ marginTop: '1.5rem', background: '#f8fafc', borderRadius: 12, padding: '1rem' }}>
                  <div className="fw-semibold small mb-2" style={{ color: '#1e3a5f' }}>💡 Tips for Better Results</div>
                  {['Use a clear, well-lit product photo', 'Crop to show a single product', 'Avoid blurry or low-resolution images', 'Plain backgrounds work best'].map((tip) => (
                    <div key={tip} className="d-flex align-items-start gap-2 mb-1">
                      <ChevronRight size={14} className="text-primary mt-1 flex-shrink-0" />
                      <span className="small text-muted">{tip}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT: Results */}
          <div className="col-lg-7">
            {!hasSearched && !loading && !error && (
              <div className="card border-0 h-100" style={{ borderRadius: 20, boxShadow: '0 4px 24px rgba(0,0,0,0.08)' }}>
                <div className="card-body p-4 d-flex flex-column align-items-center justify-content-center text-center" style={{ minHeight: 400 }}>
                  <div style={{ width: 80, height: 80, background: 'linear-gradient(135deg, #2563eb, #7c3aed)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem' }}>
                    <Camera size={36} color="#fff" />
                  </div>
                  <h5 className="fw-bold mb-3">How It Works</h5>
                  {[
                    { step: 1, icon: '📸', title: 'Upload Image', desc: 'Take or upload a product photo' },
                    { step: 2, icon: '🧠', title: 'AI Analysis', desc: 'ResNet50 extracts 2048-D feature vectors' },
                    { step: 3, icon: '🎯', title: 'Find Similar', desc: 'Cosine similarity ranks matching products' },
                  ].map((item) => (
                    <div key={item.step} className="d-flex align-items-center gap-3 mb-3 text-start w-100" style={{ maxWidth: 360 }}>
                      <div style={{ width: 40, height: 40, background: '#eff6ff', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', flexShrink: 0 }}>
                        {item.icon}
                      </div>
                      <div>
                        <div className="fw-semibold small">{item.step}. {item.title}</div>
                        <div className="text-muted" style={{ fontSize: '0.8rem' }}>{item.desc}</div>
                      </div>
                    </div>
                  ))}
                  <div style={{ marginTop: '1rem', background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 8, padding: '8px 16px', fontSize: '0.8rem', color: '#16a34a', fontWeight: 600 }}>
                    ✓ Powered by ResNet50 · 2048-D Vectors · Cosine Similarity
                  </div>
                </div>
              </div>
            )}

            {loading && (
              <div className="card border-0" style={{ borderRadius: 20, boxShadow: '0 4px 24px rgba(0,0,0,0.08)' }}>
                <div className="card-body p-4 d-flex flex-column align-items-center justify-content-center text-center" style={{ minHeight: 400 }}>
                  <div style={{ width: 80, height: 80, position: 'relative', marginBottom: '1.5rem' }}>
                    <div className="spinner-border text-primary" style={{ width: 80, height: 80, borderWidth: 4 }} role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                    <Cpu size={28} className="text-primary" style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)' }} />
                  </div>
                  <h5 className="fw-bold mb-2">Analyzing Image...</h5>
                  <p className="text-muted small">ResNet50 is extracting 2048-dimensional feature vectors</p>
                  <div style={{ width: '100%', maxWidth: 300, background: '#e2e8f0', borderRadius: 999, height: 6, overflow: 'hidden', marginTop: '1rem' }}>
                    <div style={{ height: '100%', background: 'linear-gradient(90deg, #2563eb, #7c3aed)', borderRadius: 999, animation: 'progress-anim 1.5s ease-in-out infinite alternate', width: '70%' }} />
                  </div>
                </div>
              </div>
            )}

            {error && !loading && (
              <div className="card border-0" style={{ borderRadius: 20, boxShadow: '0 4px 24px rgba(0,0,0,0.08)' }}>
                <div className="card-body p-4 d-flex flex-column align-items-center justify-content-center text-center" style={{ minHeight: 400 }}>
                  <AlertCircle size={48} className="text-danger mb-3" />
                  <h5 className="fw-bold">Search Failed</h5>
                  <p className="text-muted small">{error}</p>
                  <button className="btn btn-outline-primary mt-2 d-flex align-items-center gap-2" onClick={handleSearch}>
                    <RotateCcw size={16} /> Try Again
                  </button>
                </div>
              </div>
            )}

            {hasSearched && !loading && results.length > 0 && (
              <div>
                <div className="d-flex align-items-center justify-content-between mb-3 flex-wrap gap-2">
                  <div>
                    <h5 className="fw-bold mb-0">Found {results.length} Similar Products</h5>
                    <span className="text-muted small">
                      <Zap size={12} className="me-1" />Search completed in {searchTime.toFixed(2)}s · Sorted by similarity
                    </span>
                  </div>
                  <button className="btn btn-sm btn-outline-secondary d-flex align-items-center gap-1" onClick={handleImageRemove}>
                    <RotateCcw size={14} /> New Search
                  </button>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '1rem' }}>
                  {results.map((result) => (
                    <SearchResultCard key={result.product.id} result={result} rank={result.rank} />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes progress-anim {
          from { width: 20%; }
          to { width: 90%; }
        }
      `}</style>
    </div>
  );
}
