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
        facebook: {
            type: String
        },
        instagram: {
            type: String
        }
    },
    credits: [String],
    friends: [{
            id: {
                type: String,
                required: true
            },
            username: {
                type: String,
                required: true
            }
        }],
    friendRequestsRecieved: [{
            id: {
                type: String,
                required: true
            },
            username: {
                type: String,
                required: true
            }
        }],
    friendRequestsSent: [{
            id: {
                type: String,
                required: true
            },
            username: {
                type: String,
                required: true
            }
        }],
    // notifications:[{
    //   type:String,
    // }],
    date: {
        type: Date,
        default: Date.now
    }
});
var Profile = mongoose_1.default.model("profile", ProfileSchema);
exports.default = Profile;
