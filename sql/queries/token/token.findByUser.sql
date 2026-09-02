/* @name TokenFindByUser */
SELECT * FROM tokens
WHERE user_id = :userId;
