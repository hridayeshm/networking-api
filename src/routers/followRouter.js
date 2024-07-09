import express from 'express'
const router = express.Router();
import auth from "../middlewares/auth.js"
import { listAllNotifications, listAllFollowers, listAllFollowees, respond, sendFollowRequest } from '../controllers/userController.js';

router.post("/user/follow/:id", auth, sendFollowRequest);
  
  router.get("/user/list-all-notifications", auth, listAllNotifications);
  
  router.patch("/user/respond-to-request/:id/:action", auth, respond);
  
  router.get("/user/list-all-followers", auth, listAllFollowers);
  
  router.get("/user/list-all-followees", auth, listAllFollowees);

export default router;