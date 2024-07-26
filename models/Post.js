const mongoose = require("mongoose");
const postSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    desc: {
        type: String,
        max: 500
    },
    img: {
        type: String,
        default: "https://cdn.pixabay.com/photo/2024/06/28/10/04/beautiful-cities-in-west-africa-8859225_1280.jpg"
    },
    likes: {
        type: Array,
        default: []
    }
}, {
    timestamps: true
});
module.exports = mongoose.model("Post", postSchema);