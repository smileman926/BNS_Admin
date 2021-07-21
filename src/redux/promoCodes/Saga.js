import { all, call, put, takeEvery, } from 'redux-saga/effects';
import * as TYPES from './Types';
import * as ACTIONS from './Actions';
import { apiGetPromoCodes, apiSavePromoCode } from '../../utils/api/api';

function* getPromoCodes() {
  yield takeEvery(TYPES.GET_PROMO_CODES_REQUEST, function* ({
    payload,
  }) {
    try {
      const list = yield call(apiGetPromoCodes, payload);
      yield put(ACTIONS.getAllPromoCodesSuccess(list));
    } catch (err) {
      yield put(ACTIONS.getPromoCodesError(err));
    }
  });
}

function* savePromoCode() {
  yield takeEvery(TYPES.SAVE_PROMO_CODES_REQUEST, function* ({
    payload,
  }) {
    try {
      const elem = yield call(apiSavePromoCode, payload);
      yield put(ACTIONS.savePromoCodeSuccess(elem));
    } catch (err) {
      yield put(ACTIONS.savePromoCodeError(err));
    }
  });
}

export default function* rootPromoCodesSaga() {
  yield all([getPromoCodes(), savePromoCode()]);
}
