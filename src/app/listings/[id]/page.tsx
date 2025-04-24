"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import GalleryView from "@/components/GalleryView";
import { format } from "date-fns";

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
  endDate: string;
  images: { url: string; key: string }[];
  seller: {
    name: string;
    email: string;
  };
}

export default function ListingDetailPage() {
  const params = useParams();
  const [listing, setListing] = useState<Listing | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchListing = async () => {
      try {
        const response = await fetch(`/api/listings/${params.id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch listing");
        }
        const data = await response.json();
        setListing(data);
      } catch (err) {
        setError("Failed to load listing");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchListing();
  }, [params.id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
            <div className="h-96 bg-gray-200 rounded mb-8"></div>
            <div className="space-y-4">
              <div className="h-4 bg-gray-200 rounded w-full"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6"></div>
              <div className="h-4 bg-gray-200 rounded w-4/6"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !listing) {
    return (
      <div className="min-h-screen bg-gray-100 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white shadow sm:rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg font-medium leading-6 text-gray-900">
                Error
              </h3>
              <div className="mt-2 max-w-xl text-sm text-gray-500">
                <p>{error || "Listing not found"}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow sm:rounded-lg overflow-hidden">
          <div className="px-4 py-5 sm:p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div>
                <GalleryView images={listing.images} />
              </div>
              <div className="space-y-6">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">
                    {listing.title}
                  </h1>
                  <p className="mt-2 text-2xl font-semibold text-indigo-600">
                    ${listing.price.toLocaleString()}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Category</p>
                    <p className="mt-1 text-sm text-gray-900">
                      {listing.category}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Condition</p>
                    <p className="mt-1 text-sm text-gray-900">
                      {listing.condition}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Make</p>
                    <p className="mt-1 text-sm text-gray-900">{listing.make}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Model</p>
                    <p className="mt-1 text-sm text-gray-900">{listing.model}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Year</p>
                    <p className="mt-1 text-sm text-gray-900">{listing.year}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Location</p>
                    <p className="mt-1 text-sm text-gray-900">
                      {listing.location}
                    </p>
                  </div>
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-500">Description</p>
                  <p className="mt-1 text-sm text-gray-900">
                    {listing.description}
                  </p>
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-500">Seller</p>
                  <p className="mt-1 text-sm text-gray-900">
                    {listing.seller.name}
                  </p>
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Auction Ends
                  </p>
                  <p className="mt-1 text-sm text-gray-900">
                    {format(new Date(listing.endDate), "PPpp")}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 