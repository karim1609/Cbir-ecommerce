import { useRef, useState, useCallback } from 'react';
import { Upload, Camera, X, FileImage } from 'lucide-react';
import { formatFileSize } from '../../utils/helpers';

interface ImageUploaderProps {
  onImageSelect: (file: File) => void;
  onImageRemove: () => void;
  selectedImage: File | null;
  previewUrl: string | null;
}

const ACCEPTED_FORMATS = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
const MAX_SIZE_BYTES = 10 * 1024 * 1024; // 10 MB

export default function ImageUploader({
  onImageSelect,
  onImageRemove,
  selectedImage,
  previewUrl,
}: ImageUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  const validateAndSelect = useCallback(
    (file: File) => {
      setValidationError(null);
      if (!ACCEPTED_FORMATS.includes(file.type)) {
        setValidationError('Unsupported format. Use JPG, PNG, or WEBP.');
        return;
      }
      if (file.size > MAX_SIZE_BYTES) {
        setValidationError('File is too large. Maximum size is 10 MB.');
        return;
      }
      onImageSelect(file);
    },
    [onImageSelect],
  );

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) validateAndSelect(file);
    },
    [validateAndSelect],
  );

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) validateAndSelect(file);
      e.target.value = '';
    },
    [validateAndSelect],
  );

  return (
    <div className="image-uploader">
      {previewUrl && selectedImage ? (
        <div className="uploader-preview">
          <div className="preview-image-wrapper">
            <img src={previewUrl} alt="Preview" className="preview-image" />
          </div>
          <div className="preview-info">
            <FileImage size={18} className="text-primary me-2" />
            <div className="preview-meta">
              <div className="preview-filename">{selectedImage.name}</div>
              <div className="preview-filesize text-muted">{formatFileSize(selectedImage.size)}</div>
            </div>
            <div className="preview-actions ms-auto d-flex gap-2">
              <button
                type="button"
                className="btn btn-sm btn-outline-secondary"
                onClick={() => inputRef.current?.click()}
              >
                Change
              </button>
              <button
                type="button"
                className="btn btn-sm btn-outline-danger"
                onClick={onImageRemove}
                aria-label="Remove image"
              >
                <X size={16} />
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div
          className={`upload-zone${isDragging ? ' upload-zone--dragging' : ''}`}
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') inputRef.current?.click(); }}
          aria-label="Upload image"
        >
          <div className="upload-zone-content">
            <div className="upload-icon-wrapper">
              {isDragging ? <Upload size={40} className="text-primary" /> : <Camera size={40} className="text-primary" />}
            </div>
            <p className="upload-title">{isDragging ? 'Drop your image here' : 'Drag & drop an image here'}</p>
            <p className="upload-subtitle text-muted">or</p>
            <button
              type="button"
              className="btn btn-primary btn-sm px-4"
              onClick={(e) => { e.stopPropagation(); inputRef.current?.click(); }}
            >
              Browse Files
            </button>
            <p className="upload-formats text-muted mt-3">
              Supported: JPG, PNG, WEBP · Max 10 MB
            </p>
          </div>
        </div>
      )}

      {validationError && (
        <div className="alert alert-danger mt-2 py-2 small" role="alert">
          {validationError}
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept={ACCEPTED_FORMATS.join(',')}
        onChange={handleChange}
        className="d-none"
        aria-hidden="true"
      />

      <style>{`
        .upload-zone {
          border: 2px dashed #2563eb;
          border-radius: 16px;
          padding: 3rem 2rem;
          text-align: center;
          cursor: pointer;
          transition: all 0.2s ease;
          background: #eff6ff;
        }
        .upload-zone:hover, .upload-zone--dragging {
          border-color: #1d4ed8;
          background: #dbeafe;
          transform: scale(1.01);
        }
        .upload-zone--dragging {
          box-shadow: 0 0 0 4px rgba(37,99,235,0.2);
        }
        .upload-icon-wrapper {
          margin-bottom: 1rem;
        }
        .upload-title {
          font-size: 1.1rem;
          font-weight: 600;
          color: #1e3a5f;
          margin-bottom: 0.25rem;
        }
        .upload-subtitle {
          margin-bottom: 0.75rem;
          font-size: 0.9rem;
        }
        .upload-formats {
          font-size: 0.8rem;
          margin-bottom: 0;
        }
        .uploader-preview {
          border: 2px solid #e2e8f0;
          border-radius: 16px;
          overflow: hidden;
        }
        .preview-image-wrapper {
          background: #f8fafc;
          display: flex;
          align-items: center;
          justify-content: center;
          height: 280px;
        }
        .preview-image {
          max-width: 100%;
          max-height: 280px;
          object-fit: contain;
        }
        .preview-info {
          display: flex;
          align-items: center;
          padding: 0.75rem 1rem;
          border-top: 1px solid #e2e8f0;
          background: #fff;
        }
        .preview-filename {
          font-weight: 500;
          font-size: 0.875rem;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          max-width: 160px;
        }
        .preview-filesize {
          font-size: 0.75rem;
        }
      `}</style>
    </div>
  );
}
