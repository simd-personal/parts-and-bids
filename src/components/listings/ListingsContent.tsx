"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";

interface Listing {
  id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  make: string;
  model: string;
  year: number;
  condition: string;
  location: string;
  seller: {
    name: string;
  };
  createdAt: string;
}

export default function ListingsContent() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const router = useRouter();

  const [filters, setFilters] = useState({
    category: searchParams.get("category") || "",
    make: searchParams.get("make") || "",
    model: searchParams.get("model") || "",
    minPrice: searchParams.get("minPrice") || "",
    maxPrice: searchParams.get("maxPrice") || "",
    condition: searchParams.get("condition") || "",
  });

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const queryParams = new URLSearchParams();
        Object.entries(filters).forEach(([key, value]) => {
          if (value) queryParams.set(key, value);
        });

        const response = await fetch(`/api/listings?${queryParams.toString()}`);
        if (!response.ok) throw new Error("Failed to fetch listings");
        const data = await response.json();
        setListings(data);
      } catch (err) {
        setError("Failed to load listings");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchListings();
  }, [filters]);

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleFilterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const queryParams = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value) queryParams.set(key, value);
    });
    router.push(`/listings?${queryParams.toString()}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-600">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Available Parts</h1>
          <p className="mt-2 text-sm text-gray-600">
            Browse through our collection of auto parts
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Filters</h2>
            <form onSubmit={handleFilterSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Category
                </label>
                <select
                  name="category"
                  value={filters.category}
                  onChange={handleFilterChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                >
                  <option value="">All Categories</option>
                  <option value="engine">Engine</option>
                  <option value="transmission">Transmission</option>
                  <option value="body">Body</option>
                  <option value="interior">Interior</option>
                  <option value="exterior">Exterior</option>
                  <option value="electrical">Electrical</option>
                  <option value="suspension">Suspension</option>
                  <option value="brakes">Brakes</option>
                  <option value="wheels">Wheels</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Make
                </label>
                <input
                  type="text"
                  name="make"
                  value={filters.make}
                  onChange={handleFilterChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Model
                </label>
                <input
                  type="text"
                  name="model"
                  value={filters.model}
                  onChange={handleFilterChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Price Range
                </label>
                <div className="mt-1 grid grid-cols-2 gap-2">
                  <input
                    type="number"
                    name="minPrice"
                    value={filters.minPrice}
                    onChange={handleFilterChange}
                    placeholder="Min"
                    className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                  <input
                    type="number"
                    name="maxPrice"
                    value={filters.maxPrice}
                    onChange={handleFilterChange}
                    placeholder="Max"
                    className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Condition
                </label>
                <select
                  name="condition"
                  value={filters.condition}
                  onChange={handleFilterChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                >
                  <option value="">All Conditions</option>
                  <option value="new">New</option>
                  <option value="like-new">Like New</option>
                  <option value="good">Good</option>
                  <option value="fair">Fair</option>
                  <option value="poor">Poor</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Apply Filters
              </button>
            </form>
          </div>

          {/* Listings Grid */}
          <div className="lg:col-span-3">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {listings.map((listing) => (
                <Link
                  key={listing.id}
                  href={`/listings/${listing.id}`}
                  className="bg-white rounded-lg shadow overflow-hidden hover:shadow-lg transition-shadow duration-300"
                >
                  <div className="p-6">
                    <h3 className="text-lg font-medium text-gray-900 truncate">
                      {listing.title}
                    </h3>
                    <p className="mt-2 text-sm text-gray-600 line-clamp-2">
                      {listing.description}
                    </p>
                    <div className="mt-4">
                      <p className="text-lg font-bold text-indigo-600">
                        ${listing.price.toLocaleString()}
                      </p>
                      <div className="mt-2 flex items-center text-sm text-gray-500">
                        <span>{listing.make} {listing.model} ({listing.year})</span>
                      </div>
                      <div className="mt-1 flex items-center text-sm text-gray-500">
                        <span className="capitalize">{listing.condition}</span>
                        <span className="mx-2">•</span>
                        <span>{listing.location}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 