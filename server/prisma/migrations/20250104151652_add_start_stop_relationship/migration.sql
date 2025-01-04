/*
  Warnings:

  - You are about to drop the column `endStop` on the `Train` table. All the data in the column will be lost.
  - You are about to drop the column `startStop` on the `Train` table. All the data in the column will be lost.
  - Added the required column `endStopId` to the `Train` table without a default value. This is not possible if the table is not empty.
  - Added the required column `startStopId` to the `Train` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Train" DROP COLUMN "endStop",
DROP COLUMN "startStop",
ADD COLUMN     "endStopId" INTEGER NOT NULL,
ADD COLUMN     "startStopId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Train" ADD CONSTRAINT "Train_startStopId_fkey" FOREIGN KEY ("startStopId") REFERENCES "Stop"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Train" ADD CONSTRAINT "Train_endStopId_fkey" FOREIGN KEY ("endStopId") REFERENCES "Stop"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
