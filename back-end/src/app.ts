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

import Conversation from "./models/Conversation";
import Profile from "./models/Profile";
import Message from "./models/Message";
import { IProfile, SocketMessage } from "./@types/custom";

import { uploadFile } from "./utils/fileFuncs";

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
// app.use("/api/friends", friends);
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
  socket.on("chat", async (data:{profile:IProfile, userToChat:string, message:string, conversationId:string}, callback) => {
    // if(data.profile.conversations.filter(u => u.username === data.userToChat).length > 0){
      let conservationObj = await Conversation.findOne({_id:data.conversationId});
      try{
        if(conservationObj !== null){
          const newMessage = new Message({sender: data.profile.username, content:data.message, conversationId: conservationObj._id});
          await newMessage.save();
          io.to(conservationObj._id).emit("message", {message:newMessage, username: data.profile.username, userToChat: data.userToChat } );
        }
      }catch(err){
        console.error(err)
      }
    // }else{
    //   const userProfile = await Profile.findOne({user:data.profile.user});
    //   const userProfile2 = await Profile.findOne({username:data.userToChat});
    //   if(userProfile && userProfile2){
    //     const conversation = new Conversation({participants:[data.profile.username,data.userToChat]})

    //     await conversation.save();

    //     userProfile.conversations.push({conversationId:conversation._id, username:userProfile2.username});
    //     userProfile2.conversations.push({conversationId:conversation._id, username:userProfile.username});

    //     await userProfile.save();
    //     await userProfile2.save();

    //     socket.join(conversation._id);

    //     const newMessage = new Message({sender: data.profile.username, content:data.message, conversationId: conversation._id});
    //     // if(data.files){
    //     //   const files = Array.from(data.files)
    //     //   files.forEach(file => {
    //     //     newMessage.files.push({file:`conversations/${conversation._id}/${newMessage._id}/${file.name.trim().replace(" ", "_")}`,fileName:file.name.trim()});
    //     //   });
    //     //   await uploadFile(data.files,  conversation._id, newMessage._id).then((fileData) => {
    //     //     fileData.forEach((file:any) => {
    //     //       newMessage.files.push(file.location);
    //     //     });
    //     //   })
    //     // }
    //     newMessage.save();
    //     // let fileObj = data.files ? Array.from(data.files) : []; 
    //     io.to(conversation._id).emit("message", {message:newMessage, username: data.profile.username, userToChat: data.userToChat, } );
    //   }
   
    // }

  })
})

// const params = {
//   Bucket: 'kloud-storage', // pass your bucket name
//   Key: `conversations/${conservationObj._id}`, // file will be saved as testBucket/contacts.csv
//   Body: JSON.stringify(data, null, 2)
// };
// s3.upload(params, function(s3Err, data) {
//     if (s3Err) throw s3Err
//     console.log(`File uploaded successfully at ${data.Location}`)
// });