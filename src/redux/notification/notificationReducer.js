import { combineReducers } from "redux";
import * as TYPES from "./notificationTypes";
import { notification } from "antd";

const list = (state = [], { type, payload }) => {
  switch (type) {
    case TYPES.GET_NOTIFICATION_SUCCESS:
      return payload;
    default:
      return state;
  }
};

const errorMessage = (state = null, { type, payload }) => {
  switch (type) {
    case TYPES.GET_NOTIFICATION_ERROR:
    case TYPES.READ_NOTIFICATION_ERROR:
      notification.error({
        message: payload.message,
      });
      return payload;

    case TYPES.GET_NOTIFICATION_REQUESTS:
    case TYPES.GET_NOTIFICATION_SUCCESS:
    case TYPES.READ_NOTIFICATION_REQUESTS:
    case TYPES.READ_NOTIFICATION_SUCCESS:
      return null;

    default:
      return state;
  }
};

const loading = (state = false, { type }) => {
  switch (type) {
    case TYPES.GET_NOTIFICATION_REQUESTS:
    case TYPES.READ_NOTIFICATION_REQUESTS:
      return true;
    case TYPES.GET_NOTIFICATION_SUCCESS:
    case TYPES.GET_NOTIFICATION_ERROR:
    case TYPES.READ_NOTIFICATION_SUCCESS:
    case TYPES.READ_NOTIFICATION_ERROR:
      return false;

    default:
      return state;
  }
};

const notifyReducer = combineReducers({
  list,
  errorMessage,
  loading,
});

export default notifyReducer;
