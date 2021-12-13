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

const fetchFrontIds = async () => {
   const { rows } = await query(`
      (
      SELECT
         id 
      FROM
         campaigns
      WHERE
         category = 'hot'
         AND verified IS TRUE
         AND expires - CAST(EXTRACT(epoch FROM NOW()) AS INT) > 0
      ORDER BY id DESC LIMIT 8
      )
      UNION ALL
      (
      SELECT
         id 
      FROM
         campaigns
      WHERE
         category = 'charity'
         AND verified IS TRUE
         AND expires - CAST(EXTRACT(epoch FROM NOW()) AS INT) > 0
      ORDER BY id DESC LIMIT 8
      )
      UNION ALL
      (
      SELECT
         id 
      FROM
         campaigns
      WHERE
         category = 'startup'
         AND verified IS TRUE
         AND expires - CAST(EXTRACT(epoch FROM NOW()) AS INT) > 0
      ORDER BY id DESC LIMIT 8
      )
      UNION ALL
      (
      SELECT
         id 
      FROM
         campaigns
      WHERE
         category = 'launchpad'
         AND verified IS TRUE
         AND expires - CAST(EXTRACT(epoch FROM NOW()) AS INT) > 0
      ORDER BY id DESC LIMIT 8
      )
   `);

   const res = [];
   for (let i = 0; i < rows.length; i++) {
      res.push(rows[i].id);
   }

   return res;
};

const fetchAllData = async () => {
   const { rows } = await query(`
      SELECT
         id,
         account,
         currency,
         title,
         short_desc,
         long_desc,
         goal,
         img,
         category
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
   fetchFrontIds,
   fetchAllData,

   fetchUnverifiedData
};