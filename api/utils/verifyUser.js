//to verify that the user is authenticated and this checks the cookies in a browser for this purpose
import jwt from 'jsonwebtoken';
import { errorHandler } from './error.js';

export const verifyToken = (req, res, next) => {
    const token = req.cookies.access_token;

    //after getting the token, we will verify it
    if (!token) {
        return next(errorHandler(401, 'Unauthorized'));
    }
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            return next(errorHandler(401, 'Unauthorized'));
        }
        req.user = user; //get user data from cookie
        next(); // next func pr jaane k liye(updateUser)
    });
}