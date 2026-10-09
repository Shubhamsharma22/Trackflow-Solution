import User from "../../Models/User.Model.js";
import ApiError from "../../Utils/ApiError.Utils.js";
import AsyncHandler from "../../Utils/AsyncHandler.Utils.js";

const UpdateProfileController = AsyncHandler(async (req, res) => {
  const allowedFields = ["UserName", "Email"];
  const updates = {};

  for (const field of Object.keys(req.body ?? {})) {
    if (!allowedFields.includes(field)) {
      throw new ApiError(400, `Updating ${field} is not allowed`);
    }
    updates[field] = req.body[field];
  }

  if (Object.keys(updates).length === 0) {
    throw new ApiError(400, "Provide a username or email to update");
  }

  if (
    (updates.UserName !== undefined &&
      (typeof updates.UserName !== "string" || !updates.UserName.trim())) ||
    (updates.Email !== undefined &&
      (typeof updates.Email !== "string" || !updates.Email.trim()))
  ) {
    throw new ApiError(400, "Username and email must be non-empty strings");
  }

  if (updates.UserName !== undefined) updates.UserName = updates.UserName.trim();
  if (updates.Email !== undefined) updates.Email = updates.Email.trim();

  if (updates.Email) {
    const existingUser = await User.findOne({
      Email: updates.Email,
      _id: { $ne: req.user.id },
    });
    if (existingUser) throw new ApiError(409, "Email is already in use");
  }

  let updatedUser;
  try {
    updatedUser = await User.findByIdAndUpdate(req.user.id, updates, {
      new: true,
      runValidators: true,
    }).select("-password");
  } catch (error) {
    if (error.code === 11000) throw new ApiError(409, "Email is already in use");
    throw error;
  }

  if (!updatedUser) throw new ApiError(404, "User not found");

  res.status(200).json({
    message: "Profile updated successfully",
    user: updatedUser,
  });
});

export default UpdateProfileController;
