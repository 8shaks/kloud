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
        console.log(err)
        dispatch({
            type: GET_ERRORS,
            payload: err.response.data.errors
          })
    }
      
    );
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
        Router.push("/")
    })
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data.errors
      })
    );
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
export const logoutUser = () => (dispatch: Dispatch) => {
  setAuthToken(undefined);
  dispatch(setCurrentUser({}));
  Router.push("/");
  // navigate('/')
};
