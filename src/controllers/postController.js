const PostRepository = require("../repositories/postRepository");
const postRepository = new PostRepository();

class PostController {
  async createPost(req, res, next) {
    try {
      const values = {
        title: req.body.title,
        description: req.body.description,
        owner: req.user._id,
      };

      const post = await postRepository.create(values);
      console.log(post)
      res.send(post);
    } catch (err) {
      res.send(err);
    }
  }

  async getAllPosts(req, res, next) {
    try {
      const values = { owner: req.user._id };
      const options = {
        page: parseInt(req.query.page),
        limit: parseInt(req.query.limit),
        skip: parseInt(req.query.skip)
      };

      const posts = await postRepository.getAll(values, options);
      res.send(posts);
    } catch (err) {
      res.send(err.message);
    }
  }

  async getPostById(req, res, next) {
    try {
      const values = {
        _id: req.params.id,
        owner: req.user._id,
      };

      const post = await postRepository.getById(values);
      res.send(post);
    } catch (err) {
      res.send(err.message);
    }
  }

  async updatePost(req, res, next) {
    try {
      const filter = {
        _id: req.params.id,
        owner: req.user._id,
      };
      const updates = req.body;

      const post = await postRepository.update(filter, updates);
      res.send(post);
    } catch (err) {
      res.send(err.message);
    }
  }

  async deletePost(req, res, next) {
    try {
      const filter = { _id: req.params.id, owner: req.user._id };

      const post = postRepository.delete(filter);

      res.send(post);
    } catch (err) {
      res.send(err.message);
    }
  }
}
module.exports = PostController;
