const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const bcrypt = require("bcrypt");
const { v4: uuidv4 } = require("uuid");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
      trim: true,
      lowercase: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Email is invalid");
        }
      },
    },
    password: {
      type: String,
      required: true,
      minlength: 4,
      trim: true,
      validate(value) {
        if (value.includes("-")) {
          throw new Error("Password cant contain certain special characters");
        }
      },
    },
    followers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    followees: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    emailVerificationToken: {
      type: String,
    },
    mailVerifiedAt: {
      type: Date,
      default: null,
    },
    status: {
      type: String,
      enum: ["active", "inactive", "blocked"],
      default: "inactive",
    },
  },
  {
    timestamps: true,
  }
);

userSchema.methods.toJSON = function () {
  const user = this;
  const userObject = user.toObject();

  delete userObject.password;

  return userObject;
};

userSchema.methods.generateAuthToken = async function () {
  const user = this;
  const uuid = uuidv4();
  
  const jwt_payload = {
    _id: user._id.toString(),
    email: user.email,
    username: user.username,
    uuid: uuid,
  };
  const token = jwt.sign(jwt_payload, process.env.SECRET_KEY);
  // token.insert({userId:user._id,uuid:uuid})
  // user.tokens = user.tokens.concat({ token });
  // await user.save().then(() => {
  //     console.log("saved");      //CHECK LATER
  // })

  console.log(jwt_payload.username, jwt_payload.uuid);
  return [token, jwt_payload.email, jwt_payload.uuid];
};

// userSchema.statics.findUserByCredentials = async function(email, password) {
//     const user = await User.findOne({email});

//     if(!user){
//         throw new Error("Unable to login");
//     }

//     const isMatch = await bcrypt.compare(password, user.password);

//     if(!isMatch){
//         throw new Error('Login with correct email and password');
//     }

//     return user;
// }

userSchema.pre("save", async function (next) {
  const user = this;

  if (user.isModified("password")) {
    user.password = await bcrypt.hash(user.password, 8);
  }

  next();
});

const User = mongoose.model("User", userSchema);

module.exports = User;
