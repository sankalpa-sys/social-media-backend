const router = require('express').Router();
const Message = require('../models/Message');
const validateToken = require('../utils/authValidator');

// add message
router.post('/', validateToken , async (req, res) => {
    const newMessage = new Message(req.body);

    try {
        const savedMessage = await newMessage.save();
        res.status(200).json(savedMessage);
    } catch (err) {
        res.status(500).json(err);
    }
});

// get messages of a conversation
router.get('/:conversationId', validateToken , async (req, res) => {
    try {
        const messages = await Message.find({
            conversationId: req.params.conversationId
        });
        res.status(200).json(messages);
    } catch (err) {
        res.status(500).json(err);
    }
});

module.exports = router;