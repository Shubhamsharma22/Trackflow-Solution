import ApiError from "../../Utils/ApiError.Utils.js";
import AsyncHandler from "../../Utils/AsyncHandler.Utils.js";
import TrackingEvent from "../../Models/TrackingEvent.Model.js";

const createTracking = AsyncHandler(async (req, res) => {
    const { shipment, status, location, timestamp, description } = req.body;

    if (!shipment || !status || !location) {
        throw new ApiError(400, "Shipment, status and location are required");
    }

    const tracking = await TrackingEvent.create({
        shipment,
        status,
        location,
        timestamp,
        description
    });

    res.status(201).json({
        message: "Tracking Event Created Successfully",
        tracking
    });
});

export default createTracking;