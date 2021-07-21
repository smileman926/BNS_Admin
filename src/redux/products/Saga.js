import {
  all, call, put, takeEvery,
} from 'redux-saga/effects';
import * as TYPES from './Types';
import * as ACTIONS from './Actions';
import {
  apiAddProductImgs,
  apiDeleteProductImgs, apiGetAllProductImgs,
  apiGetOneProduct,
  apiGetProducts,
  apiGetWebinars,
  apiSaveProduct,
  apiSaveWebinar, apiUpdateProduct,
} from '../../utils/api/api';
import { uploadImgToAws } from '../../utils/services/S3';

function* getProducts() {
  yield takeEvery(TYPES.GET_PRODUCTS_REQUEST, function* ({
    payload,
  }) {
    try {
      const list = yield call(apiGetProducts, payload);
      yield put(ACTIONS.getProductsSuccess(list));
    } catch (err) {
      yield put(ACTIONS.getProductsError(err));
    }
  });
}
function* getProduct() {
  yield takeEvery(TYPES.GET_SELECTED_PRODUCT_REQUEST, function* ({
    payload,
  }) {
    try {
      const list = yield call(apiGetOneProduct, payload);
      if (list)
        yield put(ACTIONS.getSelectedProductSuccess(list));
    } catch (err) {
      yield put(ACTIONS.getSelectedProductError(err));
    }
  });
}
function* getQueuedWebinars() {
  yield takeEvery(TYPES.GET_QUEUED_WEBINARS_REQUEST, function* ({
    payload,
  }) {
    try {
      const list = yield call(apiGetWebinars, payload);
      yield put(ACTIONS.getQueuedWebinarsSuccess(list));
    } catch (err) {
      yield put(ACTIONS.getQueuedWebinarsError(err));
    }
  });
}
function* moveWebinarToQueue() {
  yield takeEvery(TYPES.MOVE_WEBINAR_TO_QUEUE_REQUEST, function* ({
    payload,
    meta,
  }) {
    try {
      yield call(apiUpdateProduct, payload);
      const list = yield call(apiGetWebinars, meta);
      yield put(ACTIONS.getQueuedWebinarsSuccess(list));
    } catch (err) {
      yield put(ACTIONS.getQueuedWebinarsError(err));
    }
  });
}
function* changeWebinarPublishMethodFromQueue() {
  yield takeEvery(TYPES.CHANGE_PUBLISH_METHOD_FROM_QUEUE_REQUEST, function* ({
    payload,
    meta,
  }) {
    try {
      yield call(apiUpdateProduct, payload);
      const list = yield call(apiGetWebinars, meta);
      yield put(ACTIONS.getQueuedWebinarsSuccess(list));
      if (meta?.close) {
        meta.close();
      }
    } catch (err) {
      yield put(ACTIONS.getQueuedWebinarsError(err));
    }
  });
}
function* getProductImgs() {
  yield takeEvery(TYPES.GET_ALL_PRODUCT_IMAGES_REQUEST, function* ({
    payload,
  }) {
    try {
      const list = yield call(apiGetAllProductImgs, payload);
      yield put(ACTIONS.getAllProductImgsSuccess(list));
    } catch (err) {
      yield put(ACTIONS.getAllProductImgsError(err));
    }
  });
}
function* saveProduct() {
  yield takeEvery(TYPES.SAVE_PRODUCT_REQUEST, function* ({
    payload,
  }) {
    try {
      const list = yield call(apiSaveProduct, payload);
      yield put(ACTIONS.saveProductSuccess(list));
    } catch (err) {
      yield put(ACTIONS.saveProductError(err));
    }
  });
}
function* saveWebinarSeatWebinar() {
  yield takeEvery(TYPES.SAVE_WEBINAR_SEAT_WEBINAR_REQUEST, function* ({
    payload,
    meta,
  }) {
    try {
      const list = yield call(apiSaveWebinar, payload);
      yield put(ACTIONS.saveProductSuccess(list));
      yield meta.onSuccess();
    } catch (err) {
      yield put(ACTIONS.saveProductError(err.response.data.message));
    }
  });
}

