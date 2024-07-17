import Token from "../models/tokenModel.js"


  export const createToken = async (user, uuid) => {
    const tokenDoc = new Token({ email: user.email, uuid, user: user._id });
    await tokenDoc.save();
    
  }

  export const createTokenFromController = async (email, uuid, user) => {
    const tokenDoc = new Token({email, uuid, user: user._id });
    await tokenDoc.save();
  }



