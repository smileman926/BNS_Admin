import Amplify, { Auth, API } from 'aws-amplify';

const custom_header = async () => {
  const header = {};
  try {
    header.Authorization = (await Auth.currentSession()).idToken.jwtToken;
  } catch (e) {}
  return header;
};

const { REACT_APP_SERVER_URL, REACT_APP_REGION } = process.env;

const localAdmin = 'http://localhost:3000/local/admin';

const localGeneral = 'http://localhost:3000/local/general';


Amplify.configure({
  API: {
    endpoints: [
      {
        name: 'dev',
        endpoint: REACT_APP_SERVER_URL,
        region: REACT_APP_REGION,
        custom_header,
      },
      {
        name: 'admin',
        endpoint: `${REACT_APP_SERVER_URL}/admin`,
        region: REACT_APP_REGION,
        custom_header,
      },
      {
        name: 'general',
        endpoint: `${REACT_APP_SERVER_URL}/general`,
        region: REACT_APP_REGION,
        custom_header,
      },
    ],
  },
});

export const apiLogin = () => API.post('dev', '/consumer/users/login');

export const apiGetSettingInfo = () => API.get('general', '/support/sitesettings');
export const apiGetFAQs = () => API.get('general', '/faq');
export const apiSaveFAQ = (body) => API.post('admin', '/faq', { body });
export const apiUpdateFAQ = (body) => {
  const { id } = body;
  return API.patch('admin', `/faq/${id}`, { body });
};
export const apiDeleteFAQ = ({ id }) => API.del('admin', `/faq/${id}`);

export const apiSaveSettingInfo = (body) => API.put('admin', '/support/sitesettings', { body });

export const apiGetPromoCodes = ({filterString = ''}) => API.get('admin', `/promo-code?filterString=${filterString}`);
export const apiSavePromoCode = (body) => API.post('admin', '/promo-code', { body });
export const apiEditPromoCode = (body, id) =>
  API.put('admin', `/promo-code/${id}`, { body });
export const apiGetGiftCards = (queryStringParameters) =>
  API.get('admin', '/gift-card', { queryStringParameters });
export const apiSaveGiftCard = (body) => API.post('admin', '/gift-card', { body });
export const apiEditGiftCard = (body) => API.put('admin', '/gift-card', { body });

export const apiGetProducts = ({ offset = 0, filter = 'both', status = 'all', limit = 50, filterString = ''}) =>
  API.get(
    'admin',
    `/products/product/listings?filterByStatus=${status}&limit=${limit}&offset=${offset}&product_type=${filter}&filterString=${filterString}`,
  );

export const apiGetOrderHistory = ({ limit = 50,  offset = 0, filter = '', search = '' }) =>
API.get(
  'admin',
  `/transaction?limit=${limit}&offset=${offset}&type=${filter}&searchString=${search}`,
); 

export const apiSaveProduct = (body) => API.post('admin', '/products/physical', { body });
export const apiSaveWebinar = (body) => API.post('admin', '/products/webinar', { body });
export const apiGetWebinars = ({ limit = 50, offset = 0, param = 'queued', filterString = ''}) =>
  API.get(
    'admin',
    `/products/product/webinar/queue?queue_type=${param}&limit=${limit}&offset=${offset}&filterString=${filterString}`,
  );
export const apiUpdateProduct = (body) => API.put('admin', '/products/product', { body });
export const apiGetOneProduct = ({ id, type }) =>
  API.get('admin', `/products/product?id=${id}&product_type=${type}`);

export const apiGetUsers = (query) => 
  API.get('admin', `/users-management?query_search=${query || ''}`);

export const apiGetRevenueCounter = (queryStringParameters) =>
  API.get('admin', '/analytics/revenue', { queryStringParameters });

export const apiGetMemberCounter = (queryStringParameters) =>
  API.get('admin', '/analytics/activemembers', { queryStringParameters });

export const apiGetCategorySalesInfo = (queryStringParameters) =>
  API.get('admin', '/analytics/categorysale', { queryStringParameters });

export const apiGetCategories = (body) => API.get('admin', `/categories?filterString=${body ? (body.filterString || '') : ''}`);

