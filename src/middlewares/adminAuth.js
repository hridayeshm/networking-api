import jwt from "jsonwebtoken"
import Admin from "../models/adminModel.js"
import dotenv from "dotenv"
dotenv.config();
import Token from "../models/tokenModel.js"

const adminAuth = async (req, res, next) => {
  try {
  
    const token = req.header("Authorization").replace("Bearer ", "");
    const decoded = jwt.verify(token, process.env.ADMIN_SECRET_KEY);
    const admin = await Admin.findOne({ _id: decoded._id });
    if (!admin) {
      console.log("admin not logged in or not logged in");
    }

    const tokenValid = await Token.findOne({uuid: decoded.uuid});
    if(!tokenValid){
      throw new Error("token expired or invalid. request for new token");
    }

    req.admin = admin;
    req.token = tokenValid;

    next();
  } catch (err) {
    console.log(err);
    res.status(401).send(err);
  }
};

export default adminAuth;
