"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var Validator = require("validator");
var is_empty_1 = __importDefault(require("./is-empty"));
function validateRegisterInput(data) {
    var errors = {};
    data.username = !is_empty_1.default(data.username) ? data.username : "";
    data.email = !is_empty_1.default(data.email) ? data.email : "";
    data.password = !is_empty_1.default(data.password) ? data.password : "";
    data.password2 = !is_empty_1.default(data.password2) ? data.password2 : "";
    if (!Validator.isLength(data.username, { min: 2, max: 30 })) {
        errors.username = "Username must be between 2 and 30 characters";
    }
    if (Validator.isEmpty(data.username)) {
        errors.username = "Username is required";
    }
    if (!Validator.isEmail(data.email)) {
        errors.email = "Email is not valid";
    }
    if (Validator.isEmpty(data.email)) {
        errors.email = "Email is required";
    }
    if (Validator.isEmpty(data.password)) {
        errors.password = "Password is required";
    }
    if (!Validator.isLength(data.password, { min: 6, max: 30 })) {
        errors.password = "Passowrd must be between 6 and 30 characters";
    }
    if (Validator.isEmpty(data.password2)) {
        errors.password2 = "Please confirm your password";
    }
    if (!Validator.equals(data.password, data.password2)) {
        errors.password2 = "Passwords must match";
    }
    return {
        errors: errors,
        isValid: is_empty_1.default(errors)
    };
}
exports.default = validateRegisterInput;
;
