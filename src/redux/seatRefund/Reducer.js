import { combineReducers } from 'redux';
import * as TYPES from './Types';


const list = (state = [], { type, payload }) => {
  switch (type) {
    case TYPES.GET_SEATS_FOR_REFUND_SUCCESS:
      return payload;
    default:
      return state;
  }
};

const loading = (state = false, { type }) => {
  switch (type) {
    case TYPES.GET_SEATS_FOR_REFUND_REQUEST:
    case TYPES.SAVE_SEATS_FOR_REFUND_REQUEST:
      return true;

    case TYPES.GET_SEATS_FOR_REFUND_ERROR:
    case TYPES.GET_SEATS_FOR_REFUND_SUCCESS:
    case TYPES.SAVE_SEATS_FOR_REFUND_ERROR:
    case TYPES.SAVE_SEATS_FOR_REFUND_SUCCESS:
      return false;

    default:
      return state;
  }
};

const error = (state = null, { type, payload }) => {
  switch (type) {
    case TYPES.GET_SEATS_FOR_REFUND_ERROR:
    case TYPES.SAVE_SEATS_FOR_REFUND_ERROR:
      return payload;
    case TYPES.GET_SEATS_FOR_REFUND_REQUEST:
    case TYPES.GET_SEATS_FOR_REFUND_SUCCESS:
    case TYPES.SAVE_SEATS_FOR_REFUND_REQUEST:
    case TYPES.SAVE_SEATS_FOR_REFUND_SUCCESS:
      return null;
    default:
      return state;
  }
};

const refundSeatsReducer = combineReducers({
  list,
  loading,
  error,
});

export default refundSeatsReducer;
