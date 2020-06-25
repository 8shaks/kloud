"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = __importDefault(require("mongoose"));
// import { IUser } from './User'
var Schema = mongoose_1.default.Schema;
var ConversationSchema = new Schema({
    participants: [String],
    date: {
        type: Date,
        default: Date.now
    }
});
var Conversation = mongoose_1.default.model("conversations", ConversationSchema);
exports.default = Conversation;
