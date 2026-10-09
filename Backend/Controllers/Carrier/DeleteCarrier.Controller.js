import ApiError from "../../Utils/ApiError.Utils.js";
import AsyncHandler from "../../Utils/AsyncHandler.Utils.js";
import Carrier from "../../Models/Carrier.Model.js";

const deleteCarrier = AsyncHandler(async (req, res) => {
    const { id } = req.params;

    if (!id) throw new ApiError(400, "Carrier id is required");

    const carrier = await Carrier.findByIdAndDelete(id);

    if (!carrier) throw new ApiError(404, "Carrier not found");

    res.status(200).json({
        message: "Carrier Deleted Successfully",
        carrier
    });
});

export default deleteCarrier;
