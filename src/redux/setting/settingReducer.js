import { combineReducers } from "redux";
import * as settingTypes from "./settingTypes";
import { notification } from "antd";

const settingInfoReducer = (state = {}, { type, payload }) => {
  switch (type) {
    case settingTypes.GET_SETTING_INFO_SUCCESS:
      return payload;

    case settingTypes.UPDATE_SETTING_INFO_SUCCESS:
      notification.success({
        message: "Updated successfully",
      });
      return state;

    default:
      return state;
  }
};

const messageErrorReducer = (state = null, { type, payload }) => {
  switch (type) {
    case settingTypes.GET_SETTING_INFO_ERROR:
    case settingTypes.UPDATE_SETTING_INFO_ERROR:
      notification.error({
        message: payload.message,
      });
      return payload;

    case settingTypes.GET_SETTING_INFO_REQUEST:
    case settingTypes.UPDATE_SETTING_INFO_REQUEST:
      return null;

    default:
      return state;
  }
};

const isLoadReducer = (state = false, { type, payload }) => {
  switch (type) {
    case settingTypes.GET_SETTING_INFO_REQUEST:
    case settingTypes.UPDATE_SETTING_INFO_REQUEST:
      return true;

    case settingTypes.GET_SETTING_INFO_SUCCESS:
    case settingTypes.UPDATE_SETTING_INFO_SUCCESS:
      return false;

    case settingTypes.GET_SETTING_INFO_ERROR:
    case settingTypes.UPDATE_SETTING_INFO_ERROR:
      return false;

    default:
      return state;
  }
};

const settingReducer = combineReducers({
  settingInfo: settingInfoReducer,
  messageError: messageErrorReducer,
  isLoad: isLoadReducer,
});

export default settingReducer;
