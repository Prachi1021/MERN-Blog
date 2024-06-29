import User from "../models/user.model.js";
import bcryptjs from 'bcryptjs';
import { errorHandler } from "../utils/error.js";
import jwt from 'jsonwebtoken';

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

//for signin- user will input fields and then cookies will be saved in the user's browser to authenticate next tym--
export const signin = async (req, res, next) => {
    const { email, password } = req.body; //taking input 

    if( !email || !password || email ==='' || password === ''){
        next(errorHandler(400,'All fields are required'));
    }

    try {
        //first we'll check the email  of the user--
        const validUser = await User.findOne({email});    //await as result may take tym, User model is usd to find email(findOne)

        if(!validUser){
            return next(errorHandler(400, 'User not found'));
        }

        const validPassword = bcryptjs.compareSync(password, validUser.password); //password is not hashed so bcrypt compares both passwords by converting first password to hashed then comparing

        if(!validPassword){
            return next(errorHandler(400, 'Invalid password')); //user should know what is wrong so use wrong credentials
        }

        //to authenticate the user- jwt is used--
        const token = jwt.sign(  //whatever we're adding, should be encrypted
            {id: validUser._id, isAdmin: validUser.isAdmin},  //to save in cookie this _id will be saved but in hashed form to latr authenticate the user

            process.env.JWT_SECRET // got one time sessions
        );

        //remove password from rest to secure it
        const { password: pass, ...rest} = validUser._doc;

        //actually adding to cookie
        res.status(200).cookie('access_token', token, {
            httpOnly : true, //secure cookie
        }). json(rest); //to return valid user

    } catch (error) { //catch uses middleware to send error
        next(error);
        
    }
};


export const google = async (req, res, next) => {
    const { email, name, googlePhotoUrl } = req.body;
    
    try {
        const user = await User.findOne({email});

        if(user){
            const token = jwt.sign(
                {id: user._id, isAdmin: user.isAdmin},
                process.env.JWT_SECRET
            );

            const { password, ...rest } = user._doc;
            res.status(200).cookie('access_token',token, {
                httpOnly: true,
            }).json(rest);
        }
        else{
            const generatedPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);
            const hashedPassword = bcryptjs.hashSync(generatedPassword,10);

            const newUser = new User({
                username: name.toLowerCase().split(' ').join('')+ Math.random().toString(9).slice(-4),
                email,
                password: hashedPassword,
                profilePicture: googlePhotoUrl,
            });
            await newUser.save();

            const token = jwt.sign({id: newUser._id, isAdmin: newUser.isAdmin}, process.env.JWT_SECRET);
            const {password, ...rest} = newUser._doc;
            res.status(200).cookie('access_token',token, {
                httpOnly: true,
            }).json(rest);
        }
        
    } catch (error) {
        next(error);
    }
};