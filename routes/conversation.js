const router = require('express').Router();
const Conversation = require('../models/Conversation');
const validateToken = require('../utils/authValidator');

// new conversation
router.post('/', async (req, res) => {
    const newConversation = new Conversation({
        members: [req.body.senderId, req.body.receiverId]
    });

    try {
        const savedConversation = await newConversation.save();
        res.status(200).json(savedConversation);
    } catch (err) {
        res.status(500).json(err);
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