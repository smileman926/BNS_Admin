import { all, call, put, takeEvery } from 'redux-saga/effects';
import * as TYPES from './Types';
import * as ACTIONS from './Actions';
import {
  apiGetRoles,
  apiGetRole,
  apiSaveRole,
  apiUpdateRole,
  apiCreateUserAdmin,
} from '../../utils/api/api';

function* getRoles() {
  yield takeEvery(TYPES.GET_ROLES_REQUEST, function* ({ payload }) {
    try {
      const list = yield call(apiGetRoles, payload);
      yield put(ACTIONS.getRolesSuccess(list.data));
    } catch (err) {
      yield put(ACTIONS.getRolesError(err));
    }
  });
}
function* getRole() {
  yield takeEvery(TYPES.GET_ROLE_REQUEST, function* ({ payload }) {
    try {
      const list = yield call(apiGetRole, payload);
      yield put(ACTIONS.getRoleSuccess(list));
    } catch (err) {
      yield put(ACTIONS.getRoleError(err));
    }
  });
}
function* saveRole() {
  yield takeEvery(TYPES.SAVE_ROLE_REQUEST, function* ({ payload, meta }) {
    try {
      const list = yield call(apiSaveRole, payload);
      yield put(ACTIONS.saveRoleSuccess(list));

      yield meta?.onSuccess();
    } catch (err) {
      yield put(ACTIONS.saveRoleError(err));
    }
  });
}
function* updateRole() {
  yield takeEvery(TYPES.UPDATE_ROLE_REQUEST, function* ({ payload }) {
    try {
      const list = yield call(apiUpdateRole, payload);
      yield put(ACTIONS.updateRoleSuccess(list));
    } catch (err) {
      yield put(ACTIONS.updateRoleError(err));
    }
  });
}

function* createAdmin() {
  yield takeEvery(TYPES.CREATE_ADMIN_REQUEST, function* ({ payload }) {
    try {
      const list = yield call(apiCreateUserAdmin, payload);
      payload.callbackSuccess();
      yield put(ACTIONS.createUserSuccess(list));
    } catch (err) {
      yield put(ACTIONS.createUserError(err));
    }
  });
}

function* getAllPermissons() {
  yield takeEvery(TYPES.GET_ALL_PERMISSONS_REQUEST, function* ({ payload }) {
    try {
      const list = yield call(apiGetRoles);
      yield put(ACTIONS.allPermissonsSuccess(list));
    } catch (err) {
      yield put(ACTIONS.allPermissonsError(err));
    }
  });
}

export default function* rootRolesSaga() {
  yield all([getRoles(), saveRole(), updateRole(), getRole(), createAdmin()]);
}
