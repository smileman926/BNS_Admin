import * as TYPES from './Types';

export const getRoles = (payload) => ({
  type: TYPES.GET_ROLES_REQUEST,
  payload,
});

export const getRolesSuccess = (payload) => ({
  type: TYPES.GET_ROLES_SUCCESS,
  payload,
});

export const getRolesError = (payload) => ({
  type: TYPES.GET_ROLES_ERROR,
  payload,
});
export const getRole = (payload) => ({
  type: TYPES.GET_ROLE_REQUEST,
  payload,
});

export const getRoleSuccess = (payload) => ({
  type: TYPES.GET_ROLE_SUCCESS,
  payload,
});

export const getRoleError = (payload) => ({
  type: TYPES.GET_ROLE_ERROR,
  payload,
});

export const saveRole = (payload, meta) => ({
  type: TYPES.SAVE_ROLE_REQUEST,
  payload,
  meta
});

export const saveRoleSuccess = (payload) => ({
  type: TYPES.SAVE_ROLE_SUCCESS,
  payload,
});

export const saveRoleError = (payload) => ({
  type: TYPES.SAVE_ROLE_ERROR,
  payload,
});

export const updateRole = (payload) => ({
  type: TYPES.UPDATE_ROLE_REQUEST,
  payload,
});

export const updateRoleSuccess = (payload) => ({
  type: TYPES.UPDATE_ROLE_SUCCESS,
  payload,
});

export const updateRoleError = (payload) => ({
  type: TYPES.UPDATE_ROLE_ERROR,
  payload,
});
export const setPermissions = (payload) => ({
  type: TYPES.SET_PERMISSIONS,
  payload,
});

export const createUser = (payload) => ({
  type: TYPES.CREATE_ADMIN_REQUEST,
  payload,
});

export const createUserSuccess = (payload) => ({
  type: TYPES.CREATE_ADMIN_SUCCESS,
  payload,
});

export const createUserError = (payload) => ({
  type: TYPES.CREATE_ADMIN_ERROR,
  payload,
});

export const allPermissons = (payload) => ({
  type: TYPES.GET_ALL_PERMISSONS_REQUEST,
  payload,
});

export const allPermissonsSuccess = (payload) => ({
  type: TYPES.GET_ALL_PERMISSONS_SUCCESS,
  payload,
});

export const allPermissonsError = (payload) => ({
  type: TYPES.GET_ALL_PERMISSONS_ERROR,
  payload,
});
