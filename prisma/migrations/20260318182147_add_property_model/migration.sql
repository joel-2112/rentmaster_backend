-- CreateEnum
CREATE TYPE "CityType" AS ENUM ('CITY', 'TOWN', 'ADMINISTRATION', 'SPECIAL_ZONE');

-- CreateEnum
CREATE TYPE "PropertyType" AS ENUM ('APARTMENT', 'HOUSE', 'VILLA', 'STUDIO', 'COMMERCIAL', 'OFFICE', 'WAREHOUSE', 'LAND');

-- CreateEnum
CREATE TYPE "PropertyStatus" AS ENUM ('AVAILABLE', 'RENTED', 'UNDER_MAINTENANCE', 'UNAVAILABLE', 'PENDING_VERIFICATION');

-- CreateEnum
CREATE TYPE "InquiryStatus" AS ENUM ('PENDING', 'RESPONDED', 'CLOSED', 'SPAM');

-- CreateTable
CREATE TABLE "regions" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "regions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "zones" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT,
    "regionId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "zones_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cities" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "regionId" TEXT NOT NULL,
    "zoneId" TEXT,
    "cityType" "CityType" NOT NULL DEFAULT 'CITY',
    "municipalityName" TEXT,
    "municipalityPhone" TEXT,
    "municipalityEmail" TEXT,
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "cities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "subcities" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT,
    "cityId" TEXT NOT NULL,
    "officeName" TEXT,
    "officePhone" TEXT,
    "officeEmail" TEXT,
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "subcities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "woredas" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "number" INTEGER,
    "regionId" TEXT NOT NULL,
    "zoneId" TEXT,
    "cityId" TEXT,
    "subcityId" TEXT,
    "officeName" TEXT,
    "officePhone" TEXT,
    "officeEmail" TEXT,
    "population" INTEGER,
    "area" DOUBLE PRECISION,
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "woredas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "kebeles" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "number" INTEGER,
    "regionId" TEXT NOT NULL,
    "zoneId" TEXT,
    "cityId" TEXT,
    "subcityId" TEXT,
    "woredaId" TEXT,
    "officeName" TEXT,
    "officePhone" TEXT,
    "officeEmail" TEXT,
    "officialName" TEXT,
    "officialTitle" TEXT,
    "officialPhone" TEXT,
    "population" INTEGER,
    "area" DOUBLE PRECISION,
    "sealImage" TEXT,
    "sealCode" TEXT,
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "hasDigitalSeal" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "kebeles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "kebele_officials" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "kebeleId" TEXT NOT NULL,
    "position" TEXT NOT NULL,
    "startedAt" TIMESTAMP(3) NOT NULL,
    "endedAt" TIMESTAMP(3),
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "kebele_officials_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "verified_properties" (
    "id" TEXT NOT NULL,
    "propertyId" TEXT NOT NULL,
    "kebeleId" TEXT NOT NULL,
    "officialId" TEXT NOT NULL,
    "verifiedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3),
    "sealApplied" BOOLEAN NOT NULL DEFAULT true,
    "sealImage" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "verified_properties_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "properties" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "property_type" "PropertyType" NOT NULL DEFAULT 'APARTMENT',
    "status" "PropertyStatus" NOT NULL DEFAULT 'AVAILABLE',
    "bedrooms" INTEGER NOT NULL DEFAULT 1,
    "bathrooms" INTEGER NOT NULL DEFAULT 1,
    "area" DOUBLE PRECISION NOT NULL,
    "floor" INTEGER,
    "total_floors" INTEGER,
    "has_furniture" BOOLEAN NOT NULL DEFAULT false,
    "has_parking" BOOLEAN NOT NULL DEFAULT false,
    "has_elevator" BOOLEAN NOT NULL DEFAULT false,
    "has_balcony" BOOLEAN NOT NULL DEFAULT false,
    "has_garden" BOOLEAN NOT NULL DEFAULT false,
    "has_security" BOOLEAN NOT NULL DEFAULT false,
    "has_backup_generator" BOOLEAN NOT NULL DEFAULT false,
    "has_water_tank" BOOLEAN NOT NULL DEFAULT false,
    "monthly_rent" DOUBLE PRECISION NOT NULL,
    "security_deposit" DOUBLE PRECISION NOT NULL,
    "minimum_lease_months" INTEGER NOT NULL DEFAULT 6,
    "is_negotiable" BOOLEAN NOT NULL DEFAULT false,
    "landlord_id" TEXT NOT NULL,
    "brokerId" TEXT,
    "regionId" TEXT,
    "zoneId" TEXT,
    "cityId" TEXT,
    "subcityId" TEXT,
    "woredaId" TEXT,
    "kebeleId" TEXT,
    "house_number" TEXT,
    "street_name" TEXT,
    "landmark" TEXT,
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,
    "google_maps_url" TEXT,
    "full_address" TEXT,
    "is_verified" BOOLEAN NOT NULL DEFAULT false,
    "verified_by" TEXT,
    "verified_at" TIMESTAMP(3),
    "verification_document" TEXT,
    "kebele_seal" TEXT,
    "seal_applied_at" TIMESTAMP(3),
    "seal_expires_at" TIMESTAMP(3),
    "verification_history" JSONB,
    "view_count" INTEGER NOT NULL DEFAULT 0,
    "favorite_count" INTEGER NOT NULL DEFAULT 0,
    "inquiry_count" INTEGER NOT NULL DEFAULT 0,
    "available_from" TIMESTAMP(3),
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "priority" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "properties_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "property_images" (
    "id" TEXT NOT NULL,
    "propertyId" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "thumbnail_url" TEXT,
    "caption" TEXT,
    "is_primary" BOOLEAN NOT NULL DEFAULT false,
    "order" INTEGER NOT NULL DEFAULT 0,
    "file_size" INTEGER,
    "mime_type" TEXT,
    "width" INTEGER,
    "height" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "property_images_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "property_features" (
    "id" TEXT NOT NULL,
    "propertyId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "category" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "property_features_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "favorites" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "propertyId" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "favorites_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "property_inquiries" (
    "id" TEXT NOT NULL,
    "propertyId" TEXT NOT NULL,
    "userId" TEXT,
    "guest_name" TEXT,
    "guest_email" TEXT,
    "guest_phone" TEXT,
    "message" TEXT NOT NULL,
    "status" "InquiryStatus" NOT NULL DEFAULT 'PENDING',
    "response" TEXT,
    "responded_by" TEXT,
    "responded_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "property_inquiries_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "regions_name_key" ON "regions"("name");

