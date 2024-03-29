"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
var router = express_1.default.Router();
var auth_1 = __importDefault(require("../../middleware/auth"));
var friendRequest_1 = __importDefault(require("../../validation/friendRequest"));
var Collab_1 = __importDefault(require("../../models/Collab"));
var Profile_1 = __importDefault(require("../../models/Profile"));
var fileFuncs_1 = require("../../utils/fileFuncs");
var Conversation_1 = __importDefault(require("../../models/Conversation"));
var Message_1 = __importDefault(require("../../models/Message"));
var multer_1 = __importDefault(require("multer"));
// @route    GET api/collabs
// @desc     Get all a users collabs
// @access   Private
function getMyCollabs(profile) {
    var _this = this;
    return new Promise(function (resolve, reject) {
        var myCollabs = [];
        if (profile.collabs.length === 0)
            resolve(myCollabs);
        profile.collabs.forEach(function (collabObj) { return __awaiter(_this, void 0, void 0, function () {
            var collab, lastMessage;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, Collab_1.default.findById(collabObj.collabId)];
                    case 1:
                        collab = _a.sent();
                        if (!collab) return [3 /*break*/, 3];
                        return [4 /*yield*/, Message_1.default.find({ conversationId: collab.conversation }).limit(1).sort({ date: -1 })];
                    case 2:
                        lastMessage = _a.sent();
                        if (lastMessage.length === 0)
                            myCollabs.push(collab);
                        else {
                            if (!lastMessage[0].read && profile.username !== lastMessage[0].sender)
                                collab.notification = true;
                            else
                                collab.notification = false;
                            myCollabs.push(collab);
                        }
                        _a.label = 3;
                    case 3:
                        if (myCollabs.length === profile.collabs.length)
                            resolve(myCollabs);
                        return [2 /*return*/];
                }
            });
        }); });
    });
}
router.get('/mycollabs', auth_1.default, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var profile_1, err_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!req.user)
                    return [2 /*return*/, res.status(400).json({ errors: { user: 'Invalid User' } })];
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, Profile_1.default.findOne({ user: req.user.id })];
            case 2:
                profile_1 = _a.sent();
                if (!profile_1)
                    return [2 /*return*/, res.status(400).json({ errors: { profile: 'Cannot find your profile' } })];
                getMyCollabs(profile_1).then(function (myCollabs) {
                    return res.json(myCollabs);
                });
                return [3 /*break*/, 4];
            case 3:
                err_1 = _a.sent();
                console.error(err_1.message);
                res.status(500).send('Server Error');
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
// @route    GET api/my convos
// @desc     Get all a users conversations
// @access   Private
function getMyConvos(collabs) {
    var _this = this;
    return new Promise(function (resolve, reject) {
        var myConversations = [];
        if (collabs.length === 0)
            resolve(myConversations);
        collabs.forEach(function (collabObj) { return __awaiter(_this, void 0, void 0, function () {
            var conversation, lastMessage, conversationObj;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, Conversation_1.default.findById(collabObj.conversation)];
                    case 1:
                        conversation = _a.sent();
                        if (!conversation) return [3 /*break*/, 3];
                        return [4 /*yield*/, Message_1.default.find({ conversationId: conversation._id }).limit(1).sort({ date: -1 })];
                    case 2:
                        lastMessage = _a.sent();
                        conversationObj = void 0;
                        if (lastMessage) {
                            conversationObj = __assign(__assign({}, conversation._doc), { lastMessage: lastMessage[0] });
                            myConversations.push(conversationObj);
                        }
                        else {
                            myConversations.push(conversation);
                        }
                        _a.label = 3;
                    case 3:
                        if (myConversations.length === collabs.length) {
                            resolve(myConversations.sort(function (a, b) { return new Date(b.lastActive).getTime() - new Date(a.lastActive).getTime(); }));
                        }
                        return [2 /*return*/];
                }
            });
        }); });
    });
}
router.get('/collabconvos', auth_1.default, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var profile_2, err_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!req.user)
                    return [2 /*return*/, res.status(400).json({ errors: { user: 'Invalid User' } })];
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, Profile_1.default.findOne({ user: req.user.id })];
            case 2:
                profile_2 = _a.sent();
                if (!profile_2)
                    return [2 /*return*/, res.status(400).json({ errors: { profile: 'Cannot find your profile' } })];
                getMyCollabs(profile_2).then(function (myCollabs) {
                    return getMyConvos(myCollabs).then(function (myConversations) {
                        return res.json({ colabs: myCollabs, convos: myConversations });
                    });
                });
                return [3 /*break*/, 4];
            case 3:
                err_2 = _a.sent();
                console.error(err_2.message);
                res.status(500).send('Server Error');
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
// @route    GET api/collabs/:collab_id
// @desc     Getcollab by Id
// @access   Private
router.get('/getcollab/:collab_id', auth_1.default, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var collab, err_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!req.user)
                    return [2 /*return*/, res.status(400).json({ errors: { user: 'Valid user required' } })];
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, Collab_1.default.findById(req.params.collab_id)];
            case 2:
                collab = _a.sent();
                if (!collab)
                    return [2 /*return*/, res.status(400).json({ errors: { collab: 'Collab not found' } })];
                if (collab.user1.user !== req.user.id && collab.user2.user !== req.user.id)
                    return [2 /*return*/, res.status(400).json({ errors: { collab: 'You are not in this collab' } })];
                return [2 /*return*/, res.json(collab)];
            case 3:
                err_3 = _a.sent();
                console.error(err_3.message);
                return [2 /*return*/, res.status(500).json({ msg: 'Server error' })];
            case 4: return [2 /*return*/];
        }
    });
}); });
var upload = multer_1.default();
// @route    POST api/messages/file/:id
// @desc     Get download link for file
// @access   Private
router.post('/upload_file/:collab_id', auth_1.default, upload.single("file"), function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var collab, err_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!req.user)
                    return [2 /*return*/, res.status(400).json({ errors: { user: 'Invalid User' } })];
                if (typeof req.params.collab_id !== 'string')
                    return [2 /*return*/, res.status(400).json({ errors: { collabs: 'Invalid request' } })];
                _a.label = 1;
            case 1:
                _a.trys.push([1, 4, , 5]);
                return [4 /*yield*/, Collab_1.default.findById(req.params.collab_id)];
            case 2:
                collab = _a.sent();
                if (!collab)
                    return [2 /*return*/, res.status(400).json({ errors: { collab: 'Collab not found' } })];
                if (collab.user1.user !== req.user.id && collab.user2.user !== req.user.id)
                    return [2 /*return*/, res.status(400).json({ errors: { collab: 'You are not in this collab' } })];
                return [4 /*yield*/, fileFuncs_1.uploadFile(req.file, req.params.collab_id)];
            case 3:
                _a.sent();
                collab.files.push({ fileName: req.file.originalname, fileKey: req.params.collab_id + "/" + req.file.originalname });
                collab.save();
                return [2 /*return*/, res.json({ sucess: true, msg: "File sucesfully uploaded" })
                    // getFile(req.body.fileLoc).then((el)=>{
                    //   res.setHeader('content-type', 'application/octet-stream')
                    //   res.setHeader('content-disposition', "test.mp3")
                    //   return res.send(el)
                    //  }).catch((err) => {
                    //     console.log(err)
                    //     return res.status(500).json({errors: { server: "There was a server error"}})
                    //  })
                ];
            case 4:
                err_4 = _a.sent();
                console.error(err_4.message);
                res.status(500).send('Server Error');
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); });
// @route    POST api/messages/file/:id
// @desc     Get download link for file
// @access   Private
router.post('/getfile', auth_1.default, upload.single("file"), function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var collab, err_5;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!req.user)
                    return [2 /*return*/, res.status(400).json({ errors: { user: 'Invalid User' } })];
                if (typeof req.body.collab_id !== 'string' || typeof req.body.fileName !== 'string')
                    return [2 /*return*/, res.status(400).json({ errors: { collabs: 'Invalid request' } })];
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, Collab_1.default.findById(req.body.collab_id)];
            case 2:
                collab = _a.sent();
                if (!collab)
                    return [2 /*return*/, res.status(400).json({ errors: { collab: 'Collab not found' } })];
                if (collab.user1.user !== req.user.id && collab.user2.user !== req.user.id)
                    return [2 /*return*/, res.status(400).json({ errors: { collab: 'You are not in this collab' } })];
                fileFuncs_1.getFile(req.body.collab_id + "/" + req.body.fileName).then(function (el) {
                    res.setHeader('content-type', 'application/octet-stream');
                    res.setHeader('content-disposition', "test.mp3");
                    return res.send(el);
                }).catch(function (err) {
                    console.log(err);
                    return res.status(500).json({ errors: { server: "There was a server error" } });
                });
                return [3 /*break*/, 4];
            case 3:
                err_5 = _a.sent();
                console.error(err_5);
                res.status(500).send('Server Error');
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
// @route    POST api/friends/send_req
// @desc     Send a friend Request to a user
// @access   Private
router.post('/send_req', auth_1.default, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, errors, isValid, user_1, userProfile_1, profileToCollab_1, err_6;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = friendRequest_1.default(req.body), errors = _a.errors, isValid = _a.isValid;
                if (!isValid) {
                    return [2 /*return*/, res.status(400).json(errors)];
                }
                _b.label = 1;
            case 1:
                _b.trys.push([1, 9, , 10]);
                user_1 = req.user;
                return [4 /*yield*/, Profile_1.default.findOne({ user: user_1.id })];
            case 2:
                userProfile_1 = _b.sent();
                if (!userProfile_1) {
                    return [2 /*return*/, res.status(400).json({ errors: { collabs: "You do not have a Profile" } })];
                }
                return [4 /*yield*/, Profile_1.default.findOne({ username: req.body.username })];
            case 3:
                profileToCollab_1 = _b.sent();
                if (!profileToCollab_1)
                    return [2 /*return*/, res.status(400).json({ errors: { collabs: 'We could not find the user you wanted to collab with' } })];
                if (profileToCollab_1.username === user_1.username)
                    return [2 /*return*/, res.status(400).json({ errors: { collabs: 'You cannot collab with yourself' } })];
                if (profileToCollab_1.collabs.filter(function (u) { return u.username === userProfile_1.username; }).length > 0)
                    return [2 /*return*/, res.status(400).json({ errors: { collabs: 'You already have a collab with this guy' } })];
                if (!(profileToCollab_1.collabRequestsRecieved.filter(function (u) { return u.username === user_1.username; }).length > 0 || userProfile_1.collabRequestsSent.filter(function (u) { return u.username === profileToCollab_1.username; }).length > 0)) return [3 /*break*/, 6];
                userProfile_1.collabRequestsSent = userProfile_1.collabRequestsSent.filter(function (reqSent) {
                    return reqSent.userId !== profileToCollab_1.user;
                });
                profileToCollab_1.collabRequestsRecieved = profileToCollab_1.collabRequestsRecieved.filter(function (reqRecieve) {
                    return reqRecieve.userId !== user_1.id;
                });
                return [4 /*yield*/, profileToCollab_1.save()];
            case 4:
                _b.sent();
                return [4 /*yield*/, userProfile_1.save()];
            case 5:
                _b.sent();
                return [2 /*return*/, res.json({ success: true, msg: "Cancelled your collab request with " + profileToCollab_1.username })];
            case 6:
                profileToCollab_1.collabRequestsRecieved.push({ userId: user_1.id, username: user_1.username, title: req.body.title, description: req.body.title, date: Date.now() });
                userProfile_1.collabRequestsSent.push({ userId: profileToCollab_1.user, username: profileToCollab_1.username, title: req.body.title, description: req.body.title, date: Date.now() });
                // console.log(userProfile)
                return [4 /*yield*/, profileToCollab_1.save()];
            case 7:
                // console.log(userProfile)
                _b.sent();
                return [4 /*yield*/, userProfile_1.save()];
            case 8:
                _b.sent();
                return [2 /*return*/, res.json({ success: true, msg: "Your collab request to " + profileToCollab_1.username + " has been sent" })];
            case 9:
                err_6 = _b.sent();
                console.error(err_6.message);
                res.status(500).json({ errors: { server: 'Server error' } });
                return [3 /*break*/, 10];
            case 10: return [2 /*return*/];
        }
    });
}); });
// @route    POST api/collabs/status
// @desc     Change status of collab request(accept or decline)
// @access   Private
router.post('/status', auth_1.default, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, errors, isValid, user_2, userProfile, collabToAccept_1, collabReq_1, conversation, newCollab, err_7;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = friendRequest_1.default(req.body), errors = _a.errors, isValid = _a.isValid;
                if (!isValid) {
                    return [2 /*return*/, res.status(400).json(errors)];
                }
                _b.label = 1;
            case 1:
                _b.trys.push([1, 11, , 12]);
                user_2 = req.user;
                return [4 /*yield*/, Profile_1.default.findOne({ user: user_2.id })];
            case 2:
                userProfile = _b.sent();
                if (!userProfile) {
                    return [2 /*return*/, res.status(400).json({ errors: { collabs: "You do not have a profile yet" } })];
                }
                return [4 /*yield*/, Profile_1.default.findOne({ username: req.body.username })];
            case 3:
                collabToAccept_1 = _b.sent();
                if (!collabToAccept_1)
                    return [2 /*return*/, res.status(400).json({ errors: { collabs: 'We could not find the profile you wanted to accept' } })];
                // console.log(req.body)
                if (collabToAccept_1.username === user_2.username)
                    return [2 /*return*/, res.status(400).json({ errors: { collabs: 'You cannot collab with yourself' } })];
                if (userProfile.collabRequestsRecieved.filter(function (u) { return u.username === collabToAccept_1.username; }).length === 0 || collabToAccept_1.collabRequestsSent.filter(function (u) { return u.username === user_2.username; }).length === 0)
                    return [2 /*return*/, res.status(400).json({ errors: { collabRequestsRecieved: "You haven't recieved a collab request from this user" } })];
                collabReq_1 = { userId: "", username: "", title: "", description: "" };
                userProfile.collabRequestsRecieved = userProfile.collabRequestsRecieved.filter(function (reqSent) {
                    if (reqSent.userId === collabToAccept_1.user)
                        collabReq_1 = reqSent;
                    return reqSent.userId !== collabToAccept_1.user;
                });
                collabToAccept_1.collabRequestsSent = collabToAccept_1.collabRequestsSent.filter(function (reqRecieve) {
                    return reqRecieve.userId !== user_2.id;
                });
                if (!(Boolean(req.body.accept) === true)) return [3 /*break*/, 8];
                return [4 /*yield*/, new Conversation_1.default({ participants: [userProfile.username, collabToAccept_1.username] })];
            case 4:
                conversation = _b.sent();
                return [4 /*yield*/, new Collab_1.default({
                        user1: {
                            user: collabToAccept_1.user,
                            username: collabToAccept_1.username
                        },
                        user2: {
                            user: userProfile.user,
                            username: userProfile.username
                        },
                        title: collabReq_1.title,
                        description: collabReq_1.description,
                        conversation: conversation._id
                    })];
            case 5:
                newCollab = _b.sent();
                conversation.collabId = newCollab._id;
                newCollab.save();
                userProfile.collabs.push({ collabId: newCollab._id, username: collabToAccept_1.username });
                collabToAccept_1.collabs.push({ collabId: newCollab._id, username: userProfile.username });
                conversation.save();
                return [4 /*yield*/, collabToAccept_1.save()];
            case 6:
                _b.sent();
                return [4 /*yield*/, userProfile.save()];
            case 7:
                _b.sent();
                return [2 /*return*/, res.json({ success: true, msg: "You sucessfully accepted " + req.body.username + "'s collab request" })];
            case 8: return [4 /*yield*/, collabToAccept_1.save()];
            case 9:
                _b.sent();
                return [4 /*yield*/, userProfile.save()];
            case 10:
                _b.sent();
                return [2 /*return*/, res.json({ success: true, msg: "You sucessfully denied " + req.body.username + "'s collab request" })];
            case 11:
                err_7 = _b.sent();
                console.error(err_7.message);
                res.status(500).json({ errors: { server: 'Server error' } });
                return [3 /*break*/, 12];
            case 12: return [2 /*return*/];
        }
    });
}); });
// // @route    POST api/collabs/unfriend
// // @desc     cancel collab with user user
// // @access   Private
// router.post('/cancel-collab', auth, async (req, res) => {
//   const { errors, isValid } = validateCollabRequest(req.body);
//   if (!isValid) {
//     return res.status(400).json(errors);
//   }
// try {
//   let user = req.user!
//   const userCollab = await Collab.findOne({user:user.id});
//   if (!userCollab) {
//     return res.status(400).json({errors: { friends: "You do not have a friend's list yet" }});
//   }
//   // find user they want to unfriend
//   const collabToCancel = await Collab.findOne({username:req.body.username});
//   if(!collabToCancel)  return res.status(400).json({errors: { collabs: 'We could not find the collab you wanted to cancel' }});
//   if(collabToCancel.username === user.username) return res.status(400).json({errors: { collabs: 'You cannot have a collab to cancel' }});
//   if(collabToCancel.collabs.filter(u => u.username === user.username).length === 0 || userCollab.collabs.filter(u => u.username === collabToCancel.username).length === 0){
//     return res.status(400).json({errors:{collabs: "You do not have a collab with this user yet"}})
//   }
//   userCollab.collabs = userCollab.collabs.filter((collab)=>{
//     return collab.userId !== collabToCancel.user;
//   })
//   collabToCancel.collabs = collabToCancel.collabs.filter((collab)=>{
//     return collab.userId !== user.id;
//   })
//   await collabToCancel.save();
//   await userCollab.save();
//   return res.json({ success: true, msg: "You have sucessfully canceled the collab with " + collabToCancel.username });
// } catch (err) {
//   console.error(err.message);
//   res.status(500).json({errors: { server: 'Server error' }});
// }
// });
exports.default = router;
