const User = require("../models/User");
const router = require('express').Router();
const validateToken = require("../utils/authValidator");
router.post("/follow/:id", validateToken, async (req, res) => {
    const userId = req.params.id;
    const currentUser =  req.user._id
    if(userId === currentUser) return res.status(403).json("You can't follow yourself");
    try{
        const user = await User.findById(userId);
        const currentUser = await User.findById(req.user._id);
        if(!user.followers.includes(req.user._id)) {
            await user.updateOne({$push: {followers: req.user._id}});
            await currentUser.updateOne({$push: {followings: userId}});
            res.status(200).json("user has been followed");
        }
    }catch(err){
        res.status(400).json(err);
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