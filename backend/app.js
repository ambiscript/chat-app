const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const auth = require('./secret.json')["mongodb-auth"];

const postsRoutes = require('./routes/posts');

const app = express();

mongoose.connect(
  `mongodb+srv://${auth.user}:${auth.password}@cluster0.0njld.mongodb.net/`
   + `${auth.dbname}?retryWrites=true&w=majority`,
  { useNewUrlParser: true, useUnifiedTopology: true }
)
.then(() => {
  console.log('Connected to database!');
})
.catch((err) => {
  console.error(err);
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
    );
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, PATCH, PUT, DELETE, OPTIONS'
  );
  next();
});

app.use('/api/posts', postsRoutes);

module.exports = app;
