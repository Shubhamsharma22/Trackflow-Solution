import mongoose, { Schema } from "mongoose";

const CarrierSchema = new Schema({
	name: {
		type: String,
		required: true
	},
	organization: {
		type: Schema.Types.ObjectId,
		ref: "Organization",
		required: true
	},
	contact: {
		type: String,
		required: true
	},
	status: {
		type: String,
		default: "Active",
		required: true
	}
}, { timestamps: true });

const Carrier = mongoose.model("Carrier", CarrierSchema);

export default Carrier;