import { combineReducers } from 'redux';
import { notification } from 'antd';
import * as TYPES from './Types';

const list = (state = [], { type, payload }) => {
  switch (type) {
    case TYPES.GET_FAQ_SUCCESS:
      return payload;
    case TYPES.SAVE_FAQ_SUCCESS:
      notification.success({
        message: 'Saved',
      });
      return payload;
    case TYPES.UPDATE_FAQ_SUCCESS:
      notification.success({
        message: 'Updated',
      });
      return state;
    case TYPES.SAVE_FAQ_SUCCESS:
      notification.success({
        message: 'Deleted',
      });
    case TYPES.SELECT_FAQ:
      return {
        ...state,
        selectedFaq: state.data.find((item) => item.id === payload),
      };
    default:
      return state;
  }
};

const errorMessage = (state = null, { type, payload }) => {
  switch (type) {
    case TYPES.GET_FAQ_ERROR:
    case TYPES.SAVE_FAQ_ERROR:
    case TYPES.UPDATE_FAQ_ERROR:
    case TYPES.DELETE_FAQ_ERROR:

      notification.error({
        message: payload.message,
      });
      return payload;

    case TYPES.GET_FAQ_REQUEST:
    case TYPES.SAVE_FAQ_REQUEST:
    case TYPES.UPDATE_FAQ_REQUEST:
    case TYPES.DELETE_FAQ_REQUEST:
      return null;

    default:
      return state;
  }
};

const loading = (state = false, { type }) => {
  switch (type) {
    case TYPES.GET_FAQ_REQUEST:
    case TYPES.SAVE_FAQ_REQUEST:
    case TYPES.UPDATE_FAQ_REQUEST:
    case TYPES.DELETE_FAQ_REQUEST:
      return true;
    case TYPES.GET_FAQ_ERROR:
    case TYPES.SAVE_FAQ_ERROR:
    case TYPES.UPDATE_FAQ_ERROR:
    case TYPES.DELETE_FAQ_ERROR:
    case TYPES.SELECT_FAQ:

      return false;

    default:
      return state;
  }
};

const FAQsReducer = combineReducers({
  list,
  errorMessage,
  loading,
});

export default FAQsReducer;
