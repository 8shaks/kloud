"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var Validator = require("validator");
var is_empty_1 = __importDefault(require("./is-empty"));
function validateFriendRequest(data) {
    var errors = {};
    data.username = !is_empty_1.default(data.username) || typeof data.username !== 'string' ? data.username : "";
    if (Validator.isEmpty(data.username)) {
        errors.username = "Please add a valid user";
    }
    return {
        errors: errors,
        isValid: is_empty_1.default(errors)
    };
}
exports.default = validateFriendRequest;
;
