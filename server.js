const express = require('express');
const cors = require('cors');
 require('dotenv').config();
const mongoose = require("mongoose");
const io = require("socket.io")(8900, {
    cors: {
        origin: "http://localhost:5173",
    }
})

const port = process.env.PORT || 8000;
const app = express();
const authRoute = require("./routes/auth");
const postRoute = require("./routes/post");
const followerRoute = require("./routes/follower");
const userRoute = require("./routes/user");
const commentRoute = require("./routes/comment");
const conversationRoute = require("./routes/conversation");
const messageRoute = require("./routes/message");

//middleware
app.use(cors());
app.use(express.json());

//routes
app.use("/api/auth", authRoute)
app.use("/api/post", postRoute)
app.use("/api/follower", followerRoute)
app.use("/api/user", userRoute)
app.use("/api/comment", commentRoute)
app.use("/api/conversation", conversationRoute)
app.use("/api/message", messageRoute)

//socket connection


let users = [];
const addUser = (userId, socketId)=> {
    !users.some(user=> user.userId === userId) &&
    users.push({userId, socketId})
}

const removeUser = (socketId)=> {
    users = users.filter(user=> user.socketId !== socketId)
}
io.on("connection", (socket)=> {
socket.on("addUser", (userId)=> {
        addUser(userId, socket.id)
    io.emit("getUsers", users)
    })
    socket.on("sendMessage", ({senderId, receiverId, text})=> {
        console.log(users)
        console.log("senderId", senderId)
        console.log("receiverId", receiverId)

        console.log("text", text)
        const user = users?.find(user=> user?.userId === receiverId)
        if(user){
            io.to(user.socketId).emit("getMessage", {
                senderId,
                text
            })
        }
    })
    socket.on("disconnect", ()=> {
        removeUser(socket.id)
        console.log("a user disconnected");
    })
})

//database connection
mongoose.connect(process.env.MONGO_URI).then((res)=> {
    console.log("Database connected");
}).catch((err)=> {
    console.log(err);
})

app.listen(port, ()=> {
    console.log("Backend server is running on port " + port + "!")
})

