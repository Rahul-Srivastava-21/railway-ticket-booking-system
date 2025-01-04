/*
  Warnings:

  - You are about to drop the column `number` on the `Seat` table. All the data in the column will be lost.
  - You are about to drop the column `type` on the `Seat` table. All the data in the column will be lost.
  - The `status` column on the `Seat` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the column `stationCode` on the `Stop` table. All the data in the column will be lost.
  - You are about to drop the column `trainId` on the `Stop` table. All the data in the column will be lost.
  - You are about to drop the column `number` on the `Train` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[name]` on the table `Stop` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[trainNumber]` on the table `Train` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `seatNumber` to the `Seat` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Seat` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Stop` table without a default value. This is not possible if the table is not empty.
  - Added the required column `endStop` to the `Train` table without a default value. This is not possible if the table is not empty.
  - Added the required column `startStop` to the `Train` table without a default value. This is not possible if the table is not empty.
  - Added the required column `trainNumber` to the `Train` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Train` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "SeatStatus" AS ENUM ('AVAILABLE', 'RESERVED');

-- DropForeignKey
ALTER TABLE "Stop" DROP CONSTRAINT "Stop_trainId_fkey";

-- DropIndex
DROP INDEX "Stop_stationCode_key";

-- DropIndex
DROP INDEX "Train_number_key";

-- AlterTable
ALTER TABLE "Seat" DROP COLUMN "number",
DROP COLUMN "type",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "reservedFromStop" INTEGER,
ADD COLUMN     "reservedToStop" INTEGER,
ADD COLUMN     "seatNumber" TEXT NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
DROP COLUMN "status",
ADD COLUMN     "status" "SeatStatus" NOT NULL DEFAULT 'AVAILABLE';

-- AlterTable
ALTER TABLE "Stop" DROP COLUMN "stationCode",
DROP COLUMN "trainId",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Train" DROP COLUMN "number",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "endStop" INTEGER NOT NULL,
ADD COLUMN     "startStop" INTEGER NOT NULL,
ADD COLUMN     "trainNumber" TEXT NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- CreateTable
CREATE TABLE "Route" (
    "id" SERIAL NOT NULL,
    "trainId" INTEGER NOT NULL,
    "stopId" INTEGER NOT NULL,
    "stopOrder" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Route_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Stop_name_key" ON "Stop"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Train_trainNumber_key" ON "Train"("trainNumber");

-- AddForeignKey
ALTER TABLE "Route" ADD CONSTRAINT "Route_trainId_fkey" FOREIGN KEY ("trainId") REFERENCES "Train"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Route" ADD CONSTRAINT "Route_stopId_fkey" FOREIGN KEY ("stopId") REFERENCES "Stop"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
