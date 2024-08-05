const validateToken = require("../utils/authValidator");
const router = require('express').Router();
const Comment = require("../models/Comment");
const Post = require("../models/Post");

router.get("/:postId", validateToken, async(req, res)=> {
    try{
        const comments = await Comment.find({ post: req.params.postId })
            .populate("user"); // Populate the post field
        res.status(200).json(comments);
    }catch (e) {
        res.status(500).json({
            message: "Cannot fetch comments"
        });
    }
})

router.post("/:postId", validateToken, async (req, res) => {
    try {
        const { _id: userId } = req.user; // Extract user ID from the validated token
        const { postId } = req.params; // Extract post ID from URL parameters

        // Find the post by ID
        const post = await Post.findById(postId);
        if (!post) return res.status(400).json({ message: "Post not found" });

        // Validate input data
        if (!req.body.comment) {
            return res.status(400).json({ message: "Content is required." });
        }

        // Create a new comment instance
        const newComment = new Comment({
            ...req.body,
            user: userId,
            post: postId,
        });

        // Save the new comment to the database
        const savedComment = await newComment.save();

        // Populate the user field in the saved comment
        const populatedComment = await savedComment.populate('user');

        // Add the comment ID to the post's comments array
        post.comments.push(savedComment._id);
        await post.save();

        // Respond with the saved and populated comment
        res.status(200).json(populatedComment);
    } catch (error) {
        console.error("Error saving comment:", error); // Log the error
        res.status(500).json({ message: "Cannot save comment" });
    }
});


module.exports = router;