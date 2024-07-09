import mongoose from "mongoose"

const notificationSchema = new mongoose.Schema({
    follower: {
        type: mongoose.Schema.Types.ObjectId,
        required : true,
        ref: 'User'
    },
    followee: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    from: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    to: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    status: {
        type: String,
        enum: ["requested", "accepted", "rejected"]
    }
});

const Notification = mongoose.model("Notification", notificationSchema);

export default Notification;