/* @name TokenDelete */
DELETE FROM tokens WHERE id = :id
RETURNING *;
