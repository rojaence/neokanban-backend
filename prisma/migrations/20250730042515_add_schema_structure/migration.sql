/*
  Warnings:

  - You are about to drop the `Action` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Module` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Option` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Profile` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ProfileOption` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Task` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `UserProfile` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "manager";

-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "security";

-- DropForeignKey
ALTER TABLE "public"."Option" DROP CONSTRAINT "Option_moduleId_fkey";

-- DropForeignKey
ALTER TABLE "public"."ProfileOption" DROP CONSTRAINT "ProfileOption_actionId_fkey";

-- DropForeignKey
ALTER TABLE "public"."ProfileOption" DROP CONSTRAINT "ProfileOption_optionId_fkey";

-- DropForeignKey
ALTER TABLE "public"."ProfileOption" DROP CONSTRAINT "ProfileOption_profileId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Task" DROP CONSTRAINT "Task_userId_fkey";

-- DropForeignKey
ALTER TABLE "public"."UserProfile" DROP CONSTRAINT "UserProfile_profileId_fkey";

-- DropForeignKey
ALTER TABLE "public"."UserProfile" DROP CONSTRAINT "UserProfile_userId_fkey";

-- DropTable
DROP TABLE "public"."Action";

-- DropTable
DROP TABLE "public"."Module";

-- DropTable
DROP TABLE "public"."Option";

-- DropTable
DROP TABLE "public"."Profile";

-- DropTable
DROP TABLE "public"."ProfileOption";

-- DropTable
DROP TABLE "public"."Task";

-- DropTable
DROP TABLE "public"."User";

-- DropTable
DROP TABLE "public"."UserProfile";

-- CreateTable
CREATE TABLE "security"."sec_actions" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "sec_actions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "security"."sec_modules" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "uri" TEXT NOT NULL DEFAULT '',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "sec_modules_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "security"."sec_options" (
    "name" TEXT NOT NULL,
    "description" TEXT,
    "moduleId" INTEGER NOT NULL,
    "id" SERIAL NOT NULL,
    "iconName" TEXT,
    "uri" TEXT NOT NULL DEFAULT '',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "sec_options_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "security"."sec_profiles" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "sec_profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "security"."sec_profile_options" (
    "profileId" INTEGER NOT NULL,
    "actionId" INTEGER NOT NULL,
    "id" SERIAL NOT NULL,
    "optionId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "sec_profile_options_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "manager"."man_tasks" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "userId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "man_tasks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "security"."sec_users" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "surname" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "sec_users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "security"."sec_user_profiles" (
    "userId" INTEGER NOT NULL,
    "profileId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "sec_user_profiles_pkey" PRIMARY KEY ("userId","profileId")
);

-- CreateIndex
CREATE UNIQUE INDEX "sec_actions_name_key" ON "security"."sec_actions"("name");

-- CreateIndex
CREATE UNIQUE INDEX "sec_options_name_key" ON "security"."sec_options"("name");

-- CreateIndex
CREATE UNIQUE INDEX "sec_profiles_name_key" ON "security"."sec_profiles"("name");

-- CreateIndex
CREATE UNIQUE INDEX "sec_users_email_key" ON "security"."sec_users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "sec_users_username_key" ON "security"."sec_users"("username");

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
