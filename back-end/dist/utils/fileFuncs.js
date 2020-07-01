"use strict";
// const { keys } = require("../../config/keys")
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFile = exports.uploadFile = exports.checkFileType = exports.storage = void 0;
var aws = require("aws-sdk");
var multer = require("multer");
var multerS3 = require("multer-s3");
var keys = require("../config/keys");
var path = require("path");
var s3 = new aws.S3({
    signatureVersion: 'v4',
    accessKeyId: keys.accessKeyId,
    secretAccessKey: keys.secretAccessKey,
    region: 'us-east-2'
});
// var kms = new AWS.KMS({apiVersion: '2014-11-01'});
//IMAGE UPLOAD
// aws.config.update({
//   // Your SECRET ACCESS KEY from AWS should go here,
//   // Never share it!
//   // Setup Env Variable, e.g: process.env.SECRET_ACCESS_KEY
//   secretAccessKey: "Kud+HU5kEzRFvXj5LKrur9E1ANUuo/ThHa+K5H9I",
//   // Not working key, Your ACCESS KEY ID from AWS should go here,
//   // Never share it!
//   // Setup Env Variable, e.g: process.env.ACCESS_KEY_ID
//   accessKeyId: "AKIAJH52AAB5XEIEZQXQ",
//   region: "us-east-2" // region of your bucket
// });
exports.storage = multerS3({
    s3: s3,
    bucket: "kloud-storage",
    acl: "public-read",
    metadata: function (req, file, cb) {
        cb(null, { fieldName: file.originalname });
    },
    key: function (req, file, cb) {
        // console.log(req)
        cb(null, req.params.collab_id + "/" + file.originalname);
    }
});
// Check File Type
function checkFileType(file, cb) {
    // Allowed ext
    var filetypes = /mp3|mpeg/;
    // Check ext
    var extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    // Check mime
    var mimetype = filetypes.test(file.mimetype);
    if (mimetype && extname) {
        return cb(null, true);
    }
    else {
        cb("Error: Audio Only!");
    }
}
exports.checkFileType = checkFileType;
// {
//   "Version": "2012-10-17",
//   "Statement": [
//       {
//           "Sid": "VisualEditor0",
//           "Effect": "Allow",
//           "Action": [
//               "s3:PutObject",
//               "s3:PutObjectAcl"
//           ],
//           "Resource": "arn:aws:s3:::kloud-storage/*",
//           "Principal": "*"
//       }
//   ]
// }
exports.uploadFile = function (file, collabId) {
    console.log(keys);
    return new Promise(function (resolve, reject) {
        // let fileData:any = []
        // for( let i = 0; i< files.length; i++){
        //     // console.log(files[i])
        //     const j = Buffer.from(files[i])
        var params = {
            Bucket: 'kloud-storage',
            Key: collabId + "/" + file.originalname,
            Body: file.buffer
        };
        //     s3.putObject(params, function(s3Err:any, data:any) {
        //         if (s3Err) throw s3Err;
        //        fileData.push(data);
        //     });
        //     if (i === files.length-1) resolve(fileData)
        // }
        // files.forEach((file, i) => {
        // const j = Buffer.from(files[i])
        // }) 
        s3.putObject(params, function (s3Err, data) {
            if (s3Err)
                throw s3Err;
            resolve(data);
            //  fileData.push(data);
        });
    });
};
function encode(data) {
    var str = data.reduce(function (a, b) { return a + String.fromCharCode(b); }, '');
    return Buffer.from(str, 'base64').toString().replace(/.{76}(?=.)/g, '$&\n');
}
exports.getFile = function (fileLoc) {
    return new Promise(function (resolve, reject) { return __awaiter(void 0, void 0, void 0, function () {
        var getParams, url;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    getParams = {
                        Bucket: 'kloud-storage',
                        Key: fileLoc,
                        Expires: 60 * 5
                    };
                    return [4 /*yield*/, s3.getSignedUrl('getObject', getParams)];
                case 1:
                    url = _a.sent();
                    return [2 /*return*/, resolve(url)];
            }
        });
    }); });
};
