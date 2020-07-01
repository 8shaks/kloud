
import {
  GET_PROFILE,
  GET_PROFILES,
  LOADING_DONE,
  // PROFILE_ERROR,
  // UPDATE_PROFILE,
  GET_ERRORS,
  CLEAR_CURRENT_PROFILE,
  IS_LOADING,
} from './types';
import { Dispatch } from 'redux';
import axios from "axios";
import {ProfileType} from "../../@types/customType";
import host from "../../vars"

// Get current users profile
export const getCurrentProfile = () => async (dispatch:Dispatch) => {

  try {
    const res = await axios.get(`${host}/api/profile/me`);

    dispatch({
      type: GET_PROFILE,
      payload: res.data
    });
    // dispatch({type: LOADING_DONE});
  } catch (err) {
    if(err.response){
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data.errors
      })
    }else alert("There was a server error, please try again later")
  }
};

// CLear Profile
export const clearProfile = () => async (dispatch:Dispatch) => {
  dispatch({ type: CLEAR_CURRENT_PROFILE });
};



// // Get all profiles
// export const getProfiles = () => async dispatch => {
//   dispatch({ type: CLEAR_PROFILE });

//   try {
//     const res = await api.get('/profile');

//     dispatch({
//       type: GET_PROFILES,
//       payload: res.data
//     });
//   } catch (err) {
//     dispatch({
//       type: PROFILE_ERROR,
//       payload: { msg: err.response.statusText, status: err.response.status }
//     });
//   }
// };

// Get profile by ID
export const getProfileById = (userId:string) => async (dispatch:Dispatch) => {
  // dispatch({type:IS_LOADING})
  try {
    const res = await axios.get(`${host}/api/profile/user/${userId}`);
    dispatch({
      type: GET_PROFILE,
      payload: res.data
    });
  } catch (err) {
    if(err.response){
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data.errors
      })
    }else alert("There was a server error, please try again later")
  }
  dispatch({type:LOADING_DONE})
};

// Get profile by username
export const getProfileByUsername = (username:string) => async (dispatch:Dispatch) => {
  try {
    const res = await axios.get(`${host}/api/profile/username/${username}`);
    dispatch({
      type: GET_PROFILE,
      payload: res.data
    });
  } catch (err) {
    if(err.response){
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data.errors
      })
    }else alert("There was a server error, please try again later")
  }
  dispatch({type:LOADING_DONE})
};


// Create or update profile
export const createProfile = (formData:ProfileType) => async (dispatch:Dispatch) => {
  try {
    const res = await axios.post(`${host}/api/profile`, formData);

    dispatch({
      type: GET_PROFILE,
      payload: res.data
    });
  } catch (err) {
    if(err.response){
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data.errors
      })
    }else alert("There was a server error, please try again later")
  }
};


// send or cancelfriend request
export const sendFriendReq = (username:string) => async (dispatch:Dispatch) => {
  try {
    const res = await axios.post(`${host}/api/friends/send_req`, {username});
    if(res.data.success) window.location.reload();
    // dispatch({
    //   type: GET_PROFILE,
    //   payload: res.data
    // });
  } catch (err) {
    if(err.response){
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data.errors
      })
    }else alert("There was a server error, please try again later")
  }
};


// change friend req status
export const changeFriendReqStatus = (friendReq:{username:string, accept:boolean}) => async (dispatch:Dispatch) => {
  try {
    const res = await axios.post(`${host}/api/friends/status`, friendReq);
    if(res.data.success) window.location.reload();
    // dispatch({
    //   type: GET_PROFILE,
    //   payload: res.data
    // });
  } catch (err) {
    if(err.response){
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data.errors
      })
    }else alert("There was a server error, please try again later")
  }
};

// unfriend User
export const unfriendUser = (username:string) => async (dispatch:Dispatch) => {
  try {
    const res = await axios.post(`${host}/api/friends/unfriend`, {username:username});
    if(res.data.success) window.location.reload();
    // dispatch({
    //   type: GET_PROFILE,
    //   payload: res.data
    // });
  } catch (err) {
    if(err.response){
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data.errors
      })
    }else alert("There was a server error, please try again later")
  }
};


// change Collab req status
export const changeCollabRecStatus = (collabReq:{username:string, accept:boolean}) => async (dispatch:Dispatch) => {
  try {
    const res = await axios.post(`${host}/api/collabs/status`, collabReq);
    if(res.data.success) window.location.reload();
    // dispatch({
    //   type: GET_PROFILE,
    //   payload: res.data
    // });
  } catch (err) {
    if(err.response){
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data.errors
      })
    }else alert("There was a server error, please try again later")
  }
};
//send collab req
export const sendCollabReq = (username:string, title:string, description:string) => async (dispatch:Dispatch) => {
  try {
    const res = await axios.post(`${host}/api/collabs/send_req`, {username, title, description});
    if(res.data.success) window.location.reload();
    // dispatch({
    //   type: GET_PROFILE,
    //   payload: res.data
    // });
  } catch (err) {
    if(err.response){
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data.errors
      })
    }else alert("There was a server error, please try again later")
  }
};