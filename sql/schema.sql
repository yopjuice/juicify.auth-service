CREATE TYPE "Role" AS ENUM ('USER', 'ADMIN');

CREATE TABLE "users" (
    "id" TEXT DEFAULT gen_random_uuid()::TEXT NOT NULL,
    "phone" TEXT,
    "email" TEXT NOT NULL,
    "password_hash" TEXT,
    "role" "Role" NOT NULL DEFAULT 'USER',
    "is_phone_verified" BOOLEAN NOT NULL DEFAULT false,
    "is_email_verified" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP (3) NOT NULL DEFAULT current_timestamp,
    "updated_at" TIMESTAMP (3) NOT NULL DEFAULT current_timestamp,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "users_phone_key" UNIQUE ("phone"),
    CONSTRAINT "users_email_key" UNIQUE ("email")
);

-- artist_id IS NOT FOREIGN KEY HERE (artist table is in another db)
CREATE TABLE "artist_users" (
    "id" TEXT DEFAULT gen_random_uuid()::TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "artist_id" TEXT NOT NULL,
    "role" "ArtistMemberRole" NOT NULL DEFAULT 'OWNER',
    "created_at" TIMESTAMP (3) NOT NULL DEFAULT current_timestamp,
    "updated_at" TIMESTAMP (3) NOT NULL DEFAULT current_timestamp,

    CONSTRAINT "artist_users_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "artist_users_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "artist_users_user_artist_key" UNIQUE ("user_id", "artist_id")
);

CREATE TABLE "pending_contact_changes" (
    "id" TEXT DEFAULT gen_random_uuid()::TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "code_hash" TEXT NOT NULL,
    "expires_at" TIMESTAMP (3) NOT NULL,
    "user_id" TEXT NOT NULL,
    "created_at" TIMESTAMP (3) NOT NULL DEFAULT current_timestamp,
    "updated_at" TIMESTAMP (3) NOT NULL DEFAULT current_timestamp,

    CONSTRAINT "pending_contact_changes_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "pending_contact_changes_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE INDEX "artist_users_user_id_idx" ON "artist_users" ("user_id");

-- functions and triggers
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS '
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
' LANGUAGE plpgsql;

CREATE TRIGGER update_users_modtime BEFORE UPDATE ON "users" FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_artist_users_modtime BEFORE UPDATE ON "artist_users" FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_pending_contact_changes_modtime BEFORE UPDATE ON "pending_contact_changes" FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
