import { combineReducers } from "redux";
import * as categoriesTypes from "./categoriesTypes";
import { notification } from "antd";

const list = (state = [], { type, payload }) => {
  switch (type) {
    case categoriesTypes.GET_CATEGORIES_SUCCESS:
      return payload;
    case categoriesTypes.UPDATE_CATEGORIES_SUCCESS:
      notification.success({
        message: "Updated"
      })
      return state;
      // return [...state.filter((el) => el.id !== payload.id), payload];
    case categoriesTypes.DELETE_CATEGORIES_SUCCESS:
      return state.filter((el) => el.id !== payload.id);
    default:
      return state;
  }
};

const errorMessage = (state = null, { type, payload }) => {
  switch (type) {
    case categoriesTypes.GET_CATEGORIES_ERROR:
    case categoriesTypes.UPDATE_CATEGORIES_ERROR:
    case categoriesTypes.DELETE_CATEGORIES_ERROR:
      notification.error({
        message: payload.message,
      });
      return payload;

    case categoriesTypes.GET_CATEGORIES_REQUEST:
    case categoriesTypes.UPDATE_CATEGORIES_REQUEST:
    case categoriesTypes.DELETE_CATEGORIES_REQUEST:
      return null;

    default:
      return state;
  }
};

const loading = (state = false, { type, payload }) => {
  switch (type) {
    case categoriesTypes.GET_CATEGORIES_REQUEST:
    case categoriesTypes.UPDATE_CATEGORIES_REQUEST:
    case categoriesTypes.DELETE_CATEGORIES_REQUEST:
      return true;
    case categoriesTypes.GET_CATEGORIES_ERROR:
    case categoriesTypes.UPDATE_CATEGORIES_ERROR:
    case categoriesTypes.DELETE_CATEGORIES_ERROR:
    case categoriesTypes.GET_CATEGORIES_SUCCESS:
    case categoriesTypes.UPDATE_CATEGORIES_SUCCESS:
    case categoriesTypes.DELETE_CATEGORIES_SUCCESS:
      return false;

    default:
      return state;
  }
};

const categoriesReducer = combineReducers({
  list,
  errorMessage,
  loading,
});

export default categoriesReducer;
