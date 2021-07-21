import * as TYPES from "./notificationTypes";

export const getNotifyRequests = (payload) => ({
  type: TYPES.GET_NOTIFICATION_REQUESTS,
  payload,
});

export const getNotifySuccess = (payload) => ({
  type: TYPES.GET_NOTIFICATION_SUCCESS,
  payload,
});

export const getNotifyError = (payload) => ({
  type: TYPES.GET_NOTIFICATION_ERROR,
  payload,
});

export const readNotifyRequest = (payload) => ({
  type: TYPES.READ_NOTIFICATION_REQUESTS,
  payload,
});

export const readNotifySuccess = (payload) => ({
  type: TYPES.READ_NOTIFICATION_SUCCESS,
  payload,
});

export const readNotifyError = (payload) => ({
  type: TYPES.READ_NOTIFICATION_ERROR,
  payload,
});
