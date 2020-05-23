"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var Validator = require("validator");
var is_empty_1 = __importDefault(require("./is-empty"));
var normalize = require('normalize-url');
var youtubeRegex = new RegExp(/^(https?\:\/\/)?(www\.)?(youtube\.com|youtu\.?be)\/.+$/);
function validateProfileInput(data) {
    var _a;
    var isValid = true;
    var errors = {};
    if (data.social) {
        is_empty_1.default(data.social.youtube) ? data.social.youtube === '' : data.social.youtube = normalize(data.social.youtube, { forceHttps: true });
        is_empty_1.default(data.social.facebook) ? data.social.facebook === '' : data.social.facebook = normalize(data.social.facebook, { forceHttps: true });
        is_empty_1.default(data.social.twitter) ? data.social.twitter === '' : data.social.twitter = normalize(data.social.twitter, { forceHttps: true });
        is_empty_1.default(data.social.instagram) ? data.social.instagram === '' : data.social.instagram = normalize(data.social.instagram, { forceHttps: true });
    }
    is_empty_1.default(data.bio) ? data.bio === '' : data.bio;
    if (data.bio) {
        if (((_a = data.bio) === null || _a === void 0 ? void 0 : _a.length) > 200 && data.bio) {
            errors.bio = "Please enter a bio below 200 characters";
        }
    }
    return {
        errors: errors,
        isValid: is_empty_1.default(errors)
    };
}
exports.default = validateProfileInput;
