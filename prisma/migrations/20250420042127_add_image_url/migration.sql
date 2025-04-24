-- DropForeignKey
ALTER TABLE "Image" DROP CONSTRAINT "Image_listingId_fkey";

-- AlterTable
ALTER TABLE "Image" ADD COLUMN     "url" TEXT NOT NULL DEFAULT '';

-- AddForeignKey
ALTER TABLE "Image" ADD CONSTRAINT "Image_listingId_fkey" FOREIGN KEY ("listingId") REFERENCES "Listing"("id") ON DELETE CASCADE ON UPDATE CASCADE;
