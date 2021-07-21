import { all, call, put, takeEvery } from "redux-saga/effects";
import * as categoriesTypes from "./categoriesTypes";
import * as categoriesActions from "./categoriesActions";
import {
  apiGetCategories,
  apiDeleteCategories,
  apiUpdateCategory,
} from "../../utils/api/api";
import { notification } from "antd";

function* getCategories() {
  yield takeEvery(categoriesTypes.GET_CATEGORIES_REQUEST, function* ({
    payload,
  }) {
    try {
      const list = yield call(apiGetCategories, payload);
      yield put(categoriesActions.getCategoriesSuccess(list.data));
    } catch (err) {
      yield put(categoriesActions.getCategoriesError(err));
    }
  });
}
function* updateCategories() {
  yield takeEvery(categoriesTypes.UPDATE_CATEGORIES_REQUEST, function* ({
    payload,
  }) {
    try {
      const elem = yield call(apiUpdateCategory, payload);
      yield put(categoriesActions.updateCategoriesSuccess(elem));
      yield put({ type: categoriesTypes.GET_CATEGORIES_REQUEST });
    } catch (err) {
      if (err.response.data.message === "Validation error") {
        const newErr = {
          message: "Category name must be unique"
        }
        yield put(categoriesActions.updateCategoriesError(newErr));
      }
      else
        yield put(categoriesActions.updateCategoriesError(err));
    }
  });
}
function* deleteCategories() {
  yield takeEvery(categoriesTypes.DELETE_CATEGORIES_REQUEST, function* ({
    payload,
  }) {
    try {
      const elem = yield call(apiDeleteCategories, payload);
      yield put(categoriesActions.delCategoriesSuccess(elem));
      yield put({ type: categoriesTypes.GET_CATEGORIES_REQUEST });
      notification.success({
        message: "Deleted",
      });
    } catch (err) {
      yield put(categoriesActions.delCategoriesError(err));
    }
  });
}

export default function* rootCategoriesSaga() {
  yield all([getCategories(), deleteCategories(), updateCategories()]);
}
