import * as TYPES from './Types';

export const getProducts = (payload) => ({
  type: TYPES.GET_PRODUCTS_REQUEST,
  payload,
});
export const getQueuedWebinars = (payload) => ({
  type: TYPES.GET_QUEUED_WEBINARS_REQUEST,
  payload,
});
export const getQueuedWebinarsSuccess = (payload , meta) => ({
  type: TYPES.GET_QUEUED_WEBINARS_SUCCESS,
  payload,
  meta
});
export const getQueuedWebinarsError = (payload) => ({
  type: TYPES.GET_QUEUED_WEBINARS_ERROR,
  payload,
});

export const getProductsSuccess = (payload) => ({
  type: TYPES.GET_PRODUCTS_SUCCESS,
  payload,
});

export const getProductsError = (payload) => ({
  type: TYPES.GET_PRODUCTS_ERROR,
  payload,
});
export const filterVisibleProducts = (payload) => ({
  type: TYPES.FILTER_VISIBLE_PRODUCTS,
  payload,
});
export const filterHiddenProducts = (payload) => ({
  type: TYPES.FILTER_HIDDEN_PRODUCTS,
  payload,
});
export const filterOutOfStockProducts = (payload) => ({
  type: TYPES.FILTER_OUT_OF_STOCK_PRODUCTS,
  payload,
});
export const saveProduct = (payload) => ({
  type: TYPES.SAVE_PRODUCT_REQUEST,
  payload,
});

export const saveProductSuccess = (payload) => ({
  type: TYPES.SAVE_PRODUCT_SUCCESS,
  payload,
});

export const saveProductError = (payload) => ({
  type: TYPES.SAVE_PRODUCT_ERROR,
  payload,
});
export const updateProduct = (payload, meta) => ({
  type: TYPES.UPDATE_PRODUCT_REQUEST,
  payload,
  meta,
});

export const updateProductSuccess = (payload) => ({
  type: TYPES.UPDATE_PRODUCT_SUCCESS,
  payload,
});

export const updateProductResultMessage = (payload) => ({
  type: TYPES.UPDATE_PRODUCT_RESULT_MESSEGE,
  payload,
});

export const updateProductError = (payload) => ({
  type: TYPES.UPDATE_PRODUCT_ERROR,
  payload,
});

export const saveWebinar = (payload) => ({
  type: TYPES.SAVE_WEBINAR_REQUEST,
  payload,
});

export const saveWebinarSuccess = (payload) => ({
  type: TYPES.SAVE_WEBINAR_SUCCESS,
  payload,
});

export const saveWebinarError = (payload) => ({
  type: TYPES.SAVE_WEBINAR_ERROR,
  payload,
});
export const updateWebinar = (payload) => ({
  type: TYPES.UPDATE_WEBINAR_REQUEST,
  payload,
});

export const updateWebinarSuccess = (payload) => ({
  type: TYPES.UPDATE_WEBINAR_SUCCESS,
  payload,
});

export const updateWebinarError = (payload) => ({
  type: TYPES.UPDATE_WEBINAR_ERROR,
  payload,
});

export const getSelectedProduct = (payload) => ({
  type: TYPES.GET_SELECTED_PRODUCT_REQUEST,
  payload,
});

export const getSelectedProductSuccess = (payload) => ({
  type: TYPES.GET_SELECTED_PRODUCT_SUCCESS,
  payload,
});

export const getSelectedProductError = (payload) => ({
  type: TYPES.GET_SELECTED_PRODUCT_ERROR,
  payload,
});
export const deleteProductImgs = (payload) => ({
  type: TYPES.DELETE_PRODUCT_IMAGES_REQUEST,
  payload,
});

export const deleteProductImgsSuccess = (payload) => ({
  type: TYPES.DELETE_PRODUCT_IMAGES_SUCCESS,
  payload,
});

export const deleteProductImgsError = (payload) => ({
  type: TYPES.DELETE_PRODUCT_IMAGES_ERROR,
  payload,
});
export const getAllProductImgs = (payload) => ({
  type: TYPES.GET_ALL_PRODUCT_IMAGES_REQUEST,
  payload,
});

export const getAllProductImgsSuccess = (payload) => ({
  type: TYPES.GET_ALL_PRODUCT_IMAGES_SUCCESS,
  payload,
});

export const getAllProductImgsError = (payload) => ({
  type: TYPES.GET_ALL_PRODUCT_IMAGES_ERROR,
  payload,
});
export const addProductImgs = (payload) => ({
  type: TYPES.ADD_PRODUCT_IMAGES_REQUEST,
  payload,
});
export const changeProductStatus = (payload, meta) => ({
  type: TYPES.CHANGE_PRODUCT_STATUS_REQUEST,
  payload,
  meta,
});

export const addProductImgsSuccess = (payload) => ({
  type: TYPES.ADD_PRODUCT_IMAGES_SUCCESS,
  payload,
});

export const addProductImgsError = (payload) => ({
  type: TYPES.ADD_PRODUCT_IMAGES_ERROR,
  payload,
});
export const clearSelectedProduct = (payload) => ({
  type: TYPES.CLEAR_SELECTED_PRODUCT,
  payload,
});

export const clearWebinars = (payload) => ({
  type: TYPES.CLEAR_WEBINARS,
  payload,
});

export const moveWebinarToQueue = (payload, meta) => ({
  type: TYPES.MOVE_WEBINAR_TO_QUEUE_REQUEST,
  payload,
  meta,
});
export const changePublishMethodFromQueue = (payload, meta) => ({
  type: TYPES.CHANGE_PUBLISH_METHOD_FROM_QUEUE_REQUEST,
  payload,
  meta,
});
export const saveWebinarSeatWebinar = (payload, meta) => ({
  type: TYPES.SAVE_WEBINAR_SEAT_WEBINAR_REQUEST,
  payload,
  meta,
});
