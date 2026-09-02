/* @name TokenDeleteByUser */
DELETE FROM tokens WHERE user_id = :userId
RETURNING *;
