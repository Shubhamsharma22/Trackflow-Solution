import ApiError from "../../Utils/ApiError.Utils.js";
import AsyncHandler from "../../Utils/AsyncHandler.Utils.js";
import Organization from "../../Models/Organization.Model.js";

const deleteOrganization = AsyncHandler(async (req, res) => {
    const { id } = req.params;

    if (!id) throw new ApiError(400, "Organization id is required");

    const organization = await Organization.findOneAndDelete({
        _id: id,
        Owner: req.user.id
    });

    if (!organization) throw new ApiError(404, "Organization not found");

    res.status(200).json({
        message: "Organization Deleted Successfully",
        organization
    });
});

export default deleteOrganization;