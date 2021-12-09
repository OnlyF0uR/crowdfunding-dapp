const jwt = require('jsonwebtoken')

const withAuth = (req, res, next) => {
  const token = 
      req.body.token ||
      req.query.token ||
      req.headers['x-access-token'] ||
	  req.cookies.token;

  if (!token) {
	res.status(401);
  } else {
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
		res.status(401);
      } else {
        req.login_name = decoded.login_name;
        next();
      }
    });
  }
}

module.exports = {
	withAuth
};