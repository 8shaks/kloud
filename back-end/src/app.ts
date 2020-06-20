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
import cors from "cors";

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
// app.use("/api/courts", courts);

// Server static assets if in production

  //set static folder

// app.use(express.static("client/public"));
 

const port = 5000;

const server = app.listen(port, () => console.log(`Server running on port ${port}`))
// const io = socketIo(server);
// io.of("/chat").on(("connect"), async socket => {
//   console.log("connected")
//   socket.on("typing", async msg => {
//     console.log(msg)
//     socket.broadcast.emit("typing, { msg: msg.name});")
//   })
//   try{
//     socket.on("msg", async msg => {
//       io.emit(msg, {chats:{username:msg.name, message:msg.msg}});
//     })
//   }catch(err){
//     console.error(err.message)
//   }
//   socket.on("typing", name => {
//     io.emit("Typing", { name: `${name.name}`})
//   })
//   socket.on("disconnected", () => {
//     console.log("Disconnected")
//   })
// })