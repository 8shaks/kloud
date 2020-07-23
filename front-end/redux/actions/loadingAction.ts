
import {IS_LOADING, LOADING_DONE} from './types';
  import { Dispatch } from 'redux';
export const setLoading = () => async (dispatch:Dispatch) => {
    dispatch({
        type: IS_LOADING
    });
};
  
export const loadingDone = () => async (dispatch:Dispatch) => {
    dispatch({
        type: LOADING_DONE
    });
};
  