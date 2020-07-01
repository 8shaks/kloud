"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
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
var collabs_1 = __importDefault(require("./routes/api/collabs"));
var conversation_1 = __importDefault(require("./routes/api/conversation"));
var cors_1 = __importDefault(require("cors"));
var Conversation_1 = __importDefault(require("./models/Conversation"));
var Message_1 = __importDefault(require("./models/Message"));
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
// app.use("/api/friends", friends);
app.use("/api/collabs", collabs_1.default);
app.use("/api/posts", post_1.default);
app.use("/api/conversations", conversation_1.default);
// app.use("/api/courts", courts);
// Server static assets if in production
//set static folder
// app.use(express.static("client/public"));
var port = 5000;
var server = app.listen(port, function () { return console.log("Server running on port " + port); });
var io = socket_io_1.default(server);
io.on('connection', function (socket) {
    console.log("we have a new connection!");
    socket.on("join", function (conversationId, callbck) { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            socket.join(conversationId);
            return [2 /*return*/];
        });
    }); });
    socket.on("disconnect", function () {
        console.log("user had left");
    });
    socket.on("chat", function (data, callback) { return __awaiter(void 0, void 0, void 0, function () {
        var conservationObj, newMessage, err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, Conversation_1.default.findOne({ _id: data.conversationId })];
                case 1:
                    conservationObj = _a.sent();
                    _a.label = 2;
                case 2:
                    _a.trys.push([2, 5, , 6]);
                    if (!(conservationObj !== null)) return [3 /*break*/, 4];
                    newMessage = new Message_1.default({ sender: data.profile.username, content: data.message, conversationId: conservationObj._id });
                    return [4 /*yield*/, newMessage.save()];
                case 3:
                    _a.sent();
                    io.to(conservationObj._id).emit("message", { message: newMessage, username: data.profile.username, userToChat: data.userToChat });
                    _a.label = 4;
                case 4: return [3 /*break*/, 6];
                case 5:
                    err_1 = _a.sent();
                    console.error(err_1);
                    return [3 /*break*/, 6];
                case 6: return [2 /*return*/];
            }
        });
    }); });
});
// const params = {
//   Bucket: 'kloud-storage', // pass your bucket name
//   Key: `conversations/${conservationObj._id}`, // file will be saved as testBucket/contacts.csv
//   Body: JSON.stringify(data, null, 2)
// };
// s3.upload(params, function(s3Err, data) {
//     if (s3Err) throw s3Err
//     console.log(`File uploaded successfully at ${data.Location}`)
// });
