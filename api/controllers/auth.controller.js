import User from "../models/user.model.js";
import bcryptjs from 'bcryptjs';
import { errorHandler } from "../utils/error.js";

//next to use middleware
export const signup = async (req, res, next) =>{
    const {username, email, password} = req.body;

    if(!username || !email || !password || username === '' || email === '' || password === ''){
        //to use middleware
        next(errorHandler(400, 'All fields are required'));
    }

    //hash the password
    const hashedPassword = bcryptjs.hashSync(password,10);

    const newUser = new User({
        username,
        email,
        password: hashedPassword,
    });


    //to show in insomnia error
    try{
        //newuser ko save krne database me
        await newUser.save();
        //give response to insomnia
        res.json("Signup successful");

    }
    catch(error){
        next(error);
    }

   
}