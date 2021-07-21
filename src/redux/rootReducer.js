import { combineReducers } from 'redux';
import authReducer from './auth/authReducer';
import categoriesReducer from './categories/categoriesReducer';
import dashboardReducer from './dashboard/dashboardReducer';
import reducerFflDb from './fflDb/fflDbReducer';
import settingReducer from './setting/settingReducer';
import soldOutWebinarsReducer from './soldOutWebinars/soldOutWebinarsReducer';
import productsReducer from './products/Reducer';
import FAQsReducer from './FAQ/Reducer';
import notifyReducer from './notification/notificationReducer';
import giftCardsReducer from './giftCards/Reducer';
import usersReducer from './users/Reducer';
import promoCodesReducer from './promoCodes/Reducer';
import soldPhysicalProductsReducer from './SoldPhysicalProducts/Reducer';
import completedWebinars from './completedWebinars/completedWebinarsReducer';
import refundSeatsReducer from './seatRefund/Reducer';
import rolesReducer from './roles/Reducer';

export default combineReducers({
  auth: authReducer,
  setting: settingReducer,
  dashboard: dashboardReducer,
  categories: categoriesReducer,
  roles: rolesReducer,
  products: productsReducer,
  soldOutWebinars: soldOutWebinarsReducer,
  faqs: FAQsReducer,
  fflDb: reducerFflDb,
  notify: notifyReducer,
  giftCards: giftCardsReducer,
  users: usersReducer,
  promoCodes: promoCodesReducer,
  completedWebinars,
  soldPhysicalProducts: soldPhysicalProductsReducer,
  refundSeats: refundSeatsReducer,
  roles: rolesReducer,
});
