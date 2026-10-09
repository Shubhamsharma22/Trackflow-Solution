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

const frontendOrigins = (
  process.env.FRONTEND_URL || 
  "https://trackflow-solution-1.onrender.com,https://trackflow-solution.onrender.com"
)
  .split(",")
  .map((origin) => origin.trim().replace(/\/+$/, ""))
  .filter(Boolean)

if (process.env.NODE_ENV !== "production") {
  frontendOrigins.push("http://localhost:5173")
}

app.use(cors({
  origin: (origin, callback) => {
    // Allow server-to-server / non-browser requests without origin
    if (!origin) return callback(null, true)

    if (frontendOrigins.includes(origin)) {
      return callback(null, true)
    }

    return callback(new Error(`CORS blocked for origin: ${origin}`))
  },
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
                bearerAuth: {
                    type: "http",
                    scheme: "bearer",
                    bearerFormat: "JWT",
                },
            },
        },
    },
    apis: ["./Routes/*.js"],
})




app.use(express.json())

app.use(cookieParser())
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec))

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
