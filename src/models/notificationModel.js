const mongoose = require('mongoose');

const notifSchema = new mongoose.Schema({
    follower: {
        type: mongoose.Schema.Types.ObjectId,
        required : true
    },
    followee: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    from: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    to: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    status: {
        type: String
    }
});

const Notification = mongoose.model("Notification", notifSchema);

module.exports = Notification;