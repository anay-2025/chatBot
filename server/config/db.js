import mongoose from "mongoose";

const connectDB = async () => {
    try {
        mongoose.connection.on("connected", () => {
            console.log("DB Connected");
        });

        await mongoose.connect(`${process.env.MONGODB_URI}/merngpt`);

    } catch (error) {
        console.error("DB ERROR:", error.message); // you'll likely see a URI error here
        process.exit(1); // force crash so you can see it clearly
    }
}

export default connectDB;