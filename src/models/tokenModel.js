const mongoose = require("mongoose");
const { v4: uuidv4 } = require('uuid');


const tokenSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    uuid: {
        type: String,
        required: true,
        default: uuidv4
    }
});

const Token = mongoose.model("Token", tokenSchema);

module.exports = Token;