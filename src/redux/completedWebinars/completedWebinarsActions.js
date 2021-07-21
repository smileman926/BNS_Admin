import * as TYPES from './completedWebinarsTypes';

export const getListRequest = payload => ({
  type: TYPES.GET_LIST_COMPLETED_REQUEST,
  payload,
});

export const getListSuccess = payload => ({
  type: TYPES.GET_LIST_COMPLETED_SUCCESS,
  payload,
});

export const getListError = payload => ({
  type: TYPES.GET_LIST_COMPLETED_ERROR,
  payload,
});

export const saveFflWinnerRequest = payload => ({
  type: TYPES.SAVE_FFL_WINNERS_REQUEST,
  payload,
});

export const saveFflWinnerSuccess = payload => ({
  type: TYPES.SAVE_FFL_WINNERS_SUCCESS,
  payload,
});

export const saveFflWinnerError = payload => ({
  type: TYPES.SAVE_FFL_WINNERS_ERROR,
  payload,
});
