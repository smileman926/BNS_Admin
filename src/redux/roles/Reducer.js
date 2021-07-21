import { combineReducers } from 'redux';
import * as Types from './Types';
import { notification } from 'antd';

const list = (state = [], { type, payload }) => {
  switch (type) {
    case Types.GET_ROLES_SUCCESS:
      return payload;
    case Types.UPDATE_ROLE_SUCCESS:
      notification.success({
        message: 'Updated',
      });
    case Types.SAVE_ROLE_SUCCESS:
      notification.success({
        message: 'Saved',
      });
      return state;
    default:
      return state;
  }
};
const permissions = (state = [], { type, payload }) => {
  switch (type) {
    case Types.SET_PERMISSIONS:
      return payload;
    default:
      return state;
  }
};

const allPermissions = (state = [], { type, payload }) => {
  switch (type) {
    case Types.GET_ALL_PERMISSONS_SUCCESS:
      return payload;
    default:
      return state;
  }
};

const errorMessage = (state = null, { type, payload }) => {
  switch (type) {
    case Types.GET_ROLES_ERROR:
    case Types.UPDATE_ROLE_ERROR:
    case Types.SAVE_ROLE_ERROR:
    case Types.CREATE_ADMIN_ERROR:
      notification.error({
        message:
          payload?.response?.data?.message === 'Validation error'
            ? 'Role name must be unique'
            : payload?.response?.data?.message || payload?.message,
      });
      return payload;

    case Types.CREATE_ADMIN_REQUEST:
    case Types.GET_ROLES_REQUEST:
    case Types.UPDATE_ROLE_REQUEST:
    case Types.SAVE_ROLE_REQUEST:
      return null;

    default:
      return state;
  }
};

const loading = (state = false, { type }) => {
  switch (type) {
    case Types.GET_ROLES_REQUEST:
    case Types.UPDATE_ROLE_REQUEST:
    case Types.SAVE_ROLE_REQUEST:
    case Types.CREATE_ADMIN_REQUEST:
    case Types.GET_ALL_PERMISSONS_REQUEST:
      return true;
    case Types.GET_ALL_PERMISSONS_SUCCESS:
    case Types.GET_ALL_PERMISSONS_ERROR:
    case Types.CREATE_ADMIN_ERROR:
    case Types.CREATE_ADMIN_SUCCESS:
    case Types.GET_ROLES_ERROR:
    case Types.UPDATE_ROLE_ERROR:
    case Types.SAVE_ROLE_ERROR:
    case Types.GET_ROLES_SUCCESS:
    case Types.UPDATE_ROLE_SUCCESS:
    case Types.SAVE_ROLE_SUCCESS:
      return false;
    default:
      return state;
  }
};

const rolesReducer = combineReducers({
  list,
  errorMessage,
  loading,
  allPermissions,
  permissions,
});

export default rolesReducer;
