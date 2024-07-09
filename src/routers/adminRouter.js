import express from "express";
const router = express.Router();
import adminAuth from "../middlewares/adminAuth.js";

import { adminLogin, blockUser, listAllPosts, listAllUsers, adminLogout } from "../controllers/adminController/adminController.js";

router.post("/admin/login", adminLogin);

router.get("/admin/get-all-users", adminAuth, listAllUsers);

router.get("/admin/get-all-posts", adminAuth, listAllPosts);

router.post("/admin/block/:id", adminAuth, blockUser);

router.post("/admin/logout", adminAuth, adminLogout);

export default router;
