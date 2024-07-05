const Token = require("../models/tokenModel");

class TokenRepository {
  async createToken(email, uuid) {
    const tokenDoc = new Token({ email, uuid, user: user._id });
    await tokenDoc.save();
    return tokenDoc;
  }
}

module.exports = TokenRepository;
