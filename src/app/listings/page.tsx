import Link from 'next/link'
import { Button } from '@/components/ui/button'

// Mock data - replace with actual data from your database
const mockListings = [
  {
    id: '1',
    title: 'BMW M3 E46 OEM Headlights',
    price: 299.99,
    image: 'https://via.placeholder.com/300x200',
    make: 'BMW',
    model: 'M3',
    year: 2004,
    condition: 'Used',
    location: 'Los Angeles, CA',
    timeLeft: '2 days 5 hours',
  },
  {
    id: '2',
    title: 'Honda Civic Type R Front Bumper',
    price: 450.00,
    image: 'https://via.placeholder.com/300x200',
    make: 'Honda',
    model: 'Civic Type R',
    year: 2020,
    condition: 'New',
    location: 'Miami, FL',
    timeLeft: '1 day 12 hours',
  },
  // Add more mock listings as needed
]

export default function ListingsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Available Parts</h1>
          <div className="flex space-x-4">
            <select className="rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary">
              <option>All Categories</option>
              <option>Engine</option>
              <option>Exterior</option>
              <option>Interior</option>
              <option>Wheels & Tires</option>
            </select>
            <select className="rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary">
              <option>All Makes</option>
              <option>BMW</option>
              <option>Honda</option>
              <option>Toyota</option>
              <option>Mercedes</option>
            </select>
            <Button variant="outline">Filter</Button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {mockListings.map((listing) => (
            <Link
              key={listing.id}
              href={`/listings/${listing.id}`}
              className="bg-white rounded-lg shadow overflow-hidden hover:shadow-lg transition-shadow duration-300"
            >
              <div className="aspect-w-16 aspect-h-9">
                <img
                  src={listing.image}
                  alt={listing.title}
                  className="object-cover w-full h-48"
                />
              </div>
              <div className="p-4">
                <h2 className="text-lg font-semibold text-gray-900 mb-2">{listing.title}</h2>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-2xl font-bold text-primary">${listing.price}</span>
                  <span className="text-sm text-gray-500">{listing.timeLeft} left</span>
                </div>
                <div className="text-sm text-gray-500">
                  <p>
                    {listing.year} {listing.make} {listing.model}
                  </p>
                  <p>{listing.condition} • {listing.location}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
} 