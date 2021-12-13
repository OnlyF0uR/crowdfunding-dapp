require('dotenv').config();

// Express
const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const { withAuth } = require('./middleware');
// Promise
const { promisify } = require('util');
// Data
const crypto = require('crypto');
const redis = require('redis');
const { fetchFrontIds, fetchAllData, fetchUnverifiedData } = require('./db');

// Scrypt
const scrypt = promisify(crypto.scrypt);

/**
 * front: int[] --> Contains the selection and order
 * explore: int[] --> Contains the entire order
 * 0: {},
 * ...
 */
const client = redis.createClient();
client.on('error', (err) => console.log('Redis Client Error', err));

// Express initialization
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.disable('x-powered-by');
app.use(cookieParser());
app.use(cors({
    origin: 'http://localhost:3000',
    optionsSuccessStatus: 200,
    credentials: true
}));

// ===================================
// DEFAULT ROUTES
// ===================================
/**
 *  id SERIAL PRIMARY KEY,
 *  account VARCHAR NOT NULL,
 *  title VARCHAR NOT NULL,
 *  short_desc TEXT NOT NULL,
 *  goal decimal NOT NULL,
 *  img TEXT NOT NULL
 */
app.post('/api/campaigns/', async (req, res) => {
    const { front, page } = req.body;

    /**
     * {
     *      hot: [{ id, account, title, short_desc, goal, img, progress: {currency, goal} },],
     *      charity: [...],
     *      startup: [...],
     *      launchpad: [...]
     * }
     */
    const data = {
        hot: [],
        charity: [],
        startup: [],
        launchpad: []
    };

    await client.connect();

    if (front) {
        const ids = await client.get('front');
        for (let i = 0; i < ids.length; i++) {
            const id = ids[i];
            const dat = JSON.parse(await client.get(id));
            data[dat.category].push({
                id: id,
                adr: dat.account,
                title: dat.title,
                image: dat.img,
                desc: dat.short_desc,
                prog: {
                    curr: dat.currency,
                    goal: dat.goal,
                    // current: Will be fetched through ethers.js
                }
            });
        }
    } else {
        /**
         * Page1: 0 - 19
         * Page2: 20 - 39
         * Page3: 40 - 59
         */
        for (let i = (page - 1) * 20; i <= (page - 1) * 20 + 19; i++) {
            const dat = JSON.parse(await client.get(i));
            data[dat.category].push({
                id: i,
                adr: dat.account,
                title: dat.title,
                image: dat.img,
                desc: dat.short_desc,
                prog: {
                    curr: dat.currency,
                    goal: dat.goal,
                    // current: Will be fetched through ethers.js
                }
            });
        }
    }

    await client.quit();

    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(data));
});

app.get('/api/campaigns/:id', (req, res) => {
    const { id } = req.params;

    // TODO: Fetch a single campaign from redis
    const data = null;

    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(data));
});

// ===================================
// PRIVILEGED ROUTES (Password required for every request)
// ===================================
app.post('/api/priv/login', async (req, res) => {
    const { key } = req.body;

    const [salt, exisKey] = process.env.AUTH_KEY_HASH.split(':');
    const buffer = Buffer.from(exisKey, 'hex');

    const derKey = await scrypt(key, salt, 64, {
        N: process.env.AUTH_KEY_N,
        r: process.env.AUTH_KEY_R,
        p: process.env.AUTH_KEY_P,
        maxmem: process.env.AUTH_KEY_MAXMEM
    });

    const isEqual = crypto.timingSafeEqual(buffer, derKey);
    if (!isEqual) {
        return res.status(401).end();
    }

    const token = jwt.sign(process.env.JWT_PWD, process.env.JWT_KEY, {
        expiresIn: '1h'
    });

    res.cookie('token', token).status(200).end();
});

app.get('/api/priv/campaigns', withAuth, async (req, res) => {
    const { psph } = req.body;

    const buffer = Buffer.from(process.env.PSPH_HASH, 'hex');

    const hash = crypto.createHash('sha512');
    const data = hash.update(psph, 'utf-8');
    const derPsph = data.digest('hex');

    const isEqual = crypto.timingSafeEqual(buffer, derPsph);
    if (!isEqual) {
        return res.status(401).end();
    }

    const result = await fetchUnverifiedData();

    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(result));
});

app.post('/api/priv/campaigns/review', withAuth, (req, res) => {
    // id INT, verify BOOLEAN, cat VARCHAR
    const { psph, id, verify, cat } = req.body;

    const buffer = Buffer.from(process.env.PSPH_HASH, 'hex');

    const hash = crypto.createHash('sha512');
    const data = hash.update(psph, 'utf-8');
    const derPsph = data.digest('hex');

    const isEqual = crypto.timingSafeEqual(buffer, derPsph);
    if (!isEqual) {
        return res.status(401).end();
    }

    if (verify) {
        // TODO: Verify campaign and apply category
    } else {
        // TODO: Delete campaign
    }
});

// ===================================
const port = process.env.PORT || 3000;

const handleCache = async () => {
    // Fetch data from database and cache it
    const frontIds = await fetchFrontIds();
    await client.connect(); 

    await client.set('front', JSON.stringify(frontIds));

    const exploreData = await fetchAllData();
    const order = [];
    for (let i = 0; i < exploreData.length; i++) {
        const id = exploreData[i].id;
        order.push(id);

        await client.set(id.toString(), JSON.stringify(exploreData[i]));
    }

    await client.set('explore', JSON.stringify(order));
    await client.quit();
}

const main = async () => {
    console.log('Started caching...')
    await handleCache();
    console.log('Cached data...')
    setInterval(async () => handleCache, 1000 * 60 * 60); // Every hour
    console.log('Initiated interval...')

    // Listen on the appropiate port
    app.listen(port, () => console.log(`Listening on port ${port}.`));
}

main();