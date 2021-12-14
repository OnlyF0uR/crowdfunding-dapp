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
const ethers = require('ethers');
const { readFile } = require('fs/promises');

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
// app.use(cors({
//     origin: 'http://localhost:3000',
//     optionsSuccessStatus: 200,
//     credentials: true
// }));

// Web3 Contract
let contract = null;

// ===================================
// DEFAULT ROUTES
// ===================================
app.get('/api/campaigns/front', async (req, res) => {
    const data = {
        hot: [],
        charity: [],
        startup: [],
        launchpad: []
    };

    await client.connect();

    const frontIds = JSON.parse(await client.get('front'));
    for (let i = 0; i < frontIds.length; i++) {
        const id = frontIds[i];
        const dat = JSON.parse(await client.get(id.toString()));

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

    await client.quit();

    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(data));
});

app.get('/api/campaigns/explore/:page', async (req, res) => {
    const { page } = req.params;

    const data = {
        hot: [],
        charity: [],
        startup: [],
        launchpad: []
    };
    let maxPages = 0;

    await client.connect();

    const exploreIds = JSON.parse(await client.get('explore'));
    maxPages = parseInt(exploreIds.length / 8) + 1;

    /**
     * Page1: 0 - 19
     * Page2: 20 - 39
     * Page3: 40 - 59
     */
    let index = (page - 1) * 20;
    let last = index + 19;
    for (let i = index; i < exploreIds.length; i++) {
        const id = exploreIds[i];
        const dat = JSON.parse(await client.get(id.toString()));

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

        if (i === last) {
            break;
        }
    }

    await client.quit();

    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ data: data, maxPages: maxPages }));
});

app.get('/api/campaigns/:id', async (req, res) => {
    const { id } = req.params;

    await client.connect();

    let data = null;

    const result = JSON.parse(await client.get(id.toString()));
    if (result != null) {
        // Client side already has id, no point in sending + always control exact data sent
        data = {
            account: result.account,
            currency: result.currency,
            title: result.title,
            shortDesc: result.short_desc,
            longDesc: result.long_desc,
            goal: result.goal,
            img: result.img,
            category: result.category,
            expires: result.expires,
            verified: result.verified
        }
    }

    await client.quit();

    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(data || {}));
});

app.post('/api/campaigns/reserve', async (req, res) => {
    const { data, authSecret } = req.body;
    /**
     * TODO:
     *  - Make sure data isn't already stored
     *  - Get hash from blockchain (index: data.id)
     *      - const data = await contract.campaigns(0);
     *  - Hash authSecret
     *      - ethers.utils.keccak256
     *  - Compare hashes
     *  - Add data to the database
     */
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

app.post('/api/priv/campaigns/verify', withAuth, (req, res) => {
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
        if (exploreData[i].verified) {
            order.push(id);
        }

        await client.set(id.toString(), JSON.stringify(exploreData[i]));
    }

    await client.set('explore', JSON.stringify(order));
    await client.quit();
}

const main = async () => {
    console.log('Establishing RPC provider...');
    const provider = new ethers.providers.JsonRpcProvider(process.env.WEB3_PROVIDER);

    console.log('Loading the contract...');
    const json = JSON.parse(await readFile('../client/src/contracts/CrowdFunding.json', 'utf8'));
    contract = new ethers.Contract(json.networks[Object.keys(json.networks)[0]].address, json.abi, provider);

    console.log('Caching...');
    await handleCache();
    console.log('Initiating interval...');
    setInterval(async () => handleCache, 1000 * 60 * 60); // Every hour

    // Listen on the appropiate port
    app.listen(port, () => console.log(`Listening on port ${port}.`));
}

main();