-- CreateIndex
CREATE UNIQUE INDEX "regions_code_key" ON "regions"("code");

-- CreateIndex
CREATE UNIQUE INDEX "zones_name_regionId_key" ON "zones"("name", "regionId");

-- CreateIndex
CREATE UNIQUE INDEX "cities_name_regionId_key" ON "cities"("name", "regionId");

-- CreateIndex
CREATE UNIQUE INDEX "subcities_name_cityId_key" ON "subcities"("name", "cityId");

-- CreateIndex
CREATE UNIQUE INDEX "kebeles_name_woredaId_key" ON "kebeles"("name", "woredaId");

-- CreateIndex
CREATE UNIQUE INDEX "kebeles_name_subcityId_key" ON "kebeles"("name", "subcityId");

-- CreateIndex
CREATE UNIQUE INDEX "kebele_officials_userId_kebeleId_key" ON "kebele_officials"("userId", "kebeleId");

-- CreateIndex
CREATE UNIQUE INDEX "verified_properties_propertyId_kebeleId_key" ON "verified_properties"("propertyId", "kebeleId");

-- CreateIndex
CREATE INDEX "properties_landlord_id_idx" ON "properties"("landlord_id");

-- CreateIndex
CREATE INDEX "properties_brokerId_idx" ON "properties"("brokerId");

-- CreateIndex
CREATE INDEX "properties_status_idx" ON "properties"("status");

-- CreateIndex
CREATE INDEX "properties_property_type_idx" ON "properties"("property_type");

-- CreateIndex
CREATE INDEX "properties_is_verified_idx" ON "properties"("is_verified");

-- CreateIndex
CREATE INDEX "properties_cityId_idx" ON "properties"("cityId");

-- CreateIndex
CREATE INDEX "properties_subcityId_idx" ON "properties"("subcityId");

-- CreateIndex
CREATE INDEX "properties_woredaId_idx" ON "properties"("woredaId");

-- CreateIndex
CREATE INDEX "properties_kebeleId_idx" ON "properties"("kebeleId");

-- CreateIndex
CREATE INDEX "properties_monthly_rent_idx" ON "properties"("monthly_rent");

-- CreateIndex
CREATE INDEX "properties_created_at_idx" ON "properties"("created_at");

-- CreateIndex
CREATE INDEX "property_images_propertyId_idx" ON "property_images"("propertyId");

-- CreateIndex
CREATE INDEX "property_images_is_primary_idx" ON "property_images"("is_primary");

-- CreateIndex
CREATE INDEX "property_features_propertyId_idx" ON "property_features"("propertyId");

-- CreateIndex
CREATE UNIQUE INDEX "property_features_propertyId_name_key" ON "property_features"("propertyId", "name");

