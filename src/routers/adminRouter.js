const express = require("express");
const router = express.Router();
const Admin = require("../models/adminModel");
const AdminController = require("../controllers/admin-controller/adminController");


router.post("/admin/login", async (req, res) => {
  try {
    const values = req.body;
    const adminController = new AdminController();
    const admin = await adminController.login(values);
   
    
    res.send(admin);
  } catch (err) {
    res.send(err.message);
  }
});

router.get("/admin/get-all-users", async (req, res) => {
  try {

    const adminController = new AdminController();
    const allUsers = await adminController.listAllUsers();
    res.send(allUsers);
  } catch (err) {
    res.send(err.message);
  }
});

router.get("/admin/get-all-posts", async(req,res) => {
  try{

    const adminController = new AdminController();
    const allPosts = await adminController.listAllPosts();
    res.send(allPosts);
  }catch(err){
    res.send(err);
  }
});

router.post("/admin/logout", async(req,res) => {
  try{

    const adminController = new AdminController();
    const admin = await adminController.logout();
    res.send(admin);
  }catch(err){
    res.send(err.message);
  }
});

module.exports = router;
