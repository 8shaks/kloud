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
var Conversation_1 = __importDefault(require("../../models/Conversation"));
var Profile_1 = __importDefault(require("../../models/Profile"));
var Message_1 = __importDefault(require("../../models/Message"));
var fileFuncs_1 = require("../../utils/fileFuncs");
// const { keys } = require("../../config/keys");
// const fs = require('fs');
// const AWS = require('aws-sdk');
// const s3 = new AWS.S3({
//   accessKeyId: keys.accessKeyId,
//   secretAccessKey: keys.secretAccessKey
// });
// @route    GET api/my convos
// @desc     Get all a users conversations
// @access   Private
function getMyConvos(profile) {
    var _this = this;
    return new Promise(function (resolve, reject) {
        var myConversations = [];
        if (profile.conversations.length === 0)
            resolve(myConversations);
        profile.conversations.forEach(function (conversationUserObj) { return __awaiter(_this, void 0, void 0, function () {
            var conversation;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, Conversation_1.default.findById(conversationUserObj.conversationId)];
                    case 1:
                        conversation = _a.sent();
                        if (conversation)
                            myConversations.push(conversation);
                        if (myConversations.length === profile.conversations.length) {
                            resolve(myConversations.sort(function (a, b) { return new Date(b.date).getTime() - new Date(a.date).getTime(); }));
                        }
                        return [2 /*return*/];
                }
            });
        }); });
    });
}
router.get('/myconvos', auth_1.default, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
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
                getMyConvos(profile).then(function (myConversations) {
                    return res.json(myConversations);
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
// @route    GET api/messages/:id
// @desc     Get all a conversation's messages
// @access   Private
var testFunc = function (msg, element, i) {
    return new Promise(function (resolve, reject) {
        console.log(element);
        fileFuncs_1.getFile(element).then(function (el) {
            msg.files[i] = { file: el, fileName: msg.files[i].fileName };
            // console.log(el)
            return resolve(true);
        });
    });
};
router.get('/messages/:id', auth_1.default, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var messages, j, i, err_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!req.user)
                    return [2 /*return*/, res.status(400).json({ errors: { user: 'Invalid User' } })];
                _a.label = 1;
            case 1:
                _a.trys.push([1, 10, , 11]);
                return [4 /*yield*/, Message_1.default.find({ conversationId: req.params.id }).sort({ date: 1 })];
            case 2:
                messages = _a.sent();
                // HAVE TO PUT THIS BLOCK INTO A PROMISE
                // if(messages.length === 0) return res.status(400).json({errors: { conversation: 'Cannot find your Conversation' }});
                console.log(messages);
                j = 0;
                _a.label = 3;
            case 3:
                if (!(j < messages.length)) return [3 /*break*/, 9];
                i = 0;
                _a.label = 4;
            case 4:
                if (!(i < messages[j].files.length)) return [3 /*break*/, 7];
                // console.log("yo")
                return [4 /*yield*/, testFunc(messages[j], messages[j].files[i], i)
                    // if( j === messages.length-1){
                    //   return res.json({messages})
                    // }
                ];
            case 5:
                // console.log("yo")
                _a.sent();
                // if( j === messages.length-1){
                //   return res.json({messages})
                // }
                if (j === messages.length - 1) {
                    console.log("yo");
                    return [2 /*return*/, res.json({ messages: messages })];
                }
                _a.label = 6;
            case 6:
                i++;
                return [3 /*break*/, 4];
            case 7:
                if (j === messages.length - 1) {
                    console.log("yo");
                    return [2 /*return*/, res.json({ messages: messages })];
                }
                _a.label = 8;
            case 8:
                j++;
                return [3 /*break*/, 3];
            case 9: return [3 /*break*/, 11];
            case 10:
                err_2 = _a.sent();
                console.error(err_2.message);
                res.status(500).send('Server Error');
                return [3 /*break*/, 11];
            case 11: return [2 /*return*/];
        }
    });
}); });
exports.default = router;