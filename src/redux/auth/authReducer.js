import { combineReducers } from "redux";
import * as authTypes from "./authTypes";
import { notification } from "antd";

const userReducer = (state = null, { type, payload }) => {
  switch (type) {
    case authTypes.LOGIN_SUCCESS:
      return payload;

    case authTypes.LOGOUT_SUCCESS:
      return null;

    default:
      return state;
  }
};

const isLoginReducer = (state = false, { type, payload }) => {
  switch (type) {
    case authTypes.LOGIN_SUCCESS:
      return true;

    case authTypes.LOGOUT_SUCCESS:
      return false;

    default:
      return state;
  }
};

const messageErrorReducer = (state = null, { type, payload }) => {
  switch (type) {
    case authTypes.LOGIN_ERROR:
    case authTypes.LOGOUT_ERROR:
    case authTypes.FORGOT_ERROR:
      notification.error({
        message: payload.message,
      });
      return payload;

    case authTypes.LOGIN_REQUEST:
    case authTypes.LOGOUT_REQUEST:
    case authTypes.FORGOT_REQUEST:
      return null;

    default:
      return state;
  }
};

const isLoadReducer = (state = false, { type, payload }) => {
  switch (type) {
    case authTypes.LOGIN_REQUEST:
    case authTypes.FORGOT_REQUEST:
    case authTypes.LOGOUT_REQUEST:
      return true;

    case authTypes.LOGIN_SUCCESS:
    case authTypes.FORGOT_SUCCESS:
    case authTypes.LOGOUT_SUCCESS:
      return false;

    case authTypes.LOGIN_ERROR:
    case authTypes.FORGOT_ERROR:
    case authTypes.LOGOUT_ERROR:
      return false;

    default:
      return state;
  }
};

const authReducer = combineReducers({
  user: userReducer,
  isLogin: isLoginReducer,
  messageError: messageErrorReducer,
  isLoad: isLoadReducer,
});

export default authReducer;
