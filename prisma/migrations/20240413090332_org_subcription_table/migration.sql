-- CreateTable
CREATE TABLE `OrgSubscription` (
    `id` VARCHAR(191) NOT NULL,
    `orgId` VARCHAR(191) NOT NULL,
    `stripe_customer_id` VARCHAR(191) NULL,
    `stripe_subscription_id` VARCHAR(191) NULL,
    `stripe_price_id` VARCHAR(191) NULL,
    `stripe_current_period_end` DATETIME(3) NULL,

    UNIQUE INDEX `OrgSubscription_orgId_key`(`orgId`),
    UNIQUE INDEX `OrgSubscription_stripe_customer_id_key`(`stripe_customer_id`),
    UNIQUE INDEX `OrgSubscription_stripe_subscription_id_key`(`stripe_subscription_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
