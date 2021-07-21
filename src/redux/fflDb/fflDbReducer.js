import { combineReducers } from "redux";
import * as fflDbTypes from "./fflDbTypes";
import { notification } from "antd";

const loading = (state = false, { type, payload }) => {
  switch (type) {
    case fflDbTypes.GET_FFL_REQUEST:
    case fflDbTypes.SAVE_FFL_REQUEST:
    case fflDbTypes.EDIT_FFL_REQUEST:
      return true;
    case fflDbTypes.GET_FFL_SUCCESS:
    case fflDbTypes.SAVE_FFL_SUCCESS:
    case fflDbTypes.EDIT_FFL_SUCCESS:
    case fflDbTypes.GET_FFL_ERROR:
    case fflDbTypes.SAVE_FFL_ERROR:
    case fflDbTypes.EDIT_FFL_ERROR:
      return false;
    default:
      return state;
  }
};

const list = (state = [], { type, payload }) => {
  switch (type) {
    case fflDbTypes.GET_FFL_SUCCESS:
      return payload;
    default:
      return state;
  }
};

const errMsg = (state = null, { type, payload }) => {
  switch (type) {
    case fflDbTypes.GET_FFL_ERROR:
    case fflDbTypes.SAVE_FFL_ERROR:
    case fflDbTypes.EDIT_FFL_ERROR:
      notification.error({
        message: payload.response?.data.message || "Error",
      });
      return payload;
    case fflDbTypes.GET_FFL_REQUEST:
    case fflDbTypes.SAVE_FFL_REQUEST:
    case fflDbTypes.EDIT_FFL_REQUEST:
    case fflDbTypes.GET_FFL_SUCCESS:
    case fflDbTypes.SAVE_FFL_SUCCESS:
    case fflDbTypes.EDIT_FFL_SUCCESS:
      return null;
    default:
      return state;
  }
};

const reducerFflDb = combineReducers({
  loading,
  list,
  errMsg,
});

export default reducerFflDb;
