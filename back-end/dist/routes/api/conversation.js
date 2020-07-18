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
var Message_1 = __importDefault(require("../../models/Message"));
var multer = require("multer");
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
// function getMyConvos(profile:IProfile):Promise<any>{
//   return new Promise<IConversation[]>((resolve, reject) => {
//     let myConversations:IConversation[] = [];
//     if (profile.conversations.length === 0)  resolve(myConversations) 
//     profile!.conversations.forEach(async (conversationUserObj) => {
//       let conversation = await Conversation.findById(conversationUserObj.conversationId);
//       if (conversation) myConversations.push(conversation);
//       if (myConversations.length === profile!.conversations.length){
//         resolve(myConversations.sort((a, b) => { return new Date(b.date).getTime() - new Date(a.date).getTime()}));
//       }
//     });
//   });
// }
// router.get('/myconvos', auth, async (req, res) => {
//   if( !req.user ) return res.status(400).json({errors: { user: 'Invalid User' }});
//   try {
//     const profile = await Profile.findOne({user:req.user.id});
//     if(!profile) return res.status(400).json({errors: { profile: 'Cannot find your profile' }});
//     getMyConvos(profile).then((myConversations)=>{
//       return res.json(myConversations)
//     })
//   } catch (err) {
//     console.error(err.message);
//     res.status(500).send('Server Error');
//   }
// });
// // @route    GET api/messages/:id
// // @desc     Get all a conversation's messages
// // @access   Private
// // const testFunc = (msg:IMessage, element:any, i:any) => {
// //   return new Promise<any>((resolve, reject) => {
// //     getFile(element).then((el)=>{
// //       msg.files[i] = {file: el, fileName:msg.files[i].fileName};
// //       return resolve(true)
// //      })
// //   });
// // }
router.get('/messages/:id', auth_1.default, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var messages, err_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!req.user)
                    return [2 /*return*/, res.status(400).json({ errors: { user: 'Invalid User' } })];
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, Message_1.default.find({ conversationId: req.params.id }).sort({ date: 1 })];
            case 2:
                messages = _a.sent();
                return [2 /*return*/, res.json({ messages: messages })];
            case 3:
                err_1 = _a.sent();
                console.error(err_1.message);
                res.status(500).send('Server Error');
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
router.get('/lastMessage/:conversationId', auth_1.default, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var message, err_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!req.user)
                    return [2 /*return*/, res.status(400).json({ errors: { user: 'Invalid User' } })];
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, Message_1.default.find({ conversationId: req.params.conversationId }).limit(1).sort({ date: 1 })];
            case 2:
                message = _a.sent();
                return [2 /*return*/, res.json({ message: message })];
            case 3:
                err_2 = _a.sent();
                console.error(err_2.message);
                res.status(500).send('Server Error');
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
router.post("/changeMessageStatus", auth_1.default, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var message, err_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!req.user)
                    return [2 /*return*/, res.status(400).json({ errors: { user: 'Invalid User' } })];
                _a.label = 1;
            case 1:
                _a.trys.push([1, 4, , 5]);
                return [4 /*yield*/, Message_1.default.findById(req.body.message._id)];
            case 2:
                message = _a.sent();
                if (!message)
                    return [2 /*return*/, res.status(404).json({ errors: { message: 'Message not found' } })];
                message.read = true;
                return [4 /*yield*/, message.save()];
            case 3:
                _a.sent();
                return [2 /*return*/, res.json({ message: message })];
            case 4:
                err_3 = _a.sent();
                console.error(err_3.message);
                res.status(500).send('Server Error');
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); });
// // MAKE A FILE UPLOAD ENDPOINT
// const upload = multer({
//   storage: storage,
//   limits: { fileSize: 1000000 },
//   fileFilter: function(req:any, file:any, cb:() => void) {
//     checkFileType(file, cb);
//   }
// });
// router.post(
//   "/upload", upload.single("image"), (req, res) => {
//     let file = {};
//     return res.json({success})
//     console.log("success")
//   }
// );
// @route    POST api/messages/file/:id
// @desc     Get download link for file
// @access   Private
// router.post('/file', auth, async  (req, res) => {
//   if( !req.user ) return res.status(400).json({errors: { user: 'Invalid User' }});
//   if( typeof req.body.conversationId !== 'string' || typeof req.body.fileLoc !== "string" ) return res.status(400).json({errors: { conversation: 'Invalid request' }});
//   try {
//     const profile = await Profile.findOne({user:req.user.id});
//     if (!profile) return res.status(400).json({errors: { profile: 'Could not find your profile' }});
//     if(profile.conversations.filter(c => c.conversationId === req.body.conversationId).length === 0 ) return res.status(400).json({errors: { conversation: "No matching conversation"}});
//     getFile(req.body.fileLoc).then((el)=>{
//       res.setHeader('content-type', 'application/octet-stream')
//       res.setHeader('content-disposition', "test.mp3")
//       return res.send(el)
//      }).catch((err) => {
//         console.log(err)
//         return res.status(500).json({errors: { server: "There was a server error"}})
//      })
//   } catch (err) {
//     console.error(err.message);
//     res.status(500).send('Server Error');
//   }
// });
exports.default = router;
