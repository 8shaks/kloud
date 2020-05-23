import express, { Router, Express } from 'express'
import bodyParser from 'body-parser'
import mongoose from 'mongoose'
const passport = require("passport");
// const courts = require("./routes/api/courts");
// const path = require("path");
import users from "./routes/api/user"
import auth from "./routes/api/auth"
import profiles from "./routes/api/profile"
import friends from "./routes/api/friends"
import collabs from "./routes/api/collabs"


const app: Express = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

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
  // .catch(err => console.log(err.data);

app.use("/api/auth", auth);
app.use("/api/users", users);
app.use("/api/profile", profiles);
app.use("/api/friends", friends);
app.use("/api/collabs", collabs);
// app.use("/api/courts", courts);

// Server static assets if in production

  //set static folder

// app.use(express.static("client/public"));
 

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server running on port ${port}`))
