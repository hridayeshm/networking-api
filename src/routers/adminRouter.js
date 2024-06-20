const express = require("express");
const router = express.Router();
const Admin = require("../models/adminModel");
const AdminController = require("../controllers/admin-controller/adminController");
const adminAuth = require("../middlewares/adminAuth");

router.post("/admin/login", async (req, res) => {
  try {
    const values = req.body;
    const adminController = new AdminController();
    const admin = await adminController.login(values);
    const token = await admin.generateAuthToken();


    res.send(token);
  } catch (err) {
    res.send(err.message);
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

router.get("/admin/get-all-posts", adminAuth, async(req,res) => {
  try{

    const adminController = new AdminController();
    const allPosts = await adminController.listAllPosts();
    res.send(allPosts);
  }catch(err){
    res.send(err);
  }
});

router.post("/admin/logout", adminAuth, async(req,res) => {
  try{

    const adminController = new AdminController();
    const admin = await adminController.logout();
    res.send(admin);
  }catch(err){
    res.send(err.message);
  }
});

module.exports = router;
