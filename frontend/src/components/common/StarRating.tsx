import { Star } from 'lucide-react';

interface StarRatingProps {
  rating: number;
  size?: 'sm' | 'md';
  showCount?: boolean;
  count?: number;
}

const StarRating = ({ rating, size = 'md', showCount = false, count }: StarRatingProps) => {
  const starSize = size === 'sm' ? 14 : 18;
  const fontSize = size === 'sm' ? '0.8rem' : '0.9rem';

  const renderStars = () => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalf = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalf ? 1 : 0);

    // Full stars
    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <Star
          key={`full-${i}`}
          size={starSize}
          className="star-filled"
          style={{ fill: '#f59e0b', color: '#f59e0b' }}
        />
      );
    }

    // Half star
    if (hasHalf) {
      stars.push(
        <span
          key="half"
          style={{
            position: 'relative',
            display: 'inline-flex',
            width: starSize,
            height: starSize,
            overflow: 'hidden',
          }}
        >
          {/* Full star background (gray) */}
          <Star
            size={starSize}
            style={{
              fill: '#d1d5db',
              color: '#d1d5db',
              position: 'absolute',
              top: 0,
              left: 0,
            }}
          />
          {/* Half star overlay (gold, clipped to left 50%) */}
          <span
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '50%',
              overflow: 'hidden',
              display: 'inline-block',
            }}
          >
            <Star
              size={starSize}
              style={{ fill: '#f59e0b', color: '#f59e0b' }}
            />
          </span>
        </span>
      );
    }

    // Empty stars
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <Star
          key={`empty-${i}`}
          size={starSize}
          style={{ fill: '#d1d5db', color: '#d1d5db' }}
        />
      );
    }

    return stars;
  };

  return (
    <div
      className="d-inline-flex align-items-center gap-1"
      title={`${rating.toFixed(1)} out of 5 stars`}
    >
      <div className="d-flex align-items-center" style={{ gap: '1px' }}>
        {renderStars()}
      </div>
      {showCount && count !== undefined && (
        <span style={{ fontSize, color: 'var(--text-secondary)', fontWeight: 500 }}>
          ({count.toLocaleString()})
        </span>
      )}
    </div>
  );
};

export default StarRating;
