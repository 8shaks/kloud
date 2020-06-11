"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var body_parser_1 = __importDefault(require("body-parser"));
var mongoose_1 = __importDefault(require("mongoose"));
var passport = require("passport");
// const courts = require("./routes/api/courts");
// const path = require("path");
var users = require("./routes/api/user");
var auth = require("./routes/api/auth");
var profiles = require("./routes/api/profile");
var app = express_1.default();
app.use(body_parser_1.default.urlencoded({ extended: true }));
app.use(body_parser_1.default.json());
var db = require("./config/keys").mongoURI;
app.use(passport.initialize());
// TODO
// MAKE ERROR INTERFACE
//CHANGE DATA and err TYPE IN PROFILE VALIDATION, SAME THING FOR REGISTER VALIDATION
// ADD TYPE TO MODEL SCHEMAS
//FIND OUT HOW TO IMPORT CUSTOM TYPES AND USE FOR SOCIAL FIELDS OBJECT
// require("./config/passport.js")(passport);
mongoose_1.default
    .connect(db, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false })
    .then(function () {
    console.log("MongoDB connected");
});
// .catch(err => console.log(err.data);
app.use("/api/auth", auth);
app.use("/api/users", users);
app.use("/api/profile", profiles);
// app.use("/api/courts", courts);
// Server static assets if in production
//set static folder
// app.use(express.static("client/public"));
var port = process.env.PORT || 5000;
app.listen(port, function () { return console.log("Server running on port " + port); });
