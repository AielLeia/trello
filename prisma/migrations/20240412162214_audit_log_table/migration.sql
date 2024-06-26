-- CreateTable
CREATE TABLE `AuditLog` (
    `id` VARCHAR(191) NOT NULL,
    `orgId` VARCHAR(191) NOT NULL,
    `action` ENUM('Create', 'Update', 'Delete') NOT NULL,
    `entityId` VARCHAR(191) NOT NULL,
    `entityType` ENUM('Board', 'List', 'Card') NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `userImage` TEXT NOT NULL,
    `username` TEXT NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
