const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth");
const PostController = require("../controllers/postController");
const postController = new PostController();

router.post("/user/post", auth, postController.createPost);

router.get("/user/post/all", auth, postController.getAllPosts);

router.get("/user/post/:id", auth, postController.getPostById);

router.patch("/user/post/:id", auth, postController.updatePost);

router.delete("/user/post/:id", auth, postController.deletePost);


module.exports = router;
