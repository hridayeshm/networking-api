import express from 'express';
import auth from "../middlewares/auth.js";
const router = express.Router();
import {addComment, viewComments, updateComment, deleteCommentByAuthor, deleteCommentByPostOwner} from "../controllers/commentController.js"


router.post("/comment/post/:id", auth, addComment);

router.get("/comments/post/:id", auth, viewComments);

router.patch("/comment/update/:id", auth, updateComment);

router.delete("/comment/delete/:id", auth, deleteCommentByAuthor);

router.delete("/:postID/comment/delete/:id", auth, deleteCommentByPostOwner);

export default router;
