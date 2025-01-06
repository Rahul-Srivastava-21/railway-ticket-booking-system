/*
  Warnings:

  - A unique constraint covering the columns `[trainId,seatNumber]` on the table `Seat` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterEnum
ALTER TYPE "SeatStatus" ADD VALUE 'WAITLISTED';

-- DropForeignKey
ALTER TABLE "Booking" DROP CONSTRAINT "Booking_seatId_fkey";

-- DropForeignKey
ALTER TABLE "Booking" DROP CONSTRAINT "Booking_trainId_fkey";

-- DropForeignKey
ALTER TABLE "Booking" DROP CONSTRAINT "Booking_userId_fkey";

-- AlterTable
ALTER TABLE "Booking" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "Seat" ALTER COLUMN "status" SET DEFAULT 'AVAILABLE';

-- CreateIndex
CREATE UNIQUE INDEX "Seat_trainId_seatNumber_key" ON "Seat"("trainId", "seatNumber");

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_trainId_fkey" FOREIGN KEY ("trainId") REFERENCES "Train"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_seatId_fkey" FOREIGN KEY ("seatId") REFERENCES "Seat"("id") ON DELETE CASCADE ON UPDATE CASCADE;
