const router = require('express').Router();
const  validateToken  = require( '../utils/authValidator');

const User = require('../models/User');
router.get("/profile", validateToken, async (req, res) => {
    try{
        const user = await User.findById(req.user._id)
        const {password, ...rest} = user._doc
        res.status(200).json(rest);
    }catch (e) {
        res.status(500).json(e);
    }
});

router.get("/suggested-users", validateToken, async (req, res) => {
    try {
        const currentUser = await User.findById(req.user._id);
        const allUsers = await User.find();

        let suggestedUsers = allUsers.filter((user) => {
            let isFriend = currentUser.followings.includes(user._id);
            let isCurrentUser = user._id.equals(req.user._id);
            return !isFriend && !isCurrentUser;
        });

        // Shuffle the array
        suggestedUsers = suggestedUsers.sort(() => 0.5 - Math.random());

        // Select only the first 10 users
        suggestedUsers = suggestedUsers.slice(0, 10);

        res.status(200).json(suggestedUsers);
    } catch (e) {
        res.status(500).json(e);
    }
});

module.exports = router;