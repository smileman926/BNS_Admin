import { all, call, put, takeEvery } from 'redux-saga/effects';
import * as TYPES from './Types';
import * as ACTIONS from './Actions';
import { apiDeleteFAQ, apiGetFAQs, apiSaveFAQ, apiUpdateFAQ } from '../../utils/api/api';

function* getFAQs() {
  yield takeEvery(TYPES.GET_FAQ_REQUEST, function* ({
    payload,
  }) {
    try {
      const list = yield call(apiGetFAQs, payload);
      yield put(ACTIONS.getFAQsSuccess(list));
    } catch (err) {
      yield put(ACTIONS.getFAQsError(err));
    }
  });
}

function* saveFAQ() {
  yield takeEvery(TYPES.SAVE_FAQ_REQUEST, function* ({
    payload,
  }) {
    try {
      const elem = yield call(apiSaveFAQ, payload);
      yield put(ACTIONS.saveFAQSuccess(elem));
      yield put({ type: TYPES.GET_FAQ_REQUEST });
    } catch (err) {
      yield put(ACTIONS.saveFAQError(err));
    }
  });
}

function* updateFAQ() {
  yield takeEvery(TYPES.UPDATE_FAQ_REQUEST, function* ({
    payload,
  }) {
    try {
      const elem = yield call(apiUpdateFAQ, payload);
      yield put(ACTIONS.updateFAQSuccess(elem));
      yield put({ type: TYPES.GET_FAQ_REQUEST });
    } catch (err) {
      yield put(ACTIONS.updateFAQError(err));
    }
  });
}
function* deleteFAQ() {
  yield takeEvery(TYPES.DELETE_FAQ_REQUEST, function* ({
    payload,
  }) {
    try {
      const elem = yield call(apiDeleteFAQ, payload);
      yield put(ACTIONS.deleteFAQSuccess(elem));
      yield put({ type: TYPES.GET_FAQ_REQUEST });
    } catch (err) {
      yield put(ACTIONS.deleteFAQError(err));
    }
  });
}
export default function* rootFAQsSaga() {
  yield all([getFAQs(), saveFAQ(), updateFAQ(), deleteFAQ()]);
}
