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
    var _a, _b, _c, _d;
    var isValid = true;
    var errors = {};
    is_empty_1.default(data.description) ? data.description === '' : data.description;
    is_empty_1.default(data.title) ? data.title === '' : data.title;
    if (data.description) {
        if (((_a = data.description) === null || _a === void 0 ? void 0 : _a.length) > 300 || ((_b = data.description) === null || _b === void 0 ? void 0 : _b.length) < 20) {
            errors.description = "Please enter a description below 300 characters";
        }
    }
    if (data.title) {
        if (((_c = data.title) === null || _c === void 0 ? void 0 : _c.length) > 100 || ((_d = data.title) === null || _d === void 0 ? void 0 : _d.length) < 10) {
            errors.title = "Please enter a title below 100 characters";
        }
    }
    return {
        errors: errors,
        isValid: is_empty_1.default(errors)
    };
}
exports.default = validateProfileInput;
