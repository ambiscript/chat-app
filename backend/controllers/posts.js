const Post = require('../models/post');

exports.createPost = (req, res) => {
  const url = `${req.protocol}://${req.get('host')}`;
  const post = new Post({
    _id: req.body.id,
    user: req.userData.userId,
    title: req.body.title,
    content: req.body.content,
    imagePath: `${url}/images/${req.file.filename}`
  });
  post
    .save()
    .then((createdPost) => {
      res.status(201).json({
        message: 'Post added successfully',
        post: {
          id: createdPost._id,
          user: req.userData.userId,
          title: createdPost.title,
          content: createdPost.content,
          imagePath: createdPost.imagePath
        }
      });
    })
    .catch(() => {
      res.status(500).json({
        message: 'Failed to create post!'
      });
    });
};

exports.updatePost = (req, res) => {
  let imagePath = req.body.imagePath;
  if (req.file) {
    const url = `${req.protocol}://${req.get('host')}`;
    imagePath = `${url}/images/${req.file.filename}`;
  }
  const post = new Post({
    _id: req.body.id,
    user: req.userData.userId,
    title: req.body.title,
    content: req.body.content,
    imagePath: imagePath
  });
  Post.updateOne(
    { _id: req.params.id, user: req.userData.userId },
    post
  )
    .then((result) => {
      if (result.n > 0) {
        res.status(200).json({ message: 'Update Successful!' });
      } else {
        res.status(401).json({ message: 'Not Authorized!' });
      }
    })
    .catch(() => {
      res.status(500).json({
        message: 'Could not update post!'
      });
    });
};

exports.getPosts = (req, res) => {
  const pageSize = +req.query.pagesize; // Converts string to number
  const currentPage = +req.query.page; // Converts string to number
  const postQuery = Post.find();
  let fetchedPosts;
  if (pageSize && currentPage) {
    postQuery.skip(pageSize * (currentPage - 1)).limit(pageSize);
  }
  postQuery
    .then((documents) => {
      fetchedPosts = documents;
      return Post.countDocuments();
    })
    .then((count) => {
      res.status(200).json({
        message: 'Posts fetched successfully!',
        posts: fetchedPosts,
        maxPosts: count
      });
    })
    .catch(() => {
      res.status(500).json({
        message: 'Fetching posts failed!'
      });
    });
};

exports.getPost = (req, res) => {
  Post.findById(req.params.id)
    .then((post) => {
      if (post) {
        res.status(200).json(post);
      } else {
        res.status(404).json({ message: 'Post not found!' });
      }
    })
    .catch(() => {
      res.status(500).json({
        message: 'Fetching post failed!'
      });
    });
};

exports.deletePost = (req, res) => {
  Post.deleteOne({
    _id: req.params.id,
    user: req.userData.userId
  })
    .then((result) => {
      if (result.n > 0) {
        res.status(200).json({ message: 'Post Deleted!' });
      } else {
        res.status(401).json({ message: 'Not Authorized!' });
      }
    })
    .catch(() => {
      res.status(500).json({
        message: 'Failed to delete post!'
      });
    });
};
