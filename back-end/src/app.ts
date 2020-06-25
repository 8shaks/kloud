import express, { Router, Express } from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
const passport = require("passport");
import socketIo from "socket.io";
// const courts = require("./routes/api/courts");
// const path = require("path");
import users from "./routes/api/user";
import posts from "./routes/api/post";
import auth from "./routes/api/auth";
import profiles from "./routes/api/profile";
import friends from "./routes/api/friends";
import collabs from "./routes/api/collabs";
import conversation from "./routes/api/conversation";
import cors from "cors";

import Conversation from "./models/Conversation"
import Profile from "./models/Profile"
import Message from "./models/Message"
import { IProfile } from "./@types/custom"

const app: Express = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


app.use(cors());
const db = require("./config/keys").mongoURI;

app.use(passport.initialize());


// TODO
// MAKE ERROR INTERFACE
//CHANGE DATA and err TYPE IN PROFILE VALIDATION, SAME THING FOR REGISTER VALIDATION
// ADD TYPE TO MODEL SCHEMAS
//FIND OUT HOW TO IMPORT CUSTOM TYPES AND USE FOR SOCIAL FIELDS OBJECT


// require("./config/passport.js")(passport);

mongoose
  .connect(db, { useNewUrlParser: true ,useUnifiedTopology: true, useFindAndModify: false})
  .then(() => {
    console.log("MongoDB connected");
  })
  


app.use("/api/auth", auth);
app.use("/api/users", users);
app.use("/api/profile", profiles);
app.use("/api/friends", friends);
app.use("/api/collabs", collabs);
app.use("/api/posts", posts);
app.use("/api/conversations", conversation);
// app.use("/api/courts", courts);

// Server static assets if in production

  //set static folder

// app.use(express.static("client/public"));
 

const port = 5000;

const server = app.listen(port, () => console.log(`Server running on port ${port}`))

const io = socketIo(server);

interface user{
  username:string,
  userId:string
}
io.on('connection', (socket) => {
  console.log("we have a new connection!");
  socket.on("join", async (conversationId, callbck) => {
    socket.join(conversationId);
  })
  socket.on("disconnect", ()=> {
    console.log("user had left");
  })
  socket.on("chat", async (data:{profile:IProfile, userToChat:string, message:string}, callback) => {
    // const user = getUser(socket)
    if(data.profile.conversations.filter(u => u.username === data.userToChat).length > 0){
      let conversation = data.profile.conversations.filter((c)=> {return c.username === data.userToChat })[0];
      let conservationObj = await Conversation.findOne({_id:conversation.conversationId});
      if(conservationObj !== null){
        const newMessage = new Message({sender: data.profile.username, content:data.message, conversationId: conservationObj._id});
        await newMessage.save();
        // callback(newMessage)
        io.to(conservationObj._id).emit("message", {message:newMessage, username: data.profile.username, userToChat: data.userToChat} );
      }
    }else{
      const userProfile = await Profile.findOne({user:data.profile.user});
      const userProfile2 = await Profile.findOne({username:data.userToChat});
      if(userProfile && userProfile2){
        const conversation = new Conversation({participants:[data.profile.username,data.userToChat]})
        await conversation.save();
        userProfile.conversations.push({conversationId:conversation._id, username:userProfile2.username});
        userProfile2.conversations.push({conversationId:conversation._id, username:userProfile.username});
        await userProfile.save();
        await userProfile2.save();
        socket.join(conversation._id);
        const newMessage = new Message({sender: data.profile.username, content:data.message, conversationId: conversation._id});
        newMessage.save();
        // callback(newMessage)
        io.to(conversation._id).emit("message", {message:newMessage, username: data.profile.username, userToChat: data.userToChat} );
      }
   
    }

  })
})