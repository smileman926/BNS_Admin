import * as authTypes from "./authTypes";

export const loginRequest = (payload) => ({
  type: authTypes.LOGIN_REQUEST,
  payload,
});

export const loginSuccess = (payload) => ({
  type: authTypes.LOGIN_SUCCESS,
  payload,
});

export const loginError = (payload) => ({
  type: authTypes.LOGIN_ERROR,
  payload,
});

export const logoutSuccess = () => ({ type: authTypes.LOGOUT_SUCCESS });
