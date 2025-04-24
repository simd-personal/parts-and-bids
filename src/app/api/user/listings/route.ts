import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { PrismaClient } from "@prisma/client";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const listings = await prisma.listing.findMany({
      where: {
        sellerId: session.user.id,
      },
      include: {
        images: true,
        _count: {
          select: {
            bids: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // Transform images to include full URLs
    const transformedListings = listings.map((listing) => ({
      ...listing,
      images: listing.images.map((image) => ({
        url: `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${image.key}`,
        key: image.key,
      })),
    }));

    return NextResponse.json(transformedListings);
  } catch (error) {
    console.error("Error fetching user listings:", error);
    return NextResponse.json(
      { error: "Failed to fetch listings" },
      { status: 500 }
    );
  }
} 