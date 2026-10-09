import ApiError from "../../Utils/ApiError.Utils.js";
import AsyncHandler from "../../Utils/AsyncHandler.Utils.js";
import Organization from "../../Models/Organization.Model.js";

const updateOrganization = AsyncHandler(async (req, res) => {
    const { id } = req.params;
    const { name, members } = req.body;
    const updates = {};

    if (!id) throw new ApiError(400, "Organization id is required");

    if (name !== undefined) {
        if (typeof name !== "string" || name.trim().length < 2) {
            throw new ApiError(400, "Organization name must be at least 2 characters long");
        }
        updates.Name = name.trim();
    }

    if (members !== undefined) updates.Members = members;

    if (Object.keys(updates).length === 0) {
        throw new ApiError(400, "No organization data provided for update");
    }

    const organization = await Organization.findOneAndUpdate(
        { _id: id, Owner: req.user.id },
        { $set: updates },
        { new: true, runValidators: true }
    );

    if (!organization) throw new ApiError(404, "Organization not found");

    res.status(200).json({
        message: "Organization Updated Successfully",
        organization
    });
});

export default updateOrganization;