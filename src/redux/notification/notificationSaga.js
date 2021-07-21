import { all, call, put, takeEvery } from "redux-saga/effects";
import { apiGetNotify, apiReadNotify } from "../../utils/api/api";
import * as ACTIONS from "./notificationActions";
import * as TYPES from "./notificationTypes";

function* getNotify() {
  yield takeEvery(TYPES.GET_NOTIFICATION_REQUESTS, function* ({ payload }) {
    try {
      const list = yield call(apiGetNotify, payload);
      yield put(ACTIONS.getNotifySuccess(list));
    } catch (err) {
      yield put(ACTIONS.getNotifyError(err));
    }
  });
}

function* readNotify() {
  yield takeEvery(TYPES.READ_NOTIFICATION_REQUESTS, function* ({ payload }) {
    try {
      const elem = yield call(apiReadNotify, payload);
      yield put(ACTIONS.readNotifySuccess(elem));
      yield put({ type: TYPES.GET_NOTIFICATION_REQUESTS });
    } catch (err) {
      yield put(ACTIONS.readNotifyError(err));
    }
  });
}

export default function* rootNotify() {
  yield all([getNotify(), readNotify()]);
}
