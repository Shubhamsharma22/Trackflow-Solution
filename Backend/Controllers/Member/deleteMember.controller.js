import AsyncHandler from "../../Utils/AsyncHandler.Utils.js";
import ApiError from "../../Utils/ApiError.Utils.js";
import User from "../../Models/User.Model.js";
import Organization from "../../Models/Organization.Model.js";

const deleteMember = AsyncHandler(async (req, res) => {
    const { id } = req.params;

    if (!id) throw new ApiError(400, "Member id is required");

    const member = await User.findOne({ _id: id, role: "Member" });

    if (!member) throw new ApiError(404, "Member not found");

    const organization = await Organization.findOne({
        _id: member.Organization,
        Owner: req.user.id
    });

    if (!organization) throw new ApiError(404, "Member not found in your organizations");

    organization.Members.pull(member._id);
    await organization.save();

    await User.findByIdAndDelete(member._id);

    res.status(200).json({
        message: "Member Deleted Successfully",
        member: {
            _id: member._id,
            UserName: member.UserName,
            Email: member.Email,
            role: member.role
        }
    });
});

export default deleteMember;