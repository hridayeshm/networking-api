const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const Token = require("../models/tokenModel");
require("dotenv").config();

const auth = async (req, res, next) => {
  try {
    //console.log("Request Headers:", req.headers);
    const token = req.header("Authorization").replace("Bearer ", "");
    const decoded = jwt.verify(token, process.env.SECRET_KEY);

    const user = await User.findOne({ _id: decoded._id });
    if (!user) {
      throw new Error("user not logged in or session expired");
    }

    const tokenValid = await Token.findOne({ uuid: decoded.uuid }); 
    if (!tokenValid) {
      throw new Error("token expired or invalid. request for new token");
    }

    req.user = user;
    req.token = tokenValid;

    next();
  } catch (err) {
    console.log(err);
    res.status(401).send(err);
  }
};

module.exports = auth;
