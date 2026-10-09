import ApiError from "../../Utils/ApiError.Utils.js";
import AsyncHandler from "../../Utils/AsyncHandler.Utils.js";
import TrackingEvent from "../../Models/TrackingEvent.Model.js";

const deleteTracking = AsyncHandler(async (req, res) => {
    const { id } = req.params;

    if (!id) throw new ApiError(400, "Tracking event id is required");

    const tracking = await TrackingEvent.findByIdAndDelete(id);

    if (!tracking) throw new ApiError(404, "Tracking event not found");

    res.status(200).json({
        message: "Tracking Event Deleted Successfully",
        tracking
    });
});

export default deleteTracking;