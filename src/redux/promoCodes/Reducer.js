import { combineReducers } from "redux";
import { notification } from "antd";
import * as TYPES from "./Types";

const list = (state = [], { type, payload }) => {
  switch (type) {
    case TYPES.GET_PROMO_CODES_SUCCESS:
      return payload;
    case TYPES.SAVE_PROMO_CODES_SUCCESS:
      notification.success({
        message: "Saved",
      });
      return payload;
    default:
      return state;
  }
};

const errorMessage = (state = null, { type, payload }) => {
  switch (type) {
    case TYPES.GET_PROMO_CODES_ERROR:
      notification.error({
        message: payload.message,
      });
      return payload;
    case TYPES.SAVE_PROMO_CODES_ERROR:
      notification.error({
        message: payload.response.data.message === "Validation error" ? "Code must be unique" : payload.message,
      });
      return payload;
    case TYPES.GET_PROMO_CODES_REQUEST:
    case TYPES.SAVE_PROMO_CODES_REQUEST:
      return null;
    default:
      return state;
  }
};

const loading = (state = false, { type }) => {
  switch (type) {
    case TYPES.GET_PROMO_CODES_REQUEST:
    case TYPES.SAVE_PROMO_CODES_REQUEST:
      return true;
    case TYPES.GET_PROMO_CODES_ERROR:
    case TYPES.SAVE_PROMO_CODES_ERROR:
    case TYPES.GET_PROMO_CODES_SUCCESS:
    case TYPES.SAVE_PROMO_CODES_SUCCESS:
      return false;
    default:
      return state;
  }
};

const promoCodesReducer = combineReducers({
  list,
  errorMessage,
  loading,
});

export default promoCodesReducer;
