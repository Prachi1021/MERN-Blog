import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRoutes from "./routes/user.route.js";
import authRoutes from "./routes/auth.route.js";
import cookieParser from "cookie-parser";

const app = express();

app.use(express.json());
app.use(cookieParser()); // to extract cookie from browser

dotenv.config();

mongoose.connect(process.env.MONGO)
.then(()=>{
    console.log("MongoDB is connected");  
})
.catch((err) => {
    console.log(err);
});

app.listen(3000, () => {
    console.log("Server is running on port 3000!!");
});

app.use('/api/user', userRoutes);
app.use('/api/auth', authRoutes);


//middleware.......... err-error in input, next-to go to next middleware
app.use((err, req, res, next) =>{
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal message error';
    res.status(statusCode).json({
        success:false,
        statusCode,
        message,
    }); 
});