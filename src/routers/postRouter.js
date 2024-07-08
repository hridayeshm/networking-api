import express from 'express';
const router = express.Router();
import auth from "../middlewares/auth.js";
const PostController = require("../controllers/postController");
const postController = new PostController();

router.post("/user/post", auth, postController.createPost);

router.get("/user/post/all", auth, postController.getAllPosts);

router.get("/user/post/:id", auth, postController.getPostById);

router.patch("/user/post/:id", auth, postController.updatePost);

router.delete("/user/post/:id", auth, postController.deletePost);


export default router;
