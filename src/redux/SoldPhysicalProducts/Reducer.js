import { combineReducers } from 'redux';
import * as TYPES from './Types';
import { GET_SOLD_PHYSICAL_PRODUCTS_SUCCESS } from './Types';

const list = (state = [], { type, payload }) => {
  switch (type) {
    case TYPES.GET_SOLD_PHYSICAL_PRODUCTS_SUCCESS:
      return payload;
    default:
      return state;
  }
};

const loading = (state = false, { type }) => {
  switch (type) {
    case TYPES.GET_SOLD_PHYSICAL_PRODUCTS_REQUEST:
    case TYPES.UPDATE_SOLD_PHYSICAL_PRODUCT_FFL_REQUEST:
      return true;

    case TYPES.GET_SOLD_PHYSICAL_PRODUCTS_ERROR:
    case TYPES.UPDATE_SOLD_PHYSICAL_PRODUCT_FFL_ERROR:
    case TYPES.GET_SOLD_PHYSICAL_PRODUCTS_SUCCESS:
    case TYPES.UPDATE_SOLD_PHYSICAL_PRODUCT_FFL_SUCCESS:
      return false;

    default:
      return state;
  }
};

const error = (state = null, { type, payload }) => {
  switch (type) {
    case TYPES.GET_SOLD_PHYSICAL_PRODUCTS_ERROR:
    case TYPES.UPDATE_SOLD_PHYSICAL_PRODUCT_FFL_ERROR:
      return payload;
    case TYPES.GET_SOLD_PHYSICAL_PRODUCTS_REQUEST:
    case TYPES.UPDATE_SOLD_PHYSICAL_PRODUCT_FFL_REQUEST:
    case TYPES.GET_SOLD_PHYSICAL_PRODUCTS_SUCCESS:
    case TYPES.UPDATE_SOLD_PHYSICAL_PRODUCT_FFL_SUCCESS:
      return null;
    default:
      return state;
  }
};

const soldPhysicalProductsReducer = combineReducers({
  list,
  loading,
  error,
});

export default soldPhysicalProductsReducer;
