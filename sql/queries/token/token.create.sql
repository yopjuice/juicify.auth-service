/* @name TokenCreate */
INSERT INTO tokens ("token_hash", "user_id", "created_at", "updated_at")
VALUES (:token_hash, :userId, NOW(), NOW())
RETURNING *;
