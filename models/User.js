const mongoose = require("mongoose");
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        min: 6,
        max: 255
    },
    email: {
        type: String,
        unique: true,
        required: true,
        max: 255,
        min: 6
    },
    profilePicture: {
        type: String,
        default: "https://cdn.pixabay.com/photo/2015/03/04/22/35/avatar-659651_1280.png"
    },
    password: {
        type: String,
        required: true,
        max: 1024,
        min: 6
    },
    isAdmin: {
        type: Boolean,
        required: true,
        default: false
    },
    posts: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post",
        default: []
    }],
    followers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: []
    }],
    followings: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: []
    }],
}, {
timestamps: true
});

module.exports = mongoose.model("User", userSchema);