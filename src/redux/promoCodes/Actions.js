import * as TYPES from './Types';

export const getAllPromoCodes = (payload) => ({
  type: TYPES.GET_PROMO_CODES_REQUEST,
  payload,
});

export const getAllPromoCodesSuccess = (payload) => ({
  type: TYPES.GET_PROMO_CODES_SUCCESS,
  payload,
});

export const getPromoCodesError = (payload) => ({
  type: TYPES.GET_PROMO_CODES_ERROR,
  payload,
});

export const savePromocode = (payload) => ({
  type: TYPES.SAVE_PROMO_CODES_REQUEST,
  payload,
});

export const savePromoCodeSuccess = (payload) => ({
  type: TYPES.SAVE_PROMO_CODES_SUCCESS,
  payload,
});

export const savePromoCodeError = (payload) => ({
  type: TYPES.SAVE_PROMO_CODES_ERROR,
  payload,
});

