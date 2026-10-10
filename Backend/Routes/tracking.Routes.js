import express from "express";
import getTrackingEvents from "../Controllers/Tracking/getTrackingEvents.Controller.js";
import verificationToken from "../Middleware/VerifyToken.Middleware.js";

const trackingRoutes = express.Router();

/**
 * @openapi
 * /api/shipments/{id}/tracking-events:
 *   get:
 *     tags: [Tracking Events]
 *     summary: Get tracking events for a shipment the authenticated user can access
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Tracking events retrieved successfully
 *       404:
 *         description: Shipment not found
 */
trackingRoutes.get("/shipments/:id/tracking-events", verificationToken, getTrackingEvents);

export default trackingRoutes;
