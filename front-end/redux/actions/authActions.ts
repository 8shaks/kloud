import { GET_ERRORS, SET_CURRENT_USER, CLEAR_ERRORS } from "./types";
import axios from "axios";
import setAuthToken from "../../utils/setAuthToken";
import jwt_decode from "jwt-decode";
import { Dispatch } from "redux";
import Router from 'next/router'
import host from "../../vars"

interface userLogin {
    username:string,
    password:string
}
interface userRegister {
    username:string,
    password:string,
    passowrd2: string,
    email: string
}
// REGISTERr
export const registerUser = (userData:userRegister) => (dispatch:Dispatch) => {
  axios
    .post(`${host}/api/users`, userData)
    .then(() => {
      dispatch({
        type: GET_ERRORS,
        payload: {}
      })
      Router.push('/')
    })
    .catch(err =>{
      if(err.response){
        dispatch({
          type: GET_ERRORS,
          payload: err.response.data.errors
        })
      }else alert("There was a server error, please try again later")
    });
};

// //Login

export const loginUser = (userData:userLogin) => (dispatch: Dispatch) => {
  axios
    .post(`${host}/api/auth`, userData)
    .then(res => {
        const { token }:{token:string} = res.data;
        //Set to auth Header
        dispatch({
          type: GET_ERRORS,
          payload: {}
        })
        setAuthToken(token);
        const decoded:{exp: number} = jwt_decode(token);
        dispatch(setCurrentUser(decoded));
        Router.push("/my-collabs")
    })
    .catch(err =>{
      if(err.response){
        dispatch({
          type: GET_ERRORS,
          payload: err.response.data.errors
        })
      }else{
        alert("There was a server error, please try again later")
      }
      
    });
};

//set current user
export const setCurrentUser = (decoded:{exp?:number}) => {
  return {
    type: SET_CURRENT_USER,
    payload: decoded
  };
};

// export const resetErrors = dispatch =>{
//   return{
//     type: CLEAR_ERRORS,
//   }
// }
export const logoutUser = () => async(dispatch: Dispatch) => {
  await Router.push("/");
  setAuthToken(undefined);
  dispatch(setCurrentUser({}));

  // navigate('/')
};
