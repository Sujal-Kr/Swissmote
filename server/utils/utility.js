import jwt from "jsonwebtoken";
import { v2 as cloudinary } from "cloudinary";
import { options } from "../constants/config.js";
import { userSocketIds } from "../app.js";

const sendToken = (res, user, code, message) => {
  const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);
  res.cookie("jwt_token", token, options);
  return res.status(code).json({
    success: true,
    message,
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
    },
  });
};

const uploadToCloud = async (file) => {
  try {
    const data = await cloudinary.uploader.upload(file.path, {
      resource_type: "auto",
    });
    return {
      url: data.url,
      public_id: data.public_id,
    };
  } catch (err) {
    throw new Error("Failed to Upload" + err.message);
  }
};



const emitEvent = (req, event, users, data) => {
  try {
    const io = req.app.get("io");
    const usersSocket = getSocketIds(users);
    io.to(usersSocket).emit(event, data);
    console.log(users)
    console.log("Event emiting", event);
  } catch (err) {
    console.log("Failed to emit event", err.message);
  }
};

const getSocketIds = (users) => {
  console.log(users);
  try {
    return users.map((user) => userSocketIds.get(user.toString()));
  } catch (err) {
    console.log("socketId", err.message);
  }
};

export { sendToken, uploadToCloud, getSocketIds, emitEvent };
