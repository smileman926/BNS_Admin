import * as TYPES from "./Types";

export const getFAQs = (payload) => ({
  type: TYPES.GET_FAQ_REQUEST,
  payload,
});

export const getFAQsSuccess = (payload) => ({
  type: TYPES.GET_FAQ_SUCCESS,
  payload,
});

export const getFAQsError = (payload) => ({
  type: TYPES.GET_FAQ_ERROR,
  payload,
});

export const saveFAQ = (payload) => ({
  type: TYPES.SAVE_FAQ_REQUEST,
  payload,
});

export const saveFAQSuccess = (payload) => ({
  type: TYPES.SAVE_FAQ_SUCCESS,
  payload,
});

export const saveFAQError = (payload) => ({
  type: TYPES.GET_FAQ_ERROR,
  payload,
});
export const updateFAQ = (payload) => ({
  type: TYPES.UPDATE_FAQ_REQUEST,
  payload,
});

export const updateFAQSuccess = (payload) => ({
  type: TYPES.UPDATE_FAQ_SUCCESS,
  payload,
});

export const updateFAQError = (payload) => ({
  type: TYPES.UPDATE_FAQ_ERROR,
  payload,
});
export const deleteFAQ = (payload) => ({
  type: TYPES.DELETE_FAQ_REQUEST,
  payload,
});

export const deleteFAQSuccess = (payload) => ({
  type: TYPES.DELETE_FAQ_SUCCESS,
  payload,
});

export const deleteFAQError = (payload) => ({
  type: TYPES.DELETE_FAQ_ERROR,
  payload,
});

export const selectFAQ = (payload) => ({
  type: TYPES.SELECT_FAQ,
  payload,
});

