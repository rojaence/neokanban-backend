-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "security";

-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "workspace";

-- CreateTable
CREATE TABLE "security"."sec_actions" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "description" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "optionId" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "sec_actions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "security"."sec_modules" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "uri" TEXT NOT NULL DEFAULT '',
    "order" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "sec_modules_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "security"."sec_options" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "moduleId" UUID NOT NULL,
    "iconName" TEXT,
    "uri" TEXT NOT NULL DEFAULT '',
    "order" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "sec_options_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "security"."sec_system_roles" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "sec_system_roles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "security"."sec_workspace_roles" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "isSystem" BOOLEAN NOT NULL,

    CONSTRAINT "sec_workspace_roles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "security"."sec_user_system_roles" (
    "userId" UUID NOT NULL,
    "systemRoleId" UUID NOT NULL,

    CONSTRAINT "sec_user_system_roles_pkey" PRIMARY KEY ("userId","systemRoleId")
);

-- CreateTable
CREATE TABLE "workspace"."wsp_workspaces" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "ownerId" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "wsp_workspaces_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "workspace"."wsp_workspace_members" (
    "workspaceId" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "roleId" UUID NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "wsp_workspace_members_pkey" PRIMARY KEY ("workspaceId","userId")
);

-- CreateTable
CREATE TABLE "workspace"."wsp_projects" (
    "id" UUID NOT NULL,
    "workspaceId" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "wsp_projects_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "security"."sec_system_role_permissions" (
    "id" UUID NOT NULL,
    "roleId" UUID NOT NULL,
    "actionId" UUID NOT NULL,

    CONSTRAINT "sec_system_role_permissions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "security"."sec_workspace_role_permissions" (
    "id" UUID NOT NULL,
    "roleId" UUID NOT NULL,
    "actionId" UUID NOT NULL,

    CONSTRAINT "sec_workspace_role_permissions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "workspace"."wsp_tasks" (
    "id" UUID NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "projectId" UUID NOT NULL,
    "createdById" UUID NOT NULL,
    "updatedById" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "wsp_tasks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "security"."sec_users" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "surname" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "isStaff" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "sec_users_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "sec_actions_optionId_name_key" ON "security"."sec_actions"("optionId", "name");

-- CreateIndex
CREATE UNIQUE INDEX "sec_options_name_key" ON "security"."sec_options"("name");

-- CreateIndex
CREATE UNIQUE INDEX "sec_system_roles_name_key" ON "security"."sec_system_roles"("name");

-- CreateIndex
CREATE UNIQUE INDEX "sec_workspace_roles_name_key" ON "security"."sec_workspace_roles"("name");

-- CreateIndex
CREATE UNIQUE INDEX "sec_system_role_permissions_roleId_actionId_key" ON "security"."sec_system_role_permissions"("roleId", "actionId");

-- CreateIndex
CREATE UNIQUE INDEX "sec_workspace_role_permissions_roleId_actionId_key" ON "security"."sec_workspace_role_permissions"("roleId", "actionId");

-- CreateIndex
CREATE UNIQUE INDEX "sec_users_email_key" ON "security"."sec_users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "sec_users_username_key" ON "security"."sec_users"("username");

-- AddForeignKey
ALTER TABLE "security"."sec_actions" ADD CONSTRAINT "sec_actions_optionId_fkey" FOREIGN KEY ("optionId") REFERENCES "security"."sec_options"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "security"."sec_options" ADD CONSTRAINT "sec_options_moduleId_fkey" FOREIGN KEY ("moduleId") REFERENCES "security"."sec_modules"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "security"."sec_user_system_roles" ADD CONSTRAINT "sec_user_system_roles_userId_fkey" FOREIGN KEY ("userId") REFERENCES "security"."sec_users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "security"."sec_user_system_roles" ADD CONSTRAINT "sec_user_system_roles_systemRoleId_fkey" FOREIGN KEY ("systemRoleId") REFERENCES "security"."sec_system_roles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "workspace"."wsp_workspaces" ADD CONSTRAINT "wsp_workspaces_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "security"."sec_users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "workspace"."wsp_workspace_members" ADD CONSTRAINT "wsp_workspace_members_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "workspace"."wsp_workspaces"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "workspace"."wsp_workspace_members" ADD CONSTRAINT "wsp_workspace_members_userId_fkey" FOREIGN KEY ("userId") REFERENCES "security"."sec_users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "workspace"."wsp_workspace_members" ADD CONSTRAINT "wsp_workspace_members_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "security"."sec_workspace_roles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "workspace"."wsp_projects" ADD CONSTRAINT "wsp_projects_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "workspace"."wsp_workspaces"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "security"."sec_system_role_permissions" ADD CONSTRAINT "sec_system_role_permissions_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "security"."sec_system_roles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "security"."sec_system_role_permissions" ADD CONSTRAINT "sec_system_role_permissions_actionId_fkey" FOREIGN KEY ("actionId") REFERENCES "security"."sec_actions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "security"."sec_workspace_role_permissions" ADD CONSTRAINT "sec_workspace_role_permissions_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "security"."sec_workspace_roles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "security"."sec_workspace_role_permissions" ADD CONSTRAINT "sec_workspace_role_permissions_actionId_fkey" FOREIGN KEY ("actionId") REFERENCES "security"."sec_actions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "workspace"."wsp_tasks" ADD CONSTRAINT "wsp_tasks_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "workspace"."wsp_projects"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "workspace"."wsp_tasks" ADD CONSTRAINT "wsp_tasks_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "security"."sec_users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "workspace"."wsp_tasks" ADD CONSTRAINT "wsp_tasks_updatedById_fkey" FOREIGN KEY ("updatedById") REFERENCES "security"."sec_users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
