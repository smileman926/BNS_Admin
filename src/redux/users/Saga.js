import { all, call, put, takeEvery } from 'redux-saga/effects';
import * as TYPES from './Types';
import * as ACTIONS from './Actions';
import { apiGetUsers } from '../../utils/api/api';

function* getUsers() {
  yield takeEvery(TYPES.GET_USERS_REQUEST, function* ({
    payload,
  }) {
    try {
      const list = yield call(apiGetUsers, payload);
      yield put(ACTIONS.getUsersSuccess(list));
    } catch (err) {
      yield put(ACTIONS.getUsersError(err));
    }
  });
}
function* getUsersSearchResult() {
  yield takeEvery(TYPES.USERS_SEARCH_RESULT_REQUEST, function* ({
    payload,
  }) {
    try {
      const list = yield call(apiGetUsers, payload);
      yield put(ACTIONS.getUsersSearchSuccess(list));
    } catch (err) {
      yield put(ACTIONS.getUsersSearchError(err));
    }
  });
}


export default function* rootUsersSaga() {
  yield all([getUsers(), getUsersSearchResult()]);
}
