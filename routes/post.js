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

        const user = await User.findById(currentUser._id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        user.posts.push(savedPost._id);
        await user.save();

        const post = await Post.findById(savedPost._id).populate("user");

        res.status(201).json(post);
    } catch (err) {
        res.status(400).json(err);
    }
});

router.get('/', validateToken, async(req, res)=> {
    //get posts of followers only
    const currentUser = req.user;
    console.log("current user",currentUser)
    try{
        const user = await User.findById(currentUser._id);
        if(!user) return res.status(400).json("User not found");
        const followings = user.followings.concat(user._id);
        const posts = await Post.find({user: {$in: followings}}).populate("user").sort({createdAt: -1});
        res.status(200).json(posts);
    }catch (e){
        res.status(400).json(e);
    }
})


router.delete("/:id", validateToken, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        if (req.user && (post.user.toString() === req.user._id.toString() || req.user.isAdmin)) {
            await Post.findByIdAndDelete(req.params.id);
            res.status(200).json({ message: "Post deleted" });
        } else {
            res.status(403).json({ message: "You can delete only your post" });
        }
    } catch (err) {
        res.status(500).json({ message: "An error occurred while deleting the post", error: err.message });
    }
});

router.post("/like/:id", validateToken, async (req, res)=> {
    try{
        const currentUser = req.user;
        const post = await Post.findById(req.params.id).populate("user");
        if(!post) return res.status(404).json({message: "Post not found"});
        if(post.likes.includes(currentUser._id)){
            //handle unlike
            post.likes = post.likes.filter((likeUserId)=> likeUserId.toString() !== currentUser._id.toString());
            await post.save();
        }
        else{
            //handle like
            post.likes.push(currentUser._id);
            await post.save();
        }
        res.status(200).json(post);
    }catch (e) {
        res.status(400).json({
            message: "An error ocurred while liking the post"
        })
    }
})

router.get('/likes/:id', async (req, res) => {
    try {
        const post = await Post.findById(req.params.id).populate('likes');
        if (!post) return res.status(404).json({ message: 'Post not found' });

        res.status(200).json(post.likes);
    } catch (e) {
        res.status(400).json({
            message: 'An error occurred while getting likes of the post'
        });
    }
});


module.exports = router;