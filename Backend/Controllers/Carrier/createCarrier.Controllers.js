import ApiError from "../../Utils/ApiError.Utils.js";
import AsyncHandler from "../../Utils/AsyncHandler.Utils.js";
import Carrier from "../../Models/Carrier.Model.js";

const createCarrier = AsyncHandler(async (req, res) => {
    const { name, organization, contact, status } = req.body;

    if (!name || !organization || !contact) {
        throw new ApiError(400, "Name, organization and contact are required");
    }

    const newCarrier = {
        name,
        organization,
        contact,
        status: status || "Active"
    };

    const carrier = await Carrier.create(newCarrier);

    res.status(201).json({
        message: "Carrier Created Successfully",
        carrier
    });
});

export default createCarrier;