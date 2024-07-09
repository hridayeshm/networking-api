import mongoose from "mongoose"

const tokenSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  uuid: {
    type: String,
    required: true,
  },
  user: {
    type: mongoose.SchemaTypes.ObjectId,
    required: true, 
    ref: 'User'
  }
});

const Token = mongoose.model("Token", tokenSchema);

export default Token;