function* changeProductStatus() {
  yield takeEvery(TYPES.CHANGE_PRODUCT_STATUS_REQUEST, function* ({
    payload,
    meta,
  }) {
    try {
      const result = yield call(apiUpdateProduct, payload);
      yield put(ACTIONS.updateProductResultMessage(result.message));
      if (meta.id) {
        try {
          const list = yield call(apiGetOneProduct, meta);
          yield put(ACTIONS.getSelectedProductSuccess(list));
        } catch (err) {
          yield put(ACTIONS.getSelectedProductError(err.response.data.message));
        }
      } else {
        try {
          const list = yield call(apiGetProducts, meta);
          yield put(ACTIONS.getProductsSuccess(list));
        } catch (err) {
          yield put(ACTIONS.getProductsError(err.response.data.message));
        }
      }
    } catch (err) {
      yield put(ACTIONS.updateProductError(err.response.data.message));
    }
  });
}

function* updateProduct() {
  yield takeEvery(TYPES.UPDATE_PRODUCT_REQUEST, function* ({
    payload,
    meta,
  }) {
    try {
      if (meta) {
        console.log('meta.localState.files', meta.localState.files)
        if (meta.localState.files) {
          const newImagesNamesList = meta.localState.files.filter((item) => !item.id);
          const requests = newImagesNamesList.map((file) => uploadImgToAws(file, file.image_url));
          const response = yield Promise.all(requests);
          const mappedResponse = response.map((item) => item.key);
          const list = yield call(apiAddProductImgs, {
            product_id: payload.product_id,
            product_type: payload.product_type,
            imageLists: mappedResponse,
          });
          yield put(ACTIONS.addProductImgsSuccess(list));
          const list2 = yield call(apiGetAllProductImgs, {
            id: payload.product_id,
            type: payload.product_type,
          });
          yield put(ACTIONS.getAllProductImgsSuccess(list2));
          const primaryImg = list2.gallery.find((item) => item?.image_url === meta.localState?.mainImg?.image_url);
          if (primaryImg) {
            payload.primary_image_id = primaryImg.id;
          }
        }

        if (meta.localState.deletedImages) {
          const list = yield call(apiDeleteProductImgs, {
            id: payload.id,
            imageListIds: meta.localState.deletedImages,
          });
          yield put(ACTIONS.deleteProductImgsSuccess(list));
        }
      }

      const list = yield call(apiUpdateProduct, payload);
      yield put(ACTIONS.updateProductSuccess(list));
      if (meta?.onSuccess) {
        meta.onSuccess();
      }
    } catch (err) {
      yield put(ACTIONS.updateProductError(err.response.data.message));
    }
  });
}
function* saveWebinar() {
  yield takeEvery(TYPES.SAVE_WEBINAR_REQUEST, function* ({
    payload,
  }) {
    try {
      const list = yield call(apiSaveWebinar, payload);
      yield put(ACTIONS.saveWebinarSuccess(list));
    } catch (err) {
      yield put(ACTIONS.saveWebinarError(err));
    }
  });
}
function* updateWebinar() {
  yield takeEvery(TYPES.UPDATE_WEBINAR_REQUEST, function* ({
    payload,
  }) {
    try {
      const list = yield call(apiUpdateProduct, payload);
      yield put(ACTIONS.updateWebinarSuccess(list));
    } catch (err) {
      yield put(ACTIONS.updateWebinarError(err));
    }
  });
}
function* deleteProductImg() {
  yield takeEvery(TYPES.DELETE_PRODUCT_IMAGES_REQUEST, function* ({
    payload,
  }) {
    try {
      const list = yield call(apiDeleteProductImgs, payload);
      yield put(ACTIONS.deleteProductImgsSuccess(list));
    } catch (err) {
      yield put(ACTIONS.deleteProductImgsError(err));
    }
  });
}
function* addProductImg() {
  yield takeEvery(TYPES.ADD_PRODUCT_IMAGES_REQUEST, function* ({
    payload,
  }) {
    try {
      const list = yield call(apiAddProductImgs, payload);
      yield put(ACTIONS.addProductImgsSuccess(list));
    } catch (err) {
      yield put(ACTIONS.addProductImgsError(err));
    }
  });
}

export default function* rootProductsSaga() {
  yield all([
    getProducts(),
    saveProduct(),
    updateProduct(),
    saveWebinar(),
    updateWebinar(),
    getQueuedWebinars(),
    getProduct(),
    getProductImgs(),
    deleteProductImg(),
    addProductImg(),
    changeProductStatus(),
    moveWebinarToQueue(),
    changeWebinarPublishMethodFromQueue(),
    saveWebinarSeatWebinar(),
  ]);
}
