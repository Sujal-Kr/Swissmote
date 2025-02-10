import mongoose, { Types } from "mongoose";

const eventSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
    trim: true,
  },
  date: {
    type: Date,
    required: true,
  },
  location: {
    type: String,
    required: true,
    trim: true,
  },
  organizer: {
    type: String,
    required: true,
    trim: true,
  },
  user: {
    type: Types.ObjectId,
    ref: "user",
    required: true,
  },
  attendees: {
    type: [Types.ObjectId],
    ref: "user",
    default: [],
  },
});

const eventModel = mongoose.models.event || mongoose.model("event", eventSchema);

export { eventModel };
