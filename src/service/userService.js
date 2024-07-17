import { v4 as uuidv4 } from "uuid";
import { login, register, show, verify } from "../repositories/userRepository.js";
import sendVerficationMail from "./verificationMail.js";
import { verifyPassword } from "../utils/verifyPassword.js";
import { createToken } from "../repositories/tokenRepository.js";
import { generateAuthToken } from "./authService.js";

export const registerUser = async ({data}) => {
  try{
  const userDetails = {
    ...data,
    emailVerificationToken: uuidv4(),
  };

  const registeredUser = await register(userDetails);
  sendVerficationMail(values);

  return registeredUser;
} catch(err) {
  throw err;
}
};

export const verifyUser = async ({emailVerificationToken}) => {
  try{
    const verifiedUser = await verify(emailVerificationToken);
    return verifiedUser;
  } catch(err) {
    throw err;
  }

};

export const loginUser = async ({data}) => {
  try {
    const user = await login(data);
    if (!user) {
      throw new Error("user not found");
    }

    if (!(await verifyPassword(data.password, user.password))) {
      throw new Error("login with correct email and password");
    }
    if (user.status === "inactive" || user.status === "blocked") {
      throw new Error(
        "user not activated. please check mail for verification or contact administrator"
      );
    }
    const {token, uuid} = await generateAuthToken(user);
    await createToken(user, uuid);
   
    return {user, token};
  } catch (err) {
    throw err;
  }
};

export const showFeed = async(user) => {
  try{
    const filter = { _id: user._id};
    
    const feed = await show(filter);
    console.log(feed)
    return feed;
  } catch(err) {

  }
}
