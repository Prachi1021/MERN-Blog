import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRoutes from "./routes/user.route.js";
import authRoutes from "./routes/auth.route.js";
import postRoutes from './routes/post.route.js';
import commentRoutes from './routes/comment.route.js';
import cookieParser from "cookie-parser";
import path from 'path';

dotenv.config();
const app = express();

app.use(express.json());
app.use(cookieParser()); // to extract cookie from browser


mongoose.connect(process.env.MONGO)
.then(()=>{
    console.log("MongoDB is connected");  
})
.catch((err) => {
    console.log(err);
});

const __dirname = path.resolve();

app.listen(3000, () => {
    console.log("Server is running on port 3000!!");
});

app.use('/api/user', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/post', postRoutes);
app.use('/api/comment', commentRoutes);

app.use(express.static(path.join(__dirname, '/client/dist')));


app.get('*', (req, res)=>{
    res.sendFile(path.join(__dirname, 'client', 'dist', 'index.html'));
});


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