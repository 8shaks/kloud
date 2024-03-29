import { GET_ERRORS, CLEAR_ERRORS } from "../actions/types";
const intialState = {};

export default function(state = intialState, action: any) {
  switch (action.type) {
    case GET_ERRORS:
      return action.payload;
    case CLEAR_ERRORS:
      return {};
    default:
      return state;
  }
}
