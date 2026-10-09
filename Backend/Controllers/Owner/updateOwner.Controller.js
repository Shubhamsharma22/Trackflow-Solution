import AsyncHandler from "../../Utils/AsyncHandler.Utils.js";
import ApiError from "../../Utils/ApiError.Utils.js";
import User from "../../Models/User.Model.js";
import bcrypt from "bcrypt";

const updateOwner = AsyncHandler(async (req, res) => {
    const { id } = req.params;
    const { UserName, Email, password } = req.body;
    const updates = {};

    if (!id) throw new ApiError(400, "Owner id is required");

    if (UserName !== undefined) updates.UserName = UserName;
    if (Email !== undefined) updates.Email = Email;
    if (password !== undefined) updates.password = await bcrypt.hash(password, 10);

    if (Object.keys(updates).length === 0) {
        throw new ApiError(400, "No owner data provided for update");
    }

    const owner = await User.findOneAndUpdate(
        { _id: id, role: "Owner" },
        { $set: updates },
        { new: true, runValidators: true }
    );

    if (!owner) throw new ApiError(404, "Owner not found");

    res.status(200).json({
        message: "Owner Updated Successfully",
        owner: {
            _id: owner._id,
            UserName: owner.UserName,
            Email: owner.Email,
            role: owner.role
        }
    });
});

export default updateOwner;