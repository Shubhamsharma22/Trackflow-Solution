import express from "express";
import createCarrier from "../Controllers/Carrier/createCarrier.Controllers.js";
import deleteCarrier from "../Controllers/Carrier/DeleteCarrier.Controller.js";
import getCarriers from "../Controllers/Carrier/getCarriers.Controller.js";
import updateCarrier from "../Controllers/Carrier/UpdateCarrier.Controller.js";
import createShipment from "../Controllers/Shipment/CreateShipment.Controllers.js";
import deleteShipment from "../Controllers/Shipment/DeleteShipment.Controller.js";
import getMemberShipments from "../Controllers/Shipment/getMemberShipments.Controller.js";
import updateShipment from "../Controllers/Shipment/UpdateShipment.controller.js";
import createTracking from "../Controllers/Tracking/createTracking.Controller.js";
import deleteTracking from "../Controllers/Tracking/deleteTracking.Controller.js";
import updateTracking from "../Controllers/Tracking/updateTracking.Controller.js";

import getOwnersWithOrganizations from "../Controllers/Owner/getOwnersWithOrganizations.Controller.js";
import isMember from "../Middleware/isMember.Middleware.js";
import verificationToken from "../Middleware/VerifyToken.Middleware.js";
import { validateShipment } from "../Validators/shipment.Validator.js";

const memberRoutes = express.Router();

/**
 * @openapi
 * /api/member/carriers:
 *   get:
 *     tags: [Carriers]
 *     summary: Get carriers available to the current member
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Carriers retrieved successfully
 */
memberRoutes.get("/carriers", verificationToken, isMember, getCarriers);

/**
 * @openapi
 * /api/member/carriers:
 *   post:
 *     tags: [Carriers]
 *     summary: Create a carrier
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, organization, contact]
 *             properties:
 *               name:
 *                 type: string
 *               organization:
 *                 type: string
 *               contact:
 *                 type: string
 *               status:
 *                 type: string
 *     responses:
 *       201:
 *         description: Carrier created successfully
 */
memberRoutes.post("/carriers", verificationToken, isMember, createCarrier);

/**
 * @openapi
 * /api/member/carriers/{id}:
 *   put:
 *     tags: [Carriers]
 *     summary: Update a carrier
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               organization:
 *                 type: string
 *               contact:
 *                 type: string
 *               status:
 *                 type: string
 *     responses:
 *       200:
 *         description: Carrier updated successfully
 */
memberRoutes.put("/carriers/:id", verificationToken, isMember, updateCarrier);

/**
 * @openapi
 * /api/member/carriers/{id}:
 *   delete:
 *     tags: [Carriers]
 *     summary: Delete a carrier
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
 *         description: Carrier deleted successfully
 *       404:
 *         description: Carrier not found
 */
memberRoutes.delete("/carriers/:id", verificationToken, isMember, deleteCarrier);

/**
 * @openapi
 * /api/member/shipments:
 *   get:
 *     tags: [Shipments]
 *     summary: Get shipments available to the current member
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Shipments retrieved successfully
 */
memberRoutes.get("/shipments", verificationToken, isMember, getMemberShipments);

/**
 * @openapi
 * /api/member/shipments:
 *   post:
 *     tags: [Shipments]
 *     summary: Create a shipment
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [trackingId, organization, sender, receiver, origin, destination, currentStatus, carrier]
 *             properties:
 *               trackingId:
 *                 type: string
 *               organization:
 *                 type: string
 *               sender:
 *                 type: string
 *               receiver:
 *                 type: string
 *               origin:
 *                 type: string
 *               destination:
 *                 type: string
 *               currentStatus:
 *                 type: string
 *               expectedDelivery:
 *                 type: string
 *                 format: date-time
 *               carrier:
 *                 type: string
 *     responses:
 *       201:
 *         description: Shipment created successfully
 */
memberRoutes.post("/shipments", verificationToken, isMember, validateShipment, createShipment);

/**
 * @openapi
 * /api/member/shipments/{id}:
 *   put:
 *     tags: [Shipments]
 *     summary: Update a shipment
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Shipment updated successfully
 *       404:
 *         description: Shipment not found
 */
memberRoutes.put("/shipments/:id", verificationToken, isMember, updateShipment);

/**
 * @openapi
 * /api/member/shipments/{id}:
 *   delete:
 *     tags: [Shipments]
 *     summary: Delete a shipment
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
 *         description: Shipment deleted successfully
 *       404:
 *         description: Shipment not found
 */
memberRoutes.delete("/shipments/:id", verificationToken, isMember, deleteShipment);

/**
 * @openapi
 * /api/member/tracking-events:
 *   post:
 *     tags: [Tracking Events]
 *     summary: Create a tracking event
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [shipment, status, location]
 *             properties:
 *               shipment:
 *                 type: string
 *               status:
 *                 type: string
 *               location:
 *                 type: string
 *               timestamp:
 *                 type: string
 *                 format: date-time
 *               description:
 *                 type: string
 *     responses:
 *       201:
 *         description: Tracking event created successfully
 */
memberRoutes.post("/tracking-events", verificationToken, isMember, createTracking);

/**
 * @openapi
 * /api/member/tracking-events/{id}:
 *   put:
 *     tags: [Tracking Events]
 *     summary: Update a tracking event
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Tracking event updated successfully
 *       404:
 *         description: Tracking event not found
 */
memberRoutes.put("/tracking-events/:id", verificationToken, isMember, updateTracking);

/**
 * @openapi
 * /api/member/tracking-events/{id}:
 *   delete:
 *     tags: [Tracking Events]
 *     summary: Delete a tracking event
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
 *         description: Tracking event deleted successfully
 *       404:
 *         description: Tracking event not found
 */
memberRoutes.delete("/tracking-events/:id", verificationToken, isMember, deleteTracking);
memberRoutes.get("/ownersWithOrganizations",verificationToken,isMember,getOwnersWithOrganizations)
export default memberRoutes;