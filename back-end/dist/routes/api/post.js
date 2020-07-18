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
var post_1 = __importDefault(require("../../validation/post"));
var Profile_1 = __importDefault(require("../../models/Profile"));
var Post_1 = __importDefault(require("../../models/Post"));
// @route    POST api/posts
// @desc     Create a post
// @access   Private
router.post('/', auth_1.default, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, errors, isValid, newPost, profile, post, err_1;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                if (!req.user)
                    return [2 /*return*/, res.status(400).json({ errors: { user: 'Invalid User' } })];
                _a = post_1.default(req.body), errors = _a.errors, isValid = _a.isValid;
                if (!isValid) {
                    return [2 /*return*/, res.status(400).json(errors)];
                }
                _b.label = 1;
            case 1:
                _b.trys.push([1, 5, , 6]);
                newPost = new Post_1.default({
                    description: req.body.description,
                    title: req.body.title,
                    username: req.user.username,
                    genre: req.body.genre,
                    user: req.user.id
                });
                return [4 /*yield*/, Profile_1.default.findOne({ user: req.user.id })];
            case 2:
                profile = _b.sent();
                if (!profile)
                    return [2 /*return*/, res.status(400).json({ errors: { profile: 'Cannot find your profile' } })];
                profile === null || profile === void 0 ? void 0 : profile.posts.push(newPost._id);
                return [4 /*yield*/, (profile === null || profile === void 0 ? void 0 : profile.save())];
            case 3:
                _b.sent();
                return [4 /*yield*/, newPost.save()];
            case 4:
                post = _b.sent();
                console.log(post);
                res.json(post);
                return [3 /*break*/, 6];
            case 5:
                err_1 = _b.sent();
                console.error(err_1.message);
                res.status(500).send('Server Error');
                return [3 /*break*/, 6];
            case 6: return [2 /*return*/];
        }
    });
}); });
// @route    POST api/posts/edit
// @desc     edit a post
// @access   Private
router.post('/edit', auth_1.default, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, errors, isValid, newPost, post, err_2;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                if (!req.user)
                    return [2 /*return*/, res.status(400).json({ errors: { user: 'Invalid User' } })];
                _a = post_1.default(req.body), errors = _a.errors, isValid = _a.isValid;
                if (!isValid) {
                    return [2 /*return*/, res.status(400).json(errors)];
                }
                _b.label = 1;
            case 1:
                _b.trys.push([1, 4, , 5]);
                return [4 /*yield*/, Post_1.default.findOneAndUpdate({ _id: req.body.id }, { $set: { title: req.body.title, description: req.body.description, genre: req.body.genre, username: req.user.username, user: req.user.id } }, { new: true, upsert: true })];
            case 2:
                newPost = _b.sent();
                return [4 /*yield*/, newPost.save()];
            case 3:
                post = _b.sent();
                res.json(post);
                return [3 /*break*/, 5];
            case 4:
                err_2 = _b.sent();
                console.error(err_2.message);
                res.status(500).send('Server Error');
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); });
// @route    GET api/posts/user/[id]
// @desc     Get all posts for a user
// @access   Private
function getMyPosts(profile) {
    var _this = this;
    return new Promise(function (resolve, reject) {
        var myPosts = [];
        profile.posts.forEach(function (postId) { return __awaiter(_this, void 0, void 0, function () {
            var post;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, Post_1.default.findById(postId)];
                    case 1:
                        post = _a.sent();
                        if (post)
                            myPosts.push(post);
                        if (myPosts.length === profile.posts.length)
                            resolve(myPosts);
                        return [2 /*return*/];
                }
            });
        }); });
    });
}
router.get('/user/:id', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var profile, err_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, Profile_1.default.findOne({ user: req.params.id })];
            case 1:
                profile = _a.sent();
                if (!profile)
                    return [2 /*return*/, res.status(400).json({ errors: { profile: 'Cannot find your profile' } })];
                getMyPosts(profile).then(function (myPosts) {
                    return res.json(myPosts);
                });
                return [3 /*break*/, 3];
            case 2:
                err_3 = _a.sent();
                console.error(err_3.message);
                res.status(500).send('Server Error');
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
// @route    GET api/posts
// @desc     Get all posts
// @access   Private
router.get('/', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var posts, err_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, Post_1.default.find().sort({ date: -1 })];
            case 1:
                posts = _a.sent();
                res.json(posts);
                return [3 /*break*/, 3];
            case 2:
                err_4 = _a.sent();
                console.error(err_4.message);
                res.status(500).send('Server Error');
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
// @route    GET api/posts/:id
// @desc     Get post by ID
// @access   Private
router.get('/:id', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var post, err_5;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, Post_1.default.findById(req.params.id)];
            case 1:
                post = _a.sent();
                res.json(post);
                return [3 /*break*/, 3];
            case 2:
                err_5 = _a.sent();
                console.error(err_5.message);
                res.status(500).send('Server Error');
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
// @route    DELETE api/posts/:id
// @desc     Delete a post
// @access   Private
router.delete('/:id', auth_1.default, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var post, err_6;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!req.user)
                    return [2 /*return*/, res.status(400).json({ errors: { user: 'Invalid User' } })];
                _a.label = 1;
            case 1:
                _a.trys.push([1, 4, , 5]);
                return [4 /*yield*/, Post_1.default.findById(req.params.id)];
            case 2:
                post = _a.sent();
                if (!post)
                    return [2 /*return*/, res.status(400).json({ errors: { post: 'We coulc not find the post you wanted to delete' } })];
                // Check user
                if (post.user.toString() !== req.user.id) {
                    return [2 /*return*/, res.status(401).json({ msg: 'User not authorized' })];
                }
                return [4 /*yield*/, post.remove()];
            case 3:
                _a.sent();
                res.json({ msg: 'Post removed' });
                return [3 /*break*/, 5];
            case 4:
                err_6 = _a.sent();
                console.error(err_6.message);
                res.status(500).send('Server Error');
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); });
exports.default = router;
