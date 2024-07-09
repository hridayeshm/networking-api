import express from 'express';
const router = express.Router();
import auth from "../middlewares/auth.js";
import {createPost, getAllPosts, getPostById, updatePost, deletePostById} from "../controllers/postController.js"

router.post("/user/post", auth, createPost);

router.get("/user/post/all", auth, getAllPosts);

router.get("/user/post/:id", auth, getPostById);

router.patch("/user/post/:id", auth, updatePost);

router.delete("/user/post/:id", auth, deletePostById);


export default router;
