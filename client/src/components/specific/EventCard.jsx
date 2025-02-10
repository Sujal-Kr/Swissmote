import { Calendar1, Users, MapPin } from "lucide-react"; // Fixed missing import
import React from "react";
import { useSelector } from "react-redux";

const EventCard = ({ event, onJoin, onLeave }) => {
  const { user } = useSelector((state) => state.auth);

  return (
    <div className="p-3 rounded-md border shadow-lg">
      <div className="py-3">
        <h2 className="text-xl font-bold">{event.name}</h2>
        <h6 className="text-gray-500 text-xs">{event.organizer}</h6>
        <p className="text-gray-700">{event.description.substring(0, 90)}...</p>
      </div>
      <div className="mt-2 space-y-2">
        <div className="flex items-center gap-3">
          <Calendar1 />
          <span>{event?.date}</span>
        </div>
        <div className="flex items-center gap-3">
          <MapPin /> {/* Fixed icon import */}
          <span>{event?.location}</span>
        </div>
        <div className="flex items-center gap-3">
          <Users />
          <span>{event?.attendees?.length} Attendees</span>
        </div>
      </div>
      <div className="mt-4">
        {event.attendees?.includes(user?._id) ? ( // Fixed user null check
          <button
            onClick={() => onLeave(event._id)}
            className="p-2 bg-red-600 text-white rounded-lg w-full"
          >
            Leave Event
          </button>
        ) : (
          <button
            onClick={() => onJoin(event._id)}
            className="p-2 bg-blue-600 text-white rounded-lg w-full"
          >
            Join Event
          </button>
        )}
      </div>
    </div>
  );
};

export default EventCard;
