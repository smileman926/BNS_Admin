import * as TYPES from './Types';

export const getRefundSeats = (payload) => ({
  type: TYPES.GET_SEATS_FOR_REFUND_REQUEST,
  payload,
});

export const getRefundSeatsSuccess = (payload) => ({
  type: TYPES.GET_SEATS_FOR_REFUND_SUCCESS,
  payload,
});

export const getRefundSeatsError = (payload) => ({
  type: TYPES.GET_SEATS_FOR_REFUND_ERROR,
  payload,
});

export const saveRefundSeats = (payload, meta) => ({
  type: TYPES.SAVE_SEATS_FOR_REFUND_REQUEST,
  payload,
  meta,
});

export const saveRefundSeatsSuccess = (payload) => ({
  type: TYPES.SAVE_SEATS_FOR_REFUND_SUCCESS,
  payload,
});

export const saveRefundSeatsError = (payload) => ({
  type: TYPES.SAVE_SEATS_FOR_REFUND_ERROR,
  payload,
});
