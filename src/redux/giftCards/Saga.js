import {
  all, call, put, takeEvery,
} from 'redux-saga/effects';
import * as TYPES from './Types';
import * as ACTIONS from './Actions';
import { apiGetGiftCards, apiSaveGiftCard, apiEditGiftCard } from '../../utils/api/api';

function* getGiftCards() {
  yield takeEvery(TYPES.GET_GIFT_CARDS_REQUEST, function* ({
    payload,
  }) {
    try {
      const list = yield call(apiGetGiftCards, payload);
      yield put(ACTIONS.getGiftCardsSuccess(list));
    } catch (err) {
      yield put(ACTIONS.getGiftCardsError(err));
    }
  });
}

function* saveGiftCard() {
  yield takeEvery(TYPES.SAVE_GIFT_CARDS_REQUEST, function* ({
    payload,
  }) {
    try {
      const elem = yield call(apiSaveGiftCard, payload);
      yield put(ACTIONS.saveGiftCardSuccess(elem));
      yield put({ type: TYPES.GET_GIFT_CARDS_REQUEST });
    } catch (err) {
      yield put(ACTIONS.saveGiftCardError(err));
    }
  });
}

function* editGiftCard() {
  yield takeEvery(TYPES.EDIT_GIFT_CARDS_REQUEST, function* ({
    payload,
  }) {
    try {
      const elem = yield call(apiEditGiftCard, payload);
      yield put(ACTIONS.editGiftCardSuccess(elem));
      yield put({ type: TYPES.GET_GIFT_CARDS_REQUEST });
    } catch (err) {
      yield put(ACTIONS.editGiftCardError(err));
    }
  });
}

export default function* rootGiftCardsSaga() {
  yield all([getGiftCards(), saveGiftCard(), editGiftCard()]);
}
