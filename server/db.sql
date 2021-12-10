-- Create campaigns table
CREATE TABLE IF NOT EXISTS campaigns(
    id SERIAL PRIMARY KEY,
    account VARCHAR NOT NULL,
    title VARCHAR NOT NULL,
    short_desc TEXT NOT NULL,
    long_desc TEXT NOT NULL,
    goal decimal NOT NULL,
    img TEXT NOT NULL,
    category VARCHAR NOT NULL,
    expires BIGINT NOT NULL,
    verified BOOLEAN NOT NULL
);

-- Select brief by newest first
(
SELECT
   id, account, title, short_desc, goal, img, expires 
FROM
   campaigns c1 
WHERE
   id = 
   (
      SELECT
         MAX(c2.id) 
      FROM
         campaigns c2 
      WHERE
         c1.id = c2.id 
   )
   AND category = 'hot'
   AND verified IS TRUE
   LIMIT 8
) 
UNION ALL
(
SELECT
   id, account, title, short_desc, goal, img, expires 
FROM
   campaigns c1 
WHERE
   id = 
   (
      SELECT
         MAX(c2.id) 
      FROM
         campaigns c2 
      WHERE
         c1.id = c2.id 
   )
   AND category = 'charity'
   AND verified IS TRUE
   LIMIT 8
) 
UNION ALL
(
SELECT
   id, account, title, short_desc, goal, img, expires 
FROM
   campaigns c1 
WHERE
   id = 
   (
      SELECT
         MAX(c2.id) 
      FROM
         campaigns c2 
      WHERE
         c1.id = c2.id 
   )
   AND category = 'startup'
   AND verified IS TRUE
   LIMIT 8
) 
UNION ALL
(
SELECT
   id, account, title, short_desc, goal, img, expires 
FROM
   campaigns c1 
WHERE
   id = 
   (
      SELECT
         MAX(c2.id) 
      FROM
         campaigns c2 
      WHERE
         c1.id = c2.id  
   )
   AND category = 'launchpad'
   AND verified IS TRUE
   LIMIT 8
);

-- Select campaign by close to expire first
SELECT
    id,
    account,
    title,
    short_desc,
    goal,
    img,
    expires
FROM
    campaigns
WHERE
    verified IS TRUE AND
    expires - CAST(EXTRACT(epoch FROM NOW()) AS INT) > 0
ORDER BY
    expires - CAST(EXTRACT(epoch FROM NOW()) AS INT) ASC
;