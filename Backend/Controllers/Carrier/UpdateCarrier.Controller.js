import ApiError from "../../Utils/ApiError.Utils.js";
import AsyncHandler from "../../Utils/AsyncHandler.Utils.js";
import Carrier from "../../Models/Carrier.Model.js";

const updateCarrier = AsyncHandler(async (req, res) => {
    const { id } = req.params;
    const { name, organization, contact, status } = req.body;

    if (!id) throw new ApiError(400, "Carrier id is required");

    const existingCarrier = await Carrier.findById(id);

    if (!existingCarrier) throw new ApiError(404, "Carrier not found");

    if (name) existingCarrier.name = name;
    if (organization) existingCarrier.organization = organization;
    if (contact) existingCarrier.contact = contact;
    if (status) existingCarrier.status = status;

    const updatedCarrier = await existingCarrier.save();

    res.status(200).json({
        message: "Carrier Updated Successfully",
        carrier: updatedCarrier
    });
});

export default updateCarrier;
