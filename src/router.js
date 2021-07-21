import Login from './pages/Login';
import Forgot from './pages/Forgot';
import Setting from './pages/Settings';
import Dashboard from './pages/Dashboard';
import Categories from './pages/Categories';
import AddCategories from './pages/AddCategories';
import SoldOutWebinars from './pages/SoldOutWebinars';
import LiveStreamMode from './pages/LiveStreamMode';
import FAQ from './pages/FAQ';
import EditFaq from './pages/FAQ/EditFaq';
import AddFaq from './pages/FAQ/AddFaq';
import ProductListingOptions from './pages/ProductListing';
import WebinarQueues from './pages/WebinarQueues';
import ProductEdit from './pages/ProductListing/ProductEdit';
import FFLDB from './pages/FFLDB';
import SoldOutWebinarsAlerts from './pages/SoldOutWebinarsAlerts';
import ProductAdd from './pages/ProductListing/ProductAdd';
import GiftCards from './pages/GiftCards';
import GiftCardAdd from './pages/GiftCards/GiftCardAdd';
import PromoCodes from './pages/PromoCodes';
import PromoCodeAdd from './pages/PromoCodes/PromoCodeAdd';
import CompliteWebinars from './pages/CompletedWebinars/CompletedWebinars';
import SoldPhysicalProducts from './pages/SoldPhysicalProducts';
import SeatRefund from './pages/SeatRefund';
import UserManagement from './pages/UserManagement';
import UserEdit from './pages/UserManagement/UserEdit';
import Roles from './pages/Roles';
import CreateAdmin from './pages/UserManagement/CreateAdmin';
import CreateRole from './pages/Roles/CreateRole';
import OrderHistory from './pages/OrderHistory';

const router = {
  setting: {
    path: '/settings',
    component: Setting,
    exact: true,
    permission: 'settingsView',
  },
  login: {
    path: '/login',
    component: Login,
  },
  forgot: {
    path: '/forgot',
    component: Forgot,
  },
  faq: {
    path: '/faq',
    component: FAQ,
    permission: 'faqView',
  },
  editFaq: {
    path: '/faq-edit',
    component: EditFaq,
    permission: 'faqEdit',
  },
  addFaq: {
    path: '/faq-add',
    component: AddFaq,
    permission: 'faqEdit',
  },
  dashboard: {
    path: '/',
    component: Dashboard,
    exact: true,
    permission: 'dashboardView',
  },
  categories: {
    path: '/product-management/categories',
    component: Categories,
    exact: true,
    permission: 'categoryView',
  },
  products: {
    path: '/product-management/products',
    component: ProductListingOptions,
    exact: true,
    permission: 'productView',
  },
  editProduct: {
    path: '/product-management/edit',
    component: ProductEdit,
    exact: true,
    permission: 'productEdit',
  },
  addProduct: {
    path: '/product-management/add/:product_type',
    component: ProductAdd,
    permission: 'productEdit',
  },
  // addWebinar: {
  //   path: '/product-management/add-webinar',
  //   component: ProductAdd,
  //   exact: true,
  //   permission: 'productEdit',
  // },
  // addGiftCardWebinar: {
  //   path: '/product-management/add-giftcard-webinar',
  //   component: ProductAdd,
  //   exact: true,
  //   permission: 'productEdit',
  // },
  // addWebinarSeatWebinar: {
  //   path: '/product-management/add-webinarseat-webinar',
  //   component: ProductAdd,
  //   exact: true,
  //   permission: 'productEdit',
  // },
  addCategories: {
    path: '/product-management/categories/add',
    component: AddCategories,
    permission: 'categoryEdit',
  },
  soldOutWebinars: {
    path: '/product-management/sold-out-webinars',
    component: SoldOutWebinars,
    exact: true,
    permission: 'soldOutWebinarsView',
  },
  liveStreamMode: {
    path: '/product-management/sold-out-webinars/live-stream-mode',
    component: LiveStreamMode,
    permission: 'soldOutWebinarsView',
  },
  productListingOptions: {
    path: '/product-management/products/product-listing',
    component: ProductListingOptions,
    permission: 'productView',
  },
  webinarQueues: {
    path: '/product-management/products/queued-webinars',
    component: WebinarQueues,
    permission: 'webinarQueueView',
  },
  scheduledWebinars: {
    path: '/product-management/products/scheduled-webinars',
    component: WebinarQueues,
    permission: 'webinarQueueView',
  },
  seatRefund: {
    path: '/product-management/products/seatRefund/:id',
    component: SeatRefund,
    permission: 'seatsRefundView',
  },
  soldPhysicalProducts: {
    path: '/product-magement/products/sold-physical',
    component: SoldPhysicalProducts,
    permission: 'soldOutPhysicalView',
  },
  orderHistory: {
    path: '/product-magement/order-history',
    component: OrderHistory,
    permission: 'orderView',
  },
  fflDb: {
    path: '/product-management/ffl-database',
    component: FFLDB,
    permission: 'fflView',
  },
  giftCards: {
    path: '/product-management/giftcards',
    component: GiftCards,
    permission: 'giftCardsView',
  },
  addGiftCard: {
    path: '/product-management/giftcards-add',
    component: GiftCardAdd,
    permission: 'giftCardsEdit',
  },
  promoCodes: {
    path: '/product-management/promocodes',
    component: PromoCodes,
    permission: 'promoCodesView',
  },
  addPromoCode: {
    path: '/product-management/promocodes-add',
    component: PromoCodeAdd,
    permission: 'promoCodesEdit',
  },
  soldOutWebinarsAlerts: {
    path: '/alerts/soldoutwebinars',
    component: SoldOutWebinarsAlerts,
    permission: 'soldOutWebinarsView',
  },
  completedWebinars: {
    path: '/product-management/completed-webinars',
    component: CompliteWebinars,
    permission: 'completedWebinarsView',
  },
  userManagement: {
    path: '/user-management/users',
    component: UserManagement,
    exact: true,
    permission: 'usersView',
  },
  userInformation: {
    path: '/user-management/information',
    component: UserEdit,
    permission: 'usersView',
  },
  roles: {
    path: '/user-management/roles',
    component: Roles,
    permission: 'rolesView',
    exact: true,
  },
  createRole: {
    path: '/user-management/roles/create',
    component: CreateRole,
    permission: 'rolesEdit',
  },
  createAdmin: {
    path: '/user-management/admin-create',
    component: CreateAdmin,
    permission: 'userCreate',
  },
};

export default router;
