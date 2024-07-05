const User = require("../models/userModel");

class UserRepository {
  async register(values) {
    try {
      const user = new User(values);

      await user.save();
      return user;
    } catch (err) {
      throw err;
    }
  }

  async verify(emailVerificationToken) {
    try {
      const user = await User.findOneAndUpdate(
        { emailVerificationToken },
        {
          mailVerifiedAt: new Date(),
          emailVerificationToken: null,
          status: "active",
        },
        { new: true }
      );
      if (!user) {
        throw new Error("invalid token");
      }

      return user;
    } catch (err) {
      throw err;
    }
  }

  async login(filter){
    try {
        const user = await User.findOne({ email: filter.email });
  
        return user;
      } catch (err) {
        console.log(err);
      }
  }
}

module.exports = UserRepository;
