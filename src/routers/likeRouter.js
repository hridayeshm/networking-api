import express from 'express';
import auth from "../middlewares/auth.js";
const router = express.Router();
import {likePost, removeLike} from "../controllers/likeController.js";

router.post("/like/post/:id", auth, likePost);

router.delete("/unlike/post/:id", auth, removeLike);

export default router;
