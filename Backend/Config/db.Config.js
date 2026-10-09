import mongoose from "mongoose";

const connectDB = async () => {
    if (!process.env.Mongo_Url) {
        throw new Error("Mongo_Url is not defined");
    }

    await mongoose.connect(process.env.Mongo_Url);
    console.log("MongoDB connected");
};

export default connectDB