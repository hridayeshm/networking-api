import express from 'express';
import userRouter from "../routers/userRouter";
import postRouter from "../routers/postRouter";
import commentRouter from "../routers/commentRouter";
import likeRouter from "../routers/likeRouter";
import adminRouter from "../routers/adminRouter";
import followRouter from "../routers/followRouter";
import eventRouter from "../routers/eventRouter";

import '../db/db.js';
import '../service/notificationMail.js';
const router = express.Router();

router.use(userRouter);
router.use(postRouter);
router.use(commentRouter);
router.use(likeRouter);
router.use(adminRouter);
router.use(followRouter);
router.use(eventRouter);

export default router;
