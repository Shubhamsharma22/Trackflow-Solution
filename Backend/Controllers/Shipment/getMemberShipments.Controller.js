import AsyncHandler from "../../Utils/AsyncHandler.Utils.js";
import Organization from "../../Models/Organization.Model.js";
import Shipment from "../../Models/Shipment.Model.js";

const getMemberShipments = AsyncHandler(async (req, res) => {
    const organizations = await Organization.find({ Members: req.user.id }).select("_id");
    const organizationIds = organizations.map((organization) => organization._id);
    const shipments = await Shipment.find({ organization: { $in: organizationIds } })
        .populate("receiver", "UserName")
        .sort({ createdAt: -1 });

    res.status(200).json({
        count: shipments.length,
        message: "Organization shipments retrieved successfully",
        shipments
    });
});

export default getMemberShipments;
