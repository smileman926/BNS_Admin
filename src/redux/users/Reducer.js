import { combineReducers } from 'redux';
import { notification } from 'antd';
import * as TYPES from './Types';

const list = (state = [], { type, payload }) => {
  switch (type) {
    case TYPES.GET_USERS_SUCCESS:
      return payload;
    case TYPES.USERS_SEARCH_RESULT_SUCCESS:
      return {
        ...state,
        searchResult: payload,
      };
    default:
      return state;
  }
};

const errorMessage = (state = null, { type, payload }) => {
  switch (type) {
    case TYPES.GET_USERS_ERROR:
      notification.error({
        message: payload.message,
      });
      return payload;

    case TYPES.GET_USERS_REQUEST:
    case TYPES.USERS_SEARCH_RESULT_ERROR:
      return null;

    default:
      return state;
  }
};

const loading = (state = false, { type }) => {
  switch (type) {
    case TYPES.GET_USERS_REQUEST:
    case TYPES.USERS_SEARCH_RESULT_REQUEST:
      return true;
    case TYPES.GET_USERS_ERROR:
    case TYPES.GET_USERS_SUCCESS:
      return false;

    default:
      return state;
  }
};

const usersReducer = combineReducers({
  list,
  errorMessage,
  loading,
});

export default usersReducer;
