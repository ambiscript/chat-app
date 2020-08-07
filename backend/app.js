const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const auth = require('./secret.json')["mongodb-auth"];

const Post = require('./models/post');

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
    'GET, POST, PATCH, DELETE, OPTIONS'
  );
  next();
});

app.post('/api/posts', (req, res, next) => {
  const post = new Post({
    title: req.body.title,
    content: req.body.content
  });
  post.save(); // stores in posts collection
  res.status(201).json({
    message: 'Post added successfully'
  });
});

app.get('/api/posts', (req, res, next) => {
  Post.find()
    .then((documents) => {
      console.log(documents);
      res.status(200).json({
        message: 'Posts fetched successfully',
        posts: documents
      });
    });
});

module.exports = app;
