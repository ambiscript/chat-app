const jwt = require('jsonwebtoken');

const secret = require('../secret.json').userAuth;

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    jwt.verify(token, secret.privateTokenKey);
    next();
  } catch (err) {
    console.error(err);
    res.status(401).json({ message: 'Auth failed!' });
  }
};
