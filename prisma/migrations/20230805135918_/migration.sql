/*
  Warnings:

  - You are about to drop the column `addressId` on the `owner` table. All the data in the column will be lost.
  - Added the required column `countyId` to the `Owner` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `owner` DROP FOREIGN KEY `Owner_addressId_fkey`;

-- AlterTable
ALTER TABLE `owner` DROP COLUMN `addressId`,
    ADD COLUMN `countyId` VARCHAR(191) NOT NULL;

-- AddForeignKey
ALTER TABLE `Owner` ADD CONSTRAINT `Owner_countyId_fkey` FOREIGN KEY (`countyId`) REFERENCES `County`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
