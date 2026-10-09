import createOrganization from "../Controllers/Organization/createOrganization.Controller.js"
import deleteOrganization from "../Controllers/Organization/deleteOrganization.Controller.js"
import getOrganizations from "../Controllers/Organization/getOrganizations.Controller.js"
import updateOrganization from "../Controllers/Organization/updateOrganization.Controller.js"
import createMember from "../Controllers/Member/createMember.Controller.js"
import deleteMember from "../Controllers/Member/deleteMember.controller.js"
import getMembers from "../Controllers/Member/getMembers.Controller.js"
import getMyShipments from "../Controllers/Shipment/getMyShipments.Controller.js"
import isOwner from "../Middleware/isOwner.Middleware.js"
import isMember from "../Middleware/isMember.Middleware.js";
import verificationToken from "../Middleware/VerifyToken.Middleware.js"
import express from "express"

const ownerRoutes = express.Router()

const both =[isOwner||isMember]


/**
 * @openapi
 * /api/owner/shipments:
 *   get:
 *     tags: [Shipments]
 *     summary: Get shipments belonging to the current owner's organizations
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Owner shipments retrieved successfully
 */
ownerRoutes.get("/shipments", verificationToken, isOwner, getMyShipments)

/**
 * @openapi
 * /api/owner/createOrganization:
 *   post:
 *     tags: [Organizations]
 *     summary: Create an organization for the current owner
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name]
 *             properties:
 *               name:
 *                 type: string
 *     responses:
 *       201:
 *         description: Organization created successfully
 */
ownerRoutes.post("/createOrganization",verificationToken,isOwner,createOrganization)

/**
 * @openapi
 * /api/owner/getOrganizations:
 *   get:
 *     tags: [Organizations]
 *     summary: Get organizations owned by the current owner
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Organizations retrieved successfully
 */
ownerRoutes.get("/getOrganizations",verificationToken,getOrganizations)

/**
 * @openapi
 * /api/owner/getOrganization/{id}:
 *   get:
 *     tags: [Organizations]
 *     summary: Get one organization owned by the current owner
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Organization retrieved successfully
 *       404:
 *         description: Organization not found
 */
ownerRoutes.get("/getOrganization/:id",verificationToken,isOwner,getOrganizations)

/**
 * @openapi
 * /api/owner/updateOrganization/{id}:
 *   put:
 *     tags: [Organizations]
 *     summary: Update an organization owned by the current owner
 *     security:
 *       - bearerAuth: []
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
 *               members:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: Organization updated successfully
 *       404:
 *         description: Organization not found
 */
ownerRoutes.put("/updateOrganization/:id",verificationToken,isOwner,updateOrganization)

/**
 * @openapi
 * /api/owner/deleteOrganization/{id}:
 *   delete:
 *     tags: [Organizations]
 *     summary: Delete an organization owned by the current owner
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Organization deleted successfully
 *       404:
 *         description: Organization not found
 */
ownerRoutes.delete("/deleteOrganization/:id",verificationToken,isOwner,deleteOrganization)

/**
 * @openapi
 * /api/owner/organizations/{id}/members:
 *   get:
 *     tags: [Members]
 *     summary: Get members in an organization owned by the current owner
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Members retrieved successfully
 *       404:
 *         description: Organization not found
 */
ownerRoutes.get("/organizations/:id/members",verificationToken,isOwner,getMembers)

/**
 * @openapi
 * /api/owner/createMember:
 *   post:
 *     tags: [Members]
 *     summary: Create a member in an organization owned by the current owner
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [UserName, Email, password, Organization]
 *             properties:
 *               UserName:
 *                 type: string
 *               Email:
 *                 type: string
 *               password:
 *                 type: string
 *               Organization:
 *                 type: string
 *     responses:
 *       201:
 *         description: Member created successfully
 *       404:
 *         description: Organization not found
 */
ownerRoutes.post("/createMember",verificationToken,isOwner,createMember)

/**
 * @openapi
 * /api/owner/deleteMember/{id}:
 *   delete:
 *     tags: [Members]
 *     summary: Delete a member from an organization owned by the current owner
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Member deleted successfully
 *       404:
 *         description: Member not found in the owner's organizations
 */
ownerRoutes.delete("/deleteMember/:id",verificationToken,isOwner,deleteMember)

export default ownerRoutes