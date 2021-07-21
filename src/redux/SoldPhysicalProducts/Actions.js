import * as TYPES from './Types';

export const getSoldPhysicalProducts = (payload) => ({
  type: TYPES.GET_SOLD_PHYSICAL_PRODUCTS_REQUEST,
  payload,
});

export const getSoldPhysicalProductsSuccess = (payload) => ({
  type: TYPES.GET_SOLD_PHYSICAL_PRODUCTS_SUCCESS,
  payload,
});

export const getSoldPhysicalProductsError = (payload) => ({
  type: TYPES.GET_SOLD_PHYSICAL_PRODUCTS_ERROR,
  payload,
});

export const updateSoldPhysicalFFl = (payload) => ({
  type: TYPES.UPDATE_SOLD_PHYSICAL_PRODUCT_FFL_REQUEST,
  payload,
});
export const updateSoldPhysicalFFlSuccess = (payload) => ({
  type: TYPES.UPDATE_SOLD_PHYSICAL_PRODUCT_FFL_SUCCESS,
  payload,
});
export const updateSoldPhysicalFFlError = (payload) => ({
  type: TYPES.UPDATE_SOLD_PHYSICAL_PRODUCT_FFL_ERROR,
  payload,
});
