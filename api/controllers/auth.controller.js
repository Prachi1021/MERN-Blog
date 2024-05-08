import User from "../models/user.model.js";
import bcryptjs from 'bcryptjs';

export const signup = async (req, res) =>{
    const {username, email, password} = req.body;

    if(!username || !email || !password || username === '' || email === '' || password === ''){
        return res.status(400).json({message : "All fields are required"});
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
        res.status(500).json({message: error.message});
    }

   
}