import Event from "../models/eventModel.js"

export const create = async(values) => {
    try {
        const event = new Event(values);
        if (!event) {
          throw new Error("failed to create event");
        }
        await event.save();
        return event;
      } catch (err) {
        throw err;
      }
}

export const list = async() => {
    try {
        const events = Event.find();
        return events;
      } catch (err) {
        throw err;
      }
}

export const add = async() => {
    try {
        const event = await Event.findOneAndUpdate(
          values,
          { $push: { participants: participantID } },
          { new: true }
        );
        if (!event) {
          throw new Error("event not found");
        }
        return event;
      } catch (err) {
        throw err;
      }
}

export const participate = async(values, req) => {
    try {
        const event = await Event.findOneAndUpdate(
          values,
          { $push: { participants: req.user._id } },
          { new: true }
        );
        if (!event) {
          throw new Error("event not found");
        }
        return event;
      } catch (err) {
        throw err;
      }
}