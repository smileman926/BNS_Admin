import * as TYPES from './Types';

export const getAllGiftCards = (payload) => ({
  type: TYPES.GET_GIFT_CARDS_REQUEST,
  payload,
});

export const getGiftCardsSuccess = (payload) => ({
  type: TYPES.GET_GIFT_CARDS_SUCCESS,
  payload,
});

export const getGiftCardsError = (payload) => ({
  type: TYPES.GET_GIFT_CARDS_ERROR,
  payload,
});

export const saveGiftCard = (payload) => ({
  type: TYPES.SAVE_GIFT_CARDS_REQUEST,
  payload,
});

export const saveGiftCardSuccess = (payload) => ({
  type: TYPES.SAVE_GIFT_CARDS_SUCCESS,
  payload,
});

export const saveGiftCardError = (payload) => ({
  type: TYPES.SAVE_GIFT_CARDS_ERROR,
  payload,
});

export const editGiftCard = (payload) => ({
  type: TYPES.EDIT_GIFT_CARDS_REQUEST,
  payload,
});

export const editGiftCardSuccess = (payload) => ({
  type: TYPES.EDIT_GIFT_CARDS_SUCCESS,
  payload,
});

export const editGiftCardError = (payload) => ({
  type: TYPES.EDIT_GIFT_CARDS_ERROR,
  payload,
});

