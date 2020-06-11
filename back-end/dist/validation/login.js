"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var Validator = require("validator");
var is_empty_1 = __importDefault(require("./is-empty"));
function validateLoginInput(data) {
    var errors = {};
    data.username = !is_empty_1.default(data.username) ? data.username : "";
    data.password = !is_empty_1.default(data.password) ? data.password : "";
    if (Validator.isEmpty(data.username)) {
        errors.username = "Username is required";
    }
    if (Validator.isEmpty(data.password)) {
        errors.password = "Password is required";
    }
    return {
        errors: errors,
        isValid: is_empty_1.default(errors)
    };
}
exports.default = validateLoginInput;
;
