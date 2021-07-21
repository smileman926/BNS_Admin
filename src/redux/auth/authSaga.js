import { all, call, put, takeEvery } from "redux-saga/effects";
import * as authTypes from "./authTypes";
import * as authActions from "./authActions";
import { apiLogin } from "../../utils/api/api";
import { setPermissions } from '../roles/Actions';

export function* login() {
  yield takeEvery(authTypes.LOGIN_REQUEST, function* ({ payload }) {
    try {
      const userData = yield call(apiLogin);
      if (userData && userData.user_role === "admin") {
        yield put(authActions.loginSuccess(userData));
        yield put(setPermissions(payload.attributes['custom:permission'].split(',')));
      } else {
        yield put(authActions.loginError({ message: "User not found!" }));
      }
    } catch (err) {
      yield put(authActions.loginError(err));
    }
  });
}

export default function* rootAuthSaga() {
  yield all([login()]);
}
