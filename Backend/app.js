import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import authRoutes from "./Routes/auth.Routes.js"
import adminRoutes from "./Routes/admin.Routes.js"
import ownerRoutes from "./Routes/owner.Routes.js"
import memberRoutes from "./Routes/member.Routes.js"
import trackingRoutes from "./Routes/tracking.Routes.js"
import swaggerUi from "swagger-ui-express"
import swaggerJsdoc from "swagger-jsdoc"


const app = express()

app.use(cors({
  origin: process.env.FRONTEND_URL||"https://trackflow-solution-n.onrender.com",
  credentials: true,
}))



const swaggerSpec = swaggerJsdoc({
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Backend API",
            version: "1.0.0",
        },
        components: {
            securitySchemes: {
                cookieAuth: {
                    type: "apiKey",
                    in: "Cookie",
                    name: "token",
                },
            },
        },
        security: [
            {
                cookieAuth: [],
            },
        ],
    },
    apis: ["./Routes/*.js"],
})




app.use(express.json())

app.use(cookieParser())
app.use(
    "/api-docs",
    swaggerUi.serve,
    swaggerUi.setup(swaggerSpec, {
        swaggerOptions: {
            requestInterceptor: (req) => {
                req.credentials = "include"; // Ensures cookies are dispatched with requests
                return req;
            },
        },
    })
);

app.use("/api/auth", authRoutes)
app.use("/api/admin", adminRoutes)
app.use("/api/owner", ownerRoutes)
app.use("/api/member", memberRoutes)
app.use("/api", trackingRoutes)

app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: "Route not found"
    })
})

app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500
    res.status(statusCode).json({
        success: false,
        message: err.message || "Something went wrong",
        errors: err.errors || []
    })
})


export default app
