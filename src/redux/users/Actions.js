import * as TYPES from './Types';

export const getAllUsers = (payload) => ({
  type: TYPES.GET_USERS_REQUEST,
  payload,
});

export const getUsersSuccess = (payload) => ({
  type: TYPES.GET_USERS_SUCCESS,
  payload,
});

export const getUsersError = (payload) => ({
  type: TYPES.GET_USERS_ERROR,
  payload,
});
export const getUsersSearchSuccess = (payload) => ({
  type: TYPES.USERS_SEARCH_RESULT_SUCCESS,
  payload,
});

export const getUsersSearchError = (payload) => ({
  type: TYPES.USERS_SEARCH_RESULT_ERROR,
  payload,
});
export const getUsersSearchResult = (payload) => ({
  type: TYPES.USERS_SEARCH_RESULT_REQUEST,
  payload,
});
