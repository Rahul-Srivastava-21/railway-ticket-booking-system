-- DropForeignKey
ALTER TABLE "Route" DROP CONSTRAINT "Route_trainId_fkey";

-- DropForeignKey
ALTER TABLE "Train" DROP CONSTRAINT "Train_endStopId_fkey";

-- DropForeignKey
ALTER TABLE "Train" DROP CONSTRAINT "Train_startStopId_fkey";

-- AlterTable
ALTER TABLE "Route" ALTER COLUMN "trainId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Train" ALTER COLUMN "endStopId" DROP NOT NULL,
ALTER COLUMN "startStopId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Train" ADD CONSTRAINT "Train_startStopId_fkey" FOREIGN KEY ("startStopId") REFERENCES "Stop"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Train" ADD CONSTRAINT "Train_endStopId_fkey" FOREIGN KEY ("endStopId") REFERENCES "Stop"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Route" ADD CONSTRAINT "Route_trainId_fkey" FOREIGN KEY ("trainId") REFERENCES "Train"("id") ON DELETE SET NULL ON UPDATE CASCADE;
