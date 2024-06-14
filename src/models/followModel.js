const mongoose = require('mongoose');

const followSchema = new mongoose.Schema({
    follower: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    followee: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    }
});

const Follow = mongoose.model("Follow", followSchema);

module.exports = Follow;