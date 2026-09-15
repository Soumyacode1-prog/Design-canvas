import mongoose from "mongoose";
export async function connectDatabase() {
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) {
        throw new Error("MONGODB_URI is not defined");
    }
    await mongoose.connect(mongoUri, { dbName: "canvas" });
    console.log("MongoDB connected to canvas");
}
//# sourceMappingURL=database.js.map