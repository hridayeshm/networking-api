import Token from "../models/tokenModel.js"


  export const createToken = async (email, uuid, user) => {
    const tokenDoc = new Token({ email, uuid, user: user._id });
    await tokenDoc.save();
    return tokenDoc;
  }



