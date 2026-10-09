import "dotenv/config";
import app from "./app.js";
import connectDB from "./Config/db.Config.js";
const PORT = process.env.PORT || 3000;

try {
    await connectDB();
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
} catch (error) {
    console.error("Failed to start server:", error.message);
    process.exit(1);
}



