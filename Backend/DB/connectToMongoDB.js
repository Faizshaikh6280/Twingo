import mongoose from "mongoose";

async function connectToMongoDB() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connect to mongodb successfully!");
  } catch (error) {
    console.log("Error Connecting MONGODB 💥: ", error.message);
    process.exit(1);
  }
}

export default connectToMongoDB;
