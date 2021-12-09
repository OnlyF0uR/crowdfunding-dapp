require('dotenv').config();

const crypto = require('crypto');
const { promisify } = require('util');
const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const { withAuth } = require('./middleware');

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
    // TODO: This
});

app.post('/api/campaigns/', (req, res) => {
    // TODO: This
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
    // TODO: This
});

app.get('/api/priv/unverified-campaigns', withAuth, (req, res) => {
    const { psph } = req.body;

    // TODO: This
});

app.post('/api/priv/verify-campaign', withAuth, (req, res) => {
    const { psph } = req.body;

    // TODO: This
});

// ===================================
const port = process.env.PORT || 3000;

app.listen(port, () => console.log(`CrowdFunding app listening on port ${port}.`));