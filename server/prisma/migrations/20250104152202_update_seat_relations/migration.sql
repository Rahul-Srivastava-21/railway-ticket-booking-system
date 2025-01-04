/*
  Warnings:

  - You are about to drop the column `createdAt` on the `Seat` table. All the data in the column will be lost.
  - You are about to drop the column `reservedFromStop` on the `Seat` table. All the data in the column will be lost.
  - You are about to drop the column `reservedToStop` on the `Seat` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Seat` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Seat" DROP COLUMN "createdAt",
DROP COLUMN "reservedFromStop",
DROP COLUMN "reservedToStop",
DROP COLUMN "updatedAt",
ADD COLUMN     "reservedFromStopId" INTEGER,
ADD COLUMN     "reservedToStopId" INTEGER,
ALTER COLUMN "status" DROP DEFAULT;

-- AddForeignKey
ALTER TABLE "Seat" ADD CONSTRAINT "Seat_reservedFromStopId_fkey" FOREIGN KEY ("reservedFromStopId") REFERENCES "Stop"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Seat" ADD CONSTRAINT "Seat_reservedToStopId_fkey" FOREIGN KEY ("reservedToStopId") REFERENCES "Stop"("id") ON DELETE SET NULL ON UPDATE CASCADE;
