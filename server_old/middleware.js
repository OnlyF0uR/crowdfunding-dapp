// Generate random values
const { randomBytes } = require('crypto');
let key = randomBytes(32);
let pwd = randomBytes(16).toString('hex');

setInterval(() => {
    key = randomBytes(32);
    pwd = randomBytes(16).toString('hex');
}, 1000 * 60 * 60 * 3);

// Instantiate branca
const branca = require("branca")(key);

// Get the encoded value; timestamp: Math.floor(new Date() / 1000);
const getAuth = () => branca.encode(pwd);

const withAuth = (req, res, next) => {
    const token =
        req.body.token ||
        req.query.token ||
        req.headers['x-access-token'] ||
        req.cookies.token;

    if (!token) {
        res.status(401).end();
    } else {
        const payload = branca.decode(token, 2400).toString(); // ttl: 30 minutes

        if (payload === pwd) {
            next();
        } else {
            res.status(401).end();
        }
    }
};

module.exports = {
    getAuth,
    withAuth
};