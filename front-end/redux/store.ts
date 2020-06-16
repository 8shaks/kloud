import { createStore, applyMiddleware, compose} from "redux";
import thunk from "redux-thunk";
import rootReducer from "./reducers";
import { composeWithDevTools } from 'redux-devtools-extension';
const middleware = [thunk];
// let apple = window !== undefined ? [window.__REDUX_DEVTOOLS_EXTENSION__ , window.__REDUX_DEVTOOLS_EXTENSION__()] : null
const store = createStore(
  rootReducer,
  {},
  composeWithDevTools(applyMiddleware(...middleware))
);

export default store;