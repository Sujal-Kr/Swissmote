import axios from "axios";
import { Asterisk, Mail, UserPlus2 } from "lucide-react";
import React from "react";
import { toast } from "react-hot-toast";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { server } from "../constants/config";
import { userExists } from "../redux/slices/auth";

const Login = () => {
  const dispatch = useDispatch();

  const handleLogin = async (e) => {
    e.preventDefault();

    const id = toast.loading("Logging In...");
    try {
      const formdata = new FormData(e.target);
      const credentials = {
        email: formdata.get("email"),
        password: formdata.get("password"),
      };

      const { data } = await axios.post(
        `${server}/api/user/login`,
        credentials,
        { withCredentials: true }
      );

      if (data.success) {
        dispatch(userExists(data.user));
        toast.success(data.message, { id });
        e.target.reset(); // Reset the form after successful login
      } else {
        throw new Error(data.message || "Login failed");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || err.message, { id });
    } 
  };

  return (
    <div className="min-h-dvh grid place-content-center">
      <div className="p-4 md:px-10 md:py-12 rounded-2xl shadow-2xl">
        <div className="flex gap-3 py-4 flex-col justify-center items-center">
          <UserPlus2 className="text-indigo-600" size={40} />
          <h3 className="text-center text-xl font-semibold">Welcome User!</h3>
        </div>
        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <div className="rounded-xl flex gap-2 px-2 items-center border-2 overflow-hidden">
            <Mail className="text-gray-500" />
            <input
              type="email"
              name="email"
              className="outline-none p-2 w-full"
              placeholder="Email"
              required
            />
          </div>
          <div className="rounded-xl flex gap-2 px-2 items-center border-2 overflow-hidden">
            <Asterisk className="text-gray-500" />
            <input
              type="password"
              name="password"
              className="outline-none p-2 w-full"
              placeholder="Password"
              required
            />
          </div>
          <button
            type="submit"
            className="px-8 py-2 rounded-xl shadow-xl text-white bg-indigo-500 uppercase my-4 hover:bg-indigo-600 transition-all"
          >
            Login
          </button>
          <Link to={'/resetpassword'} className="text-center text-xs text-indigo-500">Forgot your password?</Link>
          <div className="text-xs text-center">
            Are you a new user?{" "}
            <Link to="/signup" className="text-indigo-500 hover:underline">
              Create an account
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
