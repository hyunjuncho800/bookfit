import React, { useState } from 'react';
import { BookOpen } from 'lucide-react';

interface BookCoverImageProps {
  src: string;
  alt: string;
  className?: string;
}

export const BookCoverImage: React.FC<BookCoverImageProps> = ({ src, alt, className = '' }) => {
  const [hasError, setHasError] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  const handleError = () => {
    if (retryCount < 1) {
      // Retry once by appending query param or switching to HTTP/HTTPS fallback
      setRetryCount((prev) => prev + 1);
    } else {
      setHasError(true);
    }
  };

  // If failed after retry or no src provided, render Classic Wood Fallback Template
  if (hasError || !src) {
    return (
      <div
        className={`bg-cream-card border-2 border-oak/40 rounded-xl p-3 flex flex-col justify-between items-center text-center shadow-inner relative overflow-hidden ${className}`}
      >
        <div className="w-full h-full border border-oak/20 rounded-lg p-2 flex flex-col justify-between items-center bg-[#FAF5EB]">
          <div className="w-7 h-7 rounded-full bg-forest text-oak flex items-center justify-center shrink-0 mt-2">
            <BookOpen className="w-4 h-4" />
          </div>

          <div className="my-auto px-1">
            <span className="text-[10px] font-bold text-oak-dark block uppercase tracking-wider">
              BookFit Classic
            </span>
            <h4 className="text-xs font-bold font-serif text-charcoal line-clamp-2 leading-snug mt-1">
              {alt}
            </h4>
          </div>

          <div className="w-full h-1.5 wood-shelf rounded-full mb-1" />
        </div>
      </div>
    );
  }

  // Append timestamp or cachebuster on retry
  const currentSrc = retryCount > 0 ? `${src}?retry=${retryCount}` : src;

  return (
    <img
      src={currentSrc}
      alt={alt}
      referrerPolicy="no-referrer"
      loading="lazy"
      decoding="async"
      onError={handleError}
      className={className}
    />
  );
};
