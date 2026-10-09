import ApiError from "../../Utils/ApiError.Utils.js";
import AsyncHandler from "../../Utils/AsyncHandler.Utils.js";
import Organization from "../../Models/Organization.Model.js";

const getOrganizations = AsyncHandler(async (req, res) => {
    const { id } = req.params;

    if (id) {
        const organization = await Organization.findOne({ _id: id, Owner: req.user.id });

        if (!organization) throw new ApiError(404, "Organization not found");

        return res.status(200).json({
            message: "Organization retrieved successfully",
            organization
        });
    }

    const organizations = await Organization.find({ Owner: req.user.id }).sort({ createdAt: -1 });

    res.status(200).json({
        count: organizations.length,
        message: "Organizations retrieved successfully",
        organizations
    });
});

export default getOrganizations;
