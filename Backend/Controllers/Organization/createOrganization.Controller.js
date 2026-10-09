import ApiError from "../../Utils/ApiError.Utils.js";
import AsyncHandler from "../../Utils/AsyncHandler.Utils.js";
import Organization from "../../Models/Organization.Model.js";

const createOrganization = AsyncHandler(async (req, res) => {
    const { name, members } = req.body;

    if (typeof name !== "string" || name.trim().length < 2) {
        throw new ApiError(400, "Organization name must be at least 2 characters long");
    }

    const organization = await Organization.create({
        Name: name.trim(),
        Owner: req.user.id,
        Members: members
    });

    res.status(201).json({
        message: "Organization Created Successfully",
        organization
    });
});

export default createOrganization;