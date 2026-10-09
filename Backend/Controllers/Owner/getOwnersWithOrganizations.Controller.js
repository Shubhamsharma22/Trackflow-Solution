import AsyncHandler from "../../Utils/AsyncHandler.Utils.js";
import Organization from "../../Models/Organization.Model.js";

const getOwnersWithOrganizations = AsyncHandler(async (req, res) => {
    const organizations = await Organization.find()
        .populate("Owner", "UserName Email role")
        .sort({ createdAt: -1 });

    const owners = [];

    for (const organization of organizations) {
        if (!organization.Owner) continue;

        let owner = owners.find(
            (item) => item._id.toString() === organization.Owner._id.toString()
        );

        if (!owner) {
            owner = {
                _id: organization.Owner._id,
                UserName: organization.Owner.UserName,
                Email: organization.Owner.Email,
                role: organization.Owner.role,
                organizations: []
            };
            owners.push(owner);
        }

        owner.organizations.push({
            _id: organization._id,
            Name: organization.Name
        });
    }

    res.status(200).json({
        count: owners.length,
        message: "Owners with organizations retrieved successfully",
        owners
    });
});

export default getOwnersWithOrganizations;
