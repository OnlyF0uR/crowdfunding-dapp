const { Pool } = require('pg');

const pool = new Pool({
   host: process.env.DB_HOSTNAME,
   user: process.env.DB_USERNAME,
   password: process.env.DB_PASSWORD,
   database: process.env.DB_DATABASE,
   port: process.env.DB_PORT,
   idleTimeoutMillis: 0,
   connectionTimeoutMillis: 0,
   max: 25
});

const query = (query, params) => !params ? pool.query(query) : pool.query(query, params);

const fetchBriefIds = async () => {
   const { rows } = await query(`
      (
      SELECT
         id 
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
         id 
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
         id 
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
         id 
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
      )
   `);

   return rows;
};

const fetchAllData = async () => {
   const { rows } = await query(`
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
   `);

   return rows;
};

const fetchUnverifiedData = async () => {
   const { rows } = await query('SELECT * FROM campaigns WHERE verified IS FALSE');
   return rows;
}

module.exports = {
   fetchBriefIds,
   fetchAllData,

   fetchUnverifiedData
};