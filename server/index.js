require('dotenv').config();

const crypto = require('crypto');
const { promisify } = require('util');
const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const { withAuth } = require('./middleware');
const redis = require('redis');
const { fetchBriefIds, fetchAllData, fetchUnverifiedData } = require('./db');

const app = express();
const scrypt = promisify(crypto.scrypt);
/**
 * brief: int[] --> Contains the selection and order
 * explore: int[] --> Contains the entire order
 * 0: {}
 */
const client = redis.createClient();

const setAsync = promisify(client.set).bind(client);
const getAsync = promisify(client.get).bind(client);

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
app.post('/api/campaigns/', async (req, res) => {
    const { brief, page } = req.body;

    let data;

    if (brief) {
        // TODO: Fetch from redis
    } else {
        /**
         * Page1: 0 - 19
         * Page2: 20 - 39
         * Page3: 40 - 59
         */
        for (let i = (page - 1) * 20; i <= (page - 1) * 20 + 19; i++) {
            console.log(i)
        }
    }

    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(data));
});

app.get('/api/campaigns/:id', (req, res) => {
    const { id } = req.params;

    // TODO: Fetch a single campaign from the database
    const data = null;

    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(data));
});

// ===================================
// PRIVILEGED ROUTES (Password required for every request)
// ===================================
app.post('/api/priv/login', (req, res) => {
    const { key } = req.body;

    const [salt, key] = process.env.AUTH_KEY_HASH.split(':');
    const buffer = Buffer.from(key, 'hex');

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

app.get('/api/priv/campaigns', withAuth, (req, res) => {
    const { psph } = req.body;

    const buffer = Buffer.from(process.env.PSPH_HASH, 'hex');

    const hash = crypto.createHash('sha512');
    const data = hash.update(psph, 'utf-8');
    const derPsph = data.digest('hex');

    const isEqual = crypto.timingSafeEqual(buffer, derPsph);
    if (!isEqual) {
        return res.status(401).end();
    }

    const data = await fetchUnverifiedData();

    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(data));
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
    const briefIds = await fetchBriefIds();
    await setAsync('brief', JSON.parse(briefIds));

    const exploreData = await fetchAllData(); 
    const order = [];
    for (let i = 0; i < exploreData.length; i++) {
        const id = exploreData[i].id;
        order.push(id);
        
        delete exploreData[i].id;
        await setAsync(id, exploreData[i]);
    }

    await setAsync('all', order);
}

const main = async () => {
    console.log('Started caching...')
    await handleCache();
    console.log('Cached data...')
    setInterval(async() => handleCache, 1000 * 60 * 60);
    console.log('Initiated interval...')

    // Listen on the appropiate port
    app.listen(port, () => console.log(`Listening on port ${port}.`));
}

main();