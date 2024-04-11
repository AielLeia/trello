/*
  Warnings:

  - You are about to drop the column `imageThumbFull` on the `Board` table. All the data in the column will be lost.
  - Added the required column `imageFullUrl` to the `Board` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Board` DROP COLUMN `imageThumbFull`,
    ADD COLUMN `imageFullUrl` TEXT NOT NULL;
