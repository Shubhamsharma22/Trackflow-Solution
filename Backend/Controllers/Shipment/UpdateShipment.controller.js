import ApiError from "../../Utils/ApiError.Utils.js";
import AsyncHandler from "../../Utils/AsyncHandler.Utils.js";
import Shipment from "../../Models/Shipment.Model.js";

const updateShipment = AsyncHandler(async (req, res) => {
    const { id } = req.params;
    const updates = req.body;

    if (!id) throw new ApiError(400, "Shipment id is required");

    if (!updates || Object.keys(updates).length === 0) {
        throw new ApiError(400, "No shipment data provided for update");
    }

    const shipment = await Shipment.findByIdAndUpdate(
        id,
        { $set: updates },
        { new: true, runValidators: true }
    );

    if (!shipment) throw new ApiError(404, "Shipment not found");

    res.status(200).json({
        message: "Shipment Updated Successfully",
        shipment
    });
});

export default updateShipment;
