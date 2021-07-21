import * as settingTypes from './settingTypes';

export const getSettingInfoRequest = () => ({
  type: settingTypes.GET_SETTING_INFO_REQUEST,
});

export const getSettingInfoSuccess = (payload) => ({
  type: settingTypes.GET_SETTING_INFO_SUCCESS,
  payload,
});

export const getSettingInfoError = (payload) => ({
  type: settingTypes.GET_SETTING_INFO_ERROR,
  payload,
});

export const updateSettingInfoRequest = (payload) => ({
  type: settingTypes.UPDATE_SETTING_INFO_REQUEST,
  payload,
});

export const updateSettingInfoSuccess = (payload) => ({
  type: settingTypes.UPDATE_SETTING_INFO_SUCCESS,
  payload,
});

export const updateSettingInfoError = (payload) => ({
  type: settingTypes.UPDATE_SETTING_INFO_ERROR,
  payload,
});
