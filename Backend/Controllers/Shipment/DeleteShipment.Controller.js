import ApiError from "../../Utils/ApiError.Utils.js";
import AsyncHandler from "../../Utils/AsyncHandler.Utils.js";
import Shipment from "../../Models/Shipment.Model.js";

const deleteShipment = AsyncHandler(async (req, res) => {
    const { id } = req.params;

    if (!id) throw new ApiError(400, "Shipment id is required");

    const shipment = await Shipment.findByIdAndDelete(id);

    if (!shipment) throw new ApiError(404, "Shipment not found");

    res.status(200).json({
        message: "Shipment Deleted Successfully",
        shipment
    });
});

export default deleteShipment;
