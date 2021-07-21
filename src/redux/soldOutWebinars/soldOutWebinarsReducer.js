import { combineReducers } from 'redux';
import * as soldOutWebinarsTypes from './soldOutWebinarsTypes';

const list = (state = [], { type, payload }) => {
  switch (type) {
    case soldOutWebinarsTypes.GET_SOLD_OUT_WEBINARS_SUCCESS:
      return payload;
    default:
      return state;
  }
};

const listLoading = (state = false, { type, payload }) => {
  switch (type) {
    case soldOutWebinarsTypes.GET_SOLD_OUT_WEBINARS_REQUEST:
      return true;

    case soldOutWebinarsTypes.GET_SOLD_OUT_WEBINARS_ERROR:
    case soldOutWebinarsTypes.GET_SOLD_OUT_WEBINARS_SUCCESS:
      return false;

    default:
      return state;
  }
};

const listError = (state = null, { type, payload }) => {
  switch (type) {
    case soldOutWebinarsTypes.GET_SOLD_OUT_WEBINARS_ERROR:
      return payload;
    case soldOutWebinarsTypes.GET_SOLD_OUT_WEBINARS_REQUEST:
    case soldOutWebinarsTypes.GET_SOLD_OUT_WEBINARS_SUCCESS:
      return null;
    default:
      return state;
  }
};

const sendUrlLoading = (state = false, { type, payload }) => {
  switch (type) {
    case soldOutWebinarsTypes.SEND_LINK_WEBINAR_REQUEST:
      return true;

    case soldOutWebinarsTypes.SEND_LINK_WEBINAR_SUCCESS:
    case soldOutWebinarsTypes.SEND_LINK_WEBINAR_ERROR:
      return false;

    default:
      return state;
  }
};

const sendStatus = (state = false, { type, payload }) => {
  switch (type) {
    case soldOutWebinarsTypes.SEND_LINK_WEBINAR_SUCCESS:
      return true;
    default:
      return state;
  }
};

const sendError = (state = null, { type, payload }) => {
  switch (type) {
    case soldOutWebinarsTypes.SEND_LINK_WEBINAR_ERROR:
      return payload;
    case soldOutWebinarsTypes.SEND_LINK_WEBINAR_REQUEST:
    case soldOutWebinarsTypes.SEND_LINK_WEBINAR_SUCCESS:
      return false;
    default:
      return state;
  }
};

const listUsers = {
  list: [],
  loading: false,
  err: null,
};

const listUsersWebinars = (state = listUsers, { type, payload }) => {
  switch (type) {
    case soldOutWebinarsTypes.LIST_USERS_WEBINAR_REQUEST:
      return { ...state, loading: true, err: null };
    case soldOutWebinarsTypes.LIST_USERS_WEBINAR_SUCCESS:
      return {
        list: payload,
        loading: false,
        err: null,
      };
    case soldOutWebinarsTypes.LIST_USERS_WEBINAR_ERROR:
      return {
        ...state,
        loading: false,
        err: null,
      };

    default:
      return state;
  }
};

const soldOutWebinarsReducer = combineReducers({
  list,
  listLoading,
  listError,
  sendUrlLoading,
  sendStatus,
  sendError,
  listUser: listUsersWebinars,
});

export default soldOutWebinarsReducer;
