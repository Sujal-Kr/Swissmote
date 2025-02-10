import axios from "axios";
import { server } from "../constants/config";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

const useEvents = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    const loadEvents = async () => {
      setLoading(true);
      console.log(server)
      try {
        const { data } = await axios.get(`${server}/api/event/`, {
          withCredentials: true,
        });
        if (data.success) {
          setEvents(data.events);
        }
      } catch (err) {
        toast.error(err.response?.data?.message);
      } finally {
        setLoading(false);
      }
    };
    loadEvents();
  }, []);
  return { events, setEvents,loading };
};

export { useEvents };
