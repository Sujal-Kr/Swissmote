import axios from "axios";
import { Upload, User } from "lucide-react";
import React from "react";
import { server } from "../constants/config";
import toast from "react-hot-toast";

const Create = () => {
  const handleSubmit = async (e) => {
    e.preventDefault();
    const id = toast.loading("Creating Event...");
    try {
      const formdata = new FormData(e.target);

      const event = {
        name: formdata.get("name"),
        organizer: formdata.get("organizer"),
        date: formdata.get("date"),
        description: formdata.get("description"),
        location: formdata.get("location"),
      };

      console.log(event);

      const { data } = await axios.post(`${server}/api/event/`, event, {
        withCredentials: true,
      });
      if (data.success) {
        toast.success(data.message, { id });
      }
    } catch (err) {
      toast.error(err.response?.data?.message || err.messgage, { id });
    }
  };
  return (
    <div className="p-4 md:p-20 ">
      <div className=" text-center p-12">
        <h2 className="text-3xl font-bold text-gray-900">Create Your Event</h2>
        <p className=" text-lg text-gray-600">
          Share your event with the world
        </p>
      </div>

      <form onSubmit={handleSubmit} className="rounded-lg bg-white shadow-md">
        <div className="p-3 bg-gray-100">
          <p className="text-lg">Fill the detials to create your event</p>
          <p>Have a good day</p>
        </div>
        <div className="space-y-6 p-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Event Name *
            </label>
            <input
              type="text"
              required
              name="name"
              className="mt-1 block w-full border p-2 rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="Enter event name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Organizer *
            </label>
            <input
              type="text"
              required
              name="organizer"
              className="mt-1 block w-full border p-2 rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="Organizer name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Location *
            </label>
            <input
              type="text"
              required
              name="location"
              className="mt-1 block w-full border p-2 rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="Event location"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Date and Time *
            </label>
            <input
              type="datetime-local"
              required
              name="date"
              className="mt-1 block w-full border p-2 rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Description *
            </label>
            <textarea
              required
              rows="3"
              name="description"
              className="mt-1 block w-full border p-2 rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="Event description"
            />
          </div>
        </div>

        <div className="border-t border-gray-200 px-6 py-4">
          <div className="flex justify-end">
            <button
              type="submit"
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
            >
              Create Event
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Create;
