import * as categoriesTypes from "./categoriesTypes";

export const getCategoriesRequest = (payload) => ({
  type: categoriesTypes.GET_CATEGORIES_REQUEST,
  payload,
});

export const getCategoriesSuccess = (payload) => ({
  type: categoriesTypes.GET_CATEGORIES_SUCCESS,
  payload,
});

export const getCategoriesError = (payload) => ({
  type: categoriesTypes.GET_CATEGORIES_ERROR,
  payload,
});

export const updateCategoriesRequest = (payload) => ({
  type: categoriesTypes.UPDATE_CATEGORIES_REQUEST,
  payload,
});

export const updateCategoriesSuccess = (payload) => ({
  type: categoriesTypes.UPDATE_CATEGORIES_SUCCESS,
  payload,
});

export const updateCategoriesError = (payload) => ({
  type: categoriesTypes.UPDATE_CATEGORIES_ERROR,
  payload,
});

export const delCategoriesRequest = (payload) => ({
  type: categoriesTypes.DELETE_CATEGORIES_REQUEST,
  payload,
});

export const delCategoriesSuccess = (payload) => ({
  type: categoriesTypes.DELETE_CATEGORIES_SUCCESS,
  payload,
});

export const delCategoriesError = (payload) => ({
  type: categoriesTypes.DELETE_CATEGORIES_ERROR,
  payload,
});
