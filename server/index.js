require('dotenv').config();

const crypto = require('crypto');
const { promisify } = require('util');
const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const { withAuth } = require('./middleware');
const { getBriefData, getPageData, getSingleData, getUnverifiedCampaigns } = require('./data');

const app = express();
const scrypt = promisify(crypto.scrypt);

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
app.get('/api/campaigns/:id', (req, res) => {
    const { id } = req.params;

    const data = await getSingleData(id);

    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(data));
});

app.post('/api/campaigns/', async (req, res) => {
    const { brief, page } = req.body;

    let data;

    if (brief) {
        data = await getBriefData();
    } else {
        data = await getPageData(page);
    }
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

app.get('/api/priv/unverified-campaigns', withAuth, (req, res) => {
    const { psph } = req.body;

    const buffer = Buffer.from(process.env.PSPH_HASH, 'hex');

    const hash = crypto.createHash('sha512');
    const data = hash.update(psph, 'utf-8');
    const derPsph = data.digest('hex');

    const isEqual = crypto.timingSafeEqual(buffer, derPsph);
    if (!isEqual) {
        return res.status(401).end();
    }

    const data = await getUnverifiedCampaigns(id);

    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(data));
});

app.post('/api/priv/verify-campaign', withAuth, (req, res) => {
    const { psph, cat, id } = req.body;

    const buffer = Buffer.from(process.env.PSPH_HASH, 'hex');

    const hash = crypto.createHash('sha512');
    const data = hash.update(psph, 'utf-8');
    const derPsph = data.digest('hex');

    const isEqual = crypto.timingSafeEqual(buffer, derPsph);
    if (!isEqual) {
        return res.status(401).end();
    }

    // ...
});

// ===================================
const port = process.env.PORT || 3000;

app.listen(port, () => console.log(`CrowdFunding app listening on port ${port}.`));