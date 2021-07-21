import * as fflDbTypes from "./fflDbTypes";

export const getFflDbRequest = (payload) => ({
  type: fflDbTypes.GET_FFL_REQUEST,
  payload,
});

export const getFflDbSuccess = (payload) => ({
  type: fflDbTypes.GET_FFL_SUCCESS,
  payload,
});

export const getFflDbError = (payload) => ({
  type: fflDbTypes.GET_FFL_ERROR,
  payload,
});

export const saveFflDbRequest = (payload) => ({
  type: fflDbTypes.SAVE_FFL_REQUEST,
  payload,
});

export const saveFflSuccess = (payload) => ({
  type: fflDbTypes.SAVE_FFL_SUCCESS,
  payload,
});

export const saveFflDbError = (payload) => ({
  type: fflDbTypes.SAVE_FFL_ERROR,
  payload,
});

export const editFflDbRequest = (payload) => ({
  type: fflDbTypes.EDIT_FFL_REQUEST,
  payload,
});

export const editFflSuccess = (payload) => ({
  type: fflDbTypes.EDIT_FFL_SUCCESS,
  payload,
});

export const editFflDbError = (payload) => ({
  type: fflDbTypes.EDIT_FFL_ERROR,
  payload,
});

