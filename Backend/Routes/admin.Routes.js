import isAdmin from "../Middleware/isAdmin.Middleware.js";
import verificationToken from "../Middleware/VerifyToken.Middleware.js";
import createOwner from "../Controllers/Owner/createOwner.Controller.js";
import deleteOwner from "../Controllers/Owner/DeleteOwner.Controller.js";
import updateOwner from "../Controllers/Owner/updateOwner.Controller.js";
import getOwnersWithOrganizations from "../Controllers/Owner/getOwnersWithOrganizations.Controller.js";
import express from "express"

const adminRoutes = express.Router()

/**
 * @openapi
 * /api/admin/createOwner:
 *   post:
 *     tags: [Admin]
 *     summary: Create an owner account
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [UserName, Email, password]
 *             properties:
 *               UserName:
 *                 type: string
 *               Email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: Owner created successfully
 */
adminRoutes.post("/createOwner",verificationToken,isAdmin,createOwner)

/**
 * @openapi
 * /api/admin/updateOwner/{id}:
 *   put:
 *     tags: [Admin]
 *     summary: Update an owner account
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
 *               UserName:
 *                 type: string
 *               Email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Owner updated successfully
 *       404:
 *         description: Owner not found
 */
adminRoutes.put("/updateOwner/:id",verificationToken,isAdmin,updateOwner)

/**
 * @openapi
 * /api/admin/deleteOwner/{id}:
 *   delete:
 *     tags: [Admin]
 *     summary: Delete an owner account
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
 *         description: Owner deleted successfully
 *       404:
 *         description: Owner not found
 */
adminRoutes.delete("/deleteOwner/:id",verificationToken,isAdmin,deleteOwner)

/**
 * @openapi
 * /api/admin/ownersWithOrganizations:
 *   get:
 *     tags: [Admin]
 *     summary: Get owners who have organizations
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Owners with organizations retrieved successfully
 */



export default adminRoutes