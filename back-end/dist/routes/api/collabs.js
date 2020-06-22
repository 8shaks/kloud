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
var router = express_1.default.Router();
var auth_1 = __importDefault(require("../../middleware/auth"));
var friendRequest_1 = __importDefault(require("../../validation/friendRequest"));
var Collab_1 = __importDefault(require("../../models/Collab"));
var Profile_1 = __importDefault(require("../../models/Profile"));
// @route    GET api/collabs
// @desc     Get all a users collabs
// @access   Private
function getMyCollabs(profile) {
    var _this = this;
    return new Promise(function (resolve, reject) {
        var myCollabs = [];
        if (profile.collabs)
            resolve(myCollabs);
        profile.collabs.forEach(function (collabId) { return __awaiter(_this, void 0, void 0, function () {
            var collab;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, Collab_1.default.findById(collabId)];
                    case 1:
                        collab = _a.sent();
                        if (collab)
                            myCollabs.push(collab);
                        if (myCollabs.length === profile.collabs.length)
                            resolve(myCollabs);
                        return [2 /*return*/];
                }
            });
        }); });
    });
}
router.get('/mycollabs', auth_1.default, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var profile, err_1;
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
                profile = _a.sent();
                if (!profile)
                    return [2 /*return*/, res.status(400).json({ errors: { profile: 'Cannot find your profile' } })];
                getMyCollabs(profile).then(function (myCollabs) {
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
// @route    POST api/friends/send_req
// @desc     Send a friend Request to a user
// @access   Private
router.post('/send_req', auth_1.default, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, errors, isValid, user_1, userProfile, profileToCollab_1, err_2;
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
                userProfile = _b.sent();
                if (!userProfile) {
                    return [2 /*return*/, res.status(400).json({ errors: { collabs: "You do not have a Profile" } })];
                }
                return [4 /*yield*/, Profile_1.default.findOne({ username: req.body.username })];
            case 3:
                profileToCollab_1 = _b.sent();
                if (!profileToCollab_1)
                    return [2 /*return*/, res.status(400).json({ errors: { collabs: 'We could not find the user you wanted to collab with' } })];
                if (profileToCollab_1.username === user_1.username)
                    return [2 /*return*/, res.status(400).json({ errors: { collabs: 'You cannot collab with yourself' } })];
                if (!(profileToCollab_1.collabRequestsRecieved.filter(function (u) { return u.username === user_1.username; }).length > 0 || userProfile.collabRequestsSent.filter(function (u) { return u.username === profileToCollab_1.username; }).length > 0)) return [3 /*break*/, 6];
                userProfile.collabRequestsSent = userProfile.collabRequestsSent.filter(function (reqSent) {
                    return reqSent.userId !== profileToCollab_1.user;
                });
                profileToCollab_1.collabRequestsRecieved = profileToCollab_1.collabRequestsRecieved.filter(function (reqRecieve) {
                    return reqRecieve.userId !== user_1.id;
                });
                return [4 /*yield*/, profileToCollab_1.save()];
            case 4:
                _b.sent();
                return [4 /*yield*/, userProfile.save()];
            case 5:
                _b.sent();
                return [2 /*return*/, res.json({ success: true, msg: "Cancelled your collab request with " + profileToCollab_1.username })];
            case 6:
                profileToCollab_1.collabRequestsRecieved.push({ userId: user_1.id, username: user_1.username, title: req.body.title, description: req.body.title, date: Date.now() });
                userProfile.collabRequestsSent.push({ userId: profileToCollab_1.user, username: profileToCollab_1.username, title: req.body.title, description: req.body.title, date: Date.now() });
                return [4 /*yield*/, profileToCollab_1.save()];
            case 7:
                _b.sent();
                return [4 /*yield*/, userProfile.save()];
            case 8:
                _b.sent();
                return [2 /*return*/, res.json({ success: true, msg: "Your collab request to " + profileToCollab_1.username + " has been sent" })];
            case 9:
                err_2 = _b.sent();
                console.error(err_2.message);
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
    var _a, errors, isValid, user_2, userProfile, collabToAccept_1, collabReq_1, newCollab, err_3;
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
                if (!(Boolean(req.body.accept) === true)) return [3 /*break*/, 6];
                newCollab = new Collab_1.default({
                    user1: {
                        user: collabToAccept_1.user,
                        username: collabToAccept_1.username
                    },
                    user2: {
                        user: userProfile.user,
                        username: userProfile.username
                    },
                    title: collabReq_1.title,
                    description: collabReq_1.description
                });
                newCollab.save();
                userProfile.collabs.push(newCollab._id);
                collabToAccept_1.collabs.push(newCollab._id);
                return [4 /*yield*/, collabToAccept_1.save()];
            case 4:
                _b.sent();
                return [4 /*yield*/, userProfile.save()];
            case 5:
                _b.sent();
                return [2 /*return*/, res.json({ success: true, msg: "You sucessfully accepted " + req.body.username + "'s collab request" })];
            case 6: return [4 /*yield*/, collabToAccept_1.save()];
            case 7:
                _b.sent();
                return [4 /*yield*/, userProfile.save()];
            case 8:
                _b.sent();
                return [2 /*return*/, res.json({ success: true, msg: "You sucessfully denied " + req.body.username + "'s collab request" })];
            case 9:
                err_3 = _b.sent();
                console.error(err_3.message);
                res.status(500).json({ errors: { server: 'Server error' } });
                return [3 /*break*/, 10];
            case 10: return [2 /*return*/];
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
