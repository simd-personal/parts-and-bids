import { Button } from '@/components/ui/button'
import Image from 'next/image'

// Mock data - replace with actual data from your database
const mockListing = {
  id: '1',
  title: 'BMW M3 E46 OEM Headlights',
  description: 'Original equipment manufacturer headlights for BMW M3 E46. In excellent condition with no cracks or damage. Includes all mounting hardware.',
  price: 299.99,
  images: [
    'https://via.placeholder.com/800x600',
    'https://via.placeholder.com/800x600',
    'https://via.placeholder.com/800x600',
  ],
  make: 'BMW',
  model: 'M3',
  year: 2004,
  condition: 'Used',
  location: 'Los Angeles, CA',
  timeLeft: '2 days 5 hours',
  seller: {
    name: 'John Doe',
    rating: 4.8,
    totalSales: 42,
  },
  bids: [
    { amount: 250.00, user: 'Jane Smith', time: '2 hours ago' },
    { amount: 275.00, user: 'Mike Johnson', time: '1 hour ago' },
  ],
}

async function getListing(id: string) {
  // In a real app, this would fetch from your database
  return mockListing;
}

export default function ListingPage({
  params,
}: {
  params: { id: string };
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Image Gallery */}
          <div className="space-y-4">
            <div className="aspect-w-16 aspect-h-9 relative h-96">
              <Image
                src={mockListing.images[0]}
                alt={mockListing.title}
                fill
                className="object-cover rounded-lg"
              />
            </div>
            <div className="grid grid-cols-3 gap-4">
              {mockListing.images.map((image, index) => (
                <div key={index} className="relative h-24">
                  <Image
                    src={image}
                    alt={`${mockListing.title} - Image ${index + 1}`}
                    fill
                    className="object-cover rounded-lg cursor-pointer hover:opacity-75"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Listing Details */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{mockListing.title}</h1>
              <div className="mt-2 flex items-center space-x-4">
                <span className="text-2xl font-bold text-primary">${mockListing.price}</span>
                <span className="text-sm text-gray-500">{mockListing.timeLeft} left</span>
              </div>
            </div>

            <div className="border-t border-b py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Make</p>
                  <p className="font-medium">{mockListing.make}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Model</p>
                  <p className="font-medium">{mockListing.model}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Year</p>
                  <p className="font-medium">{mockListing.year}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Condition</p>
                  <p className="font-medium">{mockListing.condition}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Location</p>
                  <p className="font-medium">{mockListing.location}</p>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-lg font-semibold mb-2">Description</h2>
              <p className="text-gray-600">{mockListing.description}</p>
            </div>

            <div>
              <h2 className="text-lg font-semibold mb-2">Bidding History</h2>
              <div className="space-y-2">
                {mockListing.bids.map((bid, index) => (
                  <div key={index} className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">{bid.user}</p>
                      <p className="text-sm text-gray-500">{bid.time}</p>
                    </div>
                    <span className="font-bold">${bid.amount}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4">
              <Button className="w-full">Place Bid</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 