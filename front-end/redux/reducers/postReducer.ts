import {
  ADD_POST,
  GET_POSTS,
  GET_POST,
  POST_LOADING,
  DELETE_POST
} from "../actions/types";
import { PostType } from "../../@types/customType"
let intialState:{ posts : PostType[] , post: PostType | {}} = {
  posts: [],
  post: {}
}

export default function(state = intialState, action:any) {
  switch (action.type) {
    case ADD_POST:
      return {
        ...state,
        posts: [action.payload, ...state.posts]
      };
    case GET_POSTS:
      return {
        ...state,
        posts: action.payload,
  
      };
    case GET_POST:
      return {
        ...state,
        post: action.payload,
  
      };
    case POST_LOADING:
      return {
        ...state,
        loading: true
      };

    case DELETE_POST:
      return {
        ...state
      };
    default:
      return state;
  }
}
