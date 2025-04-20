# Parts and Bids

A modern auction platform for buying and selling car parts.

## Features

- 🚗 Browse and search car parts by make, model, year, and category
- 💰 Place bids on parts in 5-day auctions
- 📦 Sell your unused car parts with a 6% platform fee
- 🔒 Secure authentication with email/password and Google OAuth
- 💳 Integrated Stripe payments for secure transactions
- 📱 Responsive design for desktop and mobile
- 📸 Image upload with Cloudinary integration
- 📊 User dashboard for managing bids and listings

## Tech Stack

- **Framework:** Next.js 14 with App Router
- **Database:** PostgreSQL with Prisma ORM
- **Authentication:** NextAuth.js
- **Styling:** Tailwind CSS
- **Payments:** Stripe
- **Image Storage:** Cloudinary
- **Deployment:** Vercel

## Getting Started

### Prerequisites

- Node.js 18.17 or later
- PostgreSQL database
- Stripe account
- Cloudinary account
- Google OAuth credentials

### Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/partsandbids?schema=public"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here"

# OAuth Providers
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""

# Stripe
STRIPE_SECRET_KEY=""
STRIPE_WEBHOOK_SECRET=""
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=""

# Cloudinary
CLOUDINARY_CLOUD_NAME=""
CLOUDINARY_API_KEY=""
CLOUDINARY_API_SECRET=""
```

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/parts-and-bids.git
   cd parts-and-bids
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up the database:
   ```bash
   npx prisma migrate dev
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
src/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   ├── auth/              # Authentication pages
│   ├── dashboard/         # User dashboard
│   ├── listings/          # Part listings
│   ├── sell/             # Sell a part page
│   └── layout.tsx         # Root layout
├── components/            # Reusable components
│   ├── ui/               # UI components
│   └── providers/        # Context providers
├── lib/                  # Utility functions
│   ├── prisma.ts         # Prisma client
│   └── utils.ts          # Helper functions
└── middleware.ts         # Authentication middleware
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
