"use client";

import { useState, useCallback, useEffect } from "react";
import Image from "next/image";
import { ChevronLeftIcon, ChevronRightIcon, XMarkIcon } from "@heroicons/react/24/outline";

interface GalleryViewProps {
  images: { url: string; key: string }[];
}

export default function GalleryView({ images }: GalleryViewProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [imageDimensions, setImageDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    if (images[currentIndex]?.url) {
      const img = document.createElement('img');
      img.src = images[currentIndex].url;
      img.onload = () => {
        setImageDimensions({ width: img.width, height: img.height });
        setIsLoading(false);
        setHasError(false);
      };
      img.onerror = () => {
        setHasError(true);
        setIsLoading(false);
      };
    }
  }, [currentIndex, images]);

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (touchStart - touchEnd > 75) {
      nextImage();
    }
    if (touchStart - touchEnd < -75) {
      prevImage();
    }
  };

  const nextImage = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
    setIsLoading(true);
  }, [images.length]);

  const prevImage = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
    setIsLoading(true);
  }, [images.length]);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (isModalOpen) {
      if (e.key === 'ArrowRight') nextImage();
      if (e.key === 'ArrowLeft') prevImage();
      if (e.key === 'Escape') setIsModalOpen(false);
    }
  }, [isModalOpen, nextImage, prevImage]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  if (images.length === 0) {
    return (
      <div className="aspect-w-16 aspect-h-9 bg-gray-100 rounded-lg flex items-center justify-center">
        <p className="text-gray-500">No images available</p>
      </div>
    );
  }

  return (
    <>
      <div className="relative">
        <div 
          className="relative bg-gray-100 rounded-lg overflow-hidden cursor-pointer"
          style={{ 
            minHeight: '400px',
            maxHeight: '600px'
          }}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onClick={() => setIsModalOpen(true)}
        >
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
            </div>
          )}
          {hasError && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
              <div className="text-center">
                <p className="text-red-500 mb-2">Failed to load image</p>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsLoading(true);
                  }}
                  className="text-indigo-500 hover:text-indigo-600"
                >
                  Retry
                </button>
              </div>
            </div>
          )}
          <div className="relative w-full h-full flex items-center justify-center" style={{ minHeight: '400px', maxHeight: '600px' }}>
            <div className="relative w-full h-full" style={{ 
              maxWidth: '100%',
              maxHeight: '100%',
              margin: 'auto'
            }}>
              <Image
                src={images[currentIndex].url}
                alt={`Gallery image ${currentIndex + 1}`}
                fill
                className={`transition-opacity duration-300 ${
                  isLoading ? 'opacity-0' : 'opacity-100'
                }`}
                style={{
                  objectFit: 'contain',
                  objectPosition: 'center'
                }}
                priority
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 70vw"
                quality={85}
                unoptimized={images[currentIndex].url.startsWith('data:')}
              />
            </div>
          </div>
        </div>

        {images.length > 1 && (
          <>
            <button
              onClick={(e) => {
                e.stopPropagation();
                prevImage();
              }}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-md transition-colors z-10"
              aria-label="Previous image"
            >
              <ChevronLeftIcon className="h-6 w-6" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                nextImage();
              }}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-md transition-colors z-10"
              aria-label="Next image"
            >
              <ChevronRightIcon className="h-6 w-6" />
            </button>

            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2 z-10">
              {images.map((_, index) => (
                <button
                  key={index}
                  onClick={(e) => {
                    e.stopPropagation();
                    setCurrentIndex(index);
                    setIsLoading(true);
                  }}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    index === currentIndex ? "bg-white" : "bg-white/50"
                  }`}
                  aria-label={`Go to image ${index + 1}`}
                />
              ))}
            </div>
          </>
        )}

        <div className="mt-4 grid grid-cols-4 gap-2">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={(e) => {
                e.stopPropagation();
                setCurrentIndex(index);
                setIsLoading(true);
              }}
              className={`relative aspect-square rounded-md overflow-hidden ${
                index === currentIndex ? "ring-2 ring-indigo-500" : ""
              }`}
            >
              <div className="relative w-full h-full">
                <Image
                  src={image.url}
                  alt={`Thumbnail ${index + 1}`}
                  fill
                  className="object-cover"
                  style={{
                    objectPosition: 'center'
                  }}
                  sizes="(max-width: 768px) 25vw, 20vw"
                  loading="lazy"
                  quality={60}
                  unoptimized={image.url.startsWith('data:')}
                />
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Full-screen Modal */}
      {isModalOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center"
          onClick={() => setIsModalOpen(false)}
        >
          <div className="relative w-full h-full flex items-center justify-center p-4">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-white hover:text-gray-300"
              aria-label="Close modal"
            >
              <XMarkIcon className="h-8 w-8" />
            </button>
            
            <div className="relative w-full h-full flex items-center justify-center">
              <div className="relative" style={{ 
                width: '100%',
                height: '90vh',
                maxWidth: '90vw'
              }}>
                <Image
                  src={images[currentIndex].url}
                  alt={`Full screen image ${currentIndex + 1}`}
                  fill
                  className="object-contain"
                  style={{
                    objectPosition: 'center'
                  }}
                  quality={100}
                  priority
                  sizes="100vw"
                  unoptimized={images[currentIndex].url.startsWith('data:')}
                />
              </div>
            </div>

            {images.length > 1 && (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    prevImage();
                  }}
                  className="absolute left-4 text-white hover:text-gray-300"
                  aria-label="Previous image"
                >
                  <ChevronLeftIcon className="h-12 w-12" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    nextImage();
                  }}
                  className="absolute right-4 text-white hover:text-gray-300"
                  aria-label="Next image"
                >
                  <ChevronRightIcon className="h-12 w-12" />
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
} 