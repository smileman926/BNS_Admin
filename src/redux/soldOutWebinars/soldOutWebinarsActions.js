import * as soldOutWebinarsTypes from "./soldOutWebinarsTypes";

export const getListSoldOutWebinarsRequest = (payload) => ({
  type: soldOutWebinarsTypes.GET_SOLD_OUT_WEBINARS_REQUEST,
  payload,
});

export const getListSoldOutWebinarsSuccess = (payload) => ({
  type: soldOutWebinarsTypes.GET_SOLD_OUT_WEBINARS_SUCCESS,
  payload,
});

export const getListSoldOutWebinarsError = (payload) => ({
  type: soldOutWebinarsTypes.GET_SOLD_OUT_WEBINARS_ERROR,
  payload,
});

export const sendLinkRequest = (payload) => ({
  type: soldOutWebinarsTypes.SEND_LINK_WEBINAR_REQUEST,
  payload,
});

export const sendLinkSuccess = (payload) => ({
  type: soldOutWebinarsTypes.SEND_LINK_WEBINAR_SUCCESS,
  payload,
});

export const sendLinkError = (payload) => ({
  type: soldOutWebinarsTypes.SEND_LINK_WEBINAR_ERROR,
  payload,
});

export const getListUserWebinarsRequest = (payload) => ({
  type: soldOutWebinarsTypes.LIST_USERS_WEBINAR_REQUEST,
  payload,
});

export const getListUserWebinarsSuccess = (payload) => ({
  type: soldOutWebinarsTypes.LIST_USERS_WEBINAR_SUCCESS,
  payload,
});

export const getListUserWebinarsError = (payload) => ({
  type: soldOutWebinarsTypes.LIST_USERS_WEBINAR_ERROR,
  payload,
});
