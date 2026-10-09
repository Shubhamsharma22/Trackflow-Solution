import AsyncHandler from "../../Utils/AsyncHandler.Utils.js";
import Carrier from "../../Models/Carrier.Model.js";
import Organization from "../../Models/Organization.Model.js";

const getCarriers = AsyncHandler(async (req, res) => {
    const organizations = await Organization.find({ Owner: req.user.id }).select("_id");
    const organizationIds = organizations.map((organization) => organization._id);
    const carriers = await Carrier.find()
        .where("organization")
        .in(organizationIds)
        .sort({ createdAt: -1 });

    res.status(200).json({
        message: "Your carriers retrieved successfully",
        carriers
    });
});

export default getCarriers;
