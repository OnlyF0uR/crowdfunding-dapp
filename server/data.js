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

const getBriefData = async () => {
    const { rows } = await query(`
    (
    SELECT
        id, account, title, short_desc, goal, img, expires 
     FROM
        campaigns c1 
     WHERE
        expires = 
        (
           SELECT
              MAX(c2.id) 
           FROM
              campaigns c2 
           WHERE
              c1.id = c2.id 
        )
        AND category = 'hot' LIMIT 8
     ) 
     UNION ALL
     (
     SELECT
        id, account, title, short_desc, goal, img, expires 
     FROM
        campaigns c1 
     WHERE
        expires = 
        (
           SELECT
              MAX(c2.id) 
           FROM
              campaigns c2 
           WHERE
              c1.id = c2.id 
        )
        AND category = 'charity' LIMIT 8
     ) 
     UNION ALL
     (
     SELECT
        id, account, title, short_desc, goal, img, expires 
     FROM
        campaigns c1 
     WHERE
        expires = 
        (
           SELECT
              MAX(c2.id) 
           FROM
              campaigns c2 
           WHERE
              c1.id = c2.id 
        )
        AND category = 'startup' LIMIT 8
     ) 
     UNION ALL
     (
     SELECT
        id, account, title, short_desc, goal, img, expires 
     FROM
        campaigns c1 
     WHERE
        expires = 
        (
           SELECT
              MAX(c2.id) 
           FROM
              campaigns c2 
           WHERE
              c1.id = c2.id  
        )
        AND category = 'launchpad' LIMIT 8
     );
    `);

    console.log(rows);
    // TODO: This
};

const getPageData = async (page) => {
    // Obtain all active campaigns sorted deadline (closest to expiring >)
    // Calculate appropiate id's based on page (25 per page)
    // TODO: This
};

const getSingleData = async (id) => {
    // Check redis
    // If not in redis then fetch
        // Add to redis

    const { rows } = await query('SELECT account, title, short_desc, goal, img, expires FROM campaigns WHERE id = $1::int', [id]);
    console.log(rows);
    // TODO: This
};

const getUnverifiedCampaigns = async () => {
    const { rows } = await query('SELECT * FROM campaigns WHERE verified IS NOT TRUE');
    console.log(rows);
    // TODO: This
};

const verifyCampaign = async (id) => {
    // TODO: This
};

module.exports = {
    getBriefData,
    getPageData,
    getSingleData,
    getUnverifiedCampaigns,
    verifyCampaign
};