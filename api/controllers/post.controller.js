import Post from "../models/post.model.js";
import { errorHandler } from "../utils/error.js"

export const create = async (req, res, next) => {
    
    //check if the person is admin or not
    if(!req.user.isAdmin){
        return next(errorHandler(403, 'You are not allowed to create a post.'))
    }
    
    //check if there is title, content or not
    if(!req.body.title ||  !req.body.content){
        return next(errorHandler(400,'Please provide all required fields'));
    }
    
    //for SEO purpose
    const slug = req.body.title.split(' ').join('-').toLowerCase().replace(/[^a-zA-Z0-9-]/g,'');

    const newPost = new Post({
        ...req.body,
        slug,
        userId: req.user.id,
    });

    try {
        const savedPost = await newPost.save();
        res.status(201).json(savedPost); //new post is created and send 
    } catch (error) {
        next(error);
    }
}