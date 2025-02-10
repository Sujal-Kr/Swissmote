import axios from "axios";
import { Activity, Calendar1, LogOut } from "lucide-react";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, NavLink, useLocation } from "react-router-dom";
import { server } from "../../constants/config";
import toast from "react-hot-toast";
import { userNotExists } from "../../redux/slices/auth";
import { links } from "../../constants/data";

const Header = () => {
  const { user } = useSelector((state) => state.auth);
  const { pathname } = useLocation();
  const dispatch = useDispatch();

  if (["/login", "/signup", "/resetpassword"].includes(pathname)) {
    return null;
  }
  const handleLogout = async () => {
    try {
      const { data } = await axios.get(`${server}/api/user/logout`, {
        withCredentials: true,
      });
      if (data.success) {
        toast.success("user logged out successfully");
        dispatch(userNotExists());
      }
    } catch (err) {
      toast.error(err.response?.data?.message || err.message);
    }
  };

  return (
    <nav className="bg-white shadow-lg px-8">
      <div className="flex h-20 items-center justify-between">
        <div className="flex items-center space-x-8">
          <div className="flex items-center">
            <Calendar1 />
            <h1 className=" text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
              EventHub
            </h1>
          </div>
          <div className="flex gap-4">
            {links.map(({ title, url }, index) => (
              <Link
                to={url}
                key={index}
                className={`${
                  pathname === url &&
                  "bg-blue-600 text-white shadow-lg shadow-blue-300  "
                } px-4 py-2 rounded-xl transition-all duration-300`}
              >
                {title}
              </Link>
            ))}
          </div>
        </div>
        <div className="flex items-center ">
          {user ? (
            <button className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm transition-all hover:bg-gray-50"
            onClick={handleLogout}>
              Logout
            </button>
          ) : (
            <Link
              to={"/login"}
              className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm transition-all hover:bg-gray-50"
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Header;
