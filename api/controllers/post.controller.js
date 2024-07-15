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

export const getposts = async (req, res, next) =>{
    try {
        const startIndex = parseInt(req.query.startIndex) || 0;   
        const limit = parseInt(req.query.limit) || 9;   //for showin after searching
        const sortDirection = req.query.order === 'asc' ? 1 : -1;
        const posts = await Post.find({
            ...(req.query.userId && {userId: req.query.userId}),
            ...(req.query.category && {userId: req.query.category}),
            ...(req.query.slug && {userId: req.query.slug}),
            ...(req.query.postId && {_id: req.query.postId}),
            ...(req.query.searchTerm && {
                $or: [
                    { title: {$regex : req.query.searchTerm, $options: 'i'}}, //regex tool of mongodb for searching 
                    { content: {$regex: req.query.searchTerm, $options: 'i'}}, //i means irrespective of case
                ],
            }),
    }).sort({updatedAt : sortDirection}).skip(startIndex).limit(limit);

        const totalPosts = await Post.countDocuments();

        const now = new Date();
        const oneMonthAgo = new Date(
            now.getFullYear(),
            now.getMonth() -1,
            now.getDate()
        ); //for getting last month posts

        const lastMonthPosts = await Post.countDocuments({
            createdAt: {$gte: oneMonthAgo},
        });

        res.status(200).json({
            posts,
            totalPosts,
            lastMonthPosts,
        });

    } catch (error) {
        next(error);
    }
} 