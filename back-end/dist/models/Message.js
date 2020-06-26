"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = __importDefault(require("mongoose"));
// import { IUser } from './User'
var Schema = mongoose_1.default.Schema;
var MessageSchema = new Schema({
    sender: String,
    content: String,
    conversationId: String,
    files: [{ file: String, fileName: String }],
    date: {
        type: Date,
        default: Date.now
    }
});
var Message = mongoose_1.default.model("messages", MessageSchema);
exports.default = Message;
