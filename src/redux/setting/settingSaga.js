import { all, call, put, takeEvery } from "redux-saga/effects";
import * as settingTypes from "./settingTypes";
import * as settingActions from "./settingActions";
import * as API from "../../utils/api/api";

export function* getSettingInfo() {
  yield takeEvery(settingTypes.GET_SETTING_INFO_REQUEST, function* () {
    try {
      const result = yield call(API.apiGetSettingInfo);
      yield put(settingActions.getSettingInfoSuccess(result.data));
    } catch (err) {
      yield put(settingActions.getSettingInfoError(err));
    }
  });
}

export function* updateSettingInfo() {
  yield takeEvery(settingTypes.UPDATE_SETTING_INFO_REQUEST, function* ({ payload }) {
    try {
      const result = yield call(API.apiSaveSettingInfo, payload);
      yield put(settingActions.updateSettingInfoSuccess(result));
      const newResult = yield call(API.apiGetSettingInfo);
      yield put(settingActions.getSettingInfoSuccess(newResult.data));
    } catch (err) {
      yield put(settingActions.updateSettingInfoError(err));
    }
  });
}

export default function* rootSettingSaga() {
  yield all([getSettingInfo(), updateSettingInfo()]);
}
