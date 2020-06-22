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
var Profile_1 = __importDefault(require("../../models/Profile"));
// import Friend from "../../models/Friend"
// @route    GET api/friends
// @desc     Get all a users friends
// @access   Private
router.get('/', auth_1.default, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, errors, isValid, user, userProfile, err_1;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = friendRequest_1.default(req.body), errors = _a.errors, isValid = _a.isValid;
                if (!isValid) {
                    return [2 /*return*/, res.status(400).json(errors)];
                }
                _b.label = 1;
            case 1:
                _b.trys.push([1, 3, , 4]);
                user = req.user;
                return [4 /*yield*/, Profile_1.default.findOne({ user: user.id })];
            case 2:
                userProfile = _b.sent();
                if (!userProfile) {
                    return [2 /*return*/, res.status(400).json({ errors: { friends: "You do not have a Profile" } })];
                }
                //Return all of a user's friends
                return [2 /*return*/, res.json({ success: true, friends: userProfile.friends })];
            case 3:
                err_1 = _b.sent();
                console.error(err_1.message);
                res.status(500).json({ errors: { server: 'Server error' } });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
// @route    POST api/friends/send_req
// @desc     Send a friend Request to a user
// @access   Private
router.post('/send_req', auth_1.default, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, errors, isValid, user_1, userFriend, friendtoAdd_1, err_2;
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
                userFriend = _b.sent();
                if (!userFriend) {
                    return [2 /*return*/, res.status(400).json({ errors: { friends: "You do not have a Profile" } })];
                }
                return [4 /*yield*/, Profile_1.default.findOne({ username: req.body.username })];
            case 3:
                friendtoAdd_1 = _b.sent();
                if (!friendtoAdd_1)
                    return [2 /*return*/, res.status(400).json({ errors: { friends: 'We could not find the friend you wanted to add' } })];
                if (friendtoAdd_1.username === user_1.username)
                    return [2 /*return*/, res.status(400).json({ errors: { friends: 'You cannot add yourself' } })];
                if (!(friendtoAdd_1.friendRequestsRecieved.filter(function (u) { return u.username === user_1.username; }).length > 0 || userFriend.friendRequestsSent.filter(function (u) { return u.username === friendtoAdd_1.username; }).length > 0)) return [3 /*break*/, 6];
                userFriend.friendRequestsSent = userFriend.friendRequestsSent.filter(function (reqSent) {
                    return reqSent.userId !== friendtoAdd_1.user;
                });
                friendtoAdd_1.friendRequestsRecieved = friendtoAdd_1.friendRequestsRecieved.filter(function (reqRecieve) {
                    return reqRecieve.userId !== user_1.id;
                });
                return [4 /*yield*/, friendtoAdd_1.save()];
            case 4:
                _b.sent();
                return [4 /*yield*/, userFriend.save()];
            case 5:
                _b.sent();
                return [2 /*return*/, res.json({ success: true, msg: "Cancelled your friend request" })];
            case 6:
                friendtoAdd_1.friendRequestsRecieved.push({ userId: user_1.id, username: user_1.username });
                userFriend.friendRequestsSent.push({ userId: friendtoAdd_1.user, username: friendtoAdd_1.username });
                return [4 /*yield*/, friendtoAdd_1.save()];
            case 7:
                _b.sent();
                return [4 /*yield*/, userFriend.save()];
            case 8:
                _b.sent();
                return [2 /*return*/, res.json({ success: true, msg: "Your friend message to " + friendtoAdd_1.username + " has been succesfully sent" })];
            case 9:
                err_2 = _b.sent();
                console.error(err_2.message);
                res.status(500).json({ errors: { server: 'Server error' } });
                return [3 /*break*/, 10];
            case 10: return [2 /*return*/];
        }
    });
}); });
// @route    POST api/friends/status
// @desc     Change status of friend request(accept or decline)
// @access   Private
router.post('/status', auth_1.default, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, errors, isValid, user_2, userFriend, friendtoAccept_1, err_3;
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
                userFriend = _b.sent();
                if (!userFriend) {
                    return [2 /*return*/, res.status(400).json({ errors: { friends: "You do not have a friend's list yet" } })];
                }
                return [4 /*yield*/, Profile_1.default.findOne({ username: req.body.username })];
            case 3:
                friendtoAccept_1 = _b.sent();
                if (!friendtoAccept_1)
                    return [2 /*return*/, res.status(400).json({ errors: { friends: 'We could not find the friend you wanted to add' } })];
                if (friendtoAccept_1.username === user_2.username)
                    return [2 /*return*/, res.status(400).json({ errors: { friends: 'You cannot add yourself' } })];
                if (userFriend.friendRequestsRecieved.filter(function (u) { return u.username === friendtoAccept_1.username; }).length === 0 || friendtoAccept_1.friendRequestsSent.filter(function (u) { return u.username === user_2.username; }).length === 0)
                    return [2 /*return*/, res.status(400).json({ errors: { friendRequestRecieved: "You haven't recieved a friend request from this user" } })];
                userFriend.friendRequestsRecieved = userFriend.friendRequestsRecieved.filter(function (reqSent) {
                    return reqSent.userId !== friendtoAccept_1.user;
                });
                friendtoAccept_1.friendRequestsSent = friendtoAccept_1.friendRequestsSent.filter(function (reqRecieve) {
                    return reqRecieve.userId !== user_2.id;
                });
                if (!(Boolean(req.body.accept) === true)) return [3 /*break*/, 6];
                userFriend.friends.push({ userId: friendtoAccept_1.user, username: friendtoAccept_1.username });
                friendtoAccept_1.friends.push({ userId: user_2.id, username: user_2.username });
                return [4 /*yield*/, friendtoAccept_1.save()];
            case 4:
                _b.sent();
                return [4 /*yield*/, userFriend.save()];
            case 5:
                _b.sent();
                return [2 /*return*/, res.json({ success: true, msg: "You sucessfully accepted " + req.body.username + "'s friend request" })];
            case 6: return [4 /*yield*/, friendtoAccept_1.save()];
            case 7:
                _b.sent();
                return [4 /*yield*/, userFriend.save()];
            case 8:
                _b.sent();
                return [2 /*return*/, res.json({ success: true, msg: "You sucessfully denied " + req.body.username + "'s friend request" })];
            case 9:
                err_3 = _b.sent();
                console.error(err_3.message);
                res.status(500).json({ errors: { server: 'Server error' } });
                return [3 /*break*/, 10];
            case 10: return [2 /*return*/];
        }
    });
}); });
// @route    POST api/friends/unfriend
// @desc     unfriend user
// @access   Private
router.post('/unfriend', auth_1.default, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, errors, isValid, user_3, userFriend, friendtoUnfriend_1, err_4;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = friendRequest_1.default(req.body), errors = _a.errors, isValid = _a.isValid;
                if (!isValid) {
                    return [2 /*return*/, res.status(400).json(errors)];
                }
                _b.label = 1;
            case 1:
                _b.trys.push([1, 6, , 7]);
                user_3 = req.user;
                return [4 /*yield*/, Profile_1.default.findOne({ user: user_3.id })];
            case 2:
                userFriend = _b.sent();
                if (!userFriend) {
                    return [2 /*return*/, res.status(400).json({ errors: { friends: "You do not have a Profile yet" } })];
                }
                return [4 /*yield*/, Profile_1.default.findOne({ username: req.body.username })];
            case 3:
                friendtoUnfriend_1 = _b.sent();
                if (!friendtoUnfriend_1)
                    return [2 /*return*/, res.status(400).json({ errors: { friends: 'We could not find the friend you wanted to unfriend' } })];
                if (friendtoUnfriend_1.username === user_3.username)
                    return [2 /*return*/, res.status(400).json({ errors: { friends: 'You cannot unfriend yourself' } })];
                if (friendtoUnfriend_1.friends.filter(function (u) { return u.username === user_3.username; }).length === 0 || userFriend.friends.filter(function (u) { return u.username === friendtoUnfriend_1.username; }).length === 0) {
                    return [2 /*return*/, res.status(400).json({ errors: { friends: "You are not friends with this user" } })];
                }
                userFriend.friends = userFriend.friends.filter(function (friend) {
                    return friend.userId !== friendtoUnfriend_1.user;
                });
                friendtoUnfriend_1.friends = friendtoUnfriend_1.friends.filter(function (friend) {
                    return friend.userId !== user_3.id;
                });
                return [4 /*yield*/, friendtoUnfriend_1.save()];
            case 4:
                _b.sent();
                return [4 /*yield*/, userFriend.save()];
            case 5:
                _b.sent();
                return [2 /*return*/, res.json({ success: true, msg: "You have sucessfully unfriended this user" })];
            case 6:
                err_4 = _b.sent();
                console.error(err_4.message);
                res.status(500).json({ errors: { server: 'Server error' } });
                return [3 /*break*/, 7];
            case 7: return [2 /*return*/];
        }
    });
}); });
exports.default = router;
