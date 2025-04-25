import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const getImageUrl = (key: string) => {
  const bucketName = process.env.AWS_BUCKET_NAME;
  const region = process.env.AWS_REGION;
  
  console.log('AWS Config in API:', { bucketName, region, key });
  
  if (!bucketName || !region) {
    console.error("Missing AWS configuration in API");
    return null;
  }

  const url = `https://${bucketName}.s3.${region}.amazonaws.com/${key}`;
  console.log('Generated URL:', url);
  return url;
};

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
        { error: "You must be logged in to create a listing" },
        { status: 401 }
      );
    }

    const formData = await request.formData();
    const title = formData.get("title") as string;
    const price = formData.get("price") as string;
    const imageKeys = JSON.parse(formData.get("imageKeys") as string);

    // Only validate required fields
    if (!title || !price) {
      return NextResponse.json(
        { error: "Title and price are required" },
        { status: 400 }
      );
    }

    // Create the listing with all images
    const listing = await prisma.listing.create({
      data: {
        title,
        description: formData.get("description") as string || "",
        price: parseFloat(price),
        category: formData.get("category") as string || "other",
        make: formData.get("make") as string || null,
        model: formData.get("model") as string || null,
        year: formData.get("year") ? parseInt(formData.get("year") as string) : null,
        condition: formData.get("condition") as string || "used",
        location: formData.get("location") as string || "",
        sellerId: session.user.id,
        endDate: formData.get("endDate") ? new Date(formData.get("endDate") as string) : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // Default to 7 days from now
        status: "active",
        images: {
          createMany: {
            data: imageKeys.map((img: { key: string; isDefault: boolean }) => ({
              key: img.key,
              isDefault: img.isDefault
            }))
          }
        },
      },
      include: {
        images: true,
        seller: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    // Transform the response to include full image URLs
    const transformedListing = {
      ...listing,
      images: listing.images.map((image) => ({
        ...image,
        url: getImageUrl(image.key),
      })),
    };

    return NextResponse.json(transformedListing, { status: 201 });
  } catch (error) {
    console.error("Error creating listing:", error);
    return NextResponse.json(
      { error: "Failed to create listing" },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    console.log("GET /api/listings - Starting request");
    console.log("AWS Environment Variables:", {
      bucketName: process.env.AWS_BUCKET_NAME,
      region: process.env.AWS_REGION
    });
    
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const make = searchParams.get("make");
    const model = searchParams.get("model");
    const minPrice = searchParams.get("minPrice");
    const maxPrice = searchParams.get("maxPrice");
    const condition = searchParams.get("condition");

    const where: any = {
      status: "active",
    };

    if (category) where.category = category;
    if (make) where.make = make;
    if (model) where.model = model;
    if (condition) where.condition = condition;
    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) where.price.gte = parseFloat(minPrice);
      if (maxPrice) where.price.lte = parseFloat(maxPrice);
    }

    console.log("Fetching listings with query:", where);

    const listings = await prisma.listing.findMany({
      where,
      include: {
        images: true,
        seller: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    console.log("Raw listings from database:", JSON.stringify(listings, null, 2));

    // Transform listings to include full image URLs
    const transformedListings = listings.map(listing => {
      const transformedImages = listing.images.map(image => {
        const url = getImageUrl(image.key);
        console.log('Transformed image:', { key: image.key, url });
        return {
          id: image.id,
          key: image.key,
          isDefault: image.isDefault,
          url,
          listingId: image.listingId,
          createdAt: image.createdAt.toISOString(),
          updatedAt: image.updatedAt.toISOString(),
        };
      });

      return {
        ...listing,
        createdAt: listing.createdAt.toISOString(),
        updatedAt: listing.updatedAt.toISOString(),
        endDate: listing.endDate.toISOString(),
        images: transformedImages,
      };
    });

    console.log("First listing images:", transformedListings[0]?.images);
    return NextResponse.json(transformedListings);
  } catch (error) {
    console.error("Error in GET /api/listings:", error);
    return NextResponse.json(
      { error: "Failed to fetch listings" },
      { status: 500 }
    );
  }
} 