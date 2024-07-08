import express from "express";
const router = express.Router();

const AdminController = require("../controllers/adminController/adminController");
import adminAuth from "../middlewares/adminAuth.js";
import Token from "../models/tokenModel.js";

router.post("/admin/login", async (req, res) => {
  try {
    const values = req.body;
    const adminController = new AdminController();
    const admin = await adminController.login(values);
    const [token, email, uuid, _id] = await admin.generateAuthToken();
    console.log(token);
    const tokenDoc = new Token({ email, uuid, user: _id });
    await tokenDoc.save();

    res.send([token, tokenDoc]);
  } catch (err) {
    console.log(err.message);
  }
});

router.get("/admin/get-all-users", adminAuth, async (req, res) => {
  try {
    const adminController = new AdminController();
    const allUsers = await adminController.listAllUsers();
    res.send(allUsers);
  } catch (err) {
    res.send(err.message);
  }
});

router.get("/admin/get-all-posts", adminAuth, async (req, res) => {
  try {
    const adminController = new AdminController();
    const allPosts = await adminController.listAllPosts();
    res.send(allPosts);
  } catch (err) {
    res.send(err);
  }
});

router.post("/admin/block/:id", adminAuth, async (req, res) => {
  try {
    const userID = req.params.id;
    const adminController = new AdminController();
    const [blockedUser, deletedToken] = adminController.blockUser(userID);
    res.send([blockedUser, deletedToken]);
  } catch (err) {
    console.log(err); // inside blockUser
  }
});

router.post("/admin/logout", adminAuth, async (req, res) => {
  try {
    const tokenUUID = req.token.uuid;
    const adminController = new AdminController();
    const admin = await adminController.logout(tokenUUID);

    res.send(admin);
  } catch (err) {
    res.send(err.message);
  }
});

export default router;
