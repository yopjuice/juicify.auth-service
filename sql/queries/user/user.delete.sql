/* @name UserDelete */
DELETE FROM users WHERE id = :id
RETURNING *;
