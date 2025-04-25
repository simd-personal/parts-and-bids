"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";

interface Image {
  id: string;
  url: string;
  key: string;
  isDefault: boolean;
  listingId: string;
  createdAt: string;
  updatedAt: string;
}

interface Listing {
  id: string;
  title: string;
  description: string;
  price: number;
  condition: string;
  location: string;
  category: string;
  make: string | null;
  model: string | null;
  year: number | null;
  endDate: string;
  status: string;
  sellerId: string;
  createdAt: string;
  updatedAt: string;
  images: Image[];
  seller: {
    id: string;
    name: string;
    email: string;
  };
}

const ListingCard = ({ listing }: { listing: Listing }) => {
  const [imageError, setImageError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const imageUrl = useMemo(() => {
    console.log('Processing images for listing:', listing.id);
    if (!listing.images || listing.images.length === 0) {
      console.log('No images found for listing:', listing.id);
      return "/placeholder.svg";
    }

    const defaultImage = listing.images.find(img => img.isDefault);
    const selectedImage = defaultImage || listing.images[0];
    
    if (!selectedImage.url) {
      console.log('No URL found in selected image:', selectedImage);
      return "/placeholder.svg";
    }

    console.log('Using image URL for listing:', listing.id, selectedImage.url);
    return selectedImage.url;
  }, [listing.images, listing.id]);

  useEffect(() => {
    // Preload the image
    const img = new Image();
    img.src = imageUrl;
    img.onload = () => {
      console.log('Image preloaded successfully:', imageUrl);
      setIsLoading(false);
    };
    img.onerror = (error) => {
      console.error('Error preloading image:', imageUrl, error);
      setImageError(true);
      setIsLoading(false);
    };
  }, [imageUrl]);

  return (
    <Link href={`/listings/${listing.id}`}>
      <div className="bg-white rounded-lg shadow overflow-hidden hover:shadow-lg transition-shadow duration-300">
        <div className="relative h-48 bg-gray-100">
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-2 border-indigo-500 border-t-transparent"></div>
            </div>
          )}
          <img
            src={imageUrl}
            alt={listing.title}
            className={`w-full h-full object-cover transition-opacity duration-300 ${
              isLoading ? 'opacity-0' : 'opacity-100'
            }`}
            crossOrigin="anonymous"
            onLoad={() => {
              console.log('Image loaded in DOM:', listing.id);
              setIsLoading(false);
            }}
            onError={(e) => {
              console.error('Image error in DOM:', listing.id, e);
              setImageError(true);
              setIsLoading(false);
            }}
          />
          {imageError && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
              <div className="text-gray-400">
                <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <p className="mt-2 text-sm">Image not available</p>
              </div>
            </div>
          )}
        </div>
        <div className="p-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {listing.title}
          </h3>
          <div className="flex justify-between items-center">
            <span className="text-xl font-bold text-indigo-600">
              ${listing.price.toLocaleString()}
            </span>
            <span className="text-sm text-gray-500 capitalize">
              {listing.condition}
            </span>
          </div>
          <div className="mt-2 text-sm text-gray-500">
            {listing.location}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default function BrowsePage() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [filters, setFilters] = useState({
    category: "",
    make: "",
    model: "",
    minPrice: "",
    maxPrice: "",
    condition: "",
  });

  useEffect(() => {
    fetchListings();
  }, [filters]);

  const fetchListings = async () => {
    try {
      const searchParams = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value) searchParams.append(key, value);
      });

      const response = await fetch(`/api/listings?${searchParams}`);
      if (!response.ok) {
        throw new Error("Failed to fetch listings");
      }

      const data = await response.json();
      console.log("Fetched listings data:", data);
      if (!Array.isArray(data)) {
        console.error("Unexpected data format:", data);
        throw new Error("Invalid data format from server");
      }
      setListings(data);
    } catch (err) {
      console.error("Error fetching listings:", err);
      setError(err instanceof Error ? err.message : "Failed to load listings");
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Available Parts</h1>
        <p className="text-gray-600 mb-8">Browse through our collection of auto parts</p>

        {/* Filters */}
        <div className="bg-white p-6 rounded-lg shadow mb-8">
          <h2 className="text-xl font-semibold mb-4">Filters</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <select
                name="category"
                value={filters.category}
                onChange={handleFilterChange}
                className="w-full p-2 border rounded"
              >
                <option value="">All Categories</option>
                <option value="engine">Engine</option>
                <option value="transmission">Transmission</option>
                <option value="body">Body Parts</option>
                <option value="interior">Interior</option>
                <option value="exterior">Exterior</option>
                <option value="electrical">Electrical</option>
                <option value="suspension">Suspension</option>
                <option value="brakes">Brakes</option>
                <option value="wheels">Wheels & Tires</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Make
              </label>
              <input
                type="text"
                name="make"
                value={filters.make}
                onChange={handleFilterChange}
                className="w-full p-2 border rounded"
                placeholder="Enter make"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Model
              </label>
              <input
                type="text"
                name="model"
                value={filters.model}
                onChange={handleFilterChange}
                className="w-full p-2 border rounded"
                placeholder="Enter model"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Min Price
              </label>
              <input
                type="number"
                name="minPrice"
                value={filters.minPrice}
                onChange={handleFilterChange}
                className="w-full p-2 border rounded"
                placeholder="Min price"
                min="0"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Max Price
              </label>
              <input
                type="number"
                name="maxPrice"
                value={filters.maxPrice}
                onChange={handleFilterChange}
                className="w-full p-2 border rounded"
                placeholder="Max price"
                min="0"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Condition
              </label>
              <select
                name="condition"
                value={filters.condition}
                onChange={handleFilterChange}
                className="w-full p-2 border rounded"
              >
                <option value="">All Conditions</option>
                <option value="new">New</option>
                <option value="used">Used</option>
                <option value="refurbished">Refurbished</option>
              </select>
            </div>
          </div>
        </div>

        {/* Listings Grid */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          </div>
        ) : error ? (
          <div className="text-center py-12 text-red-600">{error}</div>
        ) : listings.length === 0 ? (
          <div className="text-center py-12 text-gray-600">No listings found</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {listings.map((listing) => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 