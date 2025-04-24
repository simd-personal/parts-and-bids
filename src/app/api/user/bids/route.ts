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

    const bids = await prisma.bid.findMany({
      where: {
        userId: session.user.id,
      },
      include: {
        listing: {
          include: {
            images: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // Transform images to include full URLs
    const transformedBids = bids.map((bid) => ({
      ...bid,
      listing: {
        ...bid.listing,
        images: bid.listing.images.map((image) => ({
          url: `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${image.key}`,
          key: image.key,
        })),
      },
    }));

    return NextResponse.json(transformedBids);
  } catch (error) {
    console.error("Error fetching user bids:", error);
    return NextResponse.json(
      { error: "Failed to fetch bids" },
      { status: 500 }
    );
  }
} 