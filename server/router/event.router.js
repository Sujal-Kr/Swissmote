import express from "express";
import {
  createEvent,
  deleteEvent,
  getAllEvents,
  getMyEvents,
  joinEvent,
  leaveEvent,
} from "../controller/event.controller.js";
import { protectRoute } from "../middleware/auth.js";
const eventRouter = express.Router();

eventRouter.use(protectRoute);

eventRouter.route("/").get(getAllEvents).post(createEvent);

eventRouter.route("/me").get(getMyEvents);

eventRouter.route("/join-event").patch(joinEvent);

eventRouter.route("/leave-event").patch(leaveEvent);

eventRouter.route("/:id").delete(deleteEvent);

export { eventRouter };
