import AsyncHandler from "../../Utils/AsyncHandler.Utils.js";
import ApiError from "../../Utils/ApiError.Utils.js";
import Organization from "../../Models/Organization.Model.js";

const getMembers = AsyncHandler(async (req, res) => {
    const { id } = req.params;

    if (!id) throw new ApiError(400, "Organization id is required");

    const organization = await Organization.findOne({
        _id: id,
        Owner: req.user.id
    }).populate({
        path: "Members",
        match: { role: "Member" },
        select: "UserName Email role Organization"
    });

    if (!organization) throw new ApiError(404, "Organization not found");

    res.status(200).json({
        count: organization.Members.length,
        message: "Members retrieved successfully",
        members: organization.Members
    });
});

export default getMembers;