-- CreateIndex
CREATE INDEX "favorites_userId_idx" ON "favorites"("userId");

-- CreateIndex
CREATE INDEX "favorites_propertyId_idx" ON "favorites"("propertyId");

-- CreateIndex
CREATE UNIQUE INDEX "favorites_userId_propertyId_key" ON "favorites"("userId", "propertyId");

-- CreateIndex
CREATE INDEX "property_inquiries_propertyId_idx" ON "property_inquiries"("propertyId");

-- CreateIndex
CREATE INDEX "property_inquiries_userId_idx" ON "property_inquiries"("userId");

-- CreateIndex
CREATE INDEX "property_inquiries_status_idx" ON "property_inquiries"("status");

-- AddForeignKey
ALTER TABLE "zones" ADD CONSTRAINT "zones_regionId_fkey" FOREIGN KEY ("regionId") REFERENCES "regions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cities" ADD CONSTRAINT "cities_regionId_fkey" FOREIGN KEY ("regionId") REFERENCES "regions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cities" ADD CONSTRAINT "cities_zoneId_fkey" FOREIGN KEY ("zoneId") REFERENCES "zones"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "subcities" ADD CONSTRAINT "subcities_cityId_fkey" FOREIGN KEY ("cityId") REFERENCES "cities"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "woredas" ADD CONSTRAINT "woredas_regionId_fkey" FOREIGN KEY ("regionId") REFERENCES "regions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "woredas" ADD CONSTRAINT "woredas_zoneId_fkey" FOREIGN KEY ("zoneId") REFERENCES "zones"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "woredas" ADD CONSTRAINT "woredas_cityId_fkey" FOREIGN KEY ("cityId") REFERENCES "cities"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "woredas" ADD CONSTRAINT "woredas_subcityId_fkey" FOREIGN KEY ("subcityId") REFERENCES "subcities"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "kebeles" ADD CONSTRAINT "kebeles_regionId_fkey" FOREIGN KEY ("regionId") REFERENCES "regions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "kebeles" ADD CONSTRAINT "kebeles_zoneId_fkey" FOREIGN KEY ("zoneId") REFERENCES "zones"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "kebeles" ADD CONSTRAINT "kebeles_cityId_fkey" FOREIGN KEY ("cityId") REFERENCES "cities"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "kebeles" ADD CONSTRAINT "kebeles_subcityId_fkey" FOREIGN KEY ("subcityId") REFERENCES "subcities"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "kebeles" ADD CONSTRAINT "kebeles_woredaId_fkey" FOREIGN KEY ("woredaId") REFERENCES "woredas"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "kebele_officials" ADD CONSTRAINT "kebele_officials_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "kebele_officials" ADD CONSTRAINT "kebele_officials_kebeleId_fkey" FOREIGN KEY ("kebeleId") REFERENCES "kebeles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "verified_properties" ADD CONSTRAINT "verified_properties_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "properties"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "verified_properties" ADD CONSTRAINT "verified_properties_kebeleId_fkey" FOREIGN KEY ("kebeleId") REFERENCES "kebeles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "verified_properties" ADD CONSTRAINT "verified_properties_officialId_fkey" FOREIGN KEY ("officialId") REFERENCES "kebele_officials"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "properties" ADD CONSTRAINT "properties_landlord_id_fkey" FOREIGN KEY ("landlord_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "properties" ADD CONSTRAINT "properties_brokerId_fkey" FOREIGN KEY ("brokerId") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "properties" ADD CONSTRAINT "properties_regionId_fkey" FOREIGN KEY ("regionId") REFERENCES "regions"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "properties" ADD CONSTRAINT "properties_zoneId_fkey" FOREIGN KEY ("zoneId") REFERENCES "zones"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "properties" ADD CONSTRAINT "properties_cityId_fkey" FOREIGN KEY ("cityId") REFERENCES "cities"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "properties" ADD CONSTRAINT "properties_subcityId_fkey" FOREIGN KEY ("subcityId") REFERENCES "subcities"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "properties" ADD CONSTRAINT "properties_woredaId_fkey" FOREIGN KEY ("woredaId") REFERENCES "woredas"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "properties" ADD CONSTRAINT "properties_kebeleId_fkey" FOREIGN KEY ("kebeleId") REFERENCES "kebeles"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "property_images" ADD CONSTRAINT "property_images_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "properties"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "property_features" ADD CONSTRAINT "property_features_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "properties"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "favorites" ADD CONSTRAINT "favorites_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "favorites" ADD CONSTRAINT "favorites_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "properties"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "property_inquiries" ADD CONSTRAINT "property_inquiries_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "properties"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "property_inquiries" ADD CONSTRAINT "property_inquiries_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;
