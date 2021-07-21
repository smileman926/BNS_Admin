import router from '../router';

export const checkPermission = (location, permissions) => {
  const permission = Object.values(router).find((item) => item.path === location);
  return permissions.some((item) => item === permission.permission);
};
