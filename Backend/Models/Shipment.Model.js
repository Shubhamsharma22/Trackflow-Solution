import mongoose, { Schema } from "mongoose";

const ShipmentSchema = new Schema({
	trackingId: {
		type: String,
		required: true,
		unique: true
	},
	organization: {
		type: Schema.Types.ObjectId,
		ref: "Organization",
		required: true
	},
	sender: {
		type: Schema.Types.ObjectId,
		ref: "User",
		required: true
	},
	receiver: {
		type: Schema.Types.ObjectId,
		ref: "User",
		required: true
	},
	origin: {
		type: String,
		required: true
	},
	destination: {
		type: String,
		required: true
	},
	currentStatus: {
		type: String,
        enum:["Created","Picked Up","In Transit","Out For Delivery","Delivered","Cancelled","Delayed"],
		default: "Created",
		required: true
	},
	expectedDelivery: {
		type: Date
	},
	carrier: {
		type: String,
		required: true
	}
}, { timestamps: true });

const Shipment = mongoose.model("Shipment", ShipmentSchema);

export default Shipment;

