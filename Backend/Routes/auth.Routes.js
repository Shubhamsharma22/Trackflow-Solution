import express from "express"
import loginLimitter from "../Config/rateLimit.Config.js"
import LoginController from "../Controllers/Users/Login.Contoller.js"
import RegisterController from "../Controllers/Users/Register.Controller.js"
import { validateLogin } from "../Validators/login.Validator.js"
import validateRegister from "../Validators/register.validator.js"
import GetProfileController from "../Controllers/Users/getProfileController.js"
import DeleteProfileController from "../Controllers/Users/deleteProfile.Controller.js"
import UpdateProfileController from "../Controllers/Users/updateProfile.Controller.js"
import LogoutController from "../Controllers/Users/Logout.Controller.js"
import verificationToken from "../Middleware/VerifyToken.Middleware.js"
const authRoute = express.Router()

/**
 * @openapi
 * /api/auth/register:
 *   post:
 *     tags: [Authentication]
 *     summary: Register a user
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
 *         description: User registered successfully
 */
authRoute.post("/register",validateRegister,RegisterController)

/**
 * @openapi
 * /api/auth/login:
 *   post:
 *     tags: [Authentication]
 *     summary: Log in a user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [Email, password]
 *             properties:
 *               Email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: User logged in successfully
 */
authRoute.post("/login",loginLimitter,validateLogin,LoginController)

/**
 * @openapi
 * /api/auth/logout:
 *   post:
 *     tags: [Authentication]
 *     summary: Log out the current user
 *     responses:
 *       200:
 *         description: User logged out successfully
 */
authRoute.post("/logout",LogoutController)

/**
 * @openapi
 * /api/auth/getProfile:
 *   get:
 *     tags: [Authentication]
 *     summary: Get the current user's profile
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Profile retrieved successfully
 */
authRoute.get("/getProfile",verificationToken,GetProfileController)

/**
 * @openapi
 * /api/auth/updateProfile:
 *   put:
 *     tags: [Authentication]
 *     summary: Update the current user's profile
 *     security:
 *       - bearerAuth: []
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
 *     responses:
 *       200:
 *         description: Profile updated successfully
 */
authRoute.put("/updateProfile",verificationToken,UpdateProfileController)

/**
 * @openapi
 * /api/auth/deleteProfile:
 *   delete:
 *     tags: [Authentication]
 *     summary: Delete the current user's profile
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Profile deleted successfully
 */
authRoute.delete("/deleteProfile",verificationToken,DeleteProfileController)

export default authRoute
