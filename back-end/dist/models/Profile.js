"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = __importDefault(require("mongoose"));
// import { IUser } from './User'
var Schema = mongoose_1.default.Schema;
var ProfileSchema = new Schema({
    user: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    bio: {
        type: String
    },
    social: {
        youtube: {
            type: String
        },
        twitter: {
            type: String
        },
        beatstars: {
            type: String
        },
        instagram: {
            type: String
        },
        soundcloud: {
            type: String
        }
    },
    posts: [String],
    collabs: [{ collabId: { required: true, type: String }, username: { required: true, type: String } }],
    credits: [String],
    friends: [{
            userId: {
                type: String,
                required: true
            },
            username: {
                type: String,
                required: true
            },
            date: {
                type: Date,
                default: Date.now
            }
        }],
    friendRequestsRecieved: [{ userId: String, username: String, date: { type: Date, default: Date.now } }],
    friendRequestsSent: [{ userId: String, username: String, date: { type: Date, default: Date.now } }],
    collabRequestsRecieved: [{ userId: String, username: String, title: String, description: String, date: Date }],
    collabRequestsSent: [{ userId: String, username: String, title: String, description: String, date: Date }],
    conversations: [{ date: { type: Date, default: Date.now }, conversationId: String, username: String }],
    // collabs: [{
    //   userId:{
    //     type:String,
    //     required:true
    //   },
    //   username:{
    //     type:String,
    //     required:true
    //   },
    //   date: {
    //       type: Date,
    //       default: Date.now
    //     }
    // }],
    // collabRequestsRecieved:[{userId: String, username: String }],
    // collabRequestsSent:[{userId: String, username: String }],
    date: {
        type: Date,
        default: Date.now
    }
});
var Profile = mongoose_1.default.model("profile", ProfileSchema);
exports.default = Profile;
