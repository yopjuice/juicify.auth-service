/* @name UserCreate */
INSERT INTO users (
  name, phone, email, password_hash, role, is_phone_verified, is_email_verified, created_at, updated_at
) VALUES (:name, :phone, :email, :password_hash, :role, :is_phone_verified, :is_email_verified, NOW(), NOW())
RETURNING *;
