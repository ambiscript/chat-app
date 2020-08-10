const jwt = require('jsonwebtoken');

const secret = require('../secret.json').userAuth;

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, secret.privateTokenKey);
    req.userData = {
      email: decodedToken.email,
      userId: decodedToken.userId
    };
    next();
  } catch (err) {
    res.status(401).json({ message: 'You are not authenticated!' });
  }
};
