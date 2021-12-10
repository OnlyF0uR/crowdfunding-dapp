const { query } = require('./db');

const getBriefData = async () => {
    /**
     * Indexes:
     * 0 - 7 = hot (cat, newest)
     * 8 - 15 = charity (cat, newest)
     * 16 - 23 = startup (cat, newest)
     * 24 - 31 = launchpad (cat, newest)
     */
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
};

const getPageData = async (page) => {
    // Obtain all active campaigns sorted deadline (closest to expiring >)
    // Calculate appropiate id's based on page (25 per page)
};

const getSingleData = async (id) => {
    // Check redis
    // If not in redis then fetch
        // Add to redis

    const { rows } = await query('SELECT account, title, short_desc, goal, img, expires FROM campaigns WHERE id = $1::int', [id]);
    console.log(rows);
};

const getUnverifiedCampaigns = async () => {
    const { rows } = await query('SELECT * FROM campaigns WHERE verified IS NOT TRUE');
    console.log(rows);
};

module.exports = {
    getBriefData,
    getPageData,
    getSingleData,
    getUnverifiedCampaigns
};