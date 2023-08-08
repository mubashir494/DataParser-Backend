/*
  Warnings:

  - Added the required column `street` to the `Owner` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `owner` ADD COLUMN `street` VARCHAR(191) NOT NULL;
