import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function Home() {
  return (
    <main className="min-h-screen">
      <nav className="border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <Link href="/" className="text-xl font-bold">
                  Parts & Bids
                </Link>
              </div>
            </div>
            <div className="flex items-center">
              <Link href="/login">
                <Button variant="ghost">Login</Button>
              </Link>
              <Link href="/register">
                <Button>Sign Up</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
            Buy and Sell Car Parts
          </h1>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            Find the perfect part for your vehicle or sell your unused car parts in our 5-day auctions.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Link href="/listings">
              <Button size="lg">Browse Parts</Button>
            </Link>
            <Link href="/sell">
              <Button variant="outline" size="lg">
                Sell a Part
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
} 