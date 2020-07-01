"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = __importDefault(require("mongoose"));
// import { IUser } from './User'
var Schema = mongoose_1.default.Schema;
var CollabSchema = new Schema({
    user1: {
        user: {
            type: String,
            required: true
        },
        username: {
            type: String,
            required: true
        }
    },
    user2: {
        user: {
            type: String,
            required: true
        },
        username: {
            type: String,
            required: true
        }
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    conversation: {
        type: String,
        required: true
    },
    files: [{
            fileName: { type: String, required: true },
            fileKey: { type: String, required: true },
            data: { type: Date, default: Date.now }
        }],
    date: {
        type: Date,
        default: Date.now
    }
});
var Collab = mongoose_1.default.model("collab", CollabSchema);
exports.default = Collab;
