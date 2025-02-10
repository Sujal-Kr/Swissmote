import bcrypt from "bcrypt";
import { ApiError } from "../utils/error.js";
import { sendToken } from "../utils/utility.js";
import { options } from "../constants/config.js";
import { userModel } from "../model/user.models.js";

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      throw new ApiError(400, "email and password must be provided");
    }
    const user = await userModel.findOne({ email }).select("+password");

    if (!user) {
      throw new ApiError(400, "User not found");
    }
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      throw new ApiError(400, "Wrong Credentials");
    }
    sendToken(res, user, 200, "User Logged In");
  } catch (err) {
    return next(err);
  }
};
const signup = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    if (!email || !password || !name) {
      throw new ApiError(400, "Name, Email and  Password are required");
    }
    const user = await userModel.findOne({ email });
    if (user) {
      throw new ApiError(400, "User already exists");
    }
    const newuser = await userModel.create({ name, email, password });

    sendToken(res, newuser, 201, "User Signed Up");
  } catch (err) {
    return next(err);
  }
};
const logout = async (_, res, next) => {
  try {
    return res
      .cookie("jwt_token", "", { ...options, maxAge: 0 })
      .status(200)
      .json({
        success: true,
        message: "User Logged Out",
      });
  } catch (err) {
    return next(err);
  }
};



export { login, signup, logout };
