/*
  Warnings:

  - Added the required column `name` to the `AvailableTriggers` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "AvailableTriggers" ADD COLUMN     "name" TEXT NOT NULL;
