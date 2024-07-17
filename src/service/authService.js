import { v4 as uuidv4 } from "uuid";
import jwt from "jsonwebtoken";
import User from "../models/userModel.js";
import Token from "../models/tokenModel.js";

export const generateAuthToken = async (user) => {
  const uuid = uuidv4();

  const jwt_payload = {
    _id: user._id.toString(),
    email: user.email,
    username: user.username,
    uuid: uuid,
  };
  const token = jwt.sign(jwt_payload, process.env.SECRET_KEY);

  return { token, uuid };
};

export const verifyAuthToken = async (request) => {
  try {
  
    const token = request.req.headers.authorization.replace("Bearer ", "");
  
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    const user = await User.findOne({ _id: decoded._id });
    if (!user) {
      throw new Error("user not logged in or sesison expired");
    }

    const tokenValid = await Token.findOne({ uuid: decoded.uuid });
    if (!tokenValid) {
      throw new Error("token expired or invalid. request for new token");
    }

    return {user, tokenValid};
  } catch (err) {
    console.log(err)
    throw err;
  }
};
