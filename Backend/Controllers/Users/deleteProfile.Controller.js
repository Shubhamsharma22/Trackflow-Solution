import User from "../../Models/User.Model.js";
import ApiError from "../../Utils/ApiError.Utils.js";
import AsyncHandler from "../../Utils/AsyncHandler.Utils.js";

const DeleteProfileController = AsyncHandler(async (req, res) => {
  const deletedUser = await User.findByIdAndDelete(req.user.id);
  if (!deletedUser) throw new ApiError(404, "User not found");

  res.clearCookie("token", { httpOnly: true });
  res.status(200).json({ message: "Profile deleted successfully" });
});

export default DeleteProfileController;