//create user routes in backend/routes/user.js without validation

const express = require('express');
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

router.post("/register", async (req, res)=> {
    const {name, email, password, isAdmin, profilePicture, posts,followers} = req.body;
    if(!email || !password || !name) return res.status(400).json("Please fill all the fields");
    const emailExist = await User.findOne({email: email});
    if(emailExist) return res.status(400).send("User with this email already exists");
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);
    const user = new User({
        name: name,
        email: email,
        password: hashPassword,
        isAdmin: isAdmin,
        profilePicture: profilePicture,
        posts: posts,
        followers: followers
    });
    try {
        const savedUser = await user.save();
        res.status(201).json(savedUser);
    } catch(err) {
        res.status(400).send(err);
    }});

router.post("/login", async (req, res)=> {
    const {email, password} = req.body;
    const user = await User.findOne({email: email});
    if(!user) return res.status(400).json("User with this email doesn't exist");
    const validPass = await bcrypt.compare(password, user.password);
    if(!validPass) return res.status(400).json("Password is wrong");
    const token = jwt.sign({_id: user._id, isAdmin: user.isAdmin, email: user.email}, "sankalpasecretkey");
    res.header("auth-token", "Bearer" + " " + token).send(token);
}
);
module.exports = router;


