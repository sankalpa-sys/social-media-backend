const router = require('express').Router();
const Conversation = require('../models/Conversation');
const validateToken = require('../utils/authValidator');

// new conversation
router.post('/', async (req, res) => {
    const { senderId, receiverId } = req.body;

    try {
        // Check if a conversation between the two members already exists
        const existingConversation = await Conversation.findOne({
            members: { $all: [senderId, receiverId] }
        });

        if (existingConversation) {
            return res.status(400).json({
                message: "Conversation already exists",
                redirect: true,
                existingConversation
            });
        }

        // Create a new conversation if it doesn't already exist
        const newConversation = new Conversation({
            members: [senderId, receiverId]
        });
        const savedConversation = await newConversation.save();

        res.status(200).json(savedConversation);
    } catch (err) {
        res.status(500).json({
            message: "Server error",
            error: err.message
        });
    }
});

// get conversations of a user
router.get('/', validateToken , async (req, res) => {
    try {
        const conversations = await Conversation.find({
            members: { $in: [req.user._id] }
        }).populate('members',"-password");
        res.status(200).json(conversations);
    } catch (err) {
        res.status(500).json(err);
    }
});

module.exports = router;