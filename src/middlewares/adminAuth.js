const jwt = require("jsonwebtoken");
const Admin = require("../models/adminModel");
require("dotenv").config();

const adminAuth = async (req, res, next) => {
  try {
  
    const token = req.header("Authorization").replace("Bearer ", "");
    const decoded = jwt.verify(token, process.env.ADMIN_SECRET_KEY);
    const admin = await Admin.findOne({ _id: decoded._id });
    if (!admin) {
      console.log("admin not logged in or session expired");
    }

    req.admin = admin;

    next();
  } catch (err) {
    console.log(err);
    res.status(401).send(err);
  }
};

module.exports = adminAuth;
