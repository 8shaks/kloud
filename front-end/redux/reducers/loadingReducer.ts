import { IS_LOADING, LOADING_DONE } from "../actions/types";
const loading = true;

export default function(state = loading, action: any) {
  switch (action.type) {
    case IS_LOADING:
      return true
    case LOADING_DONE:
      return false;
    default:
      return state;
  }
}
