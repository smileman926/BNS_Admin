import { notification } from 'antd';
import { all, call, put, takeEvery } from 'redux-saga/effects';
import { aptSaveFFLtoWinners, aptGetComplitedWebinars } from '../../utils/api/api';
import * as ACTIONS from './completedWebinarsActions';
import * as TYPES from './completedWebinarsTypes';


function* getList() {
  yield takeEvery(TYPES.GET_LIST_COMPLETED_REQUEST, function* ({ payload }) {
    try {
      const data = yield call(aptGetComplitedWebinars, payload);
      yield put(ACTIONS.getListSuccess(data));
    } catch (err) {
      yield put(ACTIONS.getListError(err));
    }
  });
}
function* saveFflWinners() {
  yield takeEvery(TYPES.SAVE_FFL_WINNERS_REQUEST, function* ({ payload }) {
    try {
      const { filter, ...data } = payload;
      const elem = yield call(aptSaveFFLtoWinners, data);
      notification.success({
        message: 'Save',
      });
      yield put(ACTIONS.saveFflWinnerSuccess(elem));
      // yield put({ type: TYPES.GET_LIST_COMPLETED_REQUEST, payload: filter });
    } catch (err) {
        yield put(ACTIONS.saveFflWinnerError(err));
    }
  });
}

export default function* rootCompletedWebinars() {
  yield all([getList(), saveFflWinners()]);
}
