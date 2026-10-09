import ApiError from "../../Utils/ApiError.Utils.js";
import AsyncHandler from "../../Utils/AsyncHandler.Utils.js";
import Organization from "../../Models/Organization.Model.js";
import Shipment from "../../Models/Shipment.Model.js";
import TrackingEvent from "../../Models/TrackingEvent.Model.js";

const getTrackingEvents = AsyncHandler(async (req, res) => {
    const { id } = req.params;

    if (!id) throw new ApiError(400, "Shipment id is required");

    const shipment = await Shipment.findById(id).select("organization");

    if (!shipment) throw new ApiError(404, "Shipment not found");

    const organization = await Organization.findById(shipment.organization)
        .select("Owner Members");

    const isOwner = organization?.Owner?.toString() === req.user.id;
    const isMember = organization?.Members.some(
        (member) => member.toString() === req.user.id
    );

    if (!organization || (!isOwner && !isMember)) {
        throw new ApiError(404, "Shipment not found");
    }

    const trackingEvents = await TrackingEvent.find({ shipment: shipment._id })
        .sort({ timestamp: -1 });

    res.status(200).json({
        count: trackingEvents.length,
        message: "Shipment tracking events retrieved successfully",
        trackingEvents
    });
});

export default getTrackingEvents;
