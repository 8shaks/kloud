"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var Validator = require("validator");
var is_empty_1 = __importDefault(require("./is-empty"));
var normalize = require('normalize-url');
var urlRegex = new RegExp(/^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/);
function validateProfileInput(data) {
    var _a;
    var errors = {};
    if (data.social) {
        is_empty_1.default(data.social.youtube) ? data.social.youtube === '' : data.social.youtube = normalize(data.social.youtube, { forceHttps: true });
        is_empty_1.default(data.social.beatstars) ? data.social.beatstars === '' : data.social.beatstars = normalize(data.social.beatstars, { forceHttps: true });
        is_empty_1.default(data.social.twitter) ? data.social.twitter === '' : data.social.twitter = normalize(data.social.twitter, { forceHttps: true });
        is_empty_1.default(data.social.instagram) ? data.social.instagram === '' : data.social.instagram = normalize(data.social.instagram, { forceHttps: true });
        is_empty_1.default(data.social.soundcloud) ? data.social.soundcloud === '' : data.social.soundcloud = normalize(data.social.soundcloud, { forceHttps: true });
        if (data.social.youtube && data.social.youtube.length === 0) {
            !urlRegex.test(data.social.youtube) ? errors.social.youtube = "Please enter a valid youtube url" : null;
        }
        if (data.social.twitter && data.social.twitter.length === 0) {
            !urlRegex.test(data.social.twitter) ? errors.social.twitter = "Please enter a valid twitter url" : null;
        }
        if (data.social.soundcloud && data.social.soundcloud.length === 0) {
            !urlRegex.test(data.social.soundcloud) ? errors.social.soundcloud = "Please enter a valid soundcloud url" : null;
        }
        if (data.social.beatstars && data.social.beatstars.length === 0) {
            !urlRegex.test(data.social.beatstars) ? errors.social.beatstars = "Please enter a valid beatstars url" : null;
        }
        if (data.social.instagram && data.social.instagram.length === 0) {
            !urlRegex.test(data.social.instagram) ? errors.social.instagram = "Please enter a valid instagram url" : null;
        }
    }
    is_empty_1.default(data.bio) ? data.bio === '' : data.bio;
    if (data.bio) {
        if (((_a = data.bio) === null || _a === void 0 ? void 0 : _a.length) > 200) {
            errors.bio = "Please enter a bio below 200 characters";
        }
    }
    return {
        errors: errors,
        isValid: is_empty_1.default(errors)
    };
}
exports.default = validateProfileInput;
