"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";
import { format } from "date-fns";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

interface Listing {
  id: string;
  title: string;
  price: number;
  status: string;
  endDate: string;
  images: { url: string }[];
  _count: {
    bids: number;
  };
}

interface Bid {
  id: string;
  amount: number;
  createdAt: string;
  listing: {
    id: string;
    title: string;
    price: number;
    endDate: string;
    images: { url: string }[];
  };
}

export default function DashboardPage() {
  const { data: session } = useSession();
  const [activeTab, setActiveTab] = useState<"listings" | "bids">("listings");
  const [listings, setListings] = useState<Listing[]>([]);
  const [bids, setBids] = useState<Bid[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [listingsRes, bidsRes] = await Promise.all([
          fetch("/api/user/listings"),
          fetch("/api/user/bids"),
        ]);

        if (listingsRes.ok && bidsRes.ok) {
          const [listingsData, bidsData] = await Promise.all([
            listingsRes.json(),
            bidsRes.json(),
          ]);

          setListings(listingsData);
          setBids(bidsData);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    if (session) {
      fetchData();
    }
  }, [session]);

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-100 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="mt-2 text-sm text-gray-600">
              Manage your listings and bids
            </p>
          </div>

          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="border-b border-gray-200">
              <nav className="-mb-px flex" aria-label="Tabs">
                <button
                  onClick={() => setActiveTab("listings")}
                  className={`w-1/2 py-4 px-1 text-center border-b-2 font-medium text-sm ${
                    activeTab === "listings"
                      ? "border-indigo-500 text-indigo-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  My Listings
                </button>
                <button
                  onClick={() => setActiveTab("bids")}
                  className={`w-1/2 py-4 px-1 text-center border-b-2 font-medium text-sm ${
                    activeTab === "bids"
                      ? "border-indigo-500 text-indigo-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  My Bids
                </button>
              </nav>
            </div>

            {loading ? (
              <div className="p-4">
                <div className="animate-pulse space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-center space-x-4">
                      <div className="w-16 h-16 bg-gray-200 rounded"></div>
                      <div className="flex-1 space-y-2">
                        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : activeTab === "listings" ? (
              <div className="divide-y divide-gray-200">
                {listings.length === 0 ? (
                  <div className="p-4 text-center">
                    <p className="text-gray-500">No listings yet</p>
                    <Link
                      href="/sell"
                      className="mt-2 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
                    >
                      Create a Listing
                    </Link>
                  </div>
                ) : (
                  listings.map((listing) => (
                    <div key={listing.id} className="p-4 hover:bg-gray-50">
                      <Link href={`/listings/${listing.id}`}>
                        <div className="flex items-center space-x-4">
                          <div className="flex-shrink-0 w-16 h-16 relative">
                            {listing.images[0] ? (
                              <Image
                                src={listing.images[0].url}
                                alt={listing.title}
                                fill
                                className="object-cover rounded"
                              />
                            ) : (
                              <div className="w-full h-full bg-gray-200 rounded" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">
                              {listing.title}
                            </p>
                            <p className="text-sm text-gray-500">
                              ${listing.price.toLocaleString()}
                            </p>
                            <p className="text-xs text-gray-500">
                              {listing._count.bids} bids · Ends{" "}
                              {format(new Date(listing.endDate), "PPp")}
                            </p>
                          </div>
                          <div>
                            <span
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                listing.status === "active"
                                  ? "bg-green-100 text-green-800"
                                  : "bg-red-100 text-red-800"
                              }`}
                            >
                              {listing.status}
                            </span>
                          </div>
                        </div>
                      </Link>
                    </div>
                  ))
                )}
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {bids.length === 0 ? (
                  <div className="p-4 text-center">
                    <p className="text-gray-500">No bids yet</p>
                    <Link
                      href="/"
                      className="mt-2 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
                    >
                      Browse Listings
                    </Link>
                  </div>
                ) : (
                  bids.map((bid) => (
                    <div key={bid.id} className="p-4 hover:bg-gray-50">
                      <Link href={`/listings/${bid.listing.id}`}>
                        <div className="flex items-center space-x-4">
                          <div className="flex-shrink-0 w-16 h-16 relative">
                            {bid.listing.images[0] ? (
                              <Image
                                src={bid.listing.images[0].url}
                                alt={bid.listing.title}
                                fill
                                className="object-cover rounded"
                              />
                            ) : (
                              <div className="w-full h-full bg-gray-200 rounded" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">
                              {bid.listing.title}
                            </p>
                            <p className="text-sm text-gray-500">
                              Your bid: ${bid.amount.toLocaleString()}
                            </p>
                            <p className="text-xs text-gray-500">
                              Bid placed{" "}
                              {format(new Date(bid.createdAt), "PPp")} · Ends{" "}
                              {format(new Date(bid.listing.endDate), "PPp")}
                            </p>
                          </div>
                          <div>
                            <span
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                bid.amount === bid.listing.price
                                  ? "bg-green-100 text-green-800"
                                  : "bg-gray-100 text-gray-800"
                              }`}
                            >
                              {bid.amount === bid.listing.price
                                ? "Highest Bid"
                                : "Outbid"}
                            </span>
                          </div>
                        </div>
                      </Link>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
} 