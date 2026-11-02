-- Add a version counter so changing an admin password invalidates existing sessions.
ALTER TABLE "AdminUser"
ADD COLUMN "sessionVersion" INTEGER NOT NULL DEFAULT 0;
