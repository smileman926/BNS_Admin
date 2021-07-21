import * as dashboardTypes from "./dashboardTypes";

export const getRevenueDataRequest = (payload) => ({
  type: dashboardTypes.GET_REVENUE_DATA_REQUEST,
  payload,
});

export const getRevenueDataSuccess = (payload) => ({
  type: dashboardTypes.GET_REVENUE_DATA_SUCCESS,
  payload,
});

export const getRevenueDataError = (payload) => ({
  type: dashboardTypes.GET_REVENUE_DATA_ERROR,
  payload,
});

export const getMemberDataRequest = (payload) => ({
  type: dashboardTypes.GET_MEMBER_DATA_REQUEST,
  payload,
});

export const getMemberDataSuccess = (payload) => ({
  type: dashboardTypes.GET_MEMBER_DATA_SUCCESS,
  payload,
});

export const getMemberDataError = (payload) => ({
  type: dashboardTypes.GET_MEMBER_DATA_ERROR,
  payload,
});


export const getCategorySalesDataRequest = (payload) => ({
  type: dashboardTypes.GET_CATEGORY_SALES_DATA_REQUEST,
  payload,
});

export const getCategorySalesDataSuccess = (payload) => ({
  type: dashboardTypes.GET_CATEGORY_SALES_DATA_SUCCESS,
  payload,
});

export const getCategorySalesDataError = (payload) => ({
  type: dashboardTypes.GET_CATEGORY_SALES_DATA_ERROR,
  payload,
});