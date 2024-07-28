const express = require('express');
const cors = require('cors');
 require('dotenv').config();
const mongoose = require("mongoose");

const port = process.env.PORT || 8000;
const app = express();
const authRoute = require("./routes/auth");
const postRoute = require("./routes/post");
const followerRoute = require("./routes/follower");
const userRoute = require("./routes/user");

//middleware
app.use(cors());
app.use(express.json());

//routes
app.use("/api/auth", authRoute)
app.use("/api/post", postRoute)
app.use("/api/follower", followerRoute)
app.use("/api/user", userRoute)

//database connection
mongoose.connect(process.env.MONGO_URI).then((res)=> {
    console.log("Database connected");
}).catch((err)=> {
    console.log(err);
})

app.listen(port, ()=> {
    console.log("Backend server is running on port " + port + "!")
})

