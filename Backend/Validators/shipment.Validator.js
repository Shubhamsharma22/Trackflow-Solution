import mongoose from "mongoose";

const VALID_SHIPMENT_STATUSES = [
  "Created",
  "Picked Up",
  "In Transit",
  "Out For Delivery",
  "Delivered",
  "Cancelled",
  "Delayed",
];

const isValidObjectId = (value) => {
  return value && mongoose.Types.ObjectId.isValid(value);
};

const validateShipment = (req, res, next) => {
  const {
    trackingId,
    organization,
    sender,
    receiver,
    origin,
    destination,
    currentStatus,
    expectedDelivery,
    carrier,
  } = req.body;

  const errors = [];

  if (!trackingId || typeof trackingId !== "string" || !trackingId.trim()) {
    errors.push("trackingId is required");
  }

  if (!organization) {
    errors.push("organization must be valid ");
  }

  if (!sender) {
    errors.push("sender must be valid");
  }

  if (!receiver) {
    errors.push("receiver must be valid");
  }

  if (!origin || typeof origin !== "string" || !origin.trim()) {
    errors.push("origin is required");
  }

  if (!destination || typeof destination !== "string" || !destination.trim()) {
    errors.push("destination is required");
  }

  if (!carrier || typeof carrier !== "string" || !carrier.trim()) {
    errors.push("carrier is required");
  }

  if (currentStatus && !VALID_SHIPMENT_STATUSES.includes(currentStatus)) {
    errors.push(
      `currentStatus must be one of: ${VALID_SHIPMENT_STATUSES.join(", ")}`
    );
  }

  if (expectedDelivery && Number.isNaN(Date.parse(expectedDelivery))) {
    errors.push("expectedDelivery must be a valid date");
  }

  if (errors.length > 0) {
    return res.status(400).json({ errors });
  }

  next();
};

export { validateShipment };
