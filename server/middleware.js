const jwt = require('jsonwebtoken')

const withAuth = (req, res, next) => {
    const token =
        req.body.token ||
        req.query.token ||
        req.headers['x-access-token'] ||
        req.cookies.token;

    if (!token) {
        res.status(401).end();
    } else {
        jwt.verify(token, process.env.JWT_KEY, (err, decoded) => {
            if (err) {
                res.status(401).end();
            } else {
                if (decoded.pwd == process.env.JWT_PWD) {
                    res.status(401).end();
                } else {
                    next(); 
                }
            }
        });
    }
}

module.exports = {
    withAuth
};