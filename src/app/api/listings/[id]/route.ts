import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { PrismaClient } from "@prisma/client";
import { authOptions } from "@/lib/auth";

const prisma = new PrismaClient();

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const listing = await prisma.listing.findUnique({
      where: { id: params.id },
      include: {
        seller: {
          select: {
            name: true,
            email: true,
          },
        },
        images: true,
      },
    });

    if (!listing) {
      return NextResponse.json({ error: "Listing not found" }, { status: 404 });
    }

    // Transform images to include full URLs
    const transformedListing = {
      ...listing,
      images: listing.images.map((image) => ({
        url: `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${image.key}`,
        key: image.key,
      })),
    };

    return NextResponse.json(transformedListing);
  } catch (error) {
    console.error("Error fetching listing:", error);
    return NextResponse.json(
      { error: "Failed to fetch listing" },
      { status: 500 }
    );
  }
}

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
        { error: "You must be logged in to place a bid" },
        { status: 401 }
      );
    }

    const { amount } = await request.json();

    if (!amount || typeof amount !== "number" || amount <= 0) {
      return NextResponse.json(
        { error: "Invalid bid amount" },
        { status: 400 }
      );
    }

    const listing = await prisma.listing.findUnique({
      where: { id: params.id },
      include: { bids: true },
    });

    if (!listing) {
      return NextResponse.json({ error: "Listing not found" }, { status: 404 });
    }

    if (listing.sellerId === session.user.email) {
      return NextResponse.json(
        { error: "You cannot bid on your own listing" },
        { status: 400 }
      );
    }

    if (new Date(listing.endDate) < new Date()) {
      return NextResponse.json(
        { error: "This auction has ended" },
        { status: 400 }
      );
    }

    if (amount <= listing.price) {
      return NextResponse.json(
        { error: "Bid amount must be higher than current price" },
        { status: 400 }
      );
    }

    const bid = await prisma.bid.create({
      data: {
        amount,
        listingId: params.id,
        userId: session.user.email,
      },
    });

    const updatedListing = await prisma.listing.update({
      where: { id: params.id },
      data: { price: amount },
      include: {
        seller: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        bids: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
              },
            },
          },
          orderBy: {
            createdAt: "desc",
          },
        },
      },
    });

    return NextResponse.json(updatedListing);
  } catch (error) {
    console.error("Error placing bid:", error);
    return NextResponse.json(
      { error: "Failed to place bid" },
      { status: 500 }
    );
  }
} 