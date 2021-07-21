import { all, call, put, takeEvery } from "redux-saga/effects";
import * as fflDbTypes from "./fflDbTypes";
import * as fflDbActions from "./fflDbActions";

import { apiGetListFfl, apiSaveFfl, apiUpdateFFL } from "../../utils/api/api";
import { notification } from "antd";

function* getList() {
  yield takeEvery(fflDbTypes.GET_FFL_REQUEST, function* ({ payload }) {
    try {
      const data = yield call(apiGetListFfl, payload);
      yield put(fflDbActions.getFflDbSuccess(data));
    } catch (err) {
      yield put(fflDbActions.getFflDbError(err));
    }
  });
}
function* saveFfl() {
  yield takeEvery(fflDbTypes.SAVE_FFL_REQUEST, function* ({ payload }) {
    try {
      const { filter } = payload;
      delete payload.filter;
      const elem = yield call(apiSaveFfl, payload);
      notification.success({
        message: "Save",
      });
      yield put(fflDbActions.saveFflSuccess(elem));
      yield put({ type: fflDbTypes.GET_FFL_REQUEST, payload: { ...filter } });
    } catch (err) {
      yield put(fflDbActions.saveFflDbError(err));
    }
  });
}

function* editFfl() {
  yield takeEvery(fflDbTypes.EDIT_FFL_REQUEST, function* ({ payload }) {
    try {
      const { filter } = payload;
      delete payload.filter;
      const elem = yield call(apiUpdateFFL, payload);
      notification.success({
        message: "Save",
      });
      yield put(fflDbActions.editFflSuccess(elem));
      yield put({ type: fflDbTypes.GET_FFL_REQUEST, payload: { ...filter } });
    } catch (err) {
      yield put(fflDbActions.editFflDbError(err));
    }
  });
}

export default function* rootFFLDBSaga() {
  yield all([getList(), saveFfl(), editFfl()]);
}
