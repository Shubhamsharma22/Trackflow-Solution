import mongoose, { Schema } from "mongoose";

const TrackingEventSchema = new Schema({
	shipment: {
		type: Schema.Types.ObjectId,
		ref: "Shipment",
		required: true
	},
	status: {
		type: String,
		required: true
	},
	location: {
		type: String,
		required: true
	},
	timestamp: {
		type: Date,
		default: Date.now,
		required: true
	},
	description: {
		type: String
	}
}, { timestamps: true });

const TrackingEvent = mongoose.model("TrackingEvent", TrackingEventSchema);

export default TrackingEvent;