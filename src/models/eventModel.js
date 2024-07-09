import mongoose from "mongoose"

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
    required: true,
  },
  location: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ["active", "ended", "ongoing"],
  },
  participants: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  organizer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  coordinates: {
    type: [Number, Number],
    required: true,
    default: [0, 0],
    },
});

const Event = mongoose.model('Event', eventSchema);

export default Event;