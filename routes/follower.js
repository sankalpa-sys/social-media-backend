const User = require("../models/User");
const router = require('express').Router();
const validateToken = require("../utils/authValidator");
router.post("/follow/:id", validateToken, async (req, res) => {
    const userId = req.params.id;
    const currentUser = req.user._id;
    const action = req.body.action; // Expecting "follow" or "unfollow"

    if(userId === currentUser) return res.status(403).json("You can't follow yourself");

    try {
        const user = await User.findById(userId);
        const currentUserDoc = await User.findById(req.user._id);

        if (action === "follow") {
            if (!user.followers.includes(req.user._id)) {
                await user.updateOne({ $push: { followers: req.user._id } });
                await currentUserDoc.updateOne({ $push: { followings: userId } });
                return res.status(200).json("User has been followed");
            }
        } else if (action === "unfollow") {
            if (user.followers.includes(req.user._id)) {
                await user.updateOne({ $pull: { followers: req.user._id } });
                await currentUserDoc.updateOne({ $pull: { followings: userId } });
                return res.status(200).json("User has been unfollowed");
            }
        } else {
            return res.status(400).json("Invalid action");
        }

        res.status(400).json("Action not performed");
    } catch (err) {
        res.status(500).json(err);
    }
});

router.get("/", validateToken , async(req, res)=> {
    const currentUser = req.user
    try{
        const user = await User.findById(currentUser._id).populate("followers");
        res.status(200).send(user.followers)
    }catch (e){
        res.status(500).json(e)
    }
})
router.get("/followings", validateToken , async(req, res)=> {
    const currentUser = req.user
    try{
        const user = await User.findById(currentUser._id).populate("followings");
        res.status(200).send(user.followings)
    }catch (e){
        res.status(500).json(e)
    }
})

module.exports = router;