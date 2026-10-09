import ApiError from "../../Utils/ApiError.Utils.js"
import AsyncHandler from "../../Utils/AsyncHandler.Utils.js"
import Shipment from "../../Models/Shipment.Model.js"

const createShipment=AsyncHandler(async(req,res)=>{
    const {trackingId,
        organization,
        sender,
        receiver,
        origin,
        destination,
        currentStatus,
        expectedDelivery,
        carrier} = req.body

 if(!trackingId || !organization || !sender || !receiver || !origin || !destination || !currentStatus || !expectedDelivery || !carrier) throw new ApiError(400,"All shipment fields are required")

    const newshipment = {trackingId,
        organization,
        sender,
        receiver,
        origin,
        destination,
        currentStatus,
        expectedDelivery,
        carrier}

        await Shipment.create(newshipment)

        res.status(201).json({message:"Shipment Created Succesfully",newshipment})

})

export default createShipment