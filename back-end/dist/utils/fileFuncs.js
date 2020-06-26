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
exports.getFile = exports.uploadFile = void 0;
var fs = require('fs');
var AWS = require('aws-sdk');
var s3 = new AWS.S3({
    accessKeyId: "AKIAJH52AAB5XEIEZQXQ",
    secretAccessKey: "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"
});
var kms = new AWS.KMS({ apiVersion: '2014-11-01' });
exports.uploadFile = function (files, conversationdId, messageId) {
    return new Promise(function (resolve, reject) {
        var fileData = [];
        files.forEach(function (file, i) {
            var params = {
                Bucket: 'kloud-storage',
                Key: "conversations/" + conversationdId + "/" + messageId + "/" + file.name.trim().replace(" ", "_"),
                Body: JSON.stringify(file, null, 2)
            };
            s3.upload(params, function (s3Err, data) {
                if (s3Err)
                    throw s3Err;
                fileData.push(data);
            });
            if (i === files.length - 1)
                resolve(fileData);
        });
    });
};
function encode(data) {
    var str = data.reduce(function (a, b) { return a + String.fromCharCode(b); }, '');
    return Buffer.from(str, 'base64').toString().replace(/.{76}(?=.)/g, '$&\n');
}
exports.getFile = function (fileLoc) {
    // console.log(fileLoc)
    return new Promise(function (resolve, reject) {
        var getParams = {
            Bucket: 'kloud-storage',
            Key: fileLoc.file // path to the object you're looking for
        };
        s3.getObject(getParams, function (err, data) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    // Handle any error and exit
                    if (err) {
                        console.log(err);
                        reject(err);
                    }
                    // data.url = await "data:audio/mp4;base64," + encode(data.Body);
                    // resolve(data.Body.toString('utf-8'));
                    resolve(data);
                    return [2 /*return*/];
                });
            });
        });
    });
};
