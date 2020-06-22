"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var body_parser_1 = __importDefault(require("body-parser"));
var mongoose_1 = __importDefault(require("mongoose"));
var passport = require("passport");
var socket_io_1 = __importDefault(require("socket.io"));
// const courts = require("./routes/api/courts");
// const path = require("path");
var user_1 = __importDefault(require("./routes/api/user"));
var post_1 = __importDefault(require("./routes/api/post"));
var auth_1 = __importDefault(require("./routes/api/auth"));
var profile_1 = __importDefault(require("./routes/api/profile"));
var friends_1 = __importDefault(require("./routes/api/friends"));
var collabs_1 = __importDefault(require("./routes/api/collabs"));
var cors_1 = __importDefault(require("cors"));
var app = express_1.default();
app.use(body_parser_1.default.urlencoded({ extended: true }));
app.use(body_parser_1.default.json());
app.use(cors_1.default());
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
app.use("/api/auth", auth_1.default);
app.use("/api/users", user_1.default);
app.use("/api/profile", profile_1.default);
app.use("/api/friends", friends_1.default);
app.use("/api/collabs", collabs_1.default);
app.use("/api/posts", post_1.default);
// app.use("/api/courts", courts);
// Server static assets if in production
//set static folder
// app.use(express.static("client/public"));
var port = 5000;
var server = app.listen(port, function () { return console.log("Server running on port " + port); });
var io = socket_io_1.default(server);
io.on('connection', function (socket) {
    console.log("we have a new connection!");
    socket.on("disconnect", function () {
        console.log("user had left");
    });
});
