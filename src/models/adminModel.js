const mongoose = require("mongoose");
const { v4: uuidv4 } = require('uuid');
const jwt = require("jsonwebtoken");

const adminSchema = new mongoose.Schema({
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
    trim: true
  },

});

adminSchema.methods.generateAuthToken = async function() {
  const admin = this;
  const uuid = uuidv4();

  const jwt_payload = {
    _id: admin._id.toString(),
    email: admin.email,
    password: admin.password,
    uuid: uuid
  };
  const token = jwt.sign(jwt_payload, process.env.ADMIN_SECRET_KEY);

  return [token, jwt_payload.email, jwt_payload.uuid, jwt_payload._id];
};

const Admin = mongoose.model("Admin", adminSchema);

export default Admin;
