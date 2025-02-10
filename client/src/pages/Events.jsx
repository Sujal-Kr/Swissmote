import React, { useCallback } from "react";
import { useEvents } from "../hooks/api";
import EventCard from "../components/specific/EventCard";
import { getSocket } from "../context/socket";
import { JOIN_EVENT, LEAVE_EVENT } from "../constants/events";
import { useSocketEvents } from "../hooks/socket";
import axios from "axios";
import { server } from "../constants/config";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
const Events = () => {
  const socket = getSocket();

  const { events, setEvents, loading } = useEvents();
  const { user } = useSelector((state) => state.auth);

  const handleJoinEventListener = useCallback((data) => {
    setEvents((prev) =>
      prev.map((item) =>
        item._id === data.id && item.attendees?.includes(data.member)
          ? item
          : { ...item, attendees: [...item.attendees, data.member] }
      )
    );
    toast.success(data.message);
  }, []);

  const handleLeaveEventListener = useCallback((data) => {
    setEvents((prev) =>
      prev.map((item) =>
        item._id === data.id
          ? {
              ...item,
              attendees: item.attendees?.filter((id) => id !== data.member),
            }
          : item
      )
    );
    toast.success(data.message);
  }, []);

  const socketHandlers = {
    [JOIN_EVENT]: handleJoinEventListener,
    [LEAVE_EVENT]: handleLeaveEventListener,
  };

  useSocketEvents(socket, socketHandlers);

  const handleJoinEvent = async (id) => {
    try {
      const { data } = await axios.patch(
        `${server}/api/event/join-event`,
        { id, member: user._id },
        { withCredentials: true }
      );
    } catch (err) {
      toast.error(err.response?.data?.message);
    }
  };

  const handleLeaveEvent = async (id) => {
    console.log(id);
    try {
      const { data } = await axios.patch(
        `${server}/api/event/leave-event`,
        { id, member: user._id },
        { withCredentials: true }
      );
    } catch (err) {
      toast.error(err.response?.data?.message);
    }
  };

  return (
    <div className="p-10">
      <div className="text-center flex flex-col gap-3 py-4">
        <h1 className="text-3xl font-semibold">Discover Amazing Events</h1>
        <p className="">
          Join thousands of people who use EventHub to discover, create, and
          manage events that matter.
        </p>
      </div>
      <hr />
      <div className="py-2">
        {events?.length == 0 ? (
          <div className="text-center">Nothing to show</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 ">
            {events.map((event) => (
              <EventCard
                key={event._id}
                event={event}
                onJoin={handleJoinEvent}
                onLeave={handleLeaveEvent}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Events;
