import { CREATE, JOIN_EVENT, LEAVE_EVENT } from "../constants/events.js";
import { eventModel } from "../model/event.model.js";
import { userModel } from "../model/user.models.js";
import { ApiError } from "../utils/error.js";
import { emitEvent } from "../utils/utility.js";

const getAllEvents = async(req, res, next) => {
  try {
    const events = await eventModel.find({}).populate("user");

    return res.status(200).json({
      success: true,
      message: "Retreived Events",
      events,
    });
  } catch (err) {
    next(err);
  }
};

const getMyEvents = async(req, res, next) => {
  try {
    const events =await  eventModel.find({ user: req._id });

    return res.status(200).json({
      success: true,
      message: "Retreived Events",
      events,
    });
  } catch (err) {
    next(err);
  }
};

const createEvent = async (req, res, next) => {
  try {
    const { name, description, location, date, organizer } = req.body;

    if (!name || !description || !location || !date || !organizer) {
      throw new ApiError(400, "Missing fields");
    }
    const event = await eventModel.create({
      name,
      description,
      location,
      date,
      organizer,
      user: req._id,
      attendees:[]
    });
    // emitEvent(req, CREATE, req._id);
    return res.status(201).json({
      success: true,
      message: "Event created successfully",
      event,
    });
  } catch (err) {
    return next(err);
  }
};

const deleteEvent = async (req, res, next) => {
  try {
    const id = req.params.id;
    if (!id) {
      throw new ApiError(400, "Event Id is Missing");
    }
    const event = await eventModel.findById(id);
    if (!event) {
      throw new ApiError(400, "Event not found");
    }
    if (event.user.toString() !== id.toString()) {
      throw new ApiError(400, "You are not allowed to delete");
    }
    await findByIdAndDelete(id);
    emitEvent(req);
    return res.status(200).json({
      success: true,
      message: "Event deleted successfully",
    });
  } catch (err) {
    return next(err);
  }
};

const joinEvent = async (req, res, next) => {
  try {
    const { id, member } = req.body;
    if (!id || !member) {
      throw new ApiError(400, "Missing EventId or Member");
    }
    const event = await eventModel.findById(id);
    if (!event) {
      throw new ApiError(404, "Event not found");
    }
    const user = await userModel.findById(member);
    if (!user) {
      throw new ApiError(404, "User not found");
    }
    event?.attendees.push(member);
    await event.save();

    console.log(event.attendees.length);
    emitEvent(
      req,
      JOIN_EVENT,
      event.attendees,
      {
        id:id,
        member,
        message:`${user.name} Joined ${event.name}`
      }
    );

  } catch (err) {
    next(err);
  }
};

const leaveEvent = async (req, res, next) => {
  try {
    const { id, member } = req.body;
    if (!id || !member) {
      throw new ApiError(400, "Missing EventId or Member");
    }
    const event =await  eventModel.findById(id);
    if (!event) {
      throw new ApiError(404, "Event not found");
    }
    const user =await userModel.findById(member);
    if (!user) {
      throw new ApiError(404, "User not found");
    }

    emitEvent(
      req,
      LEAVE_EVENT,
      event.attendees,
      {
        id:id,
        member,
        message:`${user.name} Left ${event.name}`
      }
    );

    event.attendees = event.attendees.filter(
      (attendee) => attendee.toString() !== member.toString()
    );
   
    await event.save();

  } catch (err) {
    next(err);
  }
};

export {
  getAllEvents,
  getMyEvents,
  createEvent,
  deleteEvent,
  joinEvent,
  leaveEvent,
};
