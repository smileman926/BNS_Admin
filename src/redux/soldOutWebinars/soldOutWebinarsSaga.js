import {
  all, call, put, takeEvery,
} from 'redux-saga/effects';
import {
  apiGetListSoldOutWebinars,
  apiGetListUsersWebinars,
} from '../../utils/api/api';
import * as soldOutWebinarsActions from './soldOutWebinarsActions';
import * as soldOutWebinarsTypes from './soldOutWebinarsTypes';

function* getListSoldOutWebinars() {
  yield takeEvery(
    soldOutWebinarsTypes.GET_SOLD_OUT_WEBINARS_REQUEST,
    function* ({ payload }) {
      try {
        const list = yield call(apiGetListSoldOutWebinars, payload);
        yield put(soldOutWebinarsActions.getListSoldOutWebinarsSuccess(list.rows));
      } catch (err) {
        yield put(soldOutWebinarsActions.getListSoldOutWebinarsError(err));
      }
    },
  );
}

function* sendLinkWebinar() {
  yield takeEvery(soldOutWebinarsTypes.SEND_LINK_WEBINAR_REQUEST, function* ({
    payload,
  }) {
    try {
      const elem = yield call(null, payload);
      yield put(soldOutWebinarsActions.sendLinkSuccess(elem));
    } catch (err) {
      yield put(soldOutWebinarsActions.sendLinkError(err));
    }
  });
}

function* listUserWebinar() {
  yield takeEvery(soldOutWebinarsTypes.LIST_USERS_WEBINAR_REQUEST, function* ({
    payload,
  }) {
    try {
      const list = yield call(apiGetListUsersWebinars, payload);
      yield put(soldOutWebinarsActions.getListUserWebinarsSuccess(list));
    } catch (err) {
      yield put(soldOutWebinarsActions.getListUserWebinarsError(err));
    }
  });
}

export default function* rootSoldOutWebinarsSaga() {
  yield all([getListSoldOutWebinars(), sendLinkWebinar(), listUserWebinar()]);
}
