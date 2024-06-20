const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
require("dotenv").config();

const auth = async (req, res, next) => {
  try {
    //console.log("Request Headers:", req.headers);
    const token = req.header("Authorization").replace("Bearer ", "");
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    
    const user = await User.findOne({ _id: decoded._id });
    if (!user) {
      console.log("user not logged in or session expired");
    }

    req.user = user;

    next();
  } catch (err) {
    console.log(err);
    res.status(401).send(err);
  }
};

module.exports = auth;
