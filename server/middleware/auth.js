import cookieParser from "cookie-parser";
import jwt from "jsonwebtoken";
import { userModel } from "../model/user.models.js";

const protectRoute = async (req, res, next) => {
  try {
    const token = req.cookies.jwt_token;
    if (!token) {
      return res.status(400).json({
        success: false,
        message: "user not logged in",
      });
    }

    // const payload=jwt.verify(token,key);
    jwt.verify(token, process.env.JWT_SECRET, (err, data) => {
      if (err) {
        return res.status(400).json({
          success: false,
          message: "Invalid token",
        });
      }
      // console.log(data);
      req._id = data._id;

    });
    next();
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};




export const socketAuthentication = async (socket, next) => {
  try {
      const cookie = cookieParser.JSONCookies(socket.handshake.headers.cookie)
      if (!cookie) return next(new Error("user not logged in"))
      const token = cookie.split("=")[1]
      const payload = jwt.verify(token, process.env.JWT_SECRET)
      if (!payload) return next(new Error("Couldn't verify token"))
      const user = await userModel.findById(payload._id)
      if (!user) return next(new Error("User not found"))
      socket.user = user._id
      next()
  } catch (error) {
      console.error(error.message)
      return next(new Error(error))
  }
}

export { protectRoute };
