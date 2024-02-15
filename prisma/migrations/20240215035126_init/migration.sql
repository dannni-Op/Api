-- CreateTable
CREATE TABLE `companies` (
    `companyId` VARCHAR(191) NOT NULL,
    `companyName` VARCHAR(191) NOT NULL,
    `companyCode` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`companyId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `users` (
    `userId` VARCHAR(191) NOT NULL,
    `username` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `fullName` VARCHAR(191) NOT NULL,
    `userType` ENUM('Owner', 'Admin', 'Officer', 'Finance', 'Customer_Admin', 'Customer_Service') NOT NULL,
    `companyId` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`userId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `userPermissions` (
    `permissionId` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `permissionType` ENUM('Inbound', 'Outbound', 'Stock_Transfer', 'Order_Management') NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `userPermissions_userId_key`(`userId`),
    PRIMARY KEY (`permissionId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `warehouses` (
    `code` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `address` VARCHAR(191) NOT NULL,
    `status` ENUM('active', 'inactive') NOT NULL,

    PRIMARY KEY (`code`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `products` (
    `sku` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `unit` INTEGER NOT NULL,
    `warehouseCode` VARCHAR(191) NULL,

    PRIMARY KEY (`sku`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `users` ADD CONSTRAINT `users_companyId_fkey` FOREIGN KEY (`companyId`) REFERENCES `companies`(`companyId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `userPermissions` ADD CONSTRAINT `userPermissions_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`userId`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `products` ADD CONSTRAINT `products_warehouseCode_fkey` FOREIGN KEY (`warehouseCode`) REFERENCES `warehouses`(`code`) ON DELETE SET NULL ON UPDATE CASCADE;
