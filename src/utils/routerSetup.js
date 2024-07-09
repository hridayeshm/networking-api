import express from 'express';
import userRouter from "../routers/userRouter.js";
import postRouter from "../routers/postRouter.js";
import commentRouter from "../routers/commentRouter.js";
import likeRouter from "../routers/likeRouter.js";
import adminRouter from "../routers/adminRouter.js";
import followRouter from "../routers/followRouter.js";
import eventRouter from "../routers/eventRouter.js";

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
