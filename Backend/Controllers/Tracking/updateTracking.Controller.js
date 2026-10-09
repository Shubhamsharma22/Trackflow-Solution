import ApiError from "../../Utils/ApiError.Utils.js";
import AsyncHandler from "../../Utils/AsyncHandler.Utils.js";
import TrackingEvent from "../../Models/TrackingEvent.Model.js";

const updateTracking = AsyncHandler(async (req, res) => {
    const { id } = req.params;
    const { shipment, status, location, timestamp, description } = req.body;
    const updates = {};

    if (!id) throw new ApiError(400, "Tracking event id is required");

    if (shipment !== undefined) updates.shipment = shipment;
    if (status !== undefined) updates.status = status;
    if (location !== undefined) updates.location = location;
    if (timestamp !== undefined) updates.timestamp = timestamp;
    if (description !== undefined) updates.description = description;

    if (Object.keys(updates).length === 0) {
        throw new ApiError(400, "No tracking event data provided for update");
    }

    const tracking = await TrackingEvent.findByIdAndUpdate(
        id,
        { $set: updates },
        { new: true, runValidators: true }
    );

    if (!tracking) throw new ApiError(404, "Tracking event not found");

    res.status(200).json({
        message: "Tracking Event Updated Successfully",
        
        tracking
    });
});

export default updateTracking;