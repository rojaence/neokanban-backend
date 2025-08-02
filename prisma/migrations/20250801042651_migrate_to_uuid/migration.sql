/*
  Warnings:

  - The primary key for the `man_tasks` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `sec_actions` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `sec_modules` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `sec_options` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `sec_profile_options` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `sec_profiles` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `sec_user_profiles` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `sec_users` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - Changed the type of `id` on the `man_tasks` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `userId` on the `man_tasks` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `id` on the `sec_actions` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `id` on the `sec_modules` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `moduleId` on the `sec_options` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `id` on the `sec_options` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `profileId` on the `sec_profile_options` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `actionId` on the `sec_profile_options` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `id` on the `sec_profile_options` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `optionId` on the `sec_profile_options` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `id` on the `sec_profiles` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `userId` on the `sec_user_profiles` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `profileId` on the `sec_user_profiles` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `id` on the `sec_users` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE "manager"."man_tasks" DROP CONSTRAINT "man_tasks_userId_fkey";

-- DropForeignKey
ALTER TABLE "security"."sec_options" DROP CONSTRAINT "sec_options_moduleId_fkey";

-- DropForeignKey
ALTER TABLE "security"."sec_profile_options" DROP CONSTRAINT "sec_profile_options_actionId_fkey";

-- DropForeignKey
ALTER TABLE "security"."sec_profile_options" DROP CONSTRAINT "sec_profile_options_optionId_fkey";

-- DropForeignKey
ALTER TABLE "security"."sec_profile_options" DROP CONSTRAINT "sec_profile_options_profileId_fkey";

-- DropForeignKey
ALTER TABLE "security"."sec_user_profiles" DROP CONSTRAINT "sec_user_profiles_profileId_fkey";

-- DropForeignKey
ALTER TABLE "security"."sec_user_profiles" DROP CONSTRAINT "sec_user_profiles_userId_fkey";

-- AlterTable
ALTER TABLE "manager"."man_tasks" DROP CONSTRAINT "man_tasks_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" UUID NOT NULL,
DROP COLUMN "userId",
ADD COLUMN     "userId" UUID NOT NULL,
ADD CONSTRAINT "man_tasks_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "security"."sec_actions" DROP CONSTRAINT "sec_actions_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" UUID NOT NULL,
ADD CONSTRAINT "sec_actions_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "security"."sec_modules" DROP CONSTRAINT "sec_modules_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" UUID NOT NULL,
ADD CONSTRAINT "sec_modules_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "security"."sec_options" DROP CONSTRAINT "sec_options_pkey",
DROP COLUMN "moduleId",
ADD COLUMN     "moduleId" UUID NOT NULL,
DROP COLUMN "id",
ADD COLUMN     "id" UUID NOT NULL,
ADD CONSTRAINT "sec_options_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "security"."sec_profile_options" DROP CONSTRAINT "sec_profile_options_pkey",
DROP COLUMN "profileId",
ADD COLUMN     "profileId" UUID NOT NULL,
DROP COLUMN "actionId",
ADD COLUMN     "actionId" UUID NOT NULL,
DROP COLUMN "id",
ADD COLUMN     "id" UUID NOT NULL,
DROP COLUMN "optionId",
ADD COLUMN     "optionId" UUID NOT NULL,
ADD CONSTRAINT "sec_profile_options_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "security"."sec_profiles" DROP CONSTRAINT "sec_profiles_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" UUID NOT NULL,
ADD CONSTRAINT "sec_profiles_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "security"."sec_user_profiles" DROP CONSTRAINT "sec_user_profiles_pkey",
DROP COLUMN "userId",
ADD COLUMN     "userId" UUID NOT NULL,
DROP COLUMN "profileId",
ADD COLUMN     "profileId" UUID NOT NULL,
ADD CONSTRAINT "sec_user_profiles_pkey" PRIMARY KEY ("userId", "profileId");

-- AlterTable
ALTER TABLE "security"."sec_users" DROP CONSTRAINT "sec_users_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" UUID NOT NULL,
ADD CONSTRAINT "sec_users_pkey" PRIMARY KEY ("id");

-- AddForeignKey
ALTER TABLE "security"."sec_options" ADD CONSTRAINT "sec_options_moduleId_fkey" FOREIGN KEY ("moduleId") REFERENCES "security"."sec_modules"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "security"."sec_profile_options" ADD CONSTRAINT "sec_profile_options_actionId_fkey" FOREIGN KEY ("actionId") REFERENCES "security"."sec_actions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "security"."sec_profile_options" ADD CONSTRAINT "sec_profile_options_optionId_fkey" FOREIGN KEY ("optionId") REFERENCES "security"."sec_options"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "security"."sec_profile_options" ADD CONSTRAINT "sec_profile_options_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "security"."sec_profiles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "manager"."man_tasks" ADD CONSTRAINT "man_tasks_userId_fkey" FOREIGN KEY ("userId") REFERENCES "security"."sec_users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "security"."sec_user_profiles" ADD CONSTRAINT "sec_user_profiles_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "security"."sec_profiles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "security"."sec_user_profiles" ADD CONSTRAINT "sec_user_profiles_userId_fkey" FOREIGN KEY ("userId") REFERENCES "security"."sec_users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
