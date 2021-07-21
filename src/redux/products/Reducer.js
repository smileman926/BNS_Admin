import { combineReducers } from 'redux';
import { notification } from 'antd';
import * as TYPES from './Types';

const list = (state = [], { type, payload }) => {
  switch (type) {
    case TYPES.GET_PRODUCTS_SUCCESS:
    case TYPES.SAVE_WEBINAR_SUCCESS:
    case TYPES.SAVE_PRODUCT_SUCCESS:
    case TYPES.UPDATE_WEBINAR_SUCCESS:
    case TYPES.UPDATE_PRODUCT_SUCCESS:
    case TYPES.DELETE_PRODUCT_IMAGES_SUCCESS:
    case TYPES.ADD_PRODUCT_IMAGES_SUCCESS:
      return payload;
    default:
      return state;
  }
};

const selectedProduct = (state = null, { type, payload }) => {
  switch (type) {
    case TYPES.GET_SELECTED_PRODUCT_SUCCESS:
      return payload;
    case TYPES.CLEAR_SELECTED_PRODUCT:
      return null;
    default:
      return state;
  }
};

const queuedWebinars = (state = [], { type, payload }) => {
  switch (type) {
    case TYPES.GET_QUEUED_WEBINARS_SUCCESS:
      return payload;
    case TYPES.CLEAR_WEBINARS:
      return { };
    default:
      return state;
  }
};

const selectedProductImgs = (state = [], { type, payload }) => {
  switch (type) {
    case TYPES.GET_ALL_PRODUCT_IMAGES_SUCCESS:
      return payload;
    default:
      return state;
  }
};

const errorMessage = (state = null, { type, payload }) => {
  switch (type) {
    case TYPES.UPDATE_PRODUCT_RESULT_MESSEGE:
      notification.info({
        message: payload,
      });
      return payload;
    case TYPES.GET_PRODUCTS_ERROR:
    case TYPES.SAVE_WEBINAR_ERROR:
    case TYPES.SAVE_PRODUCT_ERROR:
    case TYPES.UPDATE_WEBINAR_ERROR:
    case TYPES.UPDATE_PRODUCT_ERROR:
    case TYPES.GET_SELECTED_PRODUCT_ERROR:
    case TYPES.DELETE_PRODUCT_IMAGES_ERROR:
    case TYPES.ADD_PRODUCT_IMAGES_ERROR:
    case TYPES.GET_ALL_PRODUCT_IMAGES_ERROR:
    case TYPES.GET_QUEUED_WEBINARS_ERROR:
      notification.error({
        message: payload,
      });
      return payload;

    case TYPES.GET_PRODUCTS_REQUEST:
    case TYPES.SAVE_WEBINAR_REQUEST:
    case TYPES.SAVE_PRODUCT_REQUEST:
    case TYPES.UPDATE_WEBINAR_REQUEST:
    case TYPES.UPDATE_PRODUCT_REQUEST:
    case TYPES.GET_SELECTED_PRODUCT_REQUEST:
    case TYPES.DELETE_PRODUCT_IMAGES_REQUEST:
    case TYPES.ADD_PRODUCT_IMAGES_REQUEST:
    case TYPES.GET_ALL_PRODUCT_IMAGES_REQUEST:
    case TYPES.GET_QUEUED_WEBINARS_REQUEST:
      return null;

    default:
      return state;
  }
};

const loading = (state = false, { type }) => {
  switch (type) {
    case TYPES.GET_PRODUCTS_REQUEST:
    case TYPES.SAVE_WEBINAR_REQUEST:
    case TYPES.SAVE_PRODUCT_REQUEST:
    case TYPES.UPDATE_WEBINAR_REQUEST:
    case TYPES.UPDATE_PRODUCT_REQUEST:
    case TYPES.GET_SELECTED_PRODUCT_REQUEST:
    case TYPES.GET_ALL_PRODUCT_IMAGES_REQUEST:
    case TYPES.CHANGE_PRODUCT_STATUS_REQUEST:
    case TYPES.GET_QUEUED_WEBINARS_REQUEST:
    case TYPES.CHANGE_PUBLISH_METHOD_FROM_QUEUE_REQUEST:
    case TYPES.SAVE_WEBINAR_SEAT_WEBINAR_REQUEST:
      return true;
    case TYPES.GET_PRODUCTS_ERROR:
    case TYPES.SAVE_WEBINAR_ERROR:
    case TYPES.SAVE_PRODUCT_ERROR:
    case TYPES.UPDATE_WEBINAR_ERROR:
    case TYPES.UPDATE_PRODUCT_ERROR:
    case TYPES.GET_SELECTED_PRODUCT_ERROR:
    case TYPES.GET_ALL_PRODUCT_IMAGES_ERROR:
    case TYPES.GET_QUEUED_WEBINARS_ERROR:
    case TYPES.GET_PRODUCTS_SUCCESS:
    case TYPES.SAVE_PRODUCT_SUCCESS:
    case TYPES.UPDATE_PRODUCT_SUCCESS:
    case TYPES.GET_SELECTED_PRODUCT_SUCCESS:
    case TYPES.GET_ALL_PRODUCT_IMAGES_SUCCESS:
    case TYPES.GET_QUEUED_WEBINARS_SUCCESS:
      return false;

    default:
      return state;
  }
};

const productsReducer = combineReducers({
  list,
  errorMessage,
  loading,
  selectedProduct,
  selectedProductImgs,
  queuedWebinars,
});

export default productsReducer;
