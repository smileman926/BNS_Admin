import { all, call, put, takeEvery } from "redux-saga/effects";
import * as dashboardTypes from "./dashboardTypes";
import * as dashboardActions from "./dashboardActions";
import * as API from "../../utils/api/api";

export function* getRevenueData() {
  yield takeEvery(dashboardTypes.GET_REVENUE_DATA_REQUEST, function* ({ payload }) {
    try {
      const result = yield call(API.apiGetRevenueCounter, payload);
      yield put(dashboardActions.getRevenueDataSuccess(result));
    } catch (err) {
      yield put(dashboardActions.getRevenueDataError(err));
    }
  });
}

export function* getMemberData() {
  yield takeEvery(dashboardTypes.GET_MEMBER_DATA_REQUEST, function* ({ payload }) {
    try {
      const result = yield call(API.apiGetMemberCounter, payload);
      yield put(dashboardActions.getMemberDataSuccess(result));
    } catch (err) {
      yield put(dashboardActions.getMemberDataError(err));
    }
  });
}

export function* getCategorySalesData() {
  yield takeEvery(dashboardTypes.GET_CATEGORY_SALES_DATA_REQUEST, function* ({ payload }) {
    try {
      const result = yield call(API.apiGetCategorySalesInfo, payload);
      yield put(dashboardActions.getCategorySalesDataSuccess(result));
    } catch (err) {
      yield put(dashboardActions.getCategorySalesDataError(err));
    }
  });
}

export default function* rootAuthSaga() {
  yield all([getRevenueData(), getMemberData(), getCategorySalesData()]);
}
