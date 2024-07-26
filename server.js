const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require("mongoose");

const port = process.env.PORT || 8000;
const app = express();
const authRoute = require("./routes/auth");
const postRoute = require("./routes/post");
const followerRoute = require("./routes/follower");

//middleware
app.use(cors());
app.use(express.json());

//routes
app.use("/api/auth", authRoute)
app.use("/api/post", postRoute)
app.use("/api/follower", followerRoute)

//database connection
mongoose.connect("mongodb+srv://sankalpa115:sankalpa115@social-media-dev-cluste.tp8gfnl.mongodb.net/?retryWrites=true&w=majority&appName=social-media-dev-cluster").then((res)=> {
    console.log("Database connected");
}).catch((err)=> {
    console.log(err);
})

app.listen(port, ()=> {
    console.log("Backend server is running on port " + port + "!")
})