export const apiSaveCategory = (body) =>
  API.post('admin', '/categories', {
    body,
  });

export const apiDeleteCategories = (body) => API.del('admin', '/categories', { body });

export const apiUpdateCategory = (body) => {
  const { id } = body;
  delete body.id;
  return API.patch('admin', `/categories/${id}`, { body });
};

export const apiGetListSoldOutWebinars = ({filterString = ''}) =>
  API.get('admin', `/products/product/webinar/soldout?filterString=${filterString}`);

export const apiGetListUsersWebinars = (body) =>
  API.get('admin', `/webinar/${body.id}/users?limit=1000`);

export const apiSendLinkStartWebinar = (body, id) =>
  API.put('admin', `/products/product/webinar/start?product_id=${id}`, { body });

export const apiGetListFfl = (body) =>
  API.get('admin', `/ffl-databases?limit=${body.limit}&offset=${body.offset}&filterString=${body.filterString || ''}`);

export const apiSaveFfl = (body) => API.post('admin', '/ffl-databases', { body });

export const apiUpdateFFL = (body) => {
  const { id } = body;
  delete body.id;
  return API.put('admin', `/ffl-databases/${id}`, { body });
};

export const apiGetNotify = () => API.get('admin', '/notification?product_type=webinar');

export const apiReadNotify = (body) => API.patch('admin', `/notification/${body.id}`);

export const apiSetWinners = (body) => API.post('admin', '/products/winners', { body });

export const apiDeleteProductImgs = (body) => API.del('admin', '/products/images', { body });

export const apiAddProductImgs = (body) => API.post('admin', '/products/images', { body });

export const apiGetAllProductImgs = ({ id, type }) =>
  API.get('admin', `/products/images?id=${id}&product_type=${type}`);

export const aptGetComplitedWebinars = (queryStringParameters) =>
  API.get('admin', '/products/webinar/bns/complete', { queryStringParameters });

export const aptSaveFFLtoWinners = (body) =>
  API.put('admin', '/products/webinar/complete/ffl', { body });
export const apiGetComplitedWebinars = (queryStringParameters) =>
  API.get('admin', '/products/webinar/bns/complete', { queryStringParameters });

export const apiGetSoldPhysicalProducts = (queryStringParameters) =>
  API.get('admin', '/products/physical/soldout', { queryStringParameters });

export const apiUpdateSoldProductFFL = (body) =>
  API.put('admin', '/products/physical/soldout/ffl', { body });

export const apiGetUsersManagement = (queryStringParameters) =>
  API.get('admin', '/users-management', { queryStringParameters });
export const apiUpdateUsersManagement = (body) => API.put('admin', '/users-management', { body });
export const apiDelUsersManagement = (id) => API.del('admin', `/users-management/${id}`);

export const apiGetRefundSeats = (queryStringParameters) =>
  API.get('admin', `/webinar/seats-taken/${queryStringParameters.id}`, { queryStringParameters });
export const apiSaveSeatsRefund = (body) => API.post('admin', '/checkout/refund', { body });

export const apiGetUserInfo = (id) => API.get('admin', `/users-management/${id}`);

export const apiGetRole = () => console.log('getRole');
export const apiSaveRole = (body) => API.post('admin', '/roles', { body });
export const apiUpdateRole = (id, body) => API.put('admin', `/roles/${id}`, { body });

export const apiGetRoles = ({filterString = ''}) => API.get('admin', `/roles?filterString=${filterString}`);
export const apiGetPermissions = () => API.get('admin', '/roles-permissions');
export const apiCreateUserAdmin = ({ userData }) =>
  API.post('admin', `/roles/attach/${userData.role}`, { body: {userData: { ...userData, email: userData.email.toLowerCase() }} });

// for background image change
export const apiGetBackgroundImgs = () => API.get('admin', '/background');
export const apiAddBackgroundImgs = (body) => API.post('admin', '/background', { body });
export const apiDeleteBackgroundImgs = (body) => API.del('admin', '/background', { body });
export const apiEditBackgroundImgs = (body) => {
  const { id } = body;
  delete body.id;
  return API.put('admin', `/background/${id}`, { body });
};
