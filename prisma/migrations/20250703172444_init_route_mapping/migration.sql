-- CreateTable
CREATE TABLE `WorkflowRouteMapping` (
    `id` VARCHAR(191) NOT NULL,
    `gearId` VARCHAR(191) NOT NULL,
    `apiVersion` VARCHAR(191) NOT NULL,
    `apiPath` VARCHAR(191) NOT NULL,
    `workflowCode` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
