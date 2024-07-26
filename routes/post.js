const router = require('express').Router();
const validateToken = require("../utils/authValidator");
const Post = require("../models/Post");
const User = require("../models/User");
router.post("/create", validateToken, async (req, res) => {
    const currentUser = req.user;
    const newPost = new Post(req.body);
    newPost.user = currentUser._id;
    try {
        const savedPost = await newPost.save();
        const user = await User.findById(currentUser);
        user.posts.push(savedPost._id);
        await user.save();
        res.status(201).json(savedPost);
    } catch(err) {
        res.status(400).json(err);
    }
})

router.get('/', validateToken, async(req, res)=> {
    //get posts of followers only
    const currentUser = req.user;
    console.log("current user",currentUser)
    try{
        const user = await User.findById(currentUser._id);
        if(!user) return res.status(400).json("User not found");
        const followings = user.followings;
        const posts = await Post.find({user: {$in: followings}}).populate("user");
        res.status(200).json(posts);
    }catch (e){
        res.status(400).json(e);
    }
})

module.exports = router;