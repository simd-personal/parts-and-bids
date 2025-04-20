import { Button } from '@/components/ui/button'

// Mock data - replace with actual data from your database
const mockUser = {
  name: 'John Doe',
  email: 'john@example.com',
  activeBids: [
    {
      id: '1',
      title: 'BMW M3 E46 OEM Headlights',
      currentBid: 275.00,
      highestBid: 300.00,
      timeLeft: '2 days 5 hours',
    },
  ],
  activeListings: [
    {
      id: '2',
      title: 'Honda Civic Type R Front Bumper',
      currentPrice: 450.00,
      bids: 3,
      timeLeft: '1 day 12 hours',
    },
  ],
  pastPurchases: [
    {
      id: '3',
      title: 'Toyota Supra MK4 Tail Lights',
      price: 350.00,
      date: '2024-03-15',
    },
  ],
  pastSales: [
    {
      id: '4',
      title: 'Nissan Skyline R34 Grille',
      price: 200.00,
      date: '2024-03-10',
    },
  ],
}

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="mt-2 text-sm text-gray-600">
            Welcome back, {mockUser.name}
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Active Bids */}
          <div className="bg-white shadow rounded-lg p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-medium text-gray-900">Active Bids</h2>
              <Button variant="outline" size="sm">View All</Button>
            </div>
            <div className="space-y-4">
              {mockUser.activeBids.map((bid) => (
                <div key={bid.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium text-gray-900">{bid.title}</h3>
                      <p className="text-sm text-gray-500">Your bid: ${bid.currentBid}</p>
                    </div>
                    <span className="text-sm text-gray-500">{bid.timeLeft}</span>
                  </div>
                  <div className="mt-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500">Highest bid: ${bid.highestBid}</span>
                      <Button size="sm">Increase Bid</Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Active Listings */}
          <div className="bg-white shadow rounded-lg p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-medium text-gray-900">Active Listings</h2>
              <Button variant="outline" size="sm">View All</Button>
            </div>
            <div className="space-y-4">
              {mockUser.activeListings.map((listing) => (
                <div key={listing.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium text-gray-900">{listing.title}</h3>
                      <p className="text-sm text-gray-500">Current price: ${listing.currentPrice}</p>
                    </div>
                    <span className="text-sm text-gray-500">{listing.timeLeft}</span>
                  </div>
                  <div className="mt-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500">{listing.bids} bids</span>
                      <Button size="sm">View Details</Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Past Purchases */}
          <div className="bg-white shadow rounded-lg p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-medium text-gray-900">Past Purchases</h2>
              <Button variant="outline" size="sm">View All</Button>
            </div>
            <div className="space-y-4">
              {mockUser.pastPurchases.map((purchase) => (
                <div key={purchase.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium text-gray-900">{purchase.title}</h3>
                      <p className="text-sm text-gray-500">Price: ${purchase.price}</p>
                    </div>
                    <span className="text-sm text-gray-500">{purchase.date}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Past Sales */}
          <div className="bg-white shadow rounded-lg p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-medium text-gray-900">Past Sales</h2>
              <Button variant="outline" size="sm">View All</Button>
            </div>
            <div className="space-y-4">
              {mockUser.pastSales.map((sale) => (
                <div key={sale.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium text-gray-900">{sale.title}</h3>
                      <p className="text-sm text-gray-500">Price: ${sale.price}</p>
                    </div>
                    <span className="text-sm text-gray-500">{sale.date}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Account Settings */}
        <div className="mt-8 bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Account Settings</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Name</label>
              <p className="mt-1 text-sm text-gray-900">{mockUser.name}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <p className="mt-1 text-sm text-gray-900">{mockUser.email}</p>
            </div>
            <div className="flex space-x-4">
              <Button variant="outline">Change Password</Button>
              <Button variant="outline">Update Payment Method</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 