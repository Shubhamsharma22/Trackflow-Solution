import User from "../../Models/User.Model.js";
import ApiError from "../../Utils/ApiError.Utils.js";
import AsyncHandler from "../../Utils/AsyncHandler.Utils.js";

const GetProfileController = AsyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id)
    .select("-password")
    .populate("Organization", "Name");

  if (!user) throw new ApiError(404, "User not found");

  res.status(200).json({
    message: "Profile retrieved successfully",
    user,
  });
});

export default GetProfileController;
