import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "You must be logged in to delete your account" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { password } = body;

    if (!password) {
      return NextResponse.json(
        { error: "Password is required to delete your account" },
        { status: 400 }
      );
    }

    // Get user with their listings and associated images
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: {
        listings: {
          include: {
            bids: true,
          },
        },
        bids: true,
        accounts: true,
        sessions: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Verify password if the user has one
    if (user.password) {
      const isValid = await bcrypt.compare(password, user.password);
      if (!isValid) {
        return NextResponse.json(
          { error: "Invalid password" },
          { status: 400 }
        );
      }
    }

    // Delete everything in a transaction
    await prisma.$transaction(async (tx) => {
      // Delete all bids made by the user
      await tx.bid.deleteMany({
        where: { userId: user.id },
      });

      // Delete all listings
      await tx.listing.deleteMany({
        where: { sellerId: user.id },
      });

      // Delete all sessions
      await tx.session.deleteMany({
        where: { userId: user.id },
      });

      // Delete all accounts
      await tx.account.deleteMany({
        where: { userId: user.id },
      });

      // Finally, delete the user
      await tx.user.delete({
        where: { id: user.id },
      });
    });

    return NextResponse.json(
      { message: "Account successfully deleted" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting user account:", error);
    return NextResponse.json(
      { error: "Failed to delete account" },
      { status: 500 }
    );
  }
} 