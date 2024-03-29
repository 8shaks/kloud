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
var profile_1 = __importDefault(require("../../validation/profile"));
var Profile_1 = __importDefault(require("../../models/Profile"));
// @route    GET api/profile
// @desc     Get all profiles
// @access   Public
router.get('/', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var profiles, err_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, Profile_1.default.find().sort({ date: -1 })];
            case 1:
                profiles = _a.sent();
                return [2 /*return*/, res.json(profiles)];
            case 2:
                err_1 = _a.sent();
                console.error(err_1.message);
                return [2 /*return*/, res.status(500).json({ errors: { server: 'Server error' } })];
            case 3: return [2 /*return*/];
        }
    });
}); });
// @route    GET api/profile/me
// @desc     Get current users profile
// @access   Private
router.get('/me', auth_1.default, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var user, profile, err_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                user = req.user;
                return [4 /*yield*/, Profile_1.default.findOne({ user: user.id })];
            case 1:
                profile = _a.sent();
                if (!profile) {
                    return [2 /*return*/, res.status(400).json({ errors: { profile: 'There is no profile for this user' } })];
                }
                // only populate from user document if profile exists
                return [2 /*return*/, res.json(profile)
                    // res.json(profile.populate('user'));
                ];
            case 2:
                err_2 = _a.sent();
                console.error(err_2.message);
                return [2 /*return*/, res.status(500).json({ errors: { server: 'Server error' } })];
            case 3: return [2 /*return*/];
        }
    });
}); });
// @route    POST api/profile
// @desc     Create or update user profile
// @access   Private
router.post('/', auth_1.default, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var user, _a, bio, social, credits, friendRequestsRecieved, friendRequestsSent, profileFields, _b, errors, isValid, profile, err_3;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                if (!req.user)
                    return [2 /*return*/, res.status(400).json({ errors: { user: 'Invalid User' } })];
                user = req.user;
                _a = req.body, bio = _a.bio, social = _a.social, credits = _a.credits, friendRequestsRecieved = _a.friendRequestsRecieved, friendRequestsSent = _a.friendRequestsSent;
                profileFields = {
                    user: user.id,
                    username: user.username,
                    bio: bio,
                    credits: credits,
                    social: social,
                    friendRequestsRecieved: friendRequestsRecieved,
                    friendRequestsSent: friendRequestsSent
                };
                _b = profile_1.default(profileFields), errors = _b.errors, isValid = _b.isValid;
                if (!isValid) {
                    return [2 /*return*/, res.status(400).json(errors)];
                }
                _c.label = 1;
            case 1:
                _c.trys.push([1, 3, , 4]);
                return [4 /*yield*/, Profile_1.default.findOneAndUpdate({ user: req.user.id }, { $set: profileFields }, { new: true, upsert: true })];
            case 2:
                profile = _c.sent();
                res.json(profile);
                return [3 /*break*/, 4];
            case 3:
                err_3 = _c.sent();
                console.error(err_3.message);
                res.status(500).send('Server Error');
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
// @route    GET api/profile/user/:user_id
// @desc     Get profile by user ID
// @access   Public
router.get('/user/:id', function (_a, res) {
    var id = _a.params.id;
    return __awaiter(void 0, void 0, void 0, function () {
        var profile, err_4;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, Profile_1.default.findOne({ user: id })];
                case 1:
                    profile = _b.sent();
                    if (!profile)
                        return [2 /*return*/, res.status(404).json({ msg: 'Profile not found' })];
                    return [2 /*return*/, res.json(profile)];
                case 2:
                    err_4 = _b.sent();
                    console.error(err_4.message);
                    return [2 /*return*/, res.status(500).json({ msg: 'Server error' })];
                case 3: return [2 /*return*/];
            }
        });
    });
});
// @route    GET api/profile/user/:username
// @desc     Get profile by username
// @access   Public
router.get('/username/:username', function (_a, res) {
    var username = _a.params.username;
    return __awaiter(void 0, void 0, void 0, function () {
        var profile, err_5;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, Profile_1.default.findOne({ username: username })];
                case 1:
                    profile = _b.sent();
                    if (!profile)
                        return [2 /*return*/, res.status(404).json({ msg: 'Profile not found' })];
                    return [2 /*return*/, res.json(profile)];
                case 2:
                    err_5 = _b.sent();
                    console.error(err_5.message);
                    return [2 /*return*/, res.status(500).json({ msg: 'Server error' })];
                case 3: return [2 /*return*/];
            }
        });
    });
});
// // @route    DELETE api/profile
// // @desc     Delete profile, user & posts
// // @access   Private
// router.delete('/', auth, async (req, res) => {
//   try {
//     // Remove user posts
//     await Post.deleteMany({ user: req.user.id });
//     // Remove profile
//     await Profile.findOneAndRemove({ user: req.user.id });
//     // Remove user
//     await User.findOneAndRemove({ _id: req.user.id });
//     res.json({ msg: 'User deleted' });
//   } catch (err) {
//     console.error(err.message);
//     res.status(500).send('Server Error');
//   }
// });
exports.default = router;
