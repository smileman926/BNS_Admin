import { combineReducers } from 'redux';
import { notification } from 'antd';
import * as dashboardTypes from './dashboardTypes';

const revenueReducer = (state = [], { type, payload }) => {
  switch (type) {
    case dashboardTypes.GET_REVENUE_DATA_SUCCESS:
      return payload;

    default:
      return state;
  }
};

const memberReducer = (state = [], { type, payload }) => {
  switch (type) {
    case dashboardTypes.GET_MEMBER_DATA_SUCCESS:
      return payload;

    default:
      return state;
  }
};

const categorySalesReducer = (state = [], { type, payload }) => {
  switch (type) {
    case dashboardTypes.GET_CATEGORY_SALES_DATA_SUCCESS:
      return payload;

    default:
      return state;
  }
};

const messageErrorReducer = (state = null, { type, payload }) => {
  switch (type) {
    case dashboardTypes.GET_REVENUE_DATA_ERROR:
    case dashboardTypes.GET_MEMBER_DATA_ERROR:
    case dashboardTypes.GET_CATEGORY_SALES_DATA_ERROR:
      notification.error({
        message: payload.message,
      });
      return payload;

    case dashboardTypes.GET_REVENUE_DATA_REQUEST:
    case dashboardTypes.GET_MEMBER_DATA_REQUEST:
    case dashboardTypes.GET_CATEGORY_SALES_DATA_REQUEST:
      return null;

    default:
      return state;
  }
};

const isLoadReducer = (state = false, { type, payload }) => {
  switch (type) {
    case dashboardTypes.GET_REVENUE_DATA_REQUEST:
    case dashboardTypes.GET_MEMBER_DATA_REQUEST:
    case dashboardTypes.GET_CATEGORY_SALES_DATA_REQUEST:
      return true;

    case dashboardTypes.GET_REVENUE_DATA_SUCCESS:
    case dashboardTypes.GET_MEMBER_DATA_SUCCESS:
    case dashboardTypes.GET_CATEGORY_SALES_DATA_SUCCESS:
      return false;

    case dashboardTypes.GET_REVENUE_DATA_ERROR:
    case dashboardTypes.GET_MEMBER_DATA_ERROR:
    case dashboardTypes.GET_CATEGORY_SALES_DATA_ERROR:
      return false;

    default:
      return state;
  }
};

const dashboardReducer = combineReducers({
  revenueData: revenueReducer,
  memberData: memberReducer,
  categorySalesData: categorySalesReducer,
  messageError: messageErrorReducer,
  isLoad: isLoadReducer,
});

export default dashboardReducer;
