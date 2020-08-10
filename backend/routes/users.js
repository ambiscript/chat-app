const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const secret = require('../secret.json').userAuth;
const User = require('../models/user');

const router = new express.Router();

router.post('/signup', (req, res) => {
  bcrypt.hash(req.body.password, 10).then((hash) => {
    const user = new User({
      email: req.body.email,
      password: hash
    });
    user
      .save()
      .then((result) => {
        res.status(201).json({
          message: 'User created!',
          result: result
        });
      })
      .catch((err) => {
        console.error(err);
        res.status(500).json({
          error: err
        });
      });
  });
});

router.post('/login', (req, res) => {
  let fetchedUser;
  User.findOne({ email: req.body.email })
    .then((user) => {
      if (!user) {
        return res.status(401).json({
          message: 'Auth failed'
        });
      }
      fetchedUser = user;
      return bcrypt.compare(req.body.password, user.password);
    })
    .then((result) => {
      if (!result) {
        return res.status(401).json({
          message: 'Auth failed'
        });
      }
      const token = jwt.sign(
        { email: fetchedUser.email, userId: fetchedUser._id },
        secret.privateTokenKey,
        { expiresIn: '1h' }
      );
      res.status(200).json({ token: token });
    })
    .catch((err) => {
      console.error(err);
      return res.status(401).json({
        message: 'Auth failed'
      });
    });
});

module.exports = router;
