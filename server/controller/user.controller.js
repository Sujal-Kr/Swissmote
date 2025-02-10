import { userModel } from "../model/user.models.js";

const getProfile = async (req, res, next) => {
  try {
    
    const user = await userModel.findById(req._id);

    return res.status(200).json({
      success: true,
      message: "User Profile ",
      user,
    });
  } catch (err) {
    next(err);
  }
};

export { getProfile };
