import AsyncHandler from "../../Utils/AsyncHandler.Utils.js";
import ApiError from "../../Utils/ApiError.Utils.js";
import User from "../../Models/User.Model.js";

const deleteOwner = AsyncHandler(async (req, res) => {
    const { id } = req.params;

    if (!id) throw new ApiError(400, "Owner id is required");

    const owner = await User.findOneAndDelete({ _id: id, role: "Owner" });

    if (!owner) throw new ApiError(404, "Owner not found");

    res.status(200).json({
        message: "Owner Deleted Successfully",
        owner: {
            _id: owner._id,
            UserName: owner.UserName,
            Email: owner.Email,
            role: owner.role
        }
    });
});

export default deleteOwner;