import {
  all, call, put, takeEvery,
} from 'redux-saga/effects';
import * as TYPES from './Types';
import { apiGetSoldPhysicalProducts, apiUpdateSoldProductFFL } from '../../utils/api/api';
import {
  getSoldPhysicalProductsError,
  getSoldPhysicalProductsSuccess,
  updateSoldPhysicalFFlError,
  updateSoldPhysicalFFlSuccess
} from './Actions';

function* listSoldProducts() {
  yield takeEvery(TYPES.GET_SOLD_PHYSICAL_PRODUCTS_REQUEST, function* ({
    payload,
  }) {
    try {
      const list = yield call(apiGetSoldPhysicalProducts, payload);
      yield put(getSoldPhysicalProductsSuccess(list));
    } catch (err) {
      yield put(getSoldPhysicalProductsError(err));
    }
  });
}

function* updateProductFFL() {
  yield takeEvery(TYPES.UPDATE_SOLD_PHYSICAL_PRODUCT_FFL_REQUEST, function* ({
    payload,
  }) {
    try {
      const list = yield call(apiUpdateSoldProductFFL, payload);
      console.log(list,'list');
      yield put(updateSoldPhysicalFFlSuccess(list));
      yield call(apiGetSoldPhysicalProducts, payload);
    } catch (err) {
      yield put(updateSoldPhysicalFFlError(err));
    }
  });
}

export default function* rootSoldPhysicalSaga() {
  yield all([listSoldProducts(), updateProductFFL()]);
}
