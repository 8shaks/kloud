"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = __importDefault(require("mongoose"));
// import { IUser } from './User'
var Schema = mongoose_1.default.Schema;
var MessageSchema = new Schema({
    sender: {
        required: true,
        type: String
    },
    content: {
        required: true,
        type: String
    },
    conversationId: {
        required: true,
        type: String
    },
    date: {
        type: Date,
        default: Date.now
    },
    read: {
        required: true,
        type: Boolean
    }
});
var Message = mongoose_1.default.model("messages", MessageSchema);
exports.default = Message;
