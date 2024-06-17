const express = require("express");
const router = express.Router();
const Admin = require("../models/adminModel");
const AdminController = require("../controllers/adminController");

router.post("/admin/login", async(req,res) => {
    const values = req.body;
    const adminController = new AdminController();
    const admin = await adminController.login(values);
});