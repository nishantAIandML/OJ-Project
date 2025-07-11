const mongoose=require('mongoose');
const dotenv=require('dotenv');
dotenv.config();

const DBConnection=async()=>{
    const MONGO_URI=process.env.MONGODB_URL;
    try {
        await mongoose.connect(MONGO_URI);
        console.log("Database connected successfully");
    } catch (error) {
        console.error("Database connection failed:", error);
        // process.exit(1); 
    }
}
module.exports=DBConnection;