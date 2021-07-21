import { all, call, put, takeEvery, } from 'redux-saga/effects';
import * as TYPES from './Types';
import { apiGetRefundSeats, apiSaveSeatsRefund } from '../../utils/api/api';
import {
  getRefundSeats,
  getRefundSeatsError,
  getRefundSeatsSuccess,
  saveRefundSeatsError,
  saveRefundSeatsSuccess
} from './Actions';
import { savePromoCodeSuccess } from '../promoCodes/Actions';
import { notification } from 'antd';

function* listRefundSeats() {
  yield takeEvery(TYPES.GET_SEATS_FOR_REFUND_REQUEST, function* ({
    payload,
  }) {
    try {
      const list = yield call(apiGetRefundSeats, payload);
      yield put(getRefundSeatsSuccess(list));
    } catch (err) {
      yield put(getRefundSeatsError(err));
    }
  });
}
function* saveRefundSeats() {
  yield takeEvery(TYPES.SAVE_SEATS_FOR_REFUND_REQUEST, function* ({
    payload,
    meta,
  }) {
    try {
      const list = yield call(apiSaveSeatsRefund, payload);
      yield put(saveRefundSeatsSuccess(list));
      notification.success({
        message: 'Success',
      });
      yield meta.onSuccess();
    } catch (err) {
      notification.error({
        message: err.response.data.message,
      });
      yield put(saveRefundSeatsError(err));
    }
  });
}

export default function* rootRefundSeatsSaga() {
  yield all([listRefundSeats(), saveRefundSeats()]);
}
