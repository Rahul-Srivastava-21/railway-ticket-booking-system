/*
  Warnings:

  - Added the required column `routeGroupId` to the `Route` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Route" ADD COLUMN     "routeGroupId" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "RouteGroup" (
    "id" SERIAL NOT NULL,

    CONSTRAINT "RouteGroup_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_RouteGroupToTrain" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_RouteGroupToTrain_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_RouteGroupToTrain_B_index" ON "_RouteGroupToTrain"("B");

-- AddForeignKey
ALTER TABLE "Route" ADD CONSTRAINT "Route_routeGroupId_fkey" FOREIGN KEY ("routeGroupId") REFERENCES "RouteGroup"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_RouteGroupToTrain" ADD CONSTRAINT "_RouteGroupToTrain_A_fkey" FOREIGN KEY ("A") REFERENCES "RouteGroup"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_RouteGroupToTrain" ADD CONSTRAINT "_RouteGroupToTrain_B_fkey" FOREIGN KEY ("B") REFERENCES "Train"("id") ON DELETE CASCADE ON UPDATE CASCADE;
