import AsyncHandler from "../../Utils/AsyncHandler.Utils.js";
import Organization from "../../Models/Organization.Model.js";
import Shipment from "../../Models/Shipment.Model.js";

const getMyShipments = AsyncHandler(async (req, res) => {
    const organizations = await Organization.find({ Owner: req.user.id }).select("_id");
    const organizationIds = organizations.map((organization) => organization._id);
    const shipments = await Shipment.find({ organization: { $in: organizationIds } })
        .populate("organization", "Name")
        .populate("sender", "UserName")
        .populate("receiver", "UserName")
        .sort({ createdAt: -1 });

    res.status(200).json({
        count: shipments.length,
        message: "Your shipments retrieved successfully",
        shipments
    });
});

export default getMyShipments;
