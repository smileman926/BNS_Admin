import { combineReducers } from 'redux';
import { notification } from 'antd';
import * as TYPES from './Types';

const list = (state = [], { type, payload }) => {
  switch (type) {
    case TYPES.GET_GIFT_CARDS_SUCCESS:
      return payload;
    case TYPES.SAVE_GIFT_CARDS_SUCCESS:
      notification.success({
        message: 'Saved',
      });
      return payload;
    case TYPES.EDIT_GIFT_CARDS_SUCCESS:
      notification.success({
        message: 'Success',
      });
      return payload;
    default:
      return state;
  }
};

const errorMessage = (state = null, { type, payload }) => {
  switch (type) {
    case TYPES.GET_GIFT_CARDS_ERROR:
    case TYPES.SAVE_GIFT_CARDS_ERROR:

      notification.error({
        message: payload.message,
      });
      return payload;

    case TYPES.EDIT_GIFT_CARDS_ERROR:

      notification.error({
        message: payload.message,
      });
      return payload;

    case TYPES.GET_GIFT_CARDS_REQUEST:
    case TYPES.SAVE_GIFT_CARDS_REQUEST:
    case TYPES.EDIT_GIFT_CARDS_REQUEST:
      return null;

    default:
      return state;
  }
};

const loading = (state = false, { type }) => {
  switch (type) {
    case TYPES.GET_GIFT_CARDS_REQUEST:
    case TYPES.SAVE_GIFT_CARDS_REQUEST:
    case TYPES.EDIT_GIFT_CARDS_REQUEST:
      return true;
    case TYPES.GET_GIFT_CARDS_ERROR:
    case TYPES.SAVE_GIFT_CARDS_ERROR:
    case TYPES.EDIT_GIFT_CARDS_ERROR:
    case TYPES.GET_GIFT_CARDS_SUCCESS:
    case TYPES.SAVE_GIFT_CARDS_SUCCESS:
    case TYPES.EDIT_GIFT_CARDS_SUCCESS:
      return false;
    default:
      return state;
  }
};

const giftCardsReducer = combineReducers({
  list,
  errorMessage,
  loading,
});

export default giftCardsReducer;
