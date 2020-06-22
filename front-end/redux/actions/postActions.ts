import { Dispatch } from "redux";
// import { setAlert } from './alert';
import {
  GET_POSTS,
  DELETE_POST,
  ADD_POST,
  GET_POST,
  GET_ERRORS,
} from './types';
import axios from "axios";
import { PostType } from "../../@types/customType";
import Router from 'next/router'
import host from "../../vars"

// Get posts
export const getPosts = () => async (dispatch:Dispatch) => {
  try {
    const res = await axios.get(`${host}/api/posts`);

    dispatch({
      type: GET_POSTS,
      payload: res.data
    });
  } catch (err) {
    dispatch({
      type: GET_ERRORS,
      payload: err.response.data
    });
  }
};

// // Add like
// export const addLike = id => async dispatch => {
//   try {
//     const res = await api.put(`/posts/like/${id}`);

//     dispatch({
//       type: UPDATE_LIKES,
//       payload: { id, likes: res.data }
//     });
//   } catch (err) {
//     dispatch({
//       type: POST_ERROR,
//       payload: { msg: err.response.statusText, status: err.response.status }
//     });
//   }
// };

// // Remove like
// export const removeLike = id => async dispatch => {
//   try {
//     const res = await api.put(`/posts/unlike/${id}`);

//     dispatch({
//       type: UPDATE_LIKES,
//       payload: { id, likes: res.data }
//     });
//   } catch (err) {
//     dispatch({
//       type: POST_ERROR,
//       payload: { msg: err.response.statusText, status: err.response.status }
//     });
//   }
// };

// Delete post
export const deletePost = (id:string) => async (dispatch:Dispatch) => {
  try {
    await axios.delete(`${host}/api/posts/${id}`);

    Router.push("/explore")
  } catch (err) {
    dispatch({
      type: GET_ERRORS,
      payload: err.response.data
    });
  }
};

// Add post
export const addPost = (postData:PostType) => async (dispatch: Dispatch) => {
  try {
    const res = await axios.post(`${host}/api/posts`, postData);

    dispatch({
      type: ADD_POST,
      payload: res.data
    });
    dispatch({
        type: GET_ERRORS,
        payload: {}
      });
      Router.push(`/posts/${res.data._id}`)
  } catch (err) {
    dispatch({
      type: GET_ERRORS,
      payload: err.response.data
    });
  }
};
// Edit Post
export const editPost = (postData:PostType) => async (dispatch: Dispatch) => {
  try {
    const res = await axios.post(`${host}/api/posts/edit`, postData);
    dispatch({
        type: GET_ERRORS,
        payload: {}
      });
      Router.push(`/posts/${res.data._id}`);
  } catch (err) {
    dispatch({
      type: GET_ERRORS,
      payload: err.response.data
    });
  }
};

// Get post
export const getPost = (id:string) => async (dispatch:Dispatch) => {
  try {
    const res = await axios.get(`${host}/api/posts/${id}`);

    dispatch({
      type: GET_POST,
      payload: res.data
    });
  } catch (err) {
    dispatch({
      type: GET_ERRORS,
      payload: err.response.data
    });
  }
};

// // Add comment
// export const addComment = (postId, formData) => async dispatch => {
//   try {
//     const res = await api.post(`/posts/comment/${postId}`, formData);

//     dispatch({
//       type: ADD_COMMENT,
//       payload: res.data
//     });

//     dispatch(setAlert('Comment Added', 'success'));
//   } catch (err) {
//     dispatch({
//       type: POST_ERROR,
//       payload: { msg: err.response.statusText, status: err.response.status }
//     });
//   }
// };

// // Delete comment
// export const deleteComment = (postId, commentId) => async dispatch => {
//   try {
//     await api.delete(`/posts/comment/${postId}/${commentId}`);

//     dispatch({
//       type: REMOVE_COMMENT,
//       payload: commentId
//     });

//     dispatch(setAlert('Comment Removed', 'success'));
//   } catch (err) {
//     dispatch({
//       type: POST_ERROR,
//       payload: { msg: err.response.statusText, status: err.response.status }
//     });
//   }
// };
