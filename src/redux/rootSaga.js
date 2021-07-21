import { all } from 'redux-saga/effects';
import rootAuthSaga from './auth/authSaga';
import rootSettingSaga from './setting/settingSaga';
import rootDashboardSaga from './dashboard/dashboardSaga';
import rootCategoriesSaga from './categories/categoriesSaga';
import rootSoldOutWebinarsSaga from './soldOutWebinars/soldOutWebinarsSaga';
import rootProductsSaga from './products/Saga';
import rootFAQsSaga from './FAQ/Saga';
import rootFFLDBSaga from './fflDb/fflDbSaga';
import rootNotify from './notification/notificationSaga';
import rootGiftCardsSaga from './giftCards/Saga';
import rootUsersSaga from './users/Saga';
import rootPromoCodesSaga from './promoCodes/Saga';
import rootSoldPhysicalSaga from './SoldPhysicalProducts/Saga';
import rootCompletedWebinars from './completedWebinars/completedWebinarsSaga';
import rootRefundSeatsSaga from './seatRefund/Saga';
import rootRolesSaga from './roles/Saga';

export default function* rootSaga() {
  yield all([
    rootAuthSaga(),
    rootSettingSaga(),
    rootDashboardSaga(),
    rootCategoriesSaga(),
    rootProductsSaga(),
    rootSoldOutWebinarsSaga(),
    rootFAQsSaga(),
    rootFFLDBSaga(),
    rootNotify(),
    rootGiftCardsSaga(),
    rootUsersSaga(),
    rootPromoCodesSaga(),
    rootSoldPhysicalSaga(),
    rootCompletedWebinars(),
    rootRefundSeatsSaga(),
    rootRolesSaga(),
  ]);
}
