import { notification } from 'antd';
import { combineReducers } from 'redux';
import * as TYPES from './completedWebinarsTypes';

const data = (state = { list: [], total: 0, ffl: [] }, { type, payload }) => {
  switch (type) {
    case TYPES.GET_LIST_COMPLETED_SUCCESS:
      return { list: payload.result.rows, total: payload.result.count, ffl: payload.ffl };
    case TYPES.GET_LIST_COMPLETED_ERROR:
      return state;
    default:
      return state;
  }
};

const loading = (state = false, { type }) => {
  switch (type) {
    case TYPES.GET_LIST_COMPLETED_REQUEST:
    case TYPES.SAVE_FFL_WINNERS_REQUEST:
      return true;
    case TYPES.GET_LIST_COMPLETED_SUCCESS:
    case TYPES.GET_LIST_COMPLETED_ERROR:
    case TYPES.SAVE_FFL_WINNERS_SUCCESS:
    case TYPES.SAVE_FFL_WINNERS_ERROR:
      return false;
    default:
      return state;
  }
};

const error = (state = null, { type, payload }) => {
  switch (type) {
    case TYPES.GET_LIST_COMPLETED_REQUEST:
    case TYPES.SAVE_FFL_WINNERS_REQUEST:
    case TYPES.GET_LIST_COMPLETED_SUCCESS:
    case TYPES.SAVE_FFL_WINNERS_SUCCESS:
      return null;
    case TYPES.GET_LIST_COMPLETED_ERROR:
    case TYPES.SAVE_FFL_WINNERS_ERROR:
      notification.error({
        message: payload?.response?.data.message || payload.message,
      });
      return false;
    default:
      return state;
  }
};

const completedWebinars = combineReducers({
  data,
  loading,
  error,
});

export default completedWebinars;
