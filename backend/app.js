const express = require('express');
const bodyParser = require('body-parser');
<<<<<<< HEAD

const app = express();

=======
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

>>>>>>> module4-mongodb
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
<<<<<<< HEAD
  const post = req.body;
  console.log(post);
  res.status(201).json({
    message: 'Post added successfully'
  });
});

app.get('/api/posts', (req, res, next) => {
  const posts = [
    {
      id: 'fj9as8dfuag9adf',
      title: 'First server-side post',
      content: 'This comes from the server!'
    },
    {
      id: 'agj9af8gsa9f8g4',
      title: 'Second server-side post',
      content: 'This also comes from the server!'
    }
  ];
  res.status(200).json({
    message: 'Posts fetched successfully',
    posts: posts
=======
  const post = new Post({
    title: req.body.title,
    content: req.body.content
  });
  post.save().then(createdPost => {
    res.status(201).json({
      message: 'Post added successfully',
      postId: createdPost._id
    });
  }); // stores in posts collection
});

app.get('/api/posts', (req, res, next) => {
  Post.find()
    .then((documents) => {
      res.status(200).json({
        message: 'Posts fetched successfully',
        posts: documents
      });
    });
});

app.delete("/api/posts/:id", (req, res, next) => {
  Post.deleteOne({ _id: req.params.id }).then(() => {
    res.status(200).json({ message: "Post deleted." });
>>>>>>> module4-mongodb
  });
});

module.exports = app;